const { downloadContentFromMessage } = require("@whiskeysockets/baileys");
const crypto = require("crypto");
const { getAccount } = require("../globals/accounts.dtos");
const customerService = require("../services/customer.service");
const messageService = require("../services/messages.service");
const messageDetailService = require("../services/messagedetail.service");
const logger = require("../config/logger");
require("dotenv").config({ debug: false });

//#region 🔹 Gelen mesajları dinleyen ve işleyen fonksiyon
async function listener(accountId, sock) {
  const messageHandler = async ({ messages }) => {
    for (const msg of messages) {
      try {
        if (!msg.message || !msg.key) continue;

        const _chatId = msg.key.remoteJid;
        const _customerId = msg.key.participant || _chatId;
        const messageType = Object.keys(msg.message)[0];

        let content = {
          text: "",
          caption: "",
          url: "text://message",
          mimetype: "text/plain",
          fileSha256: "0",
          fileLength: 0,
        };

        let rawMessage = msg.message[messageType];
        let actualMessageType = messageType;

        if (
          messageType === "viewOnceMessage" ||
          messageType === "ephemeralMessage"
        ) {
          if (rawMessage && rawMessage.message) {
            const innerType = Object.keys(rawMessage.message)[0];
            rawMessage = rawMessage.message[innerType];
            actualMessageType = innerType;
          }
        }

        // 🔹 Mesaj içeriğini işleme
        content = await extractMessageContent(actualMessageType, rawMessage);

        const timestamp = new Date(Number(msg.messageTimestamp) * 1000);
        const sender = await senderInfo(msg, sock);

        if (!_customerId || !_chatId) {
          logger.error("❌ Kritik alanlar eksik:", { _customerId, _chatId });
          continue;
        }

        //#region 🔹 PAYLOAD’LAR
        const customer_payload = {
          customerId: msg.key.fromMe
            ? await cleanJid(sock.user.id)
            : await cleanJid(sender.jid),
          account: accountId,
          isGroup: sender.isGroup,
          name: sender.name,
          lastActive: new Date(),
          insertDate: timestamp || new Date(),
          updateDate: new Date(),
        };

        const message_payload = {
          chatId: _chatId,
          account: accountId,
          chatType: _chatId.endsWith("@g.us") ? "group" : "individual",
          insertDate: new Date(),
          isBlocked: false,
          lastMessage: content.text || "[İçerik yok]",
          lastMessageDate: timestamp || new Date(),
          lastMessageType: actualMessageType,
          muted: false,
          name: msg.pushName || "Unknown",
          pinned: false,
          unreadCount: 0,
          updateDate: new Date(),
        };

        const messagedetail_payload = {
          messageId: msg.key.id,
          senderId: msg.key.fromMe
            ? await cleanJid(sock.user.id)
            : await cleanJid(sender.jid),
          type: actualMessageType,
          text: content.text || "",
          caption: content.caption || "",
          url: content.url || "text://message",
          mimeType: content.mimetype || "text/plain",
          fileSha256: content.fileSha256 || "0",
          fileLength:
            content.fileLength || (content.text ? content.text.length : 0),
          timeStamp: timestamp || new Date(),
          status: msg.status ? String(msg.status) : "delivered",
          isFromMe: msg.key.fromMe,
          insertDate: new Date(),
          updateDate: new Date(),
        };
        //#endregion

        //#region 🔹 MongoDB kayıt işlemleri
        // 1️⃣ Customer upsert
        const customer = await customerService.createOrUpdate(customer_payload);

        // 2️⃣ Message upsert (customerId ekle)
        const messageWithCustomer = {
          ...message_payload,
          customerId: customer.customerId,
        };
        const message = await messageService.createOrUpdate(
          messageWithCustomer
        );

        // 3️⃣ MessageDetail upsert (message._id ile ilişkilendir)
        await messageDetailService.createOrUpdate({
          ...messagedetail_payload,
          messageId: message._id,
        });

        logger.info("✅ Mesaj MongoDB'ye kaydedildi:", {
          chatId: message.chatId,
          customerId: customer.customerId,
        });
        //#endregion
      } catch (err) {
        logger.error("❌ Service error:", err.message);
        logger.error("📋 Error details:", err.stack);
      }
    }
  };

  sock.ev.on("messages.upsert", messageHandler);
  sock.ev.on("messages.media-update", () => {}); // ignore
  sock.ev.on("history.set", () => {}); // ignore
}
//#endregion

//#region 🔹 Mesaj içeriğini çıkartan yardımcı fonksiyon
async function extractMessageContent(actualMessageType, rawMessage) {
  const content = {
    text: "",
    caption: "",
    url: "text://message",
    mimetype: "text/plain",
    fileSha256: "0",
    fileLength: 0,
  };

  if (!rawMessage) return content;

  try {
    switch (actualMessageType) {
      case "conversation":
        content.text =
          typeof rawMessage === "string"
            ? rawMessage
            : JSON.stringify(rawMessage);
        break;
      case "extendedTextMessage":
        content.text = rawMessage.text || "";
        break;
      case "imageMessage":
        await handleMediaMessage(rawMessage, "image", content);
        break;
      case "videoMessage":
        await handleMediaMessage(rawMessage, "video", content);
        break;
      case "documentMessage":
        await handleMediaMessage(rawMessage, "document", content);
        break;
      case "audioMessage":
        await handleMediaMessage(rawMessage, "audio", content);
        break;
      case "stickerMessage":
        await handleMediaMessage(rawMessage, "sticker", content);
        break;
      case "contactMessage":
        content.text = `[Kişi: ${rawMessage.displayName || "Bilinmeyen"}]`;
        break;
      case "locationMessage":
        var lat = rawMessage.degreesLatitude;
        var lng = rawMessage.degreesLongitude;
        content.text = `[Konum: ${lat}, ${lng}]`;
        break;
      default:
        content.text = `[Bilinmeyen mesaj tipi: ${actualMessageType}]`;
    }

    if (!content.fileLength) {
      content.fileLength = content.text?.length || 0;
    }

    return content;
  } catch (err) {
    logger.error("❌ extractMessageContent hatası:", err);
    content.text = `[Hata: ${actualMessageType} işlenemedi]`;
    return content;
  }
}
//#endregion

//#region 🔹 Media mesajlarını işleyen yardımcı fonksiyon
async function handleMediaMessage(mediaMessage, type, content) {
  try {
    content.caption = mediaMessage.caption || "";
    content.text =
      mediaMessage.caption ||
      `[${type.charAt(0).toUpperCase() + type.slice(1)}]`;

    if (!mediaMessage.mediaKey) {
      logger.warn("⚠️ Media key yok, dosya indirilemez");
      return;
    }

    const stream = await downloadContentFromMessage(mediaMessage, type);
    let buffer = Buffer.from([]);
    for await (const chunk of stream) {
      buffer = Buffer.concat([buffer, chunk]);
    }

    const mimeType = mediaMessage.mimetype || "application/octet-stream";
    const fileSha256 = crypto.createHash("sha256").update(buffer).digest("hex");
    const fileLength = buffer.length;
    const url = `data:${mimeType};base64,${buffer.toString("base64")}`;

    content.url = url;
    content.mimetype = mimeType;
    content.fileSha256 = fileSha256;
    content.fileLength = fileLength;
  } catch (error) {
    logger.error("❌ Media işleme hatası:", error);
    content.text = `[${type} - hata]`;
  }
}
//#endregion

//#region 🔹 Gönderen bilgilerini çıkaran yardımcı fonksiyon
async function senderInfo(msg) {
  const remoteJid = msg?.key?.remoteJid || "";
  const isGroup = remoteJid.endsWith("@g.us");

  let senderJid =
    (isGroup ? msg?.key?.participant : remoteJid) ||
    msg?.participant ||
    remoteJid ||
    null;

  const senderId = senderJid ? senderJid.split("@")[0] : null;
  const senderName = msg?.pushName || senderId || "Unknown";

  return { jid: senderJid, id: senderId, name: senderName, isGroup };
}
//#endregion

//#region 🔹 JID temizleme fonksiyonu
async function cleanJid(jid) {
  if (!jid) return null;
  return jid.replace(/:\d+@/, "@");
}
//#endregion

//#region 🔹 Whatsapp mesaj gönder
async function sendMessage(accountId, to, type, content) {
  const account = getAccount(accountId);
  if (!account) throw new Error("Account not linked!");

  const sock = account.sock;
  if (!sock) throw new Error("Socket not ready!");
  if (!content) throw new Error("Missing content object.");

  let messageOptions;

  switch (type) {
    case "text":
      messageOptions = { text: content.caption };
      break;
    case "image":
      messageOptions = await buildMediaMessage("image", content);
      break;
    case "document":
      messageOptions = await buildMediaMessage("document", content);
      break;
    default:
      throw new Error("Unsupported message type.");
  }

  const result = await sock.sendMessage(to, messageOptions);
  return result;
}

async function buildMediaMessage(type, content) {
  if (content.base64) {
    const base64Data = content.base64.split(",").pop();
    const buffer = Buffer.from(base64Data, "base64");
    return {
      [type]: buffer,
      mimetype: content.mimetype,
      fileName: content.fileName || `${type}.bin`,
      caption: content.caption || "",
    };
  } else if (content.url) {
    return {
      [type]: { url: content.url },
      caption: content.caption || "",
    };
  }
  throw new Error("Missing base64 or url field.");
}
//#endregion

module.exports = { listener, sendMessage };

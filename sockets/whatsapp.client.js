const { Boom } = require("@hapi/boom");
const {
  default: makeWASocket,
  useMultiFileAuthState,
  DisconnectReason,
  fetchLatestBaileysVersion,
} = require("@whiskeysockets/baileys");
const qrcode = require("qrcode");
const { accounts } = require("../dtos/accounts");
const pino = require("pino");
const { listener } = require("./whatsapp.listener");

//#region 🔹 Baileys istemcisini başlatma fonksiyonu
async function createBaileysClient(accountId, isReconnect = false) {
  let sock;
  try {
    console.log(
      isReconnect
        ? `🔁 Reconnecting WhatsApp session for: ${accountId}`
        : `🚀 Starting new WhatsApp session for: ${accountId}`
    );

    const { state, saveCreds } = await useMultiFileAuthState(
      `./auth_info/${accountId}`
    );
    const { version } = await fetchLatestBaileysVersion();

    sock = makeWASocket({
      version,
      auth: state,
      printQRInTerminal: false,
      syncFullHistory: false,
      logger: pino({ level: "silent" }),
    });

    // Hesap bilgilerini başlangıçta kaydet
    accounts[accountId] = { sock, currentQR: null, status: "INITIALIZING" };

    // Bağlantı güncellemelerini dinle
    sock.ev.on("connection.update", async (update) => {
      const { connection, lastDisconnect, qr } = update;

      // ✅ QR kod oluşturma
      if (qr) {
        accounts[accountId].currentQR = await qrcode.toDataURL(qr);
        accounts[accountId].status = "QR_READY";
        console.log(`🔑 QR code generated for ${accountId}`);
      }

      // ✅ QR kod okundu, bağlantı kuruldu
      if (connection === "open") {
        accounts[accountId].status = "CONNECTED";
        accounts[accountId].currentQR = null;
        console.log(`✅ ${accountId} connected successfully!`);

        // 🎧 Dinleme işlemini yalnızca bağlantı kurulduğunda başlat
        if (typeof listener === "function") {
          listener(accountId, sock);
          console.log(`🎧 Listening started for ${accountId}`);
        }
      }

      // ❌ Bağlantı kapandıysa
      if (connection === "close") {
        const reason = new Boom(lastDisconnect?.error)?.output?.statusCode;
        console.log(`⚠️ ${accountId} disconnected (reason: ${reason})`);

        try {
          if (sock?.end) await sock.end();
        } catch (e) {
          console.warn(`⚠️ Socket cleanup failed for ${accountId}:`, e.message);
        }

        switch (reason) {
          case DisconnectReason.loggedOut:
            accounts[accountId].status = "LOGGED_OUT";
            accounts[accountId].currentQR = null;
            console.log(`❌ ${accountId} logged out manually.`);
            break;

          case 515:
            console.warn(`🚫 ${accountId} hit rate limit (515). Retrying...`);
            accounts[accountId].status = "RATE_LIMIT";
            setTimeout(
              () => createBaileysClient(accountId, true),
              10000
            );
            break;

          case DisconnectReason.connectionClosed:
          case DisconnectReason.timedOut:
            console.log(`♻️ ${accountId} reconnecting after timeout...`);
            accounts[accountId].status = "RECONNECTING";
            await createBaileysClient(accountId, true);
            break;

          default:
            console.log(`🔄 ${accountId} restarting session...`);
            await createBaileysClient(accountId, true);
            break;
        }
      }
    });

    sock.ev.on("creds.update", saveCreds);

    return {
      success: true,
      message: `✅ WhatsApp session started for ${accountId}`,
      response: `STATUS: ${accounts[accountId].status} QR : ${accounts[accountId].currentQR}`,
    };
  } catch (err) {
    console.error(
      `❌ startWhatsApp error for ${accountId}:`,
      err.message || err
    );

    // Hata durumunda socket temizliği
    if (sock?.end) {
      try {
        await sock.end();
        console.log(`🧹 Socket for ${accountId} closed after error.`);
      } catch (closeErr) {
        console.warn(
          `⚠️ Failed to close socket for ${accountId}:`,
          closeErr.message
        );
      }
    }

    return {
      success: false,
      message:
        err.message || "Unknown error occurred while starting WhatsApp session",
      response: "STATUS : ERROR",
    };
  }
}
//#endregion

//#region 🔹 Dinleyiciyi durdurma fonksiyonu
async function stopBaileysClient(accountId) {
  try {
    const account = accounts[accountId];
    if (!account || !account.sock) {
      console.log(
        `⚠️ ${accountId} için aktif bir WhatsApp bağlantısı bulunamadı.`
      );
      return {
        success: false,
        message: "Bağlantı zaten kapalı",
        response: null,
      };
    }

    await account.sock.ws.close(); // WebSocket'i kapat
    account.sock.ev.removeAllListeners();
    delete accounts[accountId]; // Hafızadan sil

    console.log(`🛑 ${accountId} için WhatsApp bağlantısı sonlandırıldı.`);
    return { success: true, message: "Bağlantı durduruldu", response: null };
  } catch (error) {
    console.error(`❌ ${accountId} durdurulurken hata oluştu:`, error);
    return {
      success: false,
      message: "Bağlantı durdurulamadı",
      response: error.message,
    };
  }
}
//#endregion

module.exports = { createBaileysClient, stopBaileysClient };

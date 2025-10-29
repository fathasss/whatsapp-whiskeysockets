const express = require("express");
const { sendMessage } = require("../sockets/whatsapp.listener");
const {
  createBaileysClient,
  stopBaileysClient,
} = require("../sockets/whatsapp.client");
const router = express.Router();
const { accounts } = require("../globals/accounts.dtos");
const messageService = require("../services/messages.service");

/**
 * @swagger
 * /message/start/{accountId}:
 *   post:
 *     summary: Start WhatsApp session for an account
 *     tags: [Message]
 *     parameters:
 *       - in: path
 *         name: accountId
 *         required: true
 *         schema:
 *           type: string
 *         description: WhatsApp account ID
 *     responses:
 *       200:
 *         description: WhatsApp session started successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 response:
 *                   type: object
 *       500:
 *         description: Hata
 */
router.post("/start/:accountId", async (req, res) => {
  const { accountId } = req.params;
  try {
    if (!accountId) {
      return res.status(400).json({
        success: false,
        message: "❌ The accountId parameter is missing!",
        response: null,
      });
    }
    const result = await createBaileysClient(accountId);
    if (result.success) {
      return res.json(result);
    } else {
      return res.status(500).json(result);
    }
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: `❌ Failed to start WhatsApp session for ${accountId}: ${err.message}`,
      response: null,
    });
  }
});

/**
 * @swagger
 * /message/qr/{accountId}:
 *   post:
 *     summary: Get WhatsApp QR code for account
 *     tags: [Message]
 *     parameters:
 *       - in: path
 *         name: accountId
 *         required: true
 *         schema:
 *           type: string
 *         description: WhatsApp account ID
 *     responses:
 *       200:
 *         description: QR kod başarıyla alındı veya bulunamadı
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 response:
 *                   type: string
 */
router.post("/qr/:accountId", async (req, res) => {
  try {
    const { accountId } = req.params;
    const account = accounts[accountId];
    if (account && account.currentQR) {
      res.json({
        success: true,
        message: "QR kod başarıyla alındı",
        response: `${account.currentQR}`,
      });
    } else {
      res.json({
        success: false,
        message: "📱 No qr or account not linked!",
        response: null,
      });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * @swagger
 * /message/send/{accountId}:
 *   post:
 *     summary: Send WhatsApp message via Baileys
 *     tags: [Message]
 *     parameters:
 *       - in: path
 *         name: accountId
 *         required: true
 *         schema:
 *           type: string
 *         description: WhatsApp account ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               to:
 *                 type: string
 *                 description: Alıcı JID
 *               type:
 *                 type: string
 *                 description: Mesaj tipi (text, image, document)
 *               content:
 *                 type: object
 *                 description: Mesaj içeriği (text, caption, url, base64 vb.)
 *     responses:
 *       200:
 *         description: Mesaj başarıyla gönderildi
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 result:
 *                   type: object
 *       500:
 *         description: Hata
 */
router.post("/send/:accountId", async (req, res) => {
  try {
    const { accountId } = req.params;
    const { to, type, content } = req.body;

    const result = await sendMessage(accountId, to, type, content);
    res.json({ success: true, result });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * @swagger
 * /message/get-messages/{accountId}:
 *   post:
 *     summary: Get messages for a WhatsApp account from MongoDB
 *     tags: [Message]
 *     parameters:
 *       - in: path
 *         name: accountId
 *         required: true
 *         schema:
 *           type: string
 *         description: WhatsApp account ID
 *     requestBody:
 *       required: false
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               since:
 *                 type: string
 *                 format: date-time
 *                 description: ISO timestamp to fetch messages since this date
 *               limit:
 *                 type: integer
 *                 description: Maximum number of messages to return
 *                 default: 50
 *     responses:
 *       200:
 *         description: Messages successfully retrieved
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 messages:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       chatId:
 *                         type: string
 *                       lastMessage:
 *                         type: string
 *                       lastMessageDate:
 *                         type: string
 *                         format: date-time
 *                       lastMessageType:
 *                         type: string
 *                       pinned:
 *                         type: boolean
 *                       muted:
 *                         type: boolean
 *                       unreadCount:
 *                         type: integer
 *                       messageDetail:
 *                         type: object
 *                         properties:
 *                           messageId:
 *                             type: string
 *                           senderId:
 *                             type: string
 *                           text:
 *                             type: string
 *                           type:
 *                             type: string
 *                           url:
 *                             type: string
 *                           mimeType:
 *                             type: string
 *                           fileSha256:
 *                             type: string
 *                           fileLength:
 *                             type: integer
 *                           timeStamp:
 *                             type: string
 *                             format: date-time
 */
router.post("/get-messages/:accountId", async (req, res) => {
  try {
    const { accountId } = req.params;
    const { since, limit } = req.body;

    const messages = await messageService.getMessagesByAccountId(
      accountId,
      limit,
      since
    );

    res.json({ success: true, messages });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

/**
 * @swagger
 * /message/stop/{accountId}:
 *   post:
 *     summary: Stop WhatsApp listening session for an account
 *     tags: [Message]
 *     parameters:
 *       - in: path
 *         name: accountId
 *         required: true
 *         schema:
 *           type: string
 *         description: WhatsApp account ID
 *     responses:
 *       200:
 *         description: Listening stopped successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *       500:
 *         description: Failed to stop listening
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 */
router.post("/stop/:accountId", async (req, res) => {
  const { accountId } = req.params;
  try {
    const ok = await stopBaileysClient(accountId);
    if (ok) {
      return res.json({
        success: true,
        message: `Listening stopped for ${accountId}`,
      });
    }
    return res.status(500).json({
      success: false,
      message: `Failed to stop listening for ${accountId}`,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: `Error stopping listening for ${accountId}: ${err.message}`,
    });
  }
});

module.exports = router;

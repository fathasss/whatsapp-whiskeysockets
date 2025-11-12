const express = require("express");
const logger = require("./config/logger"); // logger import
const { authMiddleware } = require("./middleware");
const authRoutes = require("./routes/auth.routes");
const whatsappRoutes = require("./routes/whatsapp.routes");
const setupSwagger = require("./api-docs/swagger");
const { webcrypto } = require("crypto");
const path = require("path");
const { autoStartSessions } = require("./infrastructure/whatsapp.client");

require("dotenv").config({ path: path.join(__dirname, ".env") });
globalThis.crypto = webcrypto;

const databaseConnection = require("./config/database");
databaseConnection();

const app = express();
app.use(express.json());
setupSwagger(app);

// 🔥 Global hata yakalayıcılar (ilk satırlara yakın olmalı)
process.on("unhandledRejection", (reason) => {
  logger.error("🚨 Unhandled Rejection:", reason);
});

process.on("uncaughtException", (err) => {
  logger.error("🚨 Uncaught Exception:", err);
});

app.use("/auth", authRoutes);
app.use("/whatsapp", authMiddleware, whatsappRoutes);

app.listen(process.env.PORT, async () => {
  logger.info(`Server running on port ${process.env.PORT}`);
  await autoStartSessions();
});

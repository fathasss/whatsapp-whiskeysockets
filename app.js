const express = require("express");
const { authMiddleware } = require("./middleware");
const authController = require("./controllers/auth-controller");
const whatsappController = require("./controllers/whatsapp-controller");
const setupSwagger = require("./api-docs/swagger");
const { webcrypto } = require("crypto");
const path = require("path");

require("dotenv").config({ path: path.join(__dirname, ".env") });
globalThis.crypto = webcrypto;


const databaseConnection = require("./database/db");

const app = express();
app.use(express.json());
setupSwagger(app);

// 🔥 Global hata yakalayıcılar (ilk satırlara yakın olmalı)
process.on("unhandledRejection", (reason) => {
  console.error("🚨 Unhandled Rejection:", reason);
});

process.on("uncaughtException", (err) => {
  console.error("🚨 Uncaught Exception:", err);
});

databaseConnection();

app.use("/auth", authController);
app.use("/whatsapp", authMiddleware, whatsappController);

app.listen(process.env.PORT, () =>
  console.log(`Server running on port ${process.env.PORT}`)
);

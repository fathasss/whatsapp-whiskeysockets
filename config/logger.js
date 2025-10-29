// config/logger.js
const winston = require("winston");
require("dotenv").config(); 
require("winston-mongodb");

const mongoUri = process.env.MONGO_URI;

const transports = [
  new winston.transports.Console({
    format: winston.format.combine(
      winston.format.colorize(),
      winston.format.timestamp(),
      winston.format.printf(({ level, message, timestamp }) => {
        return `[${timestamp}] ${level}: ${message}`;
      })
    ),
  }),
];

// MongoDB loglama sadece URI varsa
if (mongoUri) {
  transports.push(
    new winston.transports.MongoDB({
      db: mongoUri,
      collection: "app_logs",
      level: "error", 
    })
  );
} else {
  console.warn("⚠️ MONGO_URI bulunamadı, MongoDB loglama devre dışı bırakıldı.");
}

const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || "info",
  transports,
});

module.exports = logger;
const mongoose = require("mongoose");

const whatsappSessionSchema = new mongoose.Schema({
  accountId: { type: String, required: true, unique: true },
  authState: { type: Object, required: true }, // Baileys auth state
  status: { type: String, default: "INITIALIZING" },
  currentQR: { type: String, default: null },
  lastUpdated: { type: Date, default: Date.now },
});

module.exports = mongoose.model("WhatsappSession", whatsappSessionSchema);

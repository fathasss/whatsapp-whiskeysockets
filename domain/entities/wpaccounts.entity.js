const mongoose = require("mongoose");

const accountSchema = new mongoose.Schema({
  accountId: { type: String, required: true, unique: true },
  status: { type: String, default: "INITIALIZING" },
  lastUpdated: { type: Date, default: Date.now },
});

module.exports = mongoose.model("WhatsappAccount", accountSchema);

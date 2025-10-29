const mongoose = require("mongoose");

const CustomerSchema = new mongoose.Schema({
  customerId: { type: String, required: true, unique: true },
  account: String,
  isGroup: Boolean,
  name: String,
  lastActive: Date,
  insertDate: Date,
  updateDate: Date,
});

module.exports = mongoose.model("Customer", CustomerSchema);

const mongoose = require("mongoose");

const MessageSchema = new mongoose.Schema({
  chatId: { type: String, required: true, unique: true },
  customerId: { type: String, required: true }, 
  account: String,
  chatType: String,
  isBlocked: Boolean,
  lastMessage: String,
  lastMessageDate: Date,
  lastMessageType: String,
  muted: Boolean,
  name: String,
  pinned: Boolean,
  unreadCount: Number,
  insertDate: Date,
  updateDate: Date,
});

module.exports = mongoose.model("Message", MessageSchema);
const mongoose = require("mongoose");

const MessageDetailSchema = new mongoose.Schema({
  messageId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Message",
    required: true,
  },
  senderId: String,
  type: String,
  text: String,
  caption: String,
  url: String,
  mimeType: String,
  fileSha256: String,
  fileLength: Number,
  timeStamp: Date,
  status: String,
  isFromMe: Boolean,
  insertDate: Date,
  updateDate: Date,
});

module.exports = mongoose.model("MessageDetail", MessageDetailSchema);
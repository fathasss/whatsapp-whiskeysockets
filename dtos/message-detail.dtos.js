class MessageDetailDto {
  constructor(
    messageId,
    senderId,
    type,
    text,
    caption,
    url,
    mimeType,
    fileSha256,
    fileLength,
    timeStamp,
    status,
    isFromMe,
    insertDate,
    updateDate
  ) {
    this.messageId = messageId;
    this.senderId = senderId;
    this.type = type;
    this.text = text;
    this.caption = caption;
    this.url = url;
    this.mimeType = mimeType;
    this.fileSha256 = fileSha256;
    this.fileLength = fileLength;
    this.timeStamp = timeStamp;
    this.status = status;
    this.isFromMe = isFromMe;
    this.insertDate = insertDate;
    this.updateDate = updateDate;
  }
}

module.exports = MessageDetailDto;
class MessagesDto {
  constructor({
    chatId,
    accountId,
    chatType,
    insertDate,
    isBlocked,
    lastMessage,
    lastMessageDate,
    lastMessageType,
    muted,
    name,
    pinned,
    unreadCount,
    updateDate,
    messageDetail: messageDetailSchema,
  }) {
    this.chatId = chatId;
    this.accountId = accountId;
    this.chatType = chatType;
    this.insertDate = insertDate;
    this.isBlocked = isBlocked;
    this.lastMessage = lastMessage;
    this.lastMessageDate = lastMessageDate;
    this.lastMessageType = lastMessageType;
    this.muted = muted;
    this.name = name;
    this.pinned = pinned;
    this.unreadCount = unreadCount;
    this.updateDate = updateDate;
    this.messageDetail = messageDetailSchema;
  }
}

module.exports = MessagesDto;

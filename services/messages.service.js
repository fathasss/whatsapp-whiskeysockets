const MessageRepository = require("../domain/repositories/message.repository");

class MessagesService {
  async getAll() {
    return await MessageRepository.findAll();
  }

  async getMessagesByAccountId(accountId, limit = 50, since) {
    const query = { accountId };
    if (since) query.lastMessageDate = { $gte: new Date(since) };
    return await MessageRepository.find(query, limit).sort({
      lastMessageDate: -1,
    });
  }

  async createOrUpdate(messageData) {
    const existing = await MessageRepository.findOne({
      chatId: messageData.chatId,
    });
    if (existing) {
      Object.assign(existing, messageData);
      return await existing.save();
    } else {
      return await MessageRepository.create(messageData);
    }
  }

  async getByChatId(chatId) {
    return await MessageRepository.findOne({ chatId });
  }
}

module.exports = new MessagesService();

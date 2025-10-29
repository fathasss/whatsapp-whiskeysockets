const Messages = require("../entity/message.repository");

class MessagesService {
  async getAll() {
    return await Messages.find();
  }

  async getMessagesByAccountId(accountId, limit = 50, since) {
    const query = { accountId };
    if (since) query.lastMessageDate = { $gte: new Date(since) };
    return await Messages.find(query)
      .sort({ lastMessageDate: -1 })
      .limit(limit);
  }

  async createOrUpdate(messageData) {
    const existing = await Messages.findOne({ chatId: messageData.chatId });
    if (existing) {
      Object.assign(existing, messageData);
      return await existing.save();
    } else {
      return await Messages.create(messageData);
    }
  }

  async getByChatId(chatId) {
    return await Messages.findOne({ chatId });
  }
}

module.exports = new MessagesService();

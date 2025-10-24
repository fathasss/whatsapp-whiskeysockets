const MessageDetail = require("../entity/message-detail");

class MessageDetailService {
  async getAll() {
    return await MessageDetail.find();
  }

  async createOrUpdate(detailData) {
    const existing = await MessageDetail.findOne({
      messageId: detailData.messageId,
      type: detailData.type,
    });
    if (existing) {
      Object.assign(existing, detailData);
      return await existing.save();
    } else {
      return await MessageDetail.create(detailData);
    }
  }

  async getByMessageId(messageId) {
    return await MessageDetail.find({ messageId });
  }
}

module.exports = new MessageDetailService();

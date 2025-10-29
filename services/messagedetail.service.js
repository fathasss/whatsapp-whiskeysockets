const MessageDetailRepository = require("../domain/repositories/messagedetail.repository");

class MessageDetailService {
  async getAll() {
    return await MessageDetailRepository.find();
  }

  async createOrUpdate(detailData) {
    const existing = await MessageDetailRepository.findOne({
      messageId: detailData.messageId,
      type: detailData.type,
    });
    if (existing) {
      Object.assign(existing, detailData);
      return await existing.save();
    } else {
      return await MessageDetailRepository.create(detailData);
    }
  }

  async getByMessageId(messageId) {
    return await MessageDetailRepository.find({ messageId });
  }
}

module.exports = new MessageDetailService();

const MessageEntity = require("../entities/message.entity");

class MessageRepository {
  async findAll(filter = {}, limit = 100) {
    return await MessageEntity.find(filter).limit(limit);
  }
  async findById(messageId) {
    return await MessageEntity.findById({ messageId });
  }

  async findOne(query) {
    return await MessageEntity.findOne(query);
  }

  async find(query = {}, limit = 50) {
    return await MessageEntity.find(query).limit(limit);
  }

  async create(messageData) {
    const message = new MessageEntity(messageData);
    return await message.save();
  }
  async update(messageId, updateData) {
    return await MessageEntity.findByIdAndUpdate(messageId, updateData, {
      new: true,
    });
  }
  async delete(messageId) {
    return await MessageEntity.findByIdAndDelete(messageId);
  }
}

module.exports = new MessageRepository();

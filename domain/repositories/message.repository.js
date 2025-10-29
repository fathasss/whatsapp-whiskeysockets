const Message = require("../entities/message.entity");

class MessageRepository {
  async findAll(filter = {}, limit = 100) {
    return await Message.find(filter).limit(limit);
  }
  async findById(messageId) {
    return await Message.findById({ messageId });
  }
  async findOne(query) {
    return await Message.findOne(query);
  }
  async create(messageData) {
    const message = new Message(messageData);
    return await message.save();
  }
  async update(messageId, updateData) {
    return await Message.findByIdAndUpdate(messageId, updateData, {
      new: true,
    });
  }
  async delete(messageId) {
    return await Message.findByIdAndDelete(messageId);
  }
}

module.exports = new MessageRepository();

const MessageDetailEntity = require("../entities/messagedetail.entity");
class MessageDetailRepository {
  async findAll(filter = {}, limit = 100) {
    return await MessageDetailEntity.find(filter).limit(limit);
  }
  async findById(messageDetailId) {
    return await MessageDetailEntity.find({ messageDetailId });
  }
  async findOne(query) {
    return await MessageDetailEntity.findOne(query);
  }

  async find(query = {}, limit = 50) {
    return await MessageDetailEntity.find(query).limit(limit);
  }
  async create(messageDetailData) {
    const messageDetail = new MessageDetailEntity(messageDetailData);
    return await messageDetail.save();
  }
  async update(messageDetailId, updateData) {
    return await MessageDetailEntity.find.findByIdAndUpdate(
      messageDetailId,
      updateData,
      { new: true }
    );
  }
  async delete(messageDetailId) {
    return await MessageDetailEntity.findByIdAndDelete(messageDetailId);
  }
}
module.exports = new MessageDetailRepository();

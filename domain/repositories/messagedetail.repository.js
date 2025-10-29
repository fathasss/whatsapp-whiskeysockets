const MessageDetail = require("../entities/messagedetail.entity");
class MessageDetailRepository {
  async findAll(filter = {}, limit = 100) {
    return await MessageDetail.find(filter).limit(limit);
  }
  async findById(messageDetailId) {
    return await MessageDetail.find({ messageDetailId });
  }
  async findOne(query) {
    return await MessageDetail.findOne(query);
  }
  async create(messageDetailData) {
    const messageDetail = new MessageDetail(messageDetailData);
    return await messageDetail.save();
  }
  async update(messageDetailId, updateData) {
    return await MessageDetail.find.findByIdAndUpdate(
      messageDetailId,
      updateData,
      { new: true }
    );
  }
  async delete(messageDetailId) {
    return await MessageDetail.findByIdAndDelete(messageDetailId);
  }
}
module.exports = new MessageDetailRepository();

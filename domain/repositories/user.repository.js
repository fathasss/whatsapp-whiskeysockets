const UserEntity = require("../entities/user.entity");

class UserRepository {
  async findAll(filter = {}, limit = 100) {
    return await UserEntity.find(filter).limit(limit);
  }
  async findById(userId) {
    return await UserEntity.findById({ userId });
  }
  async findOne(query) {
    return await UserEntity.findOne(query);
  }
  async create(userData) {
    const user = new UserEntity(userData);
    return await user.save();
  }
  async update(userId, updateData) {
    return await UserEntity.findByIdAndUpdate(userId, updateData, { new: true });
  }
  async delete(userId) {
    return await UserEntity.findByIdAndDelete(userId);
  }
}

module.exports = new UserRepository();

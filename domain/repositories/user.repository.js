const User = require("../entities/user.entity");

class UserRepository {
  async findAll(filter = {}, limit = 100) {
    return await User.find(filter).limit(limit);
  }
  async findById(userId) {
    return await User.findById({ userId });
  }
  async findOne(query) {
    return await User.findOne(query);
  }
  async create(userData) {
    const user = new User(userData);
    return await user.save();
  }
  async update(userId, updateData) {
    return await User.findByIdAndUpdate(userId, updateData, { new: true });
  }
  async delete(userId) {
    return await User.findByIdAndDelete(userId);
  }
}

module.exports = new UserRepository();

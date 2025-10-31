const WhatsappAccountEntity = require("../entities/wpaccounts.entity");

class WhatsappAccountRepository {
  async findAll(filter = {}, limit = 100) {
    return WhatsappAccountEntity.find(filter).limit(limit);
  }

  async findOne(query){
    return WhatsappAccountEntity.findOne(query);
  }

  async create(accountData) {
    const account = new WhatsappAccountEntity(accountData);
    return await account.save();
  }

  async update(updateId, updateData) {
    return await WhatsappAccountEntity.findByIdAndUpdate(updateId, updateData, {
      new: true,
    });
  }
}

module.exports = new WhatsappAccountRepository();

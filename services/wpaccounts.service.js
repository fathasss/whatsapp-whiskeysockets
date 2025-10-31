const WhatsappAccountRepository = require("../domain/repositories/wpaccounts.repository");

class WhatsappAccountService {
  async getAll() {
    return await WhatsappAccountRepository.findAll();
  }

  async createOrUpdate(wpaccountData) {
    const existing = await WhatsappAccountRepository.findOne({
      accountId: wpaccountData.accountId,
    });

    if (existing) {
      Object.assign(existing, wpaccountData);
      return await existing.save();
    } else {
      return await WhatsappAccountRepository.create(wpaccountData);
    }
  }
}

module.exports = new WhatsappAccountService();

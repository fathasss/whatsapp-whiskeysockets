const WhatsappSessionRepository = require("../domain/repositories/whatsappsession.repository");

class WhatsappSessionService {
  async saveSession(accountId, authState) {
    const existing = await WhatsappSessionRepository.findOne({ accountId });
    if (existing) {
      existing.authState = authState;
      existing.lastUpdated = new Date();
      return await existing.save();
    }
    return await WhatsappSessionRepository.create({ accountId, authState });
  }

  async getSession(accountId) {
    return await WhatsappSessionRepository.findOne({ accountId });
  }
}

module.exports = new WhatsappSessionService();

const WhatsappSession = require("../domain/repositories/whatsappsession.repository");

class WhatsappSessionService {
  async saveSession(accountId, authState) {
    const existing = await WhatsappSession.findOne({ accountId });
    if (existing) {
      existing.authState = authState;
      existing.lastUpdated = new Date();
      return await existing.save();
    }
    return await WhatsappSession.create({ accountId, authState });
  }

  async getSession(accountId) {
    return await WhatsappSession.findOne({ accountId });
  }
}

module.exports = new WhatsappSessionService();

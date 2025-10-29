const WhatsappSession = require("../entities/whatsappsession.entity");

class WhatsappSessionRepository {
  async find(query = {}) {
    return await WhatsappSession.find(query);
  }
  async findOne(query) {
    return await WhatsappSession.findOne(query);
  }
  async create(data) {
    return await WhatsappSession.create(data);
  }
  async update(query, data) {
    return await WhatsappSession.updateOne(query, data);
  }
}
module.exports = new WhatsappSessionRepository();

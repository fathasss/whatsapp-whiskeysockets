const WhatsappSessionEntity = require("../entities/whatsappsession.entity");

class WhatsappSessionRepository {
  async find(query = {}) {
    return await WhatsappSessionEntity.find(query);
  }
  async findOne(query) {
    return await WhatsappSessionEntity.findOne(query);
  }
  async create(data) {
    return await WhatsappSessionEntity.create(data);
  }
  async update(query, data) {
    return await WhatsappSessionEntity.updateOne(query, data);
  }
}
module.exports = new WhatsappSessionRepository();

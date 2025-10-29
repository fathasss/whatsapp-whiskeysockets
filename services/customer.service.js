const Customer = require("../domain/repositories/customer.repository");

class CustomerService {
  async getAll() {
    return await Customer.find();
  }

  async createOrUpdate(customerData) {
    const existing = await Customer.findOne({
      customerId: customerData.customerId,
    });
    if (existing) {
      Object.assign(existing, customerData);
      return await existing.save();
    } else {
      return await Customer.create(customerData);
    }
  }

  async getById(customerId) {
    return await Customer.findOne({ customerId });
  }
}

module.exports = new CustomerService();

const CustomerRepository = require("../domain/repositories/customer.repository");

class CustomerService {
  async getAll() {
    return await CustomerRepository.find();
  }

  async createOrUpdate(customerData) {
    const existing = await CustomerRepository.findOne({
      customerId: customerData.customerId,
    });
    if (existing) {
      Object.assign(existing, customerData);
      return await existing.save();
    } else {
      return await CustomerRepository.create(customerData);
    }
  }

  async getById(customerId) {
    return await CustomerRepository.findOne({ customerId });
  }
}

module.exports = new CustomerService();

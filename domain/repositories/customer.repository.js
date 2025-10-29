const CustomerEntity = require("../entities/customer.entity");

class CustomerRepository {
    async findAll(filter = {}, limit = 100) {
        return await CustomerEntity.find(filter).limit(limit);
    }

    async findById(customerId) {
        return await CustomerEntity.findById({ customerId });
    }

    async findOne(query) {
        return await CustomerEntity.findOne(query);
    }   

    async create(customerData) {
        const customer = new CustomerEntity(customerData);
        return await customer.save();
    }       

    async update(customerId, updateData) {
        return await CustomerEntity.findByIdAndUpdate(customerId, updateData, { new: true });
    } 
    
    async delete(customerId) {
        return await CustomerEntity.findByIdAndDelete(customerId);
    }   
}

module.exports = new CustomerRepository();
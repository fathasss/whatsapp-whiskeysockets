const Customer = require("../entities/customer.entity");

class CustomerRepository {
    async findAll(filter = {}, limit = 100) {
        return await Customer.find(filter).limit(limit);
    }

    async findById(customerId) {
        return await Customer.findById({ customerId });
    }

    async findOne(query) {
        return await Customer.findOne(query);
    }   

    async create(customerData) {
        const customer = new Customer(customerData);
        return await customer.save();
    }       

    async update(customerId, updateData) {
        return await Customer.findByIdAndUpdate(customerId, updateData, { new: true });
    } 
    
    async delete(customerId) {
        return await Customer.findByIdAndDelete(customerId);
    }   
}

module.exports = new CustomerRepository();
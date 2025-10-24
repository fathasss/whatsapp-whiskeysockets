class CustomerDto {
  constructor({
    customerId,
    accountId,
    isGroup,
    name,
    lastActive,
    insertDate,
    updateDate,
  }) {
    this.customerId = customerId;
    this.accountId = accountId;
    this.isGroup = isGroup;
    this.name = name;
    this.lastActive = lastActive;
    this.insertDate = insertDate;
    this.updateDate = updateDate;
  }
}

module.exports = CustomerDto;

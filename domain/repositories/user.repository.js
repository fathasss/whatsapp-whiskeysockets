const UserEntity = require("../entities/user.entity");
const bcrypt = require("bcrypt");

class UserRepository {
  // Tüm kullanıcıları getir
  async findAll(filter = {}, limit = 100) {
    return await UserEntity.find(filter).limit(limit);
  }

  // ID’ye göre kullanıcı getir
  async findById(userId) {
    return await UserEntity.findById(userId);
  }

  // Belirli bir koşula göre kullanıcı getir
  async findOne(query) {
    return await UserEntity.findOne(query);
  }

  // Yeni kullanıcı oluştur (var mı yok mu kontrolüyle)
  async create(userData) {
    const { username, password, role } = userData;

    // Aynı kullanıcı var mı kontrolü
    const existingUser = await UserEntity.findOne({ username });
    if (existingUser) {
      throw new Error("Bu kullanıcı adı zaten mevcut.");
    }

    // Şifre hashleme
    const hashedPassword = await bcrypt.hash(password, 10);

    // Yeni kullanıcı kaydı
    const newUser = new UserEntity({
      username,
      password: hashedPassword,
      role: role || "user",
    });

    return await newUser.save();
  }

  // Kullanıcı güncelle
  async update(userId, updateData) {
    return await UserEntity.findByIdAndUpdate(userId, updateData, { new: true });
  }

  // Kullanıcı sil
  async delete(userId) {
    return await UserEntity.findByIdAndDelete(userId);
  }
}

module.exports = new UserRepository();

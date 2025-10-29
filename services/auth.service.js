const User = require("../domain/repositories/user.repository");
const  generateToken  = require("../middleware");
const bcrypt = require("bcrypt"); 

class AuthService {
  async login(username, password) {
    const user = await User.findOne({ username });
    if (!user) throw new Error("User not found");

    // Hash ile karşılaştır
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) throw new Error("Invalid credentials");

    return generateToken({ userId: user._id, role: user.role }, "2h");
  }
}

module.exports = new AuthService();

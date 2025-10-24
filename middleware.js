require("dotenv").config();
const jwt = require("jsonwebtoken");

// 🔹 Token üretme
function generateToken(payload) {
  if (!process.env.JWT_SECRET)
    throw new Error("JWT_SECRET environment variable is not set");
  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRATION || "1h",
  });
}

// 🔹 Token doğrulama (sadece token string'i alır)
function verifyToken(token) {
  if (!token) throw new Error("Token is missing");
  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch (err) {
    throw new Error("Invalid token: " + err.message);
  }
}

// 🔹 Express middleware (route bazlı kullanım)
function authMiddleware(req, res, next) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader)
      return res.status(401).json({ error: "Authorization header missing" });

    // Bearer <token>
    const parts = authHeader.split(" ");
    if (parts.length !== 2 || parts[0] !== "Bearer")
      return res.status(401).json({ error: "Invalid authorization format" });

    const token = parts[1];
    req.user = verifyToken(token); // payload burada kullanıma hazır
    next();
  } catch (err) {
    return res.status(401).json({ error: err.message });
  }
}

module.exports = { generateToken, verifyToken, authMiddleware };

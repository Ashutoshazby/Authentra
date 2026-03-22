const jwt = require("jsonwebtoken");
const User = require("../models/User");
const { syncDailyScanAllowance } = require("../services/usageService");

async function requireAuth(req, res, next) {
  try {
    const authHeader = req.headers.authorization || "";
    const [scheme, token] = authHeader.split(" ");

    if (scheme !== "Bearer" || !token) {
      return res.status(401).json({ error: "UNAUTHORIZED" });
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || "development-jwt-secret"
    );

    const user = await User.findById(decoded.userId).select("-passwordHash");
    if (!user) {
      return res.status(401).json({ error: "UNAUTHORIZED" });
    }

    await syncDailyScanAllowance(user);
    req.user = user;
    req.token = token;
    return next();
  } catch (_error) {
    return res.status(401).json({ error: "UNAUTHORIZED" });
  }
}

module.exports = {
  requireAuth
};

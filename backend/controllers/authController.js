const bcrypt = require("bcryptjs");
const { OAuth2Client } = require("google-auth-library");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const { DAILY_SCAN_LIMIT, syncDailyScanAllowance } = require("../services/usageService");

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

function createToken(user) {
  return jwt.sign(
    { userId: user._id.toString() },
    process.env.JWT_SECRET || "development-jwt-secret",
    { expiresIn: "7d" }
  );
}

function serializeUser(user) {
  return {
    id: user._id.toString(),
    email: user.email,
    scansRemaining: user.scansRemaining,
    adsWatchedToday: user.adsWatchedToday,
    createdAt: user.createdAt
  };
}

async function signupController(req, res, next) {
  try {
    const { email, password } = req.body;

    if (!email || !password || password.length < 6) {
      return res.status(400).json({
        message: "A valid email and password of at least 6 characters is required."
      });
    }

    const existingUser = await User.findOne({ email: email.toLowerCase().trim() });
    if (existingUser) {
      return res.status(409).json({ message: "An account with this email already exists." });
    }

    const passwordHash = await bcrypt.hash(password, 12);
    const user = await User.create({
      email: email.toLowerCase().trim(),
      passwordHash,
      scansRemaining: DAILY_SCAN_LIMIT,
      adsWatchedToday: 0,
      lastScanResetAt: new Date()
    });

    const token = createToken(user);
    return res.status(201).json({
      token,
      user: serializeUser(user)
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({ message: "An account with this email already exists." });
    }

    if (error.name === "ValidationError") {
      return res.status(400).json({ message: error.message });
    }

    return next(error);
  }
}

async function loginController(req, res, next) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required." });
    }

    const user = await User.findOne({ email: email.toLowerCase().trim() });
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password." });
    }
    if (!user.passwordHash) {
      return res.status(400).json({
        message: "This account uses Google sign-in. Please continue with Google."
      });
    }

    const isValidPassword = await bcrypt.compare(password, user.passwordHash);
    if (!isValidPassword) {
      return res.status(401).json({ message: "Invalid email or password." });
    }

    await syncDailyScanAllowance(user);

    const token = createToken(user);
    return res.json({
      token,
      user: serializeUser(user)
    });
  } catch (error) {
    return next(error);
  }
}

async function googleLoginController(req, res, next) {
  try {
    const { credential } = req.body;

    if (!credential) {
      return res.status(400).json({ message: "Google credential is required." });
    }

    const ticket = await googleClient.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID
    });

    const payload = ticket.getPayload();
    if (!payload?.email || !payload?.sub) {
      return res.status(400).json({ message: "Invalid Google account response." });
    }

    let user = await User.findOne({ email: payload.email.toLowerCase().trim() });

    if (!user) {
      user = await User.create({
        email: payload.email.toLowerCase().trim(),
        googleId: payload.sub,
        scansRemaining: DAILY_SCAN_LIMIT,
        adsWatchedToday: 0,
        lastScanResetAt: new Date()
      });
    } else if (!user.googleId) {
      user.googleId = payload.sub;
      await user.save();
    }

    await syncDailyScanAllowance(user);

    const token = createToken(user);
    return res.json({
      token,
      user: serializeUser(user)
    });
  } catch (error) {
    return res.status(401).json({ message: "Google sign-in failed." });
  }
}

function meController(req, res) {
  return res.json({
    user: serializeUser(req.user)
  });
}

module.exports = {
  signupController,
  loginController,
  googleLoginController,
  meController,
  serializeUser
};

const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const { OAuth2Client } = require("google-auth-library");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const { DAILY_SCAN_LIMIT, syncDailyScanAllowance } = require("../services/usageService");
const { sendPasswordResetEmail } = require("../services/emailService");

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

async function forgotPasswordController(req, res, next) {
  try {
    const email = String(req.body?.email || "").toLowerCase().trim();

    if (!email) {
      return res.status(400).json({ message: "Email is required." });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.json({
        message: "If an account exists for that email, a reset link has been sent."
      });
    }

    const resetToken = crypto.randomBytes(32).toString("hex");
    const passwordResetTokenHash = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");

    user.passwordResetTokenHash = passwordResetTokenHash;
    user.passwordResetExpiresAt = new Date(Date.now() + 60 * 60 * 1000);
    await user.save();

    const baseFrontendUrl = (process.env.FRONTEND_URL || "http://localhost:5173")
      .split(",")[0]
      .trim()
      .replace(/\/+$/, "");
    const resetUrl = `${baseFrontendUrl}/reset-password?token=${resetToken}`;

    await sendPasswordResetEmail({
      email: user.email,
      resetUrl
    });

    return res.json({
      message: "If an account exists for that email, a reset link has been sent."
    });
  } catch (error) {
    return next(error);
  }
}

async function resetPasswordController(req, res, next) {
  try {
    const token = String(req.body?.token || "").trim();
    const password = String(req.body?.password || "");

    if (!token || password.length < 6) {
      return res.status(400).json({
        message: "A valid reset token and password of at least 6 characters are required."
      });
    }

    const passwordResetTokenHash = crypto
      .createHash("sha256")
      .update(token)
      .digest("hex");

    const user = await User.findOne({
      passwordResetTokenHash,
      passwordResetExpiresAt: { $gt: new Date() }
    });

    if (!user) {
      return res.status(400).json({
        message: "This reset link is invalid or has expired."
      });
    }

    user.passwordHash = await bcrypt.hash(password, 12);
    user.passwordResetTokenHash = null;
    user.passwordResetExpiresAt = null;
    await user.save();

    return res.json({
      message: "Your password has been reset. You can now log in."
    });
  } catch (error) {
    return next(error);
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
  forgotPasswordController,
  resetPasswordController,
  meController,
  serializeUser
};

const mongoose = require("mongoose");
const DAILY_SCAN_LIMIT = 6;

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true
    },
    passwordHash: {
      type: String,
      default: null
    },
    googleId: {
      type: String,
      default: null,
      index: true
    },
    scansRemaining: {
      type: Number,
      default: DAILY_SCAN_LIMIT,
      min: 0
    },
    adsWatchedToday: {
      type: Number,
      default: 0,
      min: 0
    },
    lastScanResetAt: {
      type: Date,
      default: Date.now
    }
  },
  {
    timestamps: { createdAt: true, updatedAt: true }
  }
);

userSchema.pre("validate", function requireAuthMethod() {
  if (!this.passwordHash && !this.googleId) {
    this.invalidate("passwordHash", "Either passwordHash or googleId is required.");
  }
});

module.exports = mongoose.model("User", userSchema);
module.exports.DAILY_SCAN_LIMIT = DAILY_SCAN_LIMIT;

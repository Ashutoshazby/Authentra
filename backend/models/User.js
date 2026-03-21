const mongoose = require("mongoose");

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
      default: 1,
      min: 0
    },
    adsWatchedToday: {
      type: Number,
      default: 0,
      min: 0
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

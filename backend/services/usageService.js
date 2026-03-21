const User = require("../models/User");

async function consumeScan(userId) {
  const user = await User.findById(userId);

  if (!user) {
    throw Object.assign(new Error("USER_NOT_FOUND"), { code: "USER_NOT_FOUND" });
  }

  if (user.scansRemaining <= 0) {
    throw Object.assign(new Error("SCAN_LOCKED"), { code: "SCAN_LOCKED" });
  }

  user.scansRemaining -= 1;
  await user.save();
  return user;
}

async function restoreScan(userId) {
  await User.findByIdAndUpdate(userId, { $inc: { scansRemaining: 1 } });
}

async function unlockScanWithAd(userId) {
  const user = await User.findById(userId);

  if (!user) {
    throw Object.assign(new Error("USER_NOT_FOUND"), { code: "USER_NOT_FOUND" });
  }

  user.scansRemaining += 1;
  user.adsWatchedToday += 1;
  await user.save();
  return user;
}

module.exports = {
  consumeScan,
  restoreScan,
  unlockScanWithAd
};

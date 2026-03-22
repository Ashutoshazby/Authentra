const User = require("../models/User");
const { DAILY_SCAN_LIMIT } = require("../models/User");

function isSameUtcDay(leftDate, rightDate) {
  return (
    leftDate.getUTCFullYear() === rightDate.getUTCFullYear() &&
    leftDate.getUTCMonth() === rightDate.getUTCMonth() &&
    leftDate.getUTCDate() === rightDate.getUTCDate()
  );
}

async function syncDailyScanAllowance(user) {
  if (!user) {
    return user;
  }

  const now = new Date();
  const lastReset = user.lastScanResetAt ? new Date(user.lastScanResetAt) : null;
  const needsReset = !lastReset || !isSameUtcDay(lastReset, now);

  if (needsReset) {
    user.scansRemaining = DAILY_SCAN_LIMIT;
    user.adsWatchedToday = 0;
    user.lastScanResetAt = now;
    await user.save();
  } else if (
    typeof user.scansRemaining !== "number" ||
    user.scansRemaining > DAILY_SCAN_LIMIT
  ) {
    user.scansRemaining = Math.min(
      DAILY_SCAN_LIMIT,
      Number(user.scansRemaining || DAILY_SCAN_LIMIT)
    );
    await user.save();
  }

  return user;
}

async function consumeScan(userId) {
  const user = await User.findById(userId);

  if (!user) {
    throw Object.assign(new Error("USER_NOT_FOUND"), { code: "USER_NOT_FOUND" });
  }

  await syncDailyScanAllowance(user);

  if (user.scansRemaining <= 0) {
    throw Object.assign(new Error("DAILY_SCAN_LIMIT_REACHED"), {
      code: "DAILY_SCAN_LIMIT_REACHED"
    });
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
  unlockScanWithAd,
  syncDailyScanAllowance,
  DAILY_SCAN_LIMIT
};

const { unlockScanWithAd } = require("../services/usageService");

async function unlockScanController(req, res, next) {
  try {
    const userId = req.body.userId || req.user._id.toString();

    if (userId !== req.user._id.toString()) {
      return res.status(403).json({ error: "FORBIDDEN" });
    }

    const user = await unlockScanWithAd(userId);
    return res.json({
      scansRemaining: user.scansRemaining,
      adsWatchedToday: user.adsWatchedToday
    });
  } catch (error) {
    if ((error.code || error.message) === "USER_NOT_FOUND") {
      return res.status(404).json({ error: "USER_NOT_FOUND" });
    }

    return next(error);
  }
}

module.exports = {
  unlockScanController
};

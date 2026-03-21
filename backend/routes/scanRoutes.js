const express = require("express");
const { unlockScanController } = require("../controllers/scanController");
const { requireAuth } = require("../middleware/auth");

const router = express.Router();

router.post("/unlock-scan", requireAuth, unlockScanController);

module.exports = router;

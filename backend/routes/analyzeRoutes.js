const express = require("express");
const { analyzeTextController } = require("../controllers/analyzeController");
const { requireAuth } = require("../middleware/auth");

const router = express.Router();

router.post("/analyze", requireAuth, analyzeTextController);

module.exports = router;

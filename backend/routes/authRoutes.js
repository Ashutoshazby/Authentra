const express = require("express");
const {
  signupController,
  loginController,
  googleLoginController,
  meController
} = require("../controllers/authController");
const { requireAuth } = require("../middleware/auth");

const router = express.Router();

router.post("/signup", signupController);
router.post("/login", loginController);
router.post("/google", googleLoginController);
router.get("/me", requireAuth, meController);

module.exports = router;

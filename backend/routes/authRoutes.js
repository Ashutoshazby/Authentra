const express = require("express");
const {
  signupController,
  loginController,
  googleLoginController,
  forgotPasswordController,
  resetPasswordController,
  meController
} = require("../controllers/authController");
const { requireAuth } = require("../middleware/auth");

const router = express.Router();

router.post("/signup", signupController);
router.post("/login", loginController);
router.post("/google", googleLoginController);
router.post("/forgot-password", forgotPasswordController);
router.post("/reset-password", resetPasswordController);
router.get("/me", requireAuth, meController);

module.exports = router;

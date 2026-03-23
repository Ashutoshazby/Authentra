const nodemailer = require("nodemailer");

let transporter;

function getTransporter() {
  if (transporter) {
    return transporter;
  }

  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS } = process.env;

  if (!SMTP_HOST || !SMTP_PORT || !SMTP_USER || !SMTP_PASS) {
    throw new Error("SMTP is not configured. Set SMTP_HOST, SMTP_PORT, SMTP_USER, and SMTP_PASS.");
  }

  const port = Number(SMTP_PORT);
  const transportConfig = {
    host: SMTP_HOST,
    port,
    secure: port === 465,
    requireTLS: port !== 465,
    auth: {
      user: SMTP_USER,
      pass: SMTP_PASS
    },
    connectionTimeout: 15000,
    greetingTimeout: 10000,
    socketTimeout: 20000
  };

  if (SMTP_HOST.includes("gmail")) {
    transportConfig.service = "gmail";
  }

  transporter = nodemailer.createTransport(transportConfig);

  return transporter;
}

async function sendPasswordResetEmail({ email, resetUrl }) {
  const mailTransporter = getTransporter();
  const from = process.env.SMTP_FROM || process.env.SMTP_USER;

  await mailTransporter.sendMail({
    from,
    to: email,
    subject: "Reset your Authentra password",
    text: [
      "You requested a password reset for your Authentra account.",
      "",
      `Reset your password using this link: ${resetUrl}`,
      "",
      "This link expires in 1 hour.",
      "If you did not request this, you can ignore this email."
    ].join("\n"),
    html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #0f172a;">
        <h2>Reset your Authentra password</h2>
        <p>You requested a password reset for your Authentra account.</p>
        <p>
          <a href="${resetUrl}" style="display:inline-block;padding:12px 18px;background:#f59e0b;color:#020617;text-decoration:none;border-radius:999px;font-weight:700;">
            Reset Password
          </a>
        </p>
        <p>This link expires in 1 hour.</p>
        <p>If you did not request this, you can safely ignore this email.</p>
      </div>
    `
  });
}

module.exports = {
  sendPasswordResetEmail
};

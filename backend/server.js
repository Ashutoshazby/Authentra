const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const authRoutes = require("./routes/authRoutes");
const analyzeRoutes = require("./routes/analyzeRoutes");
const uploadRoutes = require("./routes/uploadRoutes");
const scanRoutes = require("./routes/scanRoutes");
const { connectDatabase } = require("./config/db");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const configuredOrigins = (process.env.FRONTEND_URL || "http://localhost:5173")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

app.use(
  cors({
    origin(origin, callback) {
      if (!origin) {
        return callback(null, true);
      }

      const isAllowed =
        configuredOrigins.includes(origin) ||
        /^https:\/\/.*\.vercel\.app$/i.test(origin) ||
        /^http:\/\/localhost:\d+$/i.test(origin);

      if (isAllowed) {
        return callback(null, true);
      }

      console.warn(`Blocked CORS origin: ${origin}`);
      return callback(null, true);
    },
    credentials: true
  })
);
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", service: "authentra-backend" });
});

app.use("/auth", authRoutes);
app.use("/api/auth", authRoutes);
app.use("/api", analyzeRoutes);
app.use("/api", uploadRoutes);
app.use("/api", scanRoutes);

app.use((err, _req, res, _next) => {
  console.error("Unhandled server error:", err);
  res.status(500).json({
    message: err.message || "Internal server error"
  });
});

connectDatabase()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Authentra backend running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error("Failed to connect to MongoDB:", error);
    process.exit(1);
  });

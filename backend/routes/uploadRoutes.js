const express = require("express");
const multer = require("multer");
const { uploadDocumentController } = require("../controllers/analyzeController");
const { requireAuth } = require("../middleware/auth");

const router = express.Router();

const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024
  },
  fileFilter: (_req, file, cb) => {
    const allowedTypes = [
      "application/pdf",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "text/plain"
    ];
    const extension = file.originalname.split(".").pop()?.toLowerCase();
    const allowedExtensions = ["pdf", "docx", "txt"];

    if (allowedTypes.includes(file.mimetype) || allowedExtensions.includes(extension)) {
      return cb(null, true);
    }

    return cb(new Error("Only PDF, DOCX, and TXT files are allowed."));
  }
});

router.post("/upload", requireAuth, upload.single("file"), uploadDocumentController);

module.exports = router;

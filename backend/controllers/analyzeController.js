const { runFullAnalysis } = require("../services/analysisService");
const { extractTextFromFile } = require("../services/textExtractionService");
const { consumeScan, restoreScan } = require("../services/usageService");

async function analyzeTextController(req, res, next) {
  try {
    const { text } = req.body;

    if (!text || !text.trim()) {
      return res.status(400).json({ message: "Text is required for analysis." });
    }

    await consumeScan(req.user._id);

    let result;
    try {
      result = await runFullAnalysis(text);
    } catch (error) {
      await restoreScan(req.user._id);
      throw error;
    }

    return res.json(result);
  } catch (error) {
    if ((error.code || error.message) === "SCAN_LOCKED") {
      return res.status(403).json({ error: "SCAN_LOCKED" });
    }
    return next(error);
  }
}

async function uploadDocumentController(req, res, next) {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "A file upload is required." });
    }

    const text = await extractTextFromFile(req.file);

    if (!text.trim()) {
      return res
        .status(400)
        .json({ message: "The uploaded file did not contain readable text." });
    }

    await consumeScan(req.user._id);

    let result;
    try {
      result = await runFullAnalysis(text);
    } catch (error) {
      await restoreScan(req.user._id);
      throw error;
    }

    return res.json(result);
  } catch (error) {
    if ((error.code || error.message) === "SCAN_LOCKED") {
      return res.status(403).json({ error: "SCAN_LOCKED" });
    }
    return next(error);
  }
}

module.exports = {
  analyzeTextController,
  uploadDocumentController
};

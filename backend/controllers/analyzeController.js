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
    if ((error.code || error.message) === "DAILY_SCAN_LIMIT_REACHED") {
      return res.status(403).json({
        error: "DAILY_SCAN_LIMIT_REACHED",
        message: "You have reached today's 6-scan limit. Please try again tomorrow."
      });
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
    if ((error.code || error.message) === "DAILY_SCAN_LIMIT_REACHED") {
      return res.status(403).json({
        error: "DAILY_SCAN_LIMIT_REACHED",
        message: "You have reached today's 6-scan limit. Please try again tomorrow."
      });
    }
    return next(error);
  }
}

module.exports = {
  analyzeTextController,
  uploadDocumentController
};

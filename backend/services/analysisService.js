const { detectAiContent } = require("./aiDetector");
const { detectPlagiarism } = require("./plagiarismEngine");
const { normalizeWhitespace } = require("../utils/preprocessing");

async function runFullAnalysis(rawText) {
  const text = normalizeWhitespace(rawText);
  const [plagiarismResult, aiResult] = await Promise.all([
    detectPlagiarism(text),
    detectAiContent(text)
  ]);

  return {
    aiScore: Math.round(aiResult.ai_probability * 100),
    plagiarismScore: plagiarismResult.plagiarismScore,
    matchedSentences: plagiarismResult.matchedSentences,
    sources: plagiarismResult.sources,
    documentText: text
  };
}

module.exports = {
  runFullAnalysis
};

const { detectAI } = require("./aiDetector");
const { detectPlagiarism } = require("./plagiarismEngine");
const { normalizeWhitespace } = require("../utils/preprocessing");

async function runFullAnalysis(rawText) {
  const text = normalizeWhitespace(rawText);
  const [plagiarismResult, aiScore] = await Promise.all([
    detectPlagiarism(text),
    detectAI(text)
  ]);

  return {
    aiScore: Number(aiScore || 0),
    plagiarismScore: plagiarismResult.plagiarismScore,
    matchedSentences: plagiarismResult.matchedSentences,
    sources: plagiarismResult.sources,
    documentText: text
  };
}

module.exports = {
  runFullAnalysis
};

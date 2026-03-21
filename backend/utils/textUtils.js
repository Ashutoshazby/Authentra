const natural = require("natural");

const tokenizer = new natural.WordTokenizer();
const stopwords = new Set(natural.stopwords);

function normalizeWhitespace(text = "") {
  return text.replace(/\s+/g, " ").trim();
}

function splitIntoSentences(text = "") {
  return normalizeWhitespace(text)
    .split(/(?<=[.!?])\s+(?=[A-Z0-9])/)
    .map((sentence) => sentence.trim())
    .filter((sentence) => sentence.length > 25);
}

function preprocessTokens(text = "") {
  return tokenizer
    .tokenize(text.toLowerCase())
    .map((token) => token.replace(/[^a-z0-9]/g, ""))
    .filter(Boolean)
    .filter((token) => !stopwords.has(token))
    .map((token) => natural.PorterStemmer.stem(token));
}

function buildNgrams(tokens, size = 3) {
  if (tokens.length < size) return [];
  const grams = [];
  for (let index = 0; index <= tokens.length - size; index += 1) {
    grams.push(tokens.slice(index, index + size).join(" "));
  }
  return grams;
}

function cosineSimilarityFromMaps(leftMap, rightMap) {
  const dimensions = new Set([...Object.keys(leftMap), ...Object.keys(rightMap)]);
  let dotProduct = 0;
  let leftMagnitude = 0;
  let rightMagnitude = 0;

  dimensions.forEach((dimension) => {
    const leftValue = leftMap[dimension] || 0;
    const rightValue = rightMap[dimension] || 0;
    dotProduct += leftValue * rightValue;
    leftMagnitude += leftValue ** 2;
    rightMagnitude += rightValue ** 2;
  });

  if (!leftMagnitude || !rightMagnitude) {
    return 0;
  }

  return dotProduct / (Math.sqrt(leftMagnitude) * Math.sqrt(rightMagnitude));
}

module.exports = {
  normalizeWhitespace,
  splitIntoSentences,
  preprocessTokens,
  buildNgrams,
  cosineSimilarityFromMaps
};

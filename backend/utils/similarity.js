const natural = require("natural");

function buildNgrams(tokens = [], size = 3) {
  if (!Array.isArray(tokens) || tokens.length < size) {
    return [];
  }

  const grams = [];
  for (let index = 0; index <= tokens.length - size; index += 1) {
    grams.push(tokens.slice(index, index + size).join(" "));
  }
  return grams;
}

function jaccardSimilarity(leftItems = [], rightItems = []) {
  const left = new Set(leftItems);
  const right = new Set(rightItems);

  if (!left.size || !right.size) {
    return 0;
  }

  const intersection = [...left].filter((item) => right.has(item)).length;
  const union = new Set([...left, ...right]).size;
  return union ? intersection / union : 0;
}

function cosineSimilarityFromMaps(leftMap = {}, rightMap = {}) {
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

function tfidfCosineSimilarity(leftText = "", rightText = "", vocabulary = []) {
  const tfidf = new natural.TfIdf();
  tfidf.addDocument(leftText);
  tfidf.addDocument(rightText);

  const terms = vocabulary.length
    ? vocabulary
    : Array.from(
        new Set(
          `${leftText} ${rightText}`
            .toLowerCase()
            .split(/\s+/)
            .filter(Boolean)
        )
      );

  const leftVector = {};
  const rightVector = {};

  terms.forEach((term) => {
    leftVector[term] = tfidf.tfidf(term, 0);
    rightVector[term] = tfidf.tfidf(term, 1);
  });

  return cosineSimilarityFromMaps(leftVector, rightVector);
}

module.exports = {
  buildNgrams,
  jaccardSimilarity,
  cosineSimilarityFromMaps,
  tfidfCosineSimilarity
};

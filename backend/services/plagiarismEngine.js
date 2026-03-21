const referenceDocuments = require("../data/referenceDocuments");
const {
  createSentenceRecords,
  normalizeWhitespace
} = require("../utils/preprocessing");
const {
  buildNgrams,
  jaccardSimilarity,
  tfidfCosineSimilarity
} = require("../utils/similarity");
const { compareFingerprints } = require("./fingerprint");
const { fetchWebMatches } = require("./webSearchService");

function collectReferenceCandidates() {
  return referenceDocuments.flatMap((document) =>
    createSentenceRecords(document.content).map((record, index) => ({
      id: `${document.id}-${index}`,
      sourceType: "database",
      source: document.title,
      sourceUrl: null,
      sentence: record.sentence,
      normalized: record.normalized,
      tokens: record.tokens
    }))
  );
}

function scoreSentenceMatch(leftRecord, rightRecord) {
  const vocabulary = Array.from(
    new Set([...leftRecord.tokens, ...rightRecord.tokens])
  );

  const threeGramSimilarity = jaccardSimilarity(
    buildNgrams(leftRecord.tokens, 3),
    buildNgrams(rightRecord.tokens, 3)
  );
  const fiveGramSimilarity = jaccardSimilarity(
    buildNgrams(leftRecord.tokens, 5),
    buildNgrams(rightRecord.tokens, 5)
  );
  const cosineSimilarity = tfidfCosineSimilarity(
    leftRecord.tokens.join(" "),
    rightRecord.tokens.join(" "),
    vocabulary
  );
  const fingerprintSimilarity = compareFingerprints(
    leftRecord.sentence,
    rightRecord.sentence,
    { k: 5, windowSize: 4 }
  );
  const tokenJaccard = jaccardSimilarity(leftRecord.tokens, rightRecord.tokens);

  const combined =
    threeGramSimilarity * 0.2 +
    fiveGramSimilarity * 0.15 +
    cosineSimilarity * 0.3 +
    fingerprintSimilarity * 0.25 +
    tokenJaccard * 0.1;

  return {
    similarity: Number(Math.min(1, combined).toFixed(4)),
    metrics: {
      threeGram: Number(threeGramSimilarity.toFixed(4)),
      fiveGram: Number(fiveGramSimilarity.toFixed(4)),
      cosine: Number(cosineSimilarity.toFixed(4)),
      fingerprint: Number(fingerprintSimilarity.toFixed(4)),
      jaccard: Number(tokenJaccard.toFixed(4))
    }
  };
}

async function detectPlagiarism(documentText) {
  const inputRecords = createSentenceRecords(documentText);
  const referenceCandidates = collectReferenceCandidates();

  const sentenceComparisons = await Promise.all(
    inputRecords.map(async (record) => {
      const candidateMatches = await Promise.all(
        referenceCandidates.map(async (candidate) => {
          const scored = scoreSentenceMatch(record, candidate);
          if (scored.similarity < 0.32) {
            return null;
          }

          return {
            sentence: record.sentence,
            similarity: scored.similarity,
            source: candidate.source,
            sourceType: candidate.sourceType,
            sourceUrl: candidate.sourceUrl,
            matchText: candidate.sentence,
            metrics: scored.metrics
          };
        })
      );

      return candidateMatches.filter(Boolean).sort((left, right) => right.similarity - left.similarity)[0] || null;
    })
  );

  const localMatches = sentenceComparisons.filter(Boolean);
  const webMatches = await fetchWebMatches(inputRecords);

  const allMatches = [...localMatches, ...webMatches]
    .sort((left, right) => right.similarity - left.similarity)
    .slice(0, 25);

  const suspiciousSentences = new Set(allMatches.map((match) => match.sentence)).size;
  const averageSimilarity =
    allMatches.reduce((sum, match) => sum + match.similarity, 0) /
    Math.max(allMatches.length, 1);

  const plagiarismScore = inputRecords.length
    ? Math.min(
        100,
        Math.round((suspiciousSentences / inputRecords.length) * 60 + averageSimilarity * 40)
      )
    : 0;

  const sources = Array.from(
    new Map(
      allMatches
        .filter((match) => match.sourceUrl || match.source)
        .map((match) => [
          `${match.sourceUrl || match.source}-${match.sentence}`,
          {
            sentence: match.sentence,
            similarity: match.similarity,
            source: match.sourceUrl || match.source,
            sourceType: match.sourceType
          }
        ])
    ).values()
  );

  return {
    plagiarismScore,
    matchedSentences: allMatches.map((match) => ({
      sentence: normalizeWhitespace(match.sentence),
      similarity: Number(match.similarity.toFixed(2)),
      source: match.sourceUrl || match.source,
      matchText: normalizeWhitespace(match.matchText || ""),
      sourceType: match.sourceType,
      metrics: match.metrics
    })),
    sources
  };
}

module.exports = {
  detectPlagiarism
};

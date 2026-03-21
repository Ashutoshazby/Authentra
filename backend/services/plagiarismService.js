const natural = require("natural");
const stringSimilarity = require("string-similarity");
const referenceDocuments = require("../data/referenceDocuments");
const { fetchWebSnippets } = require("./webSearchService");
const {
  splitIntoSentences,
  preprocessTokens,
  buildNgrams,
  cosineSimilarityFromMaps
} = require("../utils/textUtils");

function jaccardSimilarity(leftTokens, rightTokens) {
  const leftSet = new Set(leftTokens);
  const rightSet = new Set(rightTokens);
  const intersection = [...leftSet].filter((token) => rightSet.has(token)).length;
  const union = new Set([...leftSet, ...rightSet]).size;
  return union ? intersection / union : 0;
}

function tfidfCosineSimilarity(leftText, rightText) {
  const tfidf = new natural.TfIdf();
  tfidf.addDocument(leftText);
  tfidf.addDocument(rightText);

  const vocabulary = new Set([
    ...preprocessTokens(leftText),
    ...preprocessTokens(rightText)
  ]);

  const leftVector = {};
  const rightVector = {};

  vocabulary.forEach((term) => {
    leftVector[term] = tfidf.tfidf(term, 0);
    rightVector[term] = tfidf.tfidf(term, 1);
  });

  return cosineSimilarityFromMaps(leftVector, rightVector);
}

function computeSentenceSimilarity(sentence, comparisonText) {
  const leftTokens = preprocessTokens(sentence);
  const rightTokens = preprocessTokens(comparisonText);

  if (!leftTokens.length || !rightTokens.length) {
    return {
      ngram: 0,
      jaccard: 0,
      cosine: 0,
      lexical: 0,
      combined: 0
    };
  }

  const ngram = jaccardSimilarity(buildNgrams(leftTokens, 3), buildNgrams(rightTokens, 3));
  const jaccard = jaccardSimilarity(leftTokens, rightTokens);
  const cosine = tfidfCosineSimilarity(sentence, comparisonText);
  const lexical = stringSimilarity.compareTwoStrings(sentence, comparisonText);
  const combined = Math.min(
    1,
    ngram * 0.3 + jaccard * 0.25 + cosine * 0.35 + lexical * 0.1
  );

  return {
    ngram,
    jaccard,
    cosine,
    lexical,
    combined
  };
}

async function detectPlagiarism(documentText) {
  const sentences = splitIntoSentences(documentText);
  const internalCandidates = sentences.map((sentence, index) => ({
    id: `internal-${index}`,
    source: "internal",
    content: sentence
  }));

  const databaseCandidates = referenceDocuments.map((document) => ({
    id: document.id,
    source: "database",
    content: document.content
  }));

  const webResults = await fetchWebSnippets(documentText);
  const webCandidates = webResults.map((result, index) => ({
    id: `web-${index}`,
    source: "web",
    content: result.content,
    title: result.title,
    link: result.link
  }));

  const candidates = [...internalCandidates, ...databaseCandidates, ...webCandidates];
  const matches = [];

  sentences.forEach((sentence, sentenceIndex) => {
    candidates.forEach((candidate) => {
      if (
        candidate.source === "internal" &&
        candidate.id === `internal-${sentenceIndex}`
      ) {
        return;
      }

      const similarity = computeSentenceSimilarity(sentence, candidate.content);

      if (similarity.combined >= 0.35) {
        matches.push({
          sentence,
          similarity: Number(similarity.combined.toFixed(2)),
          source: candidate.source,
          matchText: candidate.content,
          ngram: Number(similarity.ngram.toFixed(2)),
          jaccard: Number(similarity.jaccard.toFixed(2)),
          cosine: Number(similarity.cosine.toFixed(2))
        });
      }
    });
  });

  const deduplicatedMatches = Array.from(
    new Map(
      matches
        .sort((left, right) => right.similarity - left.similarity)
        .map((match) => [`${match.sentence}-${match.matchText}`, match])
    ).values()
  ).slice(0, 20);

  const suspiciousSentences = new Set(deduplicatedMatches.map((match) => match.sentence)).size;
  const plagiarismScore = sentences.length
    ? Math.min(
        100,
        Math.round(
          (suspiciousSentences / sentences.length) * 65 +
            (deduplicatedMatches.reduce((sum, item) => sum + item.similarity, 0) /
              Math.max(deduplicatedMatches.length, 1)) *
              35
        )
      )
    : 0;

  return {
    plagiarismScore,
    matchedSentences: deduplicatedMatches
  };
}

module.exports = {
  detectPlagiarism
};

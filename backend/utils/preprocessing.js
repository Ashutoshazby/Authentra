const natural = require("natural");

const tokenizer = new natural.WordTokenizer();
const stopwords = new Set(natural.stopwords);

const COMMON_ACADEMIC_PHRASES = [
  "this paper explores",
  "this study examines",
  "the purpose of this study",
  "in conclusion",
  "the results of this study",
  "further research is needed",
  "this article discusses",
  "the findings suggest",
  "this essay will",
  "the aim of this paper"
];

function normalizeWhitespace(text = "") {
  return text.replace(/\s+/g, " ").trim();
}

function stripReferencesSection(text = "") {
  const lines = text.split(/\r?\n/);
  const headingIndex = lines.findIndex((line) =>
    /^(references|bibliography|works cited|literature cited)\s*$/i.test(line.trim())
  );

  if (headingIndex === -1) {
    return text;
  }

  return lines.slice(0, headingIndex).join("\n");
}

function splitIntoSentences(text = "") {
  return normalizeWhitespace(text)
    .split(/(?<=[.!?])\s+(?=[A-Z0-9"'])/)
    .map((sentence) => sentence.trim())
    .filter(Boolean);
}

function normalizeText(text = "") {
  return normalizeWhitespace(text)
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function tokenizeWords(text = "", { removeStopwords = true, stem = true } = {}) {
  let tokens = tokenizer
    .tokenize(normalizeText(text))
    .map((token) => token.trim())
    .filter(Boolean);

  if (removeStopwords) {
    tokens = tokens.filter((token) => !stopwords.has(token));
  }

  if (stem) {
    tokens = tokens.map((token) => natural.PorterStemmer.stem(token));
  }

  return tokens;
}

function wordCount(text = "") {
  return normalizeText(text).split(/\s+/).filter(Boolean).length;
}

function isReferenceLikeSentence(sentence = "") {
  const normalized = normalizeWhitespace(sentence);
  return (
    /\bdoi\b|\bet al\.\b|https?:\/\/|www\./i.test(normalized) ||
    /\(\d{4}[a-z]?\)/i.test(normalized) ||
    /^[[\d,\s-]+\]/.test(normalized)
  );
}

function isCommonAcademicSentence(sentence = "") {
  const normalized = normalizeText(sentence);
  return COMMON_ACADEMIC_PHRASES.some((phrase) => normalized.includes(phrase));
}

function shouldIgnoreSentence(sentence = "") {
  return (
    wordCount(sentence) < 10 ||
    isReferenceLikeSentence(sentence) ||
    isCommonAcademicSentence(sentence)
  );
}

function createSentenceRecords(text = "") {
  const withoutReferences = stripReferencesSection(text);
  const sentences = splitIntoSentences(withoutReferences);
  const uniqueByNormalized = new Map();

  sentences.forEach((sentence) => {
    if (shouldIgnoreSentence(sentence)) {
      return;
    }

    const normalized = normalizeText(sentence);
    if (!normalized || uniqueByNormalized.has(normalized)) {
      return;
    }

    uniqueByNormalized.set(normalized, {
      sentence: normalizeWhitespace(sentence),
      normalized,
      tokens: tokenizeWords(sentence),
      wordCount: wordCount(sentence)
    });
  });

  return Array.from(uniqueByNormalized.values());
}

module.exports = {
  COMMON_ACADEMIC_PHRASES,
  normalizeWhitespace,
  normalizeText,
  tokenizeWords,
  splitIntoSentences,
  stripReferencesSection,
  wordCount,
  shouldIgnoreSentence,
  createSentenceRecords
};

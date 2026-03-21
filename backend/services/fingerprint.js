const { normalizeText } = require("../utils/preprocessing");
const { jaccardSimilarity } = require("../utils/similarity");

const fingerprintCache = new Map();
const BASE = 257;
const MOD = 1000000007;

function hashGram(gram = "") {
  let hash = 0;
  for (let index = 0; index < gram.length; index += 1) {
    hash = (hash * BASE + gram.charCodeAt(index)) % MOD;
  }
  return hash;
}

function generateKGramHashes(text = "", k = 5) {
  const normalized = normalizeText(text).replace(/\s+/g, " ");
  if (normalized.length < k) {
    return [];
  }

  const hashes = [];
  for (let index = 0; index <= normalized.length - k; index += 1) {
    hashes.push({
      hash: hashGram(normalized.slice(index, index + k)),
      position: index
    });
  }
  return hashes;
}

function winnow(hashes = [], windowSize = 4) {
  if (hashes.length === 0) {
    return [];
  }

  if (hashes.length <= windowSize) {
    return [hashes.reduce((minimum, current) => (current.hash <= minimum.hash ? current : minimum))];
  }

  const fingerprints = [];
  let previous = null;

  for (let index = 0; index <= hashes.length - windowSize; index += 1) {
    const window = hashes.slice(index, index + windowSize);
    const minimum = window.reduce((best, current) => {
      if (current.hash < best.hash) return current;
      if (current.hash === best.hash && current.position > best.position) return current;
      return best;
    });

    if (!previous || previous.hash !== minimum.hash || previous.position !== minimum.position) {
      fingerprints.push(minimum);
      previous = minimum;
    }
  }

  return fingerprints;
}

function getFingerprints(text = "", options = {}) {
  const { k = 5, windowSize = 4 } = options;
  const cacheKey = `${k}:${windowSize}:${normalizeText(text)}`;

  if (fingerprintCache.has(cacheKey)) {
    return fingerprintCache.get(cacheKey);
  }

  const fingerprintSet = new Set(
    winnow(generateKGramHashes(text, k), windowSize).map((item) => item.hash)
  );
  fingerprintCache.set(cacheKey, fingerprintSet);
  return fingerprintSet;
}

function compareFingerprints(leftText = "", rightText = "", options = {}) {
  const left = getFingerprints(leftText, options);
  const right = getFingerprints(rightText, options);
  return jaccardSimilarity([...left], [...right]);
}

module.exports = {
  getFingerprints,
  compareFingerprints
};

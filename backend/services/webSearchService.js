const axios = require("axios");
const cheerio = require("cheerio");
const { tfidfCosineSimilarity } = require("../utils/similarity");

const webQueryCache = new Map();

async function fetchWebSnippets(queryText) {
  const query = queryText.split(/\s+/).slice(0, 18).join(" ");

  if (!query) {
    return [];
  }

  if (webQueryCache.has(query)) {
    return webQueryCache.get(query);
  }

  try {
    const response = await axios.get("https://html.duckduckgo.com/html/", {
      params: { q: query },
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"
      },
      timeout: 20000
    });

    const $ = cheerio.load(response.data);
    const results = [];

    $(".result").each((index, element) => {
      if (index >= 5) return false;
      const title = $(element).find(".result__title").text().trim();
      const snippet = $(element).find(".result__snippet").text().trim();
      const link = $(element).find(".result__url").text().trim();

      if (snippet) {
        results.push({
          title,
          link,
          content: snippet
        });
      }

      return undefined;
    });

    webQueryCache.set(query, results);
    return results;
  } catch (error) {
    console.error("Web search failed:", error.message);
    return [];
  }
}

async function fetchWebMatches(sentenceRecords = []) {
  const limitedRecords = [...sentenceRecords]
    .sort((left, right) => right.wordCount - left.wordCount)
    .slice(0, 12);

  const sentenceMatches = await Promise.all(
    limitedRecords.map(async (record) => {
      const snippets = await fetchWebSnippets(record.sentence);
      const scored = snippets
        .map((snippet) => {
          const similarity = tfidfCosineSimilarity(
            record.normalized,
            snippet.content.toLowerCase()
          );

          return {
            sentence: record.sentence,
            similarity,
            source: snippet.title || snippet.link,
            sourceUrl: snippet.link,
            sourceType: "web",
            matchText: snippet.content
          };
        })
        .filter((item) => item.similarity >= 0.2)
        .sort((left, right) => right.similarity - left.similarity)
        .slice(0, 2);

      return scored;
    })
  );

  return sentenceMatches.flat().sort((left, right) => right.similarity - left.similarity);
}

module.exports = {
  fetchWebSnippets,
  fetchWebMatches
};

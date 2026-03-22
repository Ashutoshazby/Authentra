const axios = require("axios");

async function detectAI(text) {
  const normalizedText = String(text || "").trim();
  const fallbackUrl =
    process.env.NODE_ENV === "production" ? "" : "http://localhost:5001";
  const rawBaseUrl = process.env.AI_SERVICE_URL || fallbackUrl;
  const baseUrl = String(rawBaseUrl || "").replace(/\/+$/, "");

  if (!normalizedText) {
    return 0;
  }

  if (!baseUrl) {
    console.error("AI service error: AI_SERVICE_URL is not configured.");
    return 0;
  }

  try {
    const response = await axios.post(
      `${baseUrl}/detect`,
      { text: normalizedText },
      {
        timeout: 120000,
        headers: {
          "Content-Type": "application/json"
        }
      }
    );

    return Number(response.data?.aiScore || 0);
  } catch (error) {
    console.error(
      `AI service error via ${baseUrl}:`,
      error.response?.data || error.message
    );
    return 0;
  }
}

module.exports = {
  detectAI
};

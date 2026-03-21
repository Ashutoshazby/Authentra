const axios = require("axios");

async function detectAiProbability(text) {
  const baseURL = process.env.AI_SERVICE_URL || "http://127.0.0.1:5001";

  try {
    const response = await axios.post(
      `${baseURL}/detect`,
      { text },
      {
        timeout: 120000
      }
    );

    return Number(response.data.ai_probability || 0);
  } catch (error) {
    console.error("AI detection service error:", error.message);
    return 0;
  }
}

module.exports = {
  detectAiProbability
};

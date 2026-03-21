const axios = require("axios");

async function detectAiContent(text) {
  const baseURL = process.env.AI_SERVICE_URL || "http://127.0.0.1:5001";

  try {
    const response = await axios.post(
      `${baseURL}/detect`,
      { text },
      { timeout: 120000 }
    );

    return {
      ai_probability: Number(response.data.ai_probability || 0),
      label: response.data.label || "Human"
    };
  } catch (error) {
    console.error("AI detection service error:", error.message);
    return {
      ai_probability: 0,
      label: "Human"
    };
  }
}

module.exports = {
  detectAiContent
};

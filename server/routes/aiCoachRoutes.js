const express = require("express");
const router = express.Router();
const axios = require("axios");

router.post("/", async (req, res) => {
  try {
    const { message, user, calories } = req.body;

    const prompt = `
You are a professional fitness coach.

User Name: ${user?.name}

Calories consumed today: ${calories?.calories || 0}
Daily calorie goal: ${calories?.goal || "unknown"}

User question:
${message}

Give helpful fitness advice related to workouts, diet, and nutrition.
Keep answers short and practical.
`;

    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        contents: [
          {
            parts: [{ text: prompt }]
          }
        ]
      }
    );

    const reply =
      response.data.candidates?.[0]?.content?.parts?.[0]?.text ||
      "AI could not respond.";

    res.json({ reply });

  } catch (error) {
    console.error(error.response?.data || error.message);
    res.status(500).json({ reply: "AI error occurred." });
  }
});

module.exports = router;
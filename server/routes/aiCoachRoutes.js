const express = require("express");
const router = express.Router();
const axios = require("axios");

router.post("/", async (req, res) => {
  try {
    const { message } = req.body;

    const response = await axios.post(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        model: "llama-3.1-8b-instant",
        messages: [
          {
            role: "system",
            content:
              "You are a professional fitness coach. Give short, practical, motivating answers."
          },
           ...req.body.history,
          {
            role: "user",
            content: message
          }
        ],
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
        },
      }
    );

    const reply = response.data.choices[0].message.content;

    res.json({ reply });

  } catch (err) {
    console.error("AI ERROR:", err.response?.data || err.message);

    res.status(500).json({
      reply: "AI failed. Check backend console.",
    });
  }
});

module.exports = router;
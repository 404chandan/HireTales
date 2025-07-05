// server.js
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const axios = require("axios");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(bodyParser.json());

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const MODEL_ID = "gemini-2.5-pro";
const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL_ID}:streamGenerateContent?key=${GEMINI_API_KEY}`;

app.post("/generate", async (req, res) => {
  const { company, role, experience } = req.body;

  if (!company || !role || !experience) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  const prompt = `Generate interview experience with questions in each round of ${company} for ${role} role for someone with ${experience} experience. Limit to 400 words. Format output strictly as a valid JSON object with keys: Introduction, Overview and all round details, Round 1 Name and Questions, Round 2 Name and Questions, Round 3 Name and Questions, Round 4 Name and Questions if any, Result, Tips. Do not include markdown or explanation, only return JSON.`;

  const payload = {
    contents: [{ role: "user", parts: [{ text: prompt }] }],
    generationConfig: {
      responseMimeType: "application/json",
    },
  };

  try {
    const response = await axios.post(API_URL, payload, {
      headers: { "Content-Type": "application/json" },
      responseType: "stream",
    });

    let fullData = "";

    response.data.on("data", (chunk) => {
      fullData += chunk.toString();
    });

    response.data.on("end", () => {
      try {
        const jsonStart = fullData.indexOf("{");
        const jsonEnd = fullData.lastIndexOf("}");
        const jsonText = fullData.slice(jsonStart, jsonEnd + 1);

        const parsed = JSON.parse(jsonText);
        res.json(parsed);
      } catch (parseErr) {
        console.error("Parse error:", parseErr.message);
        res.status(500).json({ error: "Failed to parse AI response." });
      }
    });
  } catch (err) {
    console.error("API error:", err.message);
    res.status(500).json({ error: "Failed to call Gemini API." });
  }
});

app.listen(3000, () => {
  console.log("✅ Server running on http://localhost:3000");
});

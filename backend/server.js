const express = require('express');
const bodyParser = require('body-parser');
const fetch = require('node-fetch');
const cors = require('cors');
require('dotenv').config();
const path = require('path');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Serve frontend static files
app.use(express.static(path.join(__dirname, '../frontend')));

// Route to handle generation
app.post('/generate', async (req, res) => {
  const { company, role, experience } = req.body;

  const prompt = `Generate interview experience of ${company} in systematic manner for ${role} and ${experience} year(s) of experience in plain text, no markdown or symbols`;

  const body = {
    contents: [
      {
        role: "user",
        parts: [{ text: prompt }]
      }
    ]
  };

  try {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-pro:generateContent?key=${process.env.GEMINI_API_KEY}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    const json = await response.json();
    console.log('✅ Gemini Response:', JSON.stringify(json, null, 2)); // Debug output

    const output = json.candidates?.[0]?.content?.parts?.[0]?.text || 'No content generated.';
    res.json({ result: output });
  } catch (err) {
    console.error('❌ Error:', err);
    res.status(500).json({ result: 'Error generating experience. Please try again.' });
  }
});

app.listen(PORT, () => {
  console.log(`✅ Server running at: http://localhost:${PORT}`);
});

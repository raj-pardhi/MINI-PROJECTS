require("dotenv").config();
const express = require("express");
const cors = require("cors");
const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

app.post("/api/chat", async (req, res) => {
  const { messages } = req.body;
  const apiKey = process.env.GOOGLE_API_KEY;

  console.log("Google API Key loaded:", apiKey ? "YES ✅" : "NO ❌");

  if (!apiKey) {
    return res.status(400).json({ error: "Google API key not found in .env" });
  }

  if (!messages || messages.length === 0) {
    return res.status(400).json({ error: "Messages are required" });
  }

  try {
    // Convert OpenAI-style messages to Gemini format
    const geminiContents = messages.map((msg) => ({
      role: msg.role === "assistant" ? "model" : "user",
      parts: [{ text: msg.content }],
    }));

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: geminiContents,
          generationConfig: {
            maxOutputTokens: 1024,
            temperature: 0.7,
          },
        }),
      }
    );

    const data = await response.json();
    console.log("Gemini response status:", response.status);

    if (!response.ok) {
      console.error("Gemini error:", data);
      return res.status(response.status).json({
        error: data.error?.message || "Gemini API error",
      });
    }

    const reply = data.candidates[0].content.parts[0].text;
    res.json({ reply });
  } catch (error) {
    console.error("Server error:", error);
    res.status(500).json({ error: "Server error. Please try again." });
  }
});

app.get("/", (req, res) => {
  res.json({ status: "Gemini AI Chatbot running!" });
});

app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});
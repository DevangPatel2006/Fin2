import express from "express";
import dotenv from "dotenv";

dotenv.config();
const router = express.Router();
const fetch = global.fetch;

// ✅ Google Gemini 2.5 Flash Integration
router.post("/", async (req, res) => {
  try {
    const { messages } = req.body;
    const userMessage = messages?.slice(-1)[0]?.content || "Hi";

    console.log("🧠 Incoming Gemini chat:", userMessage);

    // ✅ Use the working model from your key list
    const MODEL = "models/gemini-2.5-flash";

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1/${MODEL}:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [
            {
              role: "user",
              parts: [{ text: userMessage }],
            },
          ],
        }),
      }
    );

    const data = await response.json();
    console.log("✅ Gemini API response:", data);

    const text =
      data?.candidates?.[0]?.content?.parts?.[0]?.text ||
      data?.error?.message ||
      "⚠️ Gemini didn’t return a valid response.";

    res.json({
      content: [{ text }],
    });
  } catch (err) {
    console.error("❌ Gemini Proxy Error:", err);
    res.status(500).json({ error: "Gemini service failed" });
  }
});

export default router;

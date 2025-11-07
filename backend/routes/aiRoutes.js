// backend/routes/aiRoutes.js
import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import User from "../models/userModel.js";
import Transaction from "../models/transactionModel.js";
import Goal from "../models/goalModel.js";

dotenv.config();
const router = express.Router();
const fetchFn = global.fetch || fetch; // fallback if polyfilled elsewhere

// Helper: safe truncation + simple sanitize
function sanitizeQuestion(q) {
  if (!q || typeof q !== "string") return "";
  return q.replace(/[\x00-\x1F\x7F]/g, " ").trim().slice(0, 500);
}

// Helper: build transaction summary line
function txSummaryLine(t, i) {
  const when = t.date ? new Date(t.date).toISOString().split("T")[0] : "unknown-date";
  const note = t.note ? ` • ${String(t.note).slice(0, 50)}` : "";
  const cat = t.category ? `${t.category}` : "";
  const type = t.type || (t.amount < 0 ? "expense" : "income");
  return `${i + 1}. ${type} • ₹${t.amount} • ${cat}${note} • ${when}`;
}

// --- DEBUG ROUTE (optional) ---
// Uncomment to enable a debug endpoint that shows whether transactions/goals match by ObjectId or string
/*
router.get("/debug-user/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const user = await User.findById(id).lean();
    const txByObjectId = await Transaction.find({ userId: id }).limit(5).lean();
    const txByString = await Transaction.find({ userId: id.toString() }).limit(5).lean();
    const txAny = await Transaction.find({ $or: [{ userId: id }, { userId: id.toString() }] }).limit(20).lean();
    const goalAny = await Goal.find({ $or: [{ userId: id }, { userId: id.toString() }] }).limit(20).lean();

    return res.json({
      userFound: !!user,
      user,
      txCounts: { byObjectId: txByObjectId.length, byString: txByString.length, combined: txAny.length },
      txSample: txAny,
      goalCount: goalAny.length,
      goalSample: goalAny.slice(0, 10)
    });
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
});
*/

// POST /api/ai/summary
// Body: { userId: "<id>|guest", userQuestion: "..." }

router.post("/summary", async (req, res) => {
  

  try {
    
    const { userId: rawUserId, userQuestion: rawQuestion } = req.body || {};

    if (!rawUserId) return res.status(400).json({ error: "userId required" });

    // Resolve user or guest
    let user = null;
    let userIdToQuery = null;

    if (rawUserId === "guest") {
      const envGuest = process.env.GUEST_USER_ID;
      if (envGuest && mongoose.Types.ObjectId.isValid(envGuest)) {
        userIdToQuery = envGuest;
      } else {
        user = { _id: null, name: "Guest", balance: 0, isGuest: true };
      }
    } else if (mongoose.Types.ObjectId.isValid(String(rawUserId))) {
      userIdToQuery = rawUserId;
    } else {
      return res.status(400).json({ error: "Invalid userId format" });
    }

    // If we should query DB for user
    if (userIdToQuery) {
      user = await User.findById(userIdToQuery).select("-password").lean();
      if (!user) return res.status(404).json({ error: "User not found" });
    }

    // Fetch transactions + goals robustly (supports ObjectId or string stored in docs)
    let transactions = [];
    let goals = [];

    if (user && (user._id !== null && user._id !== undefined)) {
      const uidStr = String(user._id);
      const uidObj = mongoose.Types.ObjectId.isValid(uidStr) ? mongoose.Types.ObjectId(uidStr) : null;

      const userIdQuery = uidObj
        ? { $or: [{ userId: uidObj }, { userId: uidStr }] }
        : { userId: uidStr };

      transactions = await Transaction.find(userIdQuery).sort({ date: -1 }).limit(100).lean();
      goals = await Goal.find(userIdQuery).lean();

      console.log(
        `Fetched transactions: ${transactions.length}, goals: ${goals.length} for user id (obj)=${uidObj} (str)=${uidStr}`
      );
    }

    // Build stats
    const totalBalance = Number(user?.balance ?? 0);
    const totalTransactions = transactions.length;
    const activeGoals = goals.filter((g) => g.status !== "completed").length;
    const completedGoals = goals.filter((g) => g.status === "completed").length;

    // Sanitize question
    const userQuestion = sanitizeQuestion(rawQuestion) || "Give me a summary of my finances.";

    // Build short transactions snippet (up to 5)
    const latestTxLines = (transactions.slice(0, 5) || []).map((t, i) => txSummaryLine(t, i));

    const context = `
You are FinAIssist, the AI assistant for the Finlanza app.
User: ${user?.name || "Unknown"}
Balance: ₹${totalBalance}
Transactions: ${totalTransactions} (latest shown)
Active goals: ${activeGoals}, Completed goals: ${completedGoals}

Latest transactions (up to 5):
${latestTxLines.join("\n") || "No transactions available."}

User question:
"${userQuestion}"

Answer concisely and use the user's data when relevant.`;

    // Call Gemini (or configured model). Ensure GEMINI_API_KEY exists
    const MODEL = process.env.GEMINI_MODEL || "models/gemini-2.5-flash";
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.warn("No GEMINI_API_KEY set in environment.");
      return res.status(500).json({ error: "AI key not configured" });
    }

    const url = `https://generativelanguage.googleapis.com/v1/${MODEL}:generateContent?key=${apiKey}`;

    // Timeout support
    const controller = new AbortController();
    const timeoutMs = Number(process.env.AI_REQUEST_TIMEOUT_MS) || 15000;
    const timeout = setTimeout(() => controller.abort(), timeoutMs);

    const aiReqBody = {
      contents: [
        {
          role: "user",
          parts: [{ text: context }],
        },
      ],
    };

    const aiResponse = await fetchFn(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(aiReqBody),
      signal: controller.signal,
    });

    clearTimeout(timeout);

    if (!aiResponse.ok) {
      const text = await aiResponse.text().catch(() => "");
      console.error("Gemini responded non-200:", aiResponse.status, text);
      return res.status(502).json({ error: "AI service error", details: text || aiResponse.statusText });
    }

    const data = await aiResponse.json();
    console.log("✅ /api/ai/summary Gemini response:", data);

    // Extract text from likely shapes
    const text =
      data?.candidates?.[0]?.content?.parts?.[0]?.text ||
      data?.candidates?.[0]?.content?.text ||
      data?.output?.[0]?.content?.text ||
      data?.error?.message ||
      null;

    if (!text) return res.status(502).json({ error: "AI returned no usable text" });

    return res.json({
      reply: text,
      meta: {
        user: { id: user?._id ?? null, name: user?.name ?? "Guest" },
        totalBalance,
        totalTransactions,
        activeGoals,
        completedGoals,
      },
    });
  } catch (err) {
    if (err.name === "AbortError") {
      console.error("❌ /api/ai/summary error: AI request timed out");
      return res.status(504).json({ error: "AI request timed out" });
    }
    console.error("❌ /api/ai/summary error:", err);
    return res.status(500).json({ error: "AI summary failed", details: err.message });
  }
});

export default router;

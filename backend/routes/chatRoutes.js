import express from "express";
import dotenv from "dotenv";
dotenv.config();

const router = express.Router();
const fetch = global.fetch;

router.post("/", async (req, res) => {
  try {
    const { messages = [], financialContext = {} } = req.body;
    const userMessage = messages?.slice(-1)[0]?.content || "Hi";
    const financial = req.body.financialContext || null;

    const MODEL = "models/gemini-2.5-flash";

    // Build a compact, structured context to save tokens
    const ctx = {
      balance: financialContext.balance ?? 0,
      totalTransactions: financialContext.totalTransactions ?? 0,
      totalGoals: financialContext.totalGoals ?? 0,
      // optional analytics if provided by frontend
      incomeTotal: financialContext.incomeTotal,
      expenseTotal: financialContext.expenseTotal,
      topSpendingCategories: financialContext.topSpendingCategories || [],
      recurring: financialContext.recurring || [],
      monthlyNet: financialContext.monthlyNet || [],
      goalProgress: financialContext.goalProgress || [],
    };

    const prompt = `
You are FinAIssist inside Finlanza. Answer SHORT (max 4 lines). Be specific & numeric.

USER DATA:
Balance: ₹${ctx.balance}
Transactions: ${ctx.totalTransactions}
Goals: ${ctx.totalGoals}
Income (sum): ${ctx.incomeTotal ?? "n/a"}
Expenses (sum): ${ctx.expenseTotal ?? "n/a"}
Top Spending: ${ctx.topSpendingCategories?.map(c=>`${c.category}:${c.total}`).join(", ") || "n/a"}
Recurring (last 90d): ${ctx.recurring?.length || 0}
Monthly Net: ${ctx.monthlyNet?.slice(-3).map(m=>`${m.month}:${m.net}`).join(", ") || "n/a"}
Goal Progress: ${ctx.goalProgress?.slice(0,2).map(g=>`${g.name} ₹${g.savedAmount}/${g.targetAmount} (${g.percent}%)`).join("; ") || "n/a"}

INTENT RULES:
- If user asks "achieve goal fast": give 2–3 concrete steps (weekly saving amount suggestion = 1–3% of balance; mention the primary goal progress if available).
- If "where to invest": give 3 buckets (Low risk, Medium, High). Keep generic, give examples (FD/short-term debt; index funds; equities/crypto), add 1-line caution. No personalized securities picking.
- If "why spending more / where overspend": use Top Spending & Recurring; suggest 2 cuts.
- If "risk high or low": define briefly; warn if unclear.
- If "am I spending too much": reference income vs expenses, or say more data needed.
- If missing data for a calculation, ask for exactly what’s missing in 1 line.

ALWAYS stay concise. No lectures.

USER QUESTION:
"${userMessage}"
`;

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1/${MODEL}:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ role: "user", parts: [{ text: prompt }] }],
        }),
      }
    );

    const data = await response.json();
    const text =
      data?.candidates?.[0]?.content?.parts?.[0]?.text ||
      "⚠️ No response.";

    res.json({ reply: text.trim() });
  } catch (err) {
    console.error("❌ Gemini Error:", err);
    res.status(500).json({ error: "Gemini service failed" });
  }
});

export default router;

// backend/routes/chatRoutes.js
import express from "express";
import dotenv from "dotenv";
dotenv.config();

const router = express.Router();
const fetch = global.fetch;

router.post("/", async (req, res) => {
  try {
    const { messages = [], financialContext = {} } = req.body;
    const userMessage = messages?.slice(-1)[0]?.content || "Hi";

    const MODEL = "models/gemini-2.5-flash";

    // Build comprehensive financial context
    const ctx = {
      // Basic stats
      balance: financialContext.balance ?? 0,
      totalTransactions: financialContext.totalTransactions ?? 0,
      totalGoals: financialContext.totalGoals ?? 0,
      incomeTotal: financialContext.incomeTotal ?? 0,
      expenseTotal: financialContext.expenseTotal ?? 0,
      savingsRate: financialContext.savingsRate ?? 0,
      
      // Detailed analytics
      topSpendingCategories: financialContext.topSpendingCategories || [],
      monthlyNet: financialContext.monthlyNet || [],
      recurring: financialContext.recurring || [],
      goalProgress: financialContext.goalProgress || [],
      
      // Investment potential
      investableAmount: financialContext.investableAmount ?? 0,
      monthlyInvestable: financialContext.monthlyInvestable ?? 0,
      
      // Recent transactions (for pattern analysis)
      recentTransactions: financialContext.recentTransactions || [],
    };

    // Enhanced prompt with comprehensive financial intelligence
    const prompt = `
You are FinAIssist, an expert AI financial advisor integrated in Finlanza. Respond in CLEAR, ACTIONABLE advice (max 6 lines).

📊 USER'S FINANCIAL SNAPSHOT:
━━━━━━━━━━━━━━━━━━━━━━━━━━━
💰 Current Balance: ₹${ctx.balance.toLocaleString()}
📈 Total Income: ₹${ctx.incomeTotal.toLocaleString()}
📉 Total Expenses: ₹${ctx.expenseTotal.toLocaleString()}
💵 Savings Rate: ${ctx.savingsRate}%
🎯 Active Goals: ${ctx.totalGoals}
📝 Transactions: ${ctx.totalTransactions}

🔝 TOP SPENDING CATEGORIES:
${ctx.topSpendingCategories.slice(0, 3).map((c, i) => 
  `${i + 1}. ${c.category}: ₹${c.total.toLocaleString()}`
).join('\n') || 'No data'}

📅 MONTHLY TREND (Recent 3 months):
${ctx.monthlyNet.slice(-3).map(m => 
  `${m.month}: Income ₹${m.income.toLocaleString()}, Expense ₹${m.expense.toLocaleString()}, Net ₹${m.net.toLocaleString()}`
).join('\n') || 'No data'}

🔄 RECURRING EXPENSES:
${ctx.recurring.slice(0, 3).map(r => 
  `${r.category} (${r.count} times in 90 days)`
).join(', ') || 'None detected'}

🎯 GOALS PROGRESS:
${ctx.goalProgress.slice(0, 3).map(g => 
  `• ${g.name}: ₹${g.savedAmount.toLocaleString()}/₹${g.targetAmount.toLocaleString()} (${g.percent}%) - ${g.onTrack ? '✅ On Track' : '⚠️ Behind'} - ${g.monthsToGoal} months at current rate`
).join('\n') || 'No goals set'}

💼 INVESTMENT CAPACITY:
Available for Investment: ₹${ctx.investableAmount.toLocaleString()}
Monthly Surplus after goals: ₹${ctx.monthlyInvestable.toLocaleString()}

━━━━━━━━━━━━━━━━━━━━━━━━━━━

🎯 RESPONSE GUIDELINES:
━━━━━━━━━━━━━━━━━━━━━━━━━━━

IF USER ASKS "how to reach goal faster" or "achieve goal early":
→ Analyze their specific goal(s) from goalProgress above
→ Calculate exact additional monthly amount needed (target - current) / months remaining
→ Suggest 2-3 concrete actions:
   1. Increase monthly contribution by X amount
   2. Cut spending in their TOP category by 10-15%
   3. Redirect Y% of surplus to this goal
→ Give realistic timeline with new contribution

IF USER ASKS "transaction analysis" or "spending analysis":
→ Highlight their top 2-3 spending categories
→ Compare to typical benchmarks (e.g., food should be <30% expenses)
→ Identify any unusual spikes in monthly trend
→ Point out recurring expenses they could optimize
→ Provide 2 specific cost-cutting suggestions

IF USER ASKS "where to invest" or "investment advice":
→ First, acknowledge their investable amount: ₹${ctx.investableAmount.toLocaleString()}
→ Assess their risk based on:
   - Savings rate (${ctx.savingsRate}% - High >30%, Med 15-30%, Low <15%)
   - Emergency fund status (3-6 months expenses)
   - Goal obligations (monthly ₹${ctx.goalProgress.reduce((sum, g) => sum + g.monthlyContribution, 0).toLocaleString()})
→ Recommend 3-tier strategy:
   
   **LOW RISK (40%):** Fixed Deposits (7-8% returns), Debt Mutual Funds, PPF
   Allocate: ₹${Math.floor(ctx.investableAmount * 0.4).toLocaleString()}
   
   **MEDIUM RISK (40%):** Index Funds (Nifty 50), Balanced Mutual Funds (12-15% returns)
   Allocate: ₹${Math.floor(ctx.investableAmount * 0.4).toLocaleString()}
   
   **HIGH RISK (20%):** Individual stocks, Crypto, Aggressive equity funds (potential 20%+ returns but volatile)
   Allocate: ₹${Math.floor(ctx.investableAmount * 0.2).toLocaleString()}
   
→ Warn: "Never invest more than you can afford to lose in high-risk assets. Start with low-risk if new to investing."

IF USER ASKS "am I overspending" or "spending too much":
→ Calculate their expense ratio: ${((ctx.expenseTotal / ctx.incomeTotal) * 100).toFixed(1)}%
→ Benchmark: Ideal is <70%, Good <80%, Concerning >85%
→ Compare to their income and goals
→ Identify top overspending category
→ Suggest realistic budget adjustment

IF USER ASKS "financial advice" or general help:
→ Give personalized 3-point action plan based on their data:
   1. Address their weakest area (low savings, high spending, goal behind schedule)
   2. Leverage their strength (good income, disciplined goal contributions)
   3. Next best step (emergency fund, diversify, automate savings)

IF USER ASKS casual/non-financial questions:
→ Respond naturally but steer back to finances gently
→ Example: "That's interesting! By the way, I notice you have ₹X in savings - would you like tips on growing it?"

⚠️ CRITICAL RULES:
- Use ACTUAL numbers from the data above
- Be SPECIFIC with amounts, percentages, timelines
- MAX 6 lines - be concise yet complete
- Use emojis sparingly (1-2 max)
- If data is missing (₹0 or empty arrays), acknowledge it: "I don't see any [transactions/goals] yet. Start by adding some!"
- NEVER make up numbers - only use provided data
- For complex calculations, show your math briefly

USER'S QUESTION:
"${userMessage}"

RESPOND NOW (Max 6 lines):
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
      "⚠️ Unable to process your request right now.";

    res.json({ reply: text.trim() });
  } catch (err) {
    console.error("❌ Gemini Error:", err);
    res.status(500).json({ error: "AI service temporarily unavailable" });
  }
});

export default router;
import Transaction from "../models/transactionModel.js";
import Goal from "../models/goalModel.js";

// --- Simple categorizer from description/text ---
function categorize(desc = "") {
  const d = String(desc).toLowerCase();
  if (/(salary|payroll|stipend|refund|bonus|interest|dividend)/.test(d)) return "income";
  if (/(rent|emi|mortgage|loan)/.test(d)) return "housing";
  if (/(grocery|supermarket|food|restaurant|swiggy|zomato|meal)/.test(d)) return "food";
  if (/(uber|ola|fuel|petrol|diesel|bus|train|transport)/.test(d)) return "transport";
  if (/(electric|water|gas|wifi|broadband|utility|phone|mobile|recharge)/.test(d)) return "utilities";
  if (/(amazon|flipkart|shopping|clothes|apparel|electronics)/.test(d)) return "shopping";
  if (/(movie|netflix|spotify|entertainment|games)/.test(d)) return "entertainment";
  if (/(medical|pharmacy|doctor|health)/.test(d)) return "health";
  if (/(investment|mutual|sip|stock|equity|fd|etf|crypto)/.test(d)) return "investments";
  return "other";
}

function ym(date) {
  const dt = new Date(date);
  if (isNaN(dt.getTime())) return "unknown";
  return `${dt.getFullYear()}-${String(dt.getMonth() + 1).padStart(2, "0")}`;
}



export const getAISummary = async (req, res) => {
  try {
    const userId = req.user._id;

    const transactions = await Transaction.find({ userId });
    const goals = await Goal.find({ userId });

    // ✅ Calculate balance, income, expense breakdown
    let incomeTotal = 0;
    let expenseTotal = 0;
    let categories = {};

    transactions.forEach(t => {
      if (t.amount > 0) incomeTotal += t.amount;
      else expenseTotal += Math.abs(t.amount);

      if (!categories[t.category]) categories[t.category] = 0;
      categories[t.category] += Math.abs(t.amount);
    });

    const topSpendingCategories = Object.entries(categories)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([category, amount]) => ({ category, amount }));

    // ✅ Map correct goal fields (supports amount / targetAmount)
    const goalProgress = goals.map(g => {
      const target = Number(g.amount ?? g.targetAmount ?? 0);
      const saved = Number(g.savedAmount ?? 0);
      const remaining = Math.max(target - saved, 0);
      const pct = target > 0 ? ((saved / target) * 100).toFixed(1) : 0;

      return {
        id: g._id,
        name: g.name,
        targetAmount: target,
        savedAmount: saved,
        remaining,
        percent: pct,
        deadline: g.deadline ?? null,
      };
    });

    res.json({
      success: true,
      summary: {
        totalTransactions: transactions.length,
        totalGoals: goals.length,
        balance: transactions.reduce((acc, t) => acc + t.amount, 0),
        incomeTotal,
        expenseTotal,
      },
      analytics: {
        topSpendingCategories,
        goalProgress,
      },
      goals: goalProgress,
      transactions,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server error", error: err });
  }
};

export const getAIScore = async (req, res) => {
  try {
    const userId = req.user._id;
    const transactions = await Transaction.find({ userId });

    let score = 100;
    if (transactions.length > 20) score += 5;
    if (transactions.some((t) => Number(t.amount) < 0)) score -= 3;

    res.json({ success: true, score });
  } catch {
    res.status(500).json({ message: "Server error" });
  }
};

export const getAIRecommendations = async (req, res) => {
  try {
    const goals = await Goal.find({ userId: req.user._id });
    const suggestions = goals.map((g) => ({
      goal: g.name,
      suggestion: `Increase monthly savings for "${g.name}" by 10–15% to improve timeline.`,
    }));
    res.json({ success: true, suggestions });
  } catch {
    res.status(500).json({ message: "Server error" });
  }
};

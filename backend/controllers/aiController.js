// backend/controllers/aiController.js
import Transaction from "../models/transactionModel.js";
import Goal from "../models/goalModel.js";

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

    const transactions = await Transaction.find({ userId }).sort({ date: -1 });
    const goals = await Goal.find({ userId });

    // Calculate totals
    let incomeTotal = 0;
    let expenseTotal = 0;
    let categories = {};

    transactions.forEach(t => {
      if (t.type === "income") {
        incomeTotal += t.amount;
      } else {
        expenseTotal += t.amount;
      }

      const cat = t.category || "other";
      if (!categories[cat]) categories[cat] = 0;
      categories[cat] += t.amount;
    });

    const balance = incomeTotal - expenseTotal;
    const savingsRate = incomeTotal > 0 ? ((balance / incomeTotal) * 100).toFixed(1) : 0;

    // Top spending categories
    const topSpendingCategories = Object.entries(categories)
      .filter(([cat]) => cat !== "income")
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([category, total]) => ({ category, total }));

    // Monthly breakdown (last 6 months)
    const monthlyData = {};
    transactions.forEach(t => {
      const month = ym(t.date);
      if (!monthlyData[month]) {
        monthlyData[month] = { income: 0, expense: 0 };
      }
      if (t.type === "income") {
        monthlyData[month].income += t.amount;
      } else {
        monthlyData[month].expense += t.amount;
      }
    });

    const monthlyNet = Object.entries(monthlyData)
      .map(([month, data]) => ({
        month,
        income: data.income,
        expense: data.expense,
        net: data.income - data.expense,
      }))
      .sort((a, b) => b.month.localeCompare(a.month))
      .slice(0, 6)
      .reverse();

    // Recurring transactions (transactions that appear multiple times)
    const last90Days = new Date();
    last90Days.setDate(last90Days.getDate() - 90);
    
    const recentTransactions = transactions.filter(t => new Date(t.date) >= last90Days);
    const categoryCount = {};
    recentTransactions.forEach(t => {
      const cat = t.category || "other";
      categoryCount[cat] = (categoryCount[cat] || 0) + 1;
    });
    
    const recurring = Object.entries(categoryCount)
      .filter(([_, count]) => count >= 3)
      .map(([category, count]) => ({ category, count }));

    // Goal progress with detailed analysis
    const goalProgress = goals.map(g => {
      const target = Number(g.target ?? 0);
      const current = Number(g.current ?? 0);
      const monthly = Number(g.monthlyContribution ?? 0);
      const remaining = Math.max(target - current, 0);
      const percent = target > 0 ? ((current / target) * 100).toFixed(1) : 0;
      
      // Calculate months to goal
      const monthsToGoal = monthly > 0 ? Math.ceil(remaining / monthly) : 0;
      
      // Check if on track
      const deadline = new Date(g.deadline);
      const today = new Date();
      const monthsRemaining = Math.max(
        Math.ceil((deadline.getTime() - today.getTime()) / (1000 * 60 * 60 * 24 * 30)),
        0
      );
      
      const onTrack = monthsToGoal <= monthsRemaining;

      return {
        id: g._id,
        name: g.name,
        targetAmount: target,
        savedAmount: current,
        monthlyContribution: monthly,
        remaining,
        percent,
        deadline: g.deadline,
        monthsToGoal,
        monthsRemaining,
        onTrack,
        status: g.status || "ongoing",
      };
    });

    // Investment analysis
    const investableAmount = balance > 0 ? Math.floor(balance * 0.3) : 0; // 30% of savings
    const monthlyInvestable = Math.max(incomeTotal - expenseTotal - 
      goals.reduce((sum, g) => sum + (g.monthlyContribution || 0), 0), 0);

    res.json({
      success: true,
      summary: {
        totalTransactions: transactions.length,
        totalGoals: goals.length,
        balance,
        incomeTotal,
        expenseTotal,
        savingsRate,
      },
      analytics: {
        topSpendingCategories,
        monthlyNet,
        recurring,
        goalProgress,
        investableAmount,
        monthlyInvestable,
      },
      goals: goalProgress,
      transactions: transactions.slice(0, 10), // Last 10 for context
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

export const getAIScore = async (req, res) => {
  try {
    const userId = req.user._id;
    const transactions = await Transaction.find({ userId });
    const goals = await Goal.find({ userId });

    let score = 50; // Base score

    // Positive factors
    if (transactions.length > 20) score += 10; // Active user
    if (goals.length > 0) score += 10; // Has goals
    
    const income = transactions.filter(t => t.type === "income").reduce((sum, t) => sum + t.amount, 0);
    const expense = transactions.filter(t => t.type === "expense").reduce((sum, t) => sum + t.amount, 0);
    
    if (income > expense) score += 20; // Positive balance
    
    const savingsRate = income > 0 ? ((income - expense) / income) * 100 : 0;
    if (savingsRate > 30) score += 15; // Great savings rate
    else if (savingsRate > 20) score += 10;
    else if (savingsRate > 10) score += 5;

    // Goal progress
    const goalsOnTrack = goals.filter(g => {
      const remaining = g.target - g.current;
      const deadline = new Date(g.deadline);
      const monthsLeft = Math.ceil((deadline - new Date()) / (1000 * 60 * 60 * 24 * 30));
      return remaining / monthsLeft <= g.monthlyContribution;
    }).length;
    
    score += Math.min(goalsOnTrack * 5, 20); // Up to 20 points for goal tracking

    // Cap at 100
    score = Math.min(score, 100);

    res.json({ success: true, score });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

export const getAIRecommendations = async (req, res) => {
  try {
    const userId = req.user._id;
    const transactions = await Transaction.find({ userId });
    const goals = await Goal.find({ userId });

    const suggestions = [];

    // Analyze spending
    const categories = {};
    transactions.filter(t => t.type === "expense").forEach(t => {
      categories[t.category] = (categories[t.category] || 0) + t.amount;
    });

    const topCategory = Object.entries(categories).sort((a, b) => b[1] - a[1])[0];
    if (topCategory && topCategory[1] > 0) {
      suggestions.push({
        type: "spending",
        priority: "high",
        suggestion: `Your highest expense is ${topCategory[0]} (₹${topCategory[1].toLocaleString()}). Consider setting a monthly budget to reduce this by 10-15%.`,
      });
    }

    // Goal recommendations
    goals.forEach(g => {
      const remaining = g.target - g.current;
      const deadline = new Date(g.deadline);
      const monthsLeft = Math.ceil((deadline - new Date()) / (1000 * 60 * 60 * 24 * 30));
      const requiredMonthly = monthsLeft > 0 ? remaining / monthsLeft : 0;

      if (requiredMonthly > g.monthlyContribution) {
        suggestions.push({
          type: "goal",
          priority: "medium",
          goal: g.name,
          suggestion: `To achieve "${g.name}" on time, increase monthly contribution to ₹${Math.ceil(requiredMonthly).toLocaleString()} (currently ₹${g.monthlyContribution.toLocaleString()}).`,
        });
      }
    });

    res.json({ success: true, suggestions });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};
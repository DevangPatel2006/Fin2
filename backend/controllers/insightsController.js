// backend/controllers/insightsController.js
// backend/controllers/insightsController.js
import Transaction from "../models/transactionModel.js";
import Goal from "../models/goalModel.js";

/**
 * Get start and end dates for current and previous month
 */
function getMonthRanges() {
  const now = new Date();
  
  // Current month
  const currentMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
  const currentMonthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);
  
  // Previous month
  const prevMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const prevMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59);
  
  return {
    currentMonthStart,
    currentMonthEnd,
    prevMonthStart,
    prevMonthEnd
  };
}

/**
 * Calculate category spending by month
 */
function calculateCategorySpending(transactions) {
  const categoryTotals = {};
  
  transactions.forEach(t => {
    if (t.type === 'expense') {
      const cat = t.category || 'Other';
      categoryTotals[cat] = (categoryTotals[cat] || 0) + t.amount;
    }
  });
  
  return categoryTotals;
}

/**
 * Main insights controller
 */
export const getUserInsights = async (req, res) => {
  try {
    const userId = req.user._id;
    const { currentMonthStart, currentMonthEnd, prevMonthStart, prevMonthEnd } = getMonthRanges();

    // Fetch all transactions and goals
    const [allTransactions, goals] = await Promise.all([
      Transaction.find({ userId }).sort({ date: -1 }),
      Goal.find({ userId })
    ]);

    // Split transactions by month
    const currentMonthTxns = allTransactions.filter(t => {
      const date = new Date(t.date);
      return date >= currentMonthStart && date <= currentMonthEnd;
    });

    const prevMonthTxns = allTransactions.filter(t => {
      const date = new Date(t.date);
      return date >= prevMonthStart && date <= prevMonthEnd;
    });

    // Calculate totals for current month
    const currentIncome = currentMonthTxns
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);

    const currentExpenses = currentMonthTxns
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);

    const netSavings = currentIncome - currentExpenses;
    const savingsRate = currentIncome > 0 ? ((netSavings / currentIncome) * 100) : 0;

    // Calculate totals for previous month
    const prevIncome = prevMonthTxns
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);

    const prevExpenses = prevMonthTxns
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);

    // === INSIGHT 1: Savings Rate ===
    const savingsInsight = {
      type: savingsRate >= 20 ? 'success' : 'warning',
      icon: 'TrendingUp',
      title: savingsRate >= 20 ? 'Excellent Savings Rate!' : 'Low Savings Rate',
      description: savingsRate >= 20
        ? `Your savings rate of ${savingsRate.toFixed(1)}% is well above the recommended 20%. Keep up the great work!`
        : `Your savings rate of ${savingsRate.toFixed(1)}% is below the recommended 20%. Try to reduce expenses or increase income.`,
      color: savingsRate >= 20 ? 'from-accent to-primary' : 'from-secondary to-violet',
    };

    // === INSIGHT 2: Comparative Spending ===
    const currentCategories = calculateCategorySpending(currentMonthTxns);
    const prevCategories = calculateCategorySpending(prevMonthTxns);

    let maxIncrease = 0;
    let maxIncreaseCategory = null;
    let maxIncreasePercent = 0;

    Object.keys(currentCategories).forEach(cat => {
      const current = currentCategories[cat] || 0;
      const prev = prevCategories[cat] || 0;
      
      if (prev > 0) {
        const increase = current - prev;
        const percentIncrease = (increase / prev) * 100;
        
        if (increase > maxIncrease && percentIncrease > 10) {
          maxIncrease = increase;
          maxIncreaseCategory = cat;
          maxIncreasePercent = percentIncrease;
        }
      }
    });

    const spendingInsight = maxIncreaseCategory ? {
      type: 'warning',
      icon: 'AlertCircle',
      title: `High ${maxIncreaseCategory} Expenses`,
      description: `You spent ${maxIncreasePercent.toFixed(1)}% more on ${maxIncreaseCategory} this month compared to last month. Consider budgeting to reduce costs.`,
      color: 'from-secondary to-violet',
    } : {
      type: 'success',
      icon: 'AlertCircle',
      title: 'Stable Spending Pattern',
      description: 'Your spending across categories remains consistent with last month. Great job maintaining control!',
      color: 'from-accent to-primary',
    };

  // === INSIGHT 3: Investment Opportunity (12% of Savings) ===
const totalGoalContributions = goals.reduce((sum, g) => sum + (g.monthlyContribution || 0), 0);

// Calculate investable portion as 12% of savings (only if savings exist)
const potentialInvestment = netSavings > 0 ? Math.round(netSavings * 0.12) : 0;

const investmentInsight = {
  type: potentialInvestment > 0 ? 'tip' : 'warning',
  icon: 'Lightbulb',
  title: potentialInvestment > 0 ? 'Investment Opportunity' : 'No Investment Capacity',
  description: potentialInvestment > 0
    ? `Based on your current savings, investing just 12% — around ₹${potentialInvestment.toLocaleString()} monthly — could grow your wealth steadily in index funds or SIPs.`
    : 'Your current expenses leave little room for investment. Try to build a small savings buffer to start investing regularly.',
  color: 'from-primary to-secondary',
};


    // === INSIGHT 4: AI Goal Prediction ===
    let goalInsight = {
      type: 'ai',
      icon: 'Brain',
      title: 'Set Your First Goal',
      description: 'Create a financial goal to get personalized predictions on your progress!',
      color: 'from-violet to-accent',
    };

    if (goals.length > 0) {
      // Find the largest active goal
      const mainGoal = goals
        .filter(g => g.status !== 'completed')
        .sort((a, b) => b.target - a.target)[0];

      if (mainGoal) {
        const remaining = mainGoal.target - mainGoal.current;
        const monthlyRate = netSavings > 0 ? netSavings : mainGoal.monthlyContribution;
        
        if (monthlyRate > 0) {
          const monthsNeeded = Math.ceil(remaining / monthlyRate);
          const deadline = new Date(mainGoal.deadline);
          const monthsUntilDeadline = Math.ceil(
            (deadline.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24 * 30)
          );
          
          const monthsDifference = monthsUntilDeadline - monthsNeeded;
          
          goalInsight = {
            type: 'ai',
            icon: 'Brain',
            title: 'AI Goal Prediction',
            description: monthsDifference >= 0
              ? `At your current savings rate, you'll reach your "${mainGoal.name}" goal ${monthsDifference} month${monthsDifference !== 1 ? 's' : ''} ahead of schedule!`
              : `You're behind schedule for "${mainGoal.name}". Increase monthly savings by ₹${Math.ceil(Math.abs(monthsDifference * monthlyRate / monthsUntilDeadline)).toLocaleString()} to stay on track.`,
            color: 'from-violet to-accent',
          };
        }
      }
    }

    // === SUMMARY SECTION ===
    const avgCategoryGrowth = prevExpenses > 0
      ? (((currentExpenses - prevExpenses) / prevExpenses) * 100).toFixed(1)
      : '0.0';

    const summary = {
      totalIncome: currentIncome,
      totalExpenses: currentExpenses,
      netSavings: netSavings,
      avgCategoryGrowth: `${avgCategoryGrowth}% ${parseFloat(avgCategoryGrowth) >= 0 ? 'increase' : 'decrease'} vs last month`,
      savingsRate: savingsRate.toFixed(1),
      monthlyTransactions: currentMonthTxns.length,
    };

    // === RESPONSE ===
    res.json({
      status: 'READY',
      insights: [
        savingsInsight,
        spendingInsight,
        investmentInsight,
        goalInsight,
      ],
      summary,
      categoryBreakdown: currentCategories,
      comparisonData: {
        currentMonth: {
          income: currentIncome,
          expenses: currentExpenses,
          savings: netSavings,
        },
        previousMonth: {
          income: prevIncome,
          expenses: prevExpenses,
          savings: prevIncome - prevExpenses,
        },
      },
    });

  } catch (err) {
    console.error('Insights error:', err);
    res.status(500).json({
      status: 'ERROR',
      message: 'Failed to generate insights',
      error: err.message,
    });
  }
};
import { motion } from 'framer-motion';
import { Brain, TrendingUp, Lightbulb, AlertCircle } from 'lucide-react';
import DashboardLayout from '@/components/DashboardLayout';

const insights = [
  {
    type: 'success',
    icon: TrendingUp,
    title: 'Excellent Savings Rate!',
    description: 'Your savings rate of 38% is well above the recommended 20%. Keep up the great work!',
    color: 'from-accent to-primary',
  },
  {
    type: 'warning',
    icon: AlertCircle,
    title: 'High Dining Expenses',
    description: 'You spent 35% more on dining out this month compared to last month. Consider meal planning to reduce costs.',
    color: 'from-secondary to-violet',
  },
  {
    type: 'tip',
    icon: Lightbulb,
    title: 'Investment Opportunity',
    description: 'Based on your income and expenses, you could invest an additional ₹10,000 monthly in index funds.',
    color: 'from-primary to-secondary',
  },
  {
    type: 'ai',
    icon: Brain,
    title: 'AI Prediction',
    description: 'At your current savings rate, you\'ll reach your emergency fund goal 2 months ahead of schedule!',
    color: 'from-violet to-accent',
  },
];

const categories = [
  { name: 'Food & Dining', amount: 8450, trend: 'up', change: 15 },
  { name: 'Transportation', amount: 4850, trend: 'down', change: 8 },
  { name: 'Shopping', amount: 6200, trend: 'up', change: 22 },
  { name: 'Bills & Utilities', amount: 4350, trend: 'down', change: 3 },
  { name: 'Entertainment', amount: 3200, trend: 'stable', change: 0 },
];

export default function Insights() {
  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-3xl md:text-4xl font-bold mb-2">
            AI <span className="text-gradient-indigo">Insights</span>
          </h1>
          <p className="text-muted-foreground">Personalized financial intelligence powered by AI</p>
        </motion.div>

        {/* AI Insights Cards */}
        <div className="grid md:grid-cols-2 gap-6">
          {insights.map((insight, index) => {
            const Icon = insight.icon;
            return (
              <motion.div
                key={insight.title}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="glass-card p-6 hover:neon-border-indigo transition-all duration-500 group"
              >
                <div className="flex items-start gap-4">
                  <div className={`p-3 rounded-xl bg-gradient-to-br ${insight.color} group-hover:scale-110 transition-transform`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-foreground mb-2">{insight.title}</h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">{insight.description}</p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Spending Trends */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="glass-card p-8"
        >
          <h2 className="text-2xl font-bold text-foreground mb-6">Spending Trends</h2>
          <div className="space-y-4">
            {categories.map((category, index) => (
              <motion.div
                key={category.name}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 + index * 0.1 }}
                className="flex items-center justify-between p-4 rounded-xl bg-muted/30 hover:bg-muted/50 transition-colors"
              >
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-foreground">{category.name}</span>
                    <span className="font-semibold text-foreground">₹{category.amount.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {category.trend === 'up' && (
                      <span className="text-xs text-secondary flex items-center gap-1">
                        <TrendingUp className="w-3 h-3" />
                        +{category.change}% vs last month
                      </span>
                    )}
                    {category.trend === 'down' && (
                      <span className="text-xs text-accent flex items-center gap-1">
                        <TrendingUp className="w-3 h-3 rotate-180" />
                        -{category.change}% vs last month
                      </span>
                    )}
                    {category.trend === 'stable' && (
                      <span className="text-xs text-muted-foreground">No change</span>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Financial Score */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
          className="glass-card p-8 text-center hover:neon-border-cyan transition-all duration-500"
        >
          <h2 className="text-2xl font-bold text-foreground mb-4">Your Financial Health Score</h2>
          <div className="relative inline-block mb-6">
            <div className="text-6xl font-bold text-gradient-indigo">87</div>
            <div className="text-muted-foreground text-sm mt-2">out of 100</div>
          </div>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Your financial health is strong! You're managing expenses well and building towards your goals consistently.
            Consider increasing your investment allocation for better long-term growth.
          </p>
        </motion.div>
      </div>
    </DashboardLayout>
  );
}

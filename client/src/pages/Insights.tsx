import { motion } from 'framer-motion';
import { Brain, TrendingUp, Lightbulb, AlertCircle } from 'lucide-react';
import DashboardLayout from '@/components/DashboardLayout';
import TaxAdvisor from '@/components/TaxAdvisor';

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

        
    {/* ---------------- TAX ADVISOR SECTION ---------------- */}
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.6 }}
    >
      <TaxAdvisor />
    </motion.div>
  </div>
</DashboardLayout>
  );
} 
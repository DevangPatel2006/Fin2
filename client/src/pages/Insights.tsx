import { motion } from 'framer-motion';
import { Brain, TrendingUp, Lightbulb, AlertCircle, Loader2, RefreshCw } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import DashboardLayout from '@/components/DashboardLayout';
import TaxAdvisor from '@/components/TaxAdvisor';
import { useToast } from '@/hooks/use-toast';
import axios from 'axios';

const API = axios.create({ baseURL: 'http://localhost:5000/api' });
API.interceptors.request.use((req) => {
  const token = localStorage.getItem('token');
  if (token) req.headers.Authorization = `Bearer ${token}`;
  return req;
});

// Icon mapping for dynamic insights
const iconMap: Record<string, any> = {
  TrendingUp,
  Lightbulb,
  AlertCircle,
  Brain,
};

interface Insight {
  type: string;
  icon: string;
  title: string;
  description: string;
  color: string;
}

interface Summary {
  totalIncome: number;
  totalExpenses: number;
  netSavings: number;
  avgCategoryGrowth: string;
  savingsRate: string;
  monthlyTransactions: number;
}

export default function Insights() {
  const { toast } = useToast();
  const [insights, setInsights] = useState<Insight[]>([]);
  const [summary, setSummary] = useState<Summary | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchInsights = async () => {
    try {
      setRefreshing(true);
      const res = await API.get('/ai/insights');
      
      if (res.data.status === 'READY') {
        setInsights(res.data.insights);
        setSummary(res.data.summary);
      } else if (res.data.status === 'ERROR') {
        toast({
          title: 'Error',
          description: res.data.message || 'Failed to load insights',
          variant: 'destructive',
        });
      }
    } catch (err: any) {
      console.error('Failed to fetch insights:', err);
      toast({
        title: 'Error',
        description: 'Unable to load AI insights. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchInsights();
  }, []);

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex flex-col items-center justify-center h-96 space-y-4">
          <Loader2 className="w-12 h-12 animate-spin text-primary" />
          <p className="text-lg text-muted-foreground">Analyzing your financial data...</p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between"
        >
          <div>
            <h1 className="text-3xl md:text-4xl font-bold mb-2">
              AI <span className="text-gradient-indigo">Insights</span>
            </h1>
            <p className="text-muted-foreground">Personalized financial intelligence powered by AI</p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={fetchInsights}
            disabled={refreshing}
            title="Refresh insights"
          >
            <RefreshCw className={`w-5 h-5 ${refreshing ? 'animate-spin' : ''}`} />
          </Button>
        </motion.div>

        {/* Summary Cards */}
        {summary && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-4"
          >
            <div className="glass-card p-4">
              <p className="text-xs text-muted-foreground mb-1">Total Income</p>
              <p className="text-xl font-bold text-accent">₹{summary.totalIncome.toLocaleString()}</p>
            </div>
            <div className="glass-card p-4">
              <p className="text-xs text-muted-foreground mb-1">Total Expenses</p>
              <p className="text-xl font-bold text-secondary">₹{summary.totalExpenses.toLocaleString()}</p>
            </div>
            <div className="glass-card p-4">
              <p className="text-xs text-muted-foreground mb-1">Net Savings</p>
              <p className="text-xl font-bold text-primary">₹{summary.netSavings.toLocaleString()}</p>
            </div>
            <div className="glass-card p-4">
              <p className="text-xs text-muted-foreground mb-1">Savings Rate</p>
              <p className="text-xl font-bold text-gradient-indigo">{summary.savingsRate}%</p>
            </div>
          </motion.div>
        )}

        {/* Growth Indicator */}
        {summary && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="glass-card p-4 text-center"
          >
            <p className="text-sm text-muted-foreground">
              Monthly Trend: <span className="font-semibold text-foreground">{summary.avgCategoryGrowth}</span>
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              Based on {summary.monthlyTransactions} transactions this month
            </p>
          </motion.div>
        )}

        {/* AI Insights Cards */}
        {insights.length > 0 ? (
          <div className="grid md:grid-cols-2 gap-6">
            {insights.map((insight, index) => {
              const Icon = iconMap[insight.icon] || Brain;
              return (
                <motion.div
                  key={insight.title}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + index * 0.1 }}
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
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="glass-card p-12 text-center"
          >
            <Brain className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-xl font-semibold text-foreground mb-2">No Insights Yet</h3>
            <p className="text-muted-foreground mb-6">
              Add transactions and goals to receive personalized AI-powered financial insights
            </p>
            <div className="flex gap-4 justify-center">
              <Button variant="luxury" onClick={() => window.location.href = '/add-transaction'}>
                Add Transaction
              </Button>
              <Button variant="outline" onClick={() => window.location.href = '/add-goal'}>
                Create Goal
              </Button>
            </div>
          </motion.div>
        )}

        {/* Tax Advisor Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
        >
          <TaxAdvisor />
        </motion.div>
      </div>
    </DashboardLayout>
  );
}
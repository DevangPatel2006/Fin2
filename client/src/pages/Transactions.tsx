import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { Search, Filter, TrendingUp, TrendingDown, Plus } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import DashboardLayout from '@/components/DashboardLayout';
import axios from 'axios';

// ✅ Backend API setup with token
const API = axios.create({ baseURL: 'http://localhost:5000/api' });
API.interceptors.request.use((req) => {
  const token = localStorage.getItem('token');
  if (token) req.headers.Authorization = `Bearer ${token}`;
  return req;
});

export default function Transactions() {
  const [transactions, setTransactions] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  // 🧠 Fetch user transactions from backend
  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const res = await API.get('/transactions/my');
        setTransactions(res.data);
      } catch (err) {
        console.error('Failed to fetch transactions:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchTransactions();
  }, []);

  // 🔍 Filter by search
  const filteredTransactions = transactions.filter(
    (t) =>
      t.category?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.note?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // 💰 Compute totals
  const totalIncome = transactions
    .filter((t) => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpense = transactions
    .filter((t) => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex justify-center items-center h-96 text-muted-foreground text-lg">
          Loading transactions...
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-3xl md:text-4xl font-bold mb-2">
            <span className="text-gradient-indigo">Transactions</span>
          </h1>
          <p className="text-muted-foreground">Track and manage all your transactions</p>
        </motion.div>

        {/* Summary Cards */}
        <div className="grid md:grid-cols-3 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="glass-card p-6 hover:neon-border-indigo transition-all duration-500"
          >
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-lg bg-accent/10">
                <TrendingUp className="w-5 h-5 text-accent" />
              </div>
              <p className="text-muted-foreground">Total Income</p>
            </div>
            <p className="text-2xl font-bold text-accent">
              ₹{totalIncome.toLocaleString()}
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="glass-card p-6 hover:neon-border-indigo transition-all duration-500"
          >
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-lg bg-secondary/10">
                <TrendingDown className="w-5 h-5 text-secondary" />
              </div>
              <p className="text-muted-foreground">Total Expenses</p>
            </div>
            <p className="text-2xl font-bold text-secondary">
              ₹{totalExpense.toLocaleString()}
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="glass-card p-6 hover:neon-border-indigo transition-all duration-500"
          >
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-lg bg-primary/10">
                <Filter className="w-5 h-5 text-primary" />
              </div>
              <p className="text-muted-foreground">Net Savings</p>
            </div>
            <p className="text-2xl font-bold text-primary">
              ₹{(totalIncome - totalExpense).toLocaleString()}
            </p>
          </motion.div>
        </div>

        {/* Search and Add */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="flex flex-col sm:flex-row gap-4"
        >
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search transactions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 glass-card border-primary/20"
            />
          </div>
          <Link to="/add-transaction">
            <Button variant="luxury" className="w-full sm:w-auto">
              <Plus className="w-4 h-4 mr-2" />
              Add Transaction
            </Button>
          </Link>
        </motion.div>

        {/* Transactions List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="glass-card p-6"
        >
          {filteredTransactions.length === 0 ? (
            <p className="text-center text-muted-foreground py-6">
              No transactions found.
            </p>
          ) : (
            <div className="space-y-3">
              {filteredTransactions.map((transaction, index) => (
                <motion.div
                  key={transaction._id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.6 + index * 0.05 }}
                  className="flex items-center justify-between p-4 rounded-xl bg-muted/30 hover:bg-muted/50 transition-all hover:neon-border-cyan duration-300"
                >
                  <div className="flex items-center gap-4">
                    <div
                      className={`p-3 rounded-xl ${
                        transaction.type === 'income'
                          ? 'bg-accent/10'
                          : 'bg-secondary/10'
                      }`}
                    >
                      {transaction.type === 'income' ? (
                        <TrendingUp className="w-5 h-5 text-accent" />
                      ) : (
                        <TrendingDown className="w-5 h-5 text-secondary" />
                      )}
                    </div>
                    <div>
                      <p className="font-medium text-foreground">
                        {transaction.category}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {transaction.note || '—'} •{' '}
                        {new Date(transaction.date).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <p
                    className={`text-lg font-semibold ${
                      transaction.type === 'income'
                        ? 'text-accent'
                        : 'text-foreground'
                    }`}
                  >
                    {transaction.type === 'income' ? '+' : '-'}₹
                    {Math.abs(transaction.amount).toLocaleString()}
                  </p>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </DashboardLayout>
  );
}

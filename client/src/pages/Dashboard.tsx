import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  TrendingUp,
  TrendingDown,
  Wallet,
  Target,
  ArrowUpRight,
  ArrowDownRight,
  Plus,
} from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import DashboardLayout from "@/components/DashboardLayout";
import axios from "axios";

// 🧠 Backend API instance
const API = axios.create({ baseURL: "http://localhost:5000/api" });
API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");
  if (token) req.headers.Authorization = `Bearer ${token}`;
  return req;
});

export default function Dashboard() {
  const [user, setUser] = useState<{ name?: string } | null>(null);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // 🧠 Fetch user + transactions
  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;

        // Fetch user info
        const userRes = await API.get("/auth/me");
        setUser(userRes.data);

        // Fetch transactions
        const txnRes = await API.get("/transactions/my");
        setTransactions(txnRes.data);
      } catch (err) {
        console.error("Failed to fetch dashboard data:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // 🧾 Derived Stats
  const totalIncome = transactions
    .filter((t) => t.type === "income")
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpense = transactions
    .filter((t) => t.type === "expense")
    .reduce((sum, t) => sum + t.amount, 0);

  const balance = totalIncome - totalExpense;
  const savingsRate = totalIncome
    ? ((balance / totalIncome) * 100).toFixed(1)
    : 0;

  // 🧠 Dynamic Stats Grid
  const stats = [
    {
      label: "Total Balance",
      value: `₹${balance.toLocaleString()}`,
      change: balance >= 0 ? "+12.5%" : "-12.5%",
      positive: balance >= 0,
      icon: Wallet,
    },
    {
      label: "Monthly Income",
      value: `₹${totalIncome.toLocaleString()}`,
      change: "+5.2%",
      positive: true,
      icon: TrendingUp,
    },
    {
      label: "Monthly Expenses",
      value: `₹${totalExpense.toLocaleString()}`,
      change: "-8.3%",
      positive: false,
      icon: TrendingDown,
    },
    {
      label: "Savings Rate",
      value: `${savingsRate}%`,
      change: "+3.1%",
      positive: true,
      icon: Target,
    },
  ];

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-96 text-lg text-muted-foreground">
          Loading your dashboard...
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
            Welcome back,{" "}
            <span className="text-gradient-indigo">
              {user?.name ? user.name.split(" ")[0] : "User"}
            </span>{" "}
            👋
          </h1>
          <p className="text-muted-foreground">Here's your financial overview</p>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="glass-card p-6 hover:neon-border-indigo transition-all duration-500"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <Icon className="w-5 h-5 text-primary" />
                  </div>
                  <div
                    className={`flex items-center gap-1 text-sm ${
                      stat.positive ? "text-accent" : "text-destructive"
                    }`}
                  >
                    {stat.positive ? (
                      <ArrowUpRight className="w-4 h-4" />
                    ) : (
                      <ArrowDownRight className="w-4 h-4" />
                    )}
                    {stat.change}
                  </div>
                </div>
                <p className="text-muted-foreground text-sm mb-1">{stat.label}</p>
                <p className="text-2xl font-bold text-foreground">{stat.value}</p>
              </motion.div>
            );
          })}
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Recent Transactions */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="lg:col-span-2 glass-card p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-foreground">
                Recent Transactions
              </h2>
              <Link to="/transactions">
                <Button variant="ghost" size="sm">
                  View All
                </Button>
              </Link>
            </div>

            {transactions.length === 0 ? (
              <p className="text-muted-foreground text-sm">
                No transactions yet. Start by adding one!
              </p>
            ) : (
              <div className="space-y-4">
                {transactions.slice(0, 5).map((t, index) => (
                  <motion.div
                    key={t._id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 + index * 0.1 }}
                    className="flex items-center justify-between p-4 rounded-xl bg-muted/30 hover:bg-muted/50 transition-colors"
                  >
                    <div>
                      <p className="font-medium text-foreground capitalize">
                        {t.category}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {t.note || "—"} • {new Date(t.date).toLocaleDateString()}
                      </p>
                    </div>
                    <p
                      className={`font-semibold ${
                        t.type === "income" ? "text-accent" : "text-destructive"
                      }`}
                    >
                      {t.type === "income" ? "+" : "-"}₹
                      {Math.abs(t.amount).toLocaleString()}
                    </p>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>

          {/* Goals Progress (static for now) */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="glass-card p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-foreground">Goals</h2>
              <Link to="/add-goal">
                <Button variant="ghost" size="sm">
                  <Plus className="w-4 h-4" />
                </Button>
              </Link>
            </div>

            <p className="text-muted-foreground text-sm">
              Add your savings goals to track progress here soon 🚀
            </p>
          </motion.div>
        </div>
      </div>
    </DashboardLayout>
  );
}

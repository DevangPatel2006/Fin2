import { motion } from "framer-motion";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, TrendingUp, TrendingDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import DashboardLayout from "@/components/DashboardLayout";
import { z } from "zod";
import axios from "axios";

// ✅ Validation Schema
const transactionSchema = z.object({
  name: z.string().trim().min(1, "Transaction name is required").max(100),
  amount: z.number().positive("Amount must be positive").max(10000000, "Amount too large"),
  category: z.string().trim().min(1, "Category is required").max(50),
  date: z.string().min(1, "Date is required"),
  notes: z.string().max(500, "Notes must be less than 500 characters").optional(),
});

const categories = {
  income: ["Salary", "Freelance", "Investment", "Business", "Other Income"],
  expense: [
    "Food & Dining",
    "Shopping",
    "Transportation",
    "Bills & Utilities",
    "Entertainment",
    "Health & Fitness",
    "Education",
    "Other Expense",
  ],
};

// ✅ Axios setup with token
const API = axios.create({ baseURL: "https://finlanza-backend1.onrender.com/api" });
API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");
  if (token) req.headers.Authorization = `Bearer ${token}`;
  return req;
});

export default function AddTransaction() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [type, setType] = useState<"income" | "expense">("expense");
  const [formData, setFormData] = useState({
    name: "",
    amount: "",
    category: "",
    date: new Date().toISOString().split("T")[0],
    notes: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  // ✅ Submit Handler (Connected to MongoDB)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      // Validate form fields
      const validatedData = transactionSchema.parse({
        ...formData,
        amount: parseFloat(formData.amount),
      });
      setErrors({});
      setLoading(true);

      // Send to backend API
      await API.post("/transactions/add", {
        type,
        category: validatedData.category,
        amount: validatedData.amount,
        note: validatedData.notes,
        date: validatedData.date,
      });

      toast({
        title: "Transaction Added!",
        description: `${type === "income" ? "Income" : "Expense"} of ₹${validatedData.amount} recorded successfully.`,
      });

      navigate("/dashboard");
    } catch (error: any) {
      setLoading(false);

      if (error instanceof z.ZodError) {
        // Show form validation errors
        const newErrors: Record<string, string> = {};
        error.errors.forEach((err) => {
          if (err.path[0]) newErrors[err.path[0].toString()] = err.message;
        });
        setErrors(newErrors);
      } else {
        console.error("Failed to add transaction:", error);
        toast({
          title: "Error",
          description: "Something went wrong while saving your transaction.",
          variant: "destructive",
        });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-2xl mx-auto space-y-8">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <Button variant="ghost" onClick={() => navigate(-1)} className="mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <h1 className="text-3xl md:text-4xl font-bold mb-2">
            Add <span className="text-gradient-indigo">Transaction</span>
          </h1>
          <p className="text-muted-foreground">Record your income or expense</p>
        </motion.div>

        {/* Type Selector */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-2 gap-4"
        >
          <button
            type="button"
            onClick={() => setType("income")}
            className={`glass-card p-6 flex items-center justify-center gap-3 transition-all duration-300 ${
              type === "income" ? "neon-border-indigo" : "hover:border-primary/30"
            }`}
          >
            <TrendingUp className={`w-6 h-6 ${type === "income" ? "text-accent" : "text-muted-foreground"}`} />
            <span className={`font-semibold ${type === "income" ? "text-accent" : "text-muted-foreground"}`}>
              Income
            </span>
          </button>
          <button
            type="button"
            onClick={() => setType("expense")}
            className={`glass-card p-6 flex items-center justify-center gap-3 transition-all duration-300 ${
              type === "expense" ? "neon-border-indigo" : "hover:border-primary/30"
            }`}
          >
            <TrendingDown className={`w-6 h-6 ${type === "expense" ? "text-secondary" : "text-muted-foreground"}`} />
            <span className={`font-semibold ${type === "expense" ? "text-secondary" : "text-muted-foreground"}`}>
              Expense
            </span>
          </button>
        </motion.div>

        {/* Form */}
        <motion.form
          onSubmit={handleSubmit}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="glass-card p-8 space-y-6"
        >
          {/* Name */}
          <div className="space-y-2">
            <Label htmlFor="name">Transaction Name</Label>
            <Input
              id="name"
              placeholder="e.g., Grocery Shopping"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className={errors.name ? "border-destructive" : ""}
            />
            {errors.name && <p className="text-sm text-destructive">{errors.name}</p>}
          </div>

          {/* Amount */}
          <div className="space-y-2">
            <Label htmlFor="amount">Amount (₹)</Label>
            <Input
              id="amount"
              type="number"
              step="0.01"
              placeholder="0.00"
              value={formData.amount}
              onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
              className={errors.amount ? "border-destructive" : ""}
            />
            {errors.amount && <p className="text-sm text-destructive">{errors.amount}</p>}
          </div>

          {/* Category */}
          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <select
              id="category"
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className={`w-full h-10 px-3 rounded-md bg-background border ${
                errors.category ? "border-destructive" : "border-input"
              } text-foreground`}
            >
              <option value="">Select a category</option>
              {categories[type].map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
            {errors.category && <p className="text-sm text-destructive">{errors.category}</p>}
          </div>

          {/* Date */}
          <div className="space-y-2">
            <Label htmlFor="date">Date</Label>
            <Input
              id="date"
              type="date"
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              className={errors.date ? "border-destructive" : ""}
            />
            {errors.date && <p className="text-sm text-destructive">{errors.date}</p>}
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <Label htmlFor="notes">Notes (Optional)</Label>
            <Textarea
              id="notes"
              placeholder="Add any additional details..."
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              className={errors.notes ? "border-destructive" : ""}
              rows={3}
            />
            {errors.notes && <p className="text-sm text-destructive">{errors.notes}</p>}
          </div>

          {/* Buttons */}
          <div className="flex gap-4 pt-4">
            <Button type="button" variant="outline" onClick={() => navigate(-1)} className="flex-1">
              Cancel
            </Button>
            <Button
              type="submit"
              variant="luxury"
              className="flex-1"
              disabled={loading}
            >
              {loading ? "Saving..." : `Add ${type === "income" ? "Income" : "Expense"}`}
            </Button>
          </div>
        </motion.form>
      </div>
    </DashboardLayout>
  );
}

// client/src/pages/AIChat.tsx
import { motion } from "framer-motion";
import { useState, useEffect, useRef } from "react";
import { Send, Bot, User, Sparkles, Loader2, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import DashboardLayout from "@/components/DashboardLayout";
import { toast } from "sonner";

interface Message {
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

export default function AIChat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [financialContext, setFinancialContext] = useState<any>(null);
  const [contextLoading, setContextLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Load chat history
  useEffect(() => {
    const stored = localStorage.getItem("aiChatHistory");
    if (stored) {
      const parsed = JSON.parse(stored);
      setMessages(parsed.map((m: any) => ({ ...m, timestamp: new Date(m.timestamp) })));
    } else {
      setMessages([
        {
          role: "assistant",
          content: `Hey 👋 I'm **FinAIssist**, your AI financial advisor.\n\nI can help you with:\n• Goal achievement strategies\n• Spending & savings analysis\n• Investment recommendations\n• Transaction insights\n\nAsk me anything about your finances!`,
          timestamp: new Date(),
        },
      ]);
    }
  }, []);

  // Save chat history
  useEffect(() => {
    if (messages.length > 1) {
      localStorage.setItem("aiChatHistory", JSON.stringify(messages));
    }
  }, [messages]);

  // Auto-scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  // Fetch comprehensive financial data
  const fetchFinancialContext = async () => {
    setContextLoading(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("Please login to use AI insights.");
        return null;
      }

      const res = await fetch("https://finlanza-backend1.onrender.com/api/ai/summary", {
        method: "GET",
        headers: { 
          "Content-Type": "application/json", 
          Authorization: `Bearer ${token}` 
        },
      });

      if (!res.ok) throw new Error("Failed to fetch financial data");

      const data = await res.json();
      
      // Build comprehensive context
      const context = {
        // Summary
        balance: data.summary.balance,
        totalTransactions: data.summary.totalTransactions,
        totalGoals: data.summary.totalGoals,
        incomeTotal: data.summary.incomeTotal,
        expenseTotal: data.summary.expenseTotal,
        savingsRate: data.summary.savingsRate,
        
        // Analytics
        topSpendingCategories: data.analytics.topSpendingCategories,
        monthlyNet: data.analytics.monthlyNet,
        recurring: data.analytics.recurring,
        goalProgress: data.analytics.goalProgress,
        investableAmount: data.analytics.investableAmount,
        monthlyInvestable: data.analytics.monthlyInvestable,
        
        // Recent transactions for pattern analysis
        recentTransactions: data.transactions,
      };

      setFinancialContext(context);
      return context;
    } catch (err) {
      console.error("Failed to fetch financial context:", err);
      toast.error("Couldn't load your financial data");
      return null;
    } finally {
      setContextLoading(false);
    }
  };

  // Auto-fetch financial context on mount
  useEffect(() => {
    fetchFinancialContext();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMessage: Message = {
      role: "user",
      content: input.trim(),
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("Please login to use AI insights.");
        setMessages((prev) => [...prev, { 
          role: "assistant", 
          content: "⚠️ Please login to access AI features.", 
          timestamp: new Date() 
        }]);
        setLoading(false);
        return;
      }

      // Ensure we have fresh financial context
      let context = financialContext;
      if (!context) {
        context = await fetchFinancialContext();
      }

      // Send to AI with full context
      const aiRes = await fetch("https://finlanza-backend1.onrender.com/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [{ role: "user", content: userMessage.content }],
          financialContext: context,
        }),
      });

      if (!aiRes.ok) throw new Error("AI service unavailable");

      const aiData = await aiRes.json();
      const text = aiData.reply || "I couldn't process that request.";

      setMessages((prev) => [...prev, { 
        role: "assistant", 
        content: text.trim(), 
        timestamp: new Date() 
      }]);
    } catch (err) {
      console.error(err);
      setMessages((prev) => [...prev, { 
        role: "assistant", 
        content: "⚠️ AI service is temporarily unavailable. Please try again.", 
        timestamp: new Date() 
      }]);
      toast.error("AI service error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="mx-auto max-w-4xl w-full min-h-[calc(100dvh-5rem)] sm:min-h-[calc(100dvh-6rem)] flex flex-col px-3 sm:px-0">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-4 sm:mb-6">
          <div className="flex items-center justify-between mb-1 sm:mb-2">
            <div className="flex items-center gap-3">
              <div className="p-2.5 sm:p-3 rounded-xl bg-gradient-to-br from-primary to-secondary">
                <Bot className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold leading-tight">
                  AI <span className="text-gradient-indigo">Financial Advisor</span>
                </h1>
                <p className="text-muted-foreground text-xs sm:text-sm">
                  {contextLoading ? "Loading your data..." : 
                   financialContext ? "✅ Data synced" : "❌ Data unavailable"}
                </p>
              </div>
            </div>
            
            {/* Refresh button */}
            <Button
              variant="ghost"
              size="icon"
              onClick={fetchFinancialContext}
              disabled={contextLoading}
              title="Refresh financial data"
            >
              <RefreshCw className={`w-4 h-4 ${contextLoading ? 'animate-spin' : ''}`} />
            </Button>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ delay: 0.08 }} 
          className="glass-card flex-1 overflow-hidden flex flex-col"
        >
          <div className="flex-1 overflow-y-auto no-scrollbar p-3 sm:p-6 space-y-3 sm:space-y-4">
            {messages.map((m, i) => (
              <motion.div 
                key={i} 
                initial={{ opacity: 0, y: 10 }} 
                animate={{ opacity: 1, y: 0 }} 
                className={`flex gap-2.5 sm:gap-3 ${m.role === "user" ? "flex-row-reverse" : "flex-row"}`}
              >
                <div className={`flex-shrink-0 w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center ${
                  m.role === "user" ? "bg-primary" : "bg-gradient-to-br from-accent to-secondary"
                }`}>
                  {m.role === "user" ? 
                    <User className="w-4 h-4 text-white" /> : 
                    <Bot className="w-4 h-4 text-white" />
                  }
                </div>
                <div className={`flex-1 max-w-[90%] sm:max-w-[80%] ${m.role === "user" ? "text-right" : "text-left"}`}>
                  <div className={`inline-block p-3 sm:p-4 rounded-2xl ${
                    m.role === "user" 
                      ? "bg-primary text-white rounded-tr-none" 
                      : "bg-muted/50 text-foreground rounded-tl-none"
                  }`}>
                    <div className="whitespace-pre-wrap break-words text-[13px] sm:text-sm leading-relaxed">
                      {m.content}
                    </div>
                  </div>
                  <div className="text-[10px] sm:text-xs text-muted-foreground mt-1 px-1">
                    {m.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                  </div>
                </div>
              </motion.div>
            ))}

            {loading && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-3">
                <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-gradient-to-br from-accent to-secondary flex items-center justify-center">
                  <Bot className="w-4 h-4 text-white" />
                </div>
                <div className="bg-muted/50 p-3 sm:p-4 rounded-2xl rounded-tl-none">
                  <Loader2 className="w-5 h-5 animate-spin text-primary" />
                </div>
              </motion.div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <form onSubmit={handleSubmit} className="border-t border-primary/10 p-3 sm:p-4 bg-muted/20">
            <div className="flex gap-2 items-end">
              <Textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about goals, spending, investments..."
                className="flex-1 min-h-[56px] sm:min-h-[60px] max-h-[140px] resize-none"
                onKeyDown={(e) => { 
                  if (e.key === "Enter" && !e.shiftKey) { 
                    e.preventDefault(); 
                    handleSubmit(e); 
                  } 
                }}
              />
              <Button 
                type="submit" 
                variant="luxury" 
                size="icon" 
                className="w-11 h-11 sm:w-12 sm:h-12 rounded-full" 
                disabled={!input.trim() || loading}
              >
                <Send className="w-5 h-5" />
              </Button>
            </div>
            <p className="text-[11px] sm:text-xs text-muted-foreground mt-2 text-center">
              Enter = Send • Shift+Enter = New Line
            </p>
          </form>
        </motion.div>
      </div>
    </DashboardLayout>
  );
}
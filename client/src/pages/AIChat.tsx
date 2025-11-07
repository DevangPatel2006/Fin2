import { motion } from "framer-motion";
import { useState, useEffect, useRef } from "react";
import { Send, Bot, User, Sparkles, Loader2 } from "lucide-react";
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
  const [lastFinancialContext, setLastFinancialContext] = useState<any>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const stored = localStorage.getItem("aiChatHistory");
    if (stored) {
      const parsed = JSON.parse(stored);
      setMessages(parsed.map((m: any) => ({ ...m, timestamp: new Date(m.timestamp) })));
    } else {
      setMessages([
        {
          role: "assistant",
          content: `Hey 👋 I'm **FinAIssist**.\nAsk about your *balance, spending, investing, or goals* — I'll respond using your real data. (Short & clear.)`,
          timestamp: new Date(),
        },
      ]);
    }
  }, []);

  useEffect(() => {
    if (messages.length > 1) {
      localStorage.setItem("aiChatHistory", JSON.stringify(messages));
    }
  }, [messages]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

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
        setMessages((prev) => [...prev, { role: "assistant", content: "⚠️ Login required.", timestamp: new Date() }]);
        setLoading(false);
        return;
      }

      const finWords = ["goal", "transaction", "balance", "income", "expense", "saving", "budget", "finance", "invest", "spending", "overspend", "risk"];
      const isRelated = finWords.some((w) => userMessage.content.toLowerCase().includes(w)) || lastFinancialContext !== null;

      let text = "";

      if (isRelated) {
        let financialContext = lastFinancialContext;

        if (!financialContext) {
          const res = await fetch("http://localhost:5000/api/ai/summary", {
            method: "GET",
            headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
          });

          const summary = await res.json();

        financialContext = {
  balance: summary.summary.balance,
  totalTransactions: summary.summary.totalTransactions,
  totalGoals: summary.summary.totalGoals,
  goalProgress: summary.analytics?.goalProgress ?? [], // <-- correct field
};


          setLastFinancialContext(financialContext);
        }

        const aiRes = await fetch("http://localhost:5000/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            messages: [{ role: "user", content: userMessage.content }],
            financialContext,
          }),
        });

        const aiData = await aiRes.json();
        text = aiData.reply || "I couldn't analyze that.";
      } else {
        const res = await fetch("http://localhost:5000/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            messages: [
              ...messages.slice(-10).map((m) => ({ role: m.role, content: m.content })),
              { role: "user", content: userMessage.content },
            ],
          }),
        });

        const data = await res.json();
        text = data.reply || "Couldn't respond.";
      }

      setMessages((prev) => [...prev, { role: "assistant", content: text.trim(), timestamp: new Date() }]);
    } catch (err) {
      console.error(err);
      setMessages((prev) => [...prev, { role: "assistant", content: "⚠️ AI is unavailable.", timestamp: new Date() }]);
      toast.error("AI unavailable");
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="mx-auto max-w-4xl w-full min-h-[calc(100dvh-5rem)] sm:min-h-[calc(100dvh-6rem)] flex flex-col px-3 sm:px-0">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-4 sm:mb-6">
          <div className="flex items-center gap-3 mb-1 sm:mb-2">
            <div className="p-2.5 sm:p-3 rounded-xl bg-gradient-to-br from-primary to-secondary">
              <Sparkles className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold leading-tight">AI <span className="text-gradient-indigo">Assistant</span></h1>
              <p className="text-muted-foreground text-xs sm:text-sm">Your 24/7 finance guide</p>
            </div>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08 }} className="glass-card flex-1 overflow-hidden flex flex-col">
          <div className="flex-1 overflow-y-auto no-scrollbar p-3 sm:p-6 space-y-3 sm:space-y-4">
            {messages.map((m, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className={`flex gap-2.5 sm:gap-3 ${m.role === "user" ? "flex-row-reverse" : "flex-row"}`}>
                <div className={`flex-shrink-0 w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center ${m.role === "user" ? "bg-primary" : "bg-gradient-to-br from-accent to-secondary"}`}>
                  {m.role === "user" ? <User className="w-4 h-4 text-white" /> : <Bot className="w-4 h-4 text-white" />}
                </div>
                <div className={`flex-1 max-w-[90%] sm:max-w-[80%] ${m.role === "user" ? "text-right" : "text-left"}`}>
                  <div className={`inline-block p-3 sm:p-4 rounded-2xl ${m.role === "user" ? "bg-primary text-white rounded-tr-none" : "bg-muted/50 text-foreground rounded-tl-none"}`}>
                    <div className="whitespace-pre-wrap break-words text-[13px] sm:text-sm leading-relaxed">{m.content}</div>
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
                placeholder="Ask something..."
                className="flex-1 min-h-[56px] sm:min-h-[60px] max-h-[140px] resize-none"
                onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSubmit(e); } }}
              />
              <Button type="submit" variant="luxury" size="icon" className="w-11 h-11 sm:w-12 sm:h-12 rounded-full" disabled={!input.trim() || loading}>
                <Send className="w-5 h-5" />
              </Button>
            </div>
            <p className="text-[11px] sm:text-xs text-muted-foreground mt-2 text-center">Enter = Send • Shift+Enter = New Line</p>
          </form>
        </motion.div>
      </div>
    </DashboardLayout>
  );
}

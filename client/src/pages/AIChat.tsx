import { motion } from 'framer-motion';
import { useState, useEffect, useRef } from 'react';
import { Send, Bot, User, Sparkles, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import DashboardLayout from '@/components/DashboardLayout';
import { toast } from 'sonner';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export default function AIChat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Load chat history from localStorage
  useEffect(() => {
    const stored = localStorage.getItem('aiChatHistory');
    if (stored) {
      const parsed = JSON.parse(stored);
      setMessages(parsed.map((m: any) => ({ ...m, timestamp: new Date(m.timestamp) })));
    } else {
      // Default welcome message
      setMessages([
        {
          role: 'assistant',
          content: `👋 Hello! I'm your **FinAIssist AI Assistant**. I'm here to help you understand and make the most of our platform.

I can help you with:
• **Dashboard Overview** - Track your balance, income, expenses, and savings  
• **Transactions** - Record and manage your financial activities  
• **Goals** - Create and monitor your savings goals  
• **AI Insights** - Get personalized financial recommendations  
• **Settings** - Customize your account preferences  

You can also ask me **general finance questions** like saving, investing, or budgeting.`,
          timestamp: new Date(),
        },
      ]);
    }
  }, []);

  // Save chat history
  useEffect(() => {
    if (messages.length > 1) {
      localStorage.setItem('aiChatHistory', JSON.stringify(messages));
    }
  }, [messages]);

  // Auto scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  // Handle chat message
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMessage: Message = {
      role: 'user',
      content: input.trim(),
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      // 🔍 Detect if question is related to Finlanza platform
      const financeKeywords = [
        'goal',
        'transaction',
        'balance',
        'income',
        'expense',
        'saving',
        'budget',
        'dashboard',
        'finlanza',
        'ai insight',
        'profile',
        'account',
      ];

      const isPlatformRelated = financeKeywords.some((word) =>
        userMessage.content.toLowerCase().includes(word)
      );

      // Choose API endpoint dynamically
      const endpoint = isPlatformRelated
        ? 'http://localhost:5000/api/ai/summary' // platform-aware route
        : 'http://localhost:5000/api/chat'; // general chat (Gemini)

      // Create payload depending on route type
      const bodyData = isPlatformRelated
        ? {
            userId: localStorage.getItem('userId') || 'guest',
            userQuestion: userMessage.content,
          }
        : {
            messages: [...messages.slice(-10).map((m) => ({ role: m.role, content: m.content })), { role: 'user', content: userMessage.content }],
          };

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bodyData),
      });

      if (!response.ok) {
        throw new Error('Server connection failed');
      }

      const data = await response.json();

      // Normalize the output text
      const text =
        data?.reply ||
        data?.content?.[0]?.text ||
        data?.message ||
        "Sorry, I couldn't generate a proper response.";

      const assistantMessage: Message = {
        role: 'assistant',
        content: text,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Chat error:', error);
      const errorMessage: Message = {
        role: 'assistant',
        content:
          "⚠️ I'm having trouble connecting right now. Please check your server and try again shortly.",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
      toast.error('AI service unavailable');
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>
      {/* Use dynamic viewport (mobile-safe) and make the page flex so the card can grow */}
      <div className="mx-auto max-w-4xl w-full min-h-[calc(100dvh-5rem)] sm:min-h-[calc(100dvh-6rem)] flex flex-col px-3 sm:px-0">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-4 sm:mb-6"
        >
          <div className="flex items-center gap-3 mb-1 sm:mb-2">
            <div className="p-2.5 sm:p-3 rounded-xl bg-gradient-to-br from-primary to-secondary">
              <Sparkles className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
            </div>
            <div>
              {/* Smaller title on mobile, original on md+ */}
              <h1 className="text-2xl sm:text-3xl font-bold leading-tight">
                AI <span className="text-gradient-indigo">Assistant</span>
              </h1>
              <p className="text-muted-foreground text-xs sm:text-sm">
                Your 24/7 personal finance guide
              </p>
            </div>
          </div>
        </motion.div>

        {/* Chat Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.08 }}
          className="glass-card flex-1 overflow-hidden flex flex-col"
        >
          {/* Messages */}
          <div className="flex-1 overflow-y-auto no-scrollbar p-3 sm:p-6 space-y-3 sm:space-y-4">
            {messages.map((message, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.02 }}
                className={`flex gap-2.5 sm:gap-3 ${message.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
              >
                <div
                  className={`flex-shrink-0 w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center ${
                    message.role === 'user'
                      ? 'bg-primary'
                      : 'bg-gradient-to-br from-accent to-secondary'
                  }`}
                >
                  {message.role === 'user' ? (
                    <User className="w-4 h-4 text-white" />
                  ) : (
                    <Bot className="w-4 h-4 text-white" />
                  )}
                </div>

                <div
                  className={`flex-1 max-w-[90%] sm:max-w-[80%] ${
                    message.role === 'user' ? 'text-right' : 'text-left'
                  }`}
                >
                  <div
                    className={`inline-block p-3 sm:p-4 rounded-2xl ${
                      message.role === 'user'
                        ? 'bg-primary text-white rounded-tr-none'
                        : 'bg-muted/50 text-foreground rounded-tl-none'
                    }`}
                  >
                    <div className="whitespace-pre-wrap break-words text-[13px] sm:text-sm leading-relaxed">
                      {message.content}
                    </div>
                  </div>
                  <div className="text-[10px] sm:text-xs text-muted-foreground mt-1 px-1">
                    {message.timestamp.toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
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

          {/* Input Form */}
          <form onSubmit={handleSubmit} className="border-t border-primary/10 p-3 sm:p-4 bg-muted/20">
            <div className="flex gap-2 items-end">
              <Textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask me anything about FinAIssist or personal finance..."
                className="flex-1 min-h-[56px] sm:min-h-[60px] max-h-[140px] resize-none"
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
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
                aria-label="Send message"
                title="Send"
              >
                <Send className="w-5 h-5" />
              </Button>
            </div>
            <p className="text-[11px] sm:text-xs text-muted-foreground mt-2 text-center">
              Press Enter to send • Shift+Enter for new line
            </p>
          </form>
        </motion.div>
      </div>
    </DashboardLayout>
  );
}

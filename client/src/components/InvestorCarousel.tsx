import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const investors = [
  {
    name: "Warren Buffett",
    title: "CEO, Berkshire Hathaway",
    quote:
      "Do not save what is left after spending, but spend what is left after saving.",
    image:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop",
  },
  {
    name: "Ray Dalio",
    title: "Founder, Bridgewater Associates",
    quote: "He who lives by the crystal ball will eat shattered glass.",
    image:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop",
  },
  {
    name: "Charlie Munger",
    title: "Vice Chairman, Berkshire Hathaway",
    quote:
      "The big money is not in the buying and selling, but in the waiting.",
    image:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop",
  },
  {
    name: "Jack Bogle",
    title: "Founder, Vanguard Group",
    quote: "Time is your friend; impulse is your enemy.",
    image:
      "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&h=150&fit=crop",
  },
];

export default function InvestorCarousel() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % investors.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const current = investors[index];

  return (
    <section className="py-20 relative overflow-hidden border-y border-primary/10">
      <div className="container mx-auto px-4 text-center">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-3xl md:text-4xl font-bold mb-12"
        >
          Wisdom from <span className="text-gradient-indigo">Financial Legends</span>
        </motion.h2>

        <div className="relative h-[260px] flex items-center justify-center">
          <AnimatePresence mode="wait">
            <motion.div
              key={current.name}
              initial={{ opacity: 0, y: 30, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -30, scale: 0.95 }}
              transition={{ duration: 0.7, ease: "easeInOut" }}
              className="glass-card p-8 w-full max-w-md mx-auto shadow-lg rounded-2xl border border-primary/10"
            >
              <div className="flex flex-col items-center gap-4">
                <Avatar className="w-20 h-20 border-2 border-primary/50">
                  <AvatarImage src={current.image} alt={current.name} />
                  <AvatarFallback>
                    {current.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-semibold text-xl text-foreground">
                    {current.name}
                  </h3>
                  <p className="text-sm text-muted-foreground">{current.title}</p>
                </div>
                <blockquote className="text-foreground/90 italic border-l-2 border-primary pl-4 mt-4">
                  “{current.quote}”
                </blockquote>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Soft fade edges */}
      <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-background to-transparent pointer-events-none" />
      <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-background to-transparent pointer-events-none" />
    </section>
  );
}
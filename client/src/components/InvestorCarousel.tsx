import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

// ✅ Helper to try multiple image sources gracefully
function useFallback(images: string[]) {
  const [i, setI] = useState(0);
  return {
    src: images[i],
    onError: () => {
      if (i < images.length - 1) setI(i + 1);
    },
  };
}

const investors = [
  // -------- Investing (2) --------
  {
    name: "Warren Buffett",
    title: "CEO, Berkshire Hathaway",
    area: "Investing",
    quote:
      "The stock market is a device for transferring money from the impatient to the patient.",
    images: [
      "https://upload.wikimedia.org/wikipedia/commons/5/50/Warren_Buffett_KU_Visit.jpg",
      "https://en.wikipedia.org/wiki/Special:FilePath/Warren_Buffett_KU_Visit.jpg",
      "https://commons.wikimedia.org/wiki/Special:FilePath/Warren_Buffett_KU_Visit.jpg",
    ],
  },
  {
    name: "Vijay Kedia",
    title: "Indian Stock Market Investor",
    area: "Investing",
    quote: "Your investment success depends on your ability to handle losses.",
    images: [
      "https://upload.wikimedia.org/wikipedia/commons/2/2a/Vijay_Kedia.jpg",
      "https://en.wikipedia.org/wiki/Special:FilePath/Vijay_Kedia.jpg",
      "https://commons.wikimedia.org/wiki/Special:FilePath/Vijay_Kedia.jpg",
    ],
  },

  // -------- Money Management (2) --------
  {
    name: "Dave Ramsey",
    title: "Personal Finance Coach",
    area: "Money Management",
    quote:
      "A budget is telling your money where to go instead of wondering where it went.",
    images: [
      "https://upload.wikimedia.org/wikipedia/commons/e/e7/Dave_Ramsey.jpg",
      "https://en.wikipedia.org/wiki/Special:FilePath/Dave_Ramsey.jpg",
      "https://commons.wikimedia.org/wiki/Special:FilePath/Dave_Ramsey.jpg",
    ],
  },
  {
    name: "Suze Orman",
    title: "Financial Advisor & Author",
    area: "Money Management",
    quote: "You can't build wealth if you don't control your spending.",
    images: [
      "https://upload.wikimedia.org/wikipedia/commons/8/8c/Suze_Orman_2014.jpg",
      "https://en.wikipedia.org/wiki/Special:FilePath/Suze_Orman_2014.jpg",
      "https://commons.wikimedia.org/wiki/Special:FilePath/Suze_Orman_2014.jpg",
    ],
  },

  // -------- Goals / Discipline (3) --------
  {
    name: "James Clear",
    title: "Author of Atomic Habits",
    area: "Goal Building",
    quote:
      "You do not rise to the level of your goals. You fall to the level of your systems.",
    images: [
      "https://upload.wikimedia.org/wikipedia/commons/0/0e/James_Clear.png",
      "https://en.wikipedia.org/wiki/Special:FilePath/James_Clear.png",
      "https://commons.wikimedia.org/wiki/Special:FilePath/James_Clear.png",
    ],
  },
  {
    name: "Naval Ravikant",
    title: "Entrepreneur & Philosopher",
    area: "Goal Building",
    quote:
      "Desire is a contract you make with yourself to be unhappy until you get what you want.",
    images: [
      "https://upload.wikimedia.org/wikipedia/commons/c/c3/Naval_Ravikant_Headshot.jpg",
      "https://en.wikipedia.org/wiki/Special:FilePath/Naval_Ravikant_Headshot.jpg",
      "https://commons.wikimedia.org/wiki/Special:FilePath/Naval_Ravikant_Headshot.jpg",
    ],
  },
  {
    name: "Nithin Kamath",
    title: "Founder, Zerodha",
    area: "Goal Building",
    quote: "Consistency beats motivation.",
    images: [
      "https://upload.wikimedia.org/wikipedia/commons/8/8b/Nithin_Kamath_in_2023.jpg",
      "https://en.wikipedia.org/wiki/Special:FilePath/Nithin_Kamath_in_2023.jpg",
      "https://commons.wikimedia.org/wiki/Special:FilePath/Nithin_Kamath_in_2023.jpg",
    ],
  },
];

export default function InvestorCarousel() {
  const [index, setIndex] = useState(0);
  const current = investors[index];
  const fallback = useFallback(current.images);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % investors.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

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

        <div className="relative min-h-[320px] flex items-center justify-center py-6 md:py-10">

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
                  <AvatarImage src={fallback.src} onError={fallback.onError} />
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

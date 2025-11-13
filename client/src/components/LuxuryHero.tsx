import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Sparkles, Play } from 'lucide-react';
import FloatingGradients from './FloatingGradients';

export default function LuxuryHero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center px-4 overflow-hidden">
      {/* Floating gradient shapes */}
      <FloatingGradients />

      {/* Hero Content */}
      <div className="relative z-10 text-center max-w-5xl mx-auto py-20">
        {/* Glowing Badge */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="inline-flex items-center gap-2 mb-8 px-6 py-3 glass-badge glow-indigo"
        >
          <Sparkles className="w-4 h-4 text-primary animate-pulse" />
          <span className="text-sm font-semibold text-foreground tracking-wider">
            AI-Powered Financial Intelligence
          </span>
        </motion.div>

        {/* Main Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.2, ease: 'easeOut' }}
          className="text-5xl md:text-7xl lg:text-8xl font-bold mb-6 leading-tight tracking-tight"
        >
          <span className="block text-foreground mb-2">
            Your Personal 
          </span>
          <span className="block text-gradient-hero">
            Finance Coach
          </span>
        </motion.h1>

        {/* Subtitle with gradient */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.4, ease: 'easeOut' }}
          className="text-2xl md:text-3xl font-medium text-gradient-indigo mb-6"
        >
          Track. Save. Invest. Achieve.
        </motion.p>

        {/* Tagline */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.6 }}
          className="text-lg md:text-xl text-muted-foreground mb-12 max-w-3xl mx-auto leading-relaxed font-light"
        >
          Crafting exceptional financial experiences through calm intelligence
          and cutting-edge technology.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.8, ease: 'easeOut' }}
          className="flex flex-col sm:flex-row gap-4 justify-center items-center"
        >
          <Link to="/signup">
            <Button variant="luxury" size="xl" className="glow-cyan group min-w-[200px]">
              Start Now
              <motion.span
                animate={{ x: [0, 5, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                →
              </motion.span>
            </Button>
          </Link>

          <Button variant="glass" size="xl" className="group min-w-[200px]">
            <Play className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" />
            View Demo
          </Button>
        </motion.div>

        {/* Floating decorative elements */}
        <motion.div
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute top-1/4 left-10 w-2 h-2 bg-primary rounded-full blur-sm opacity-60"
        />
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
          className="absolute top-1/3 right-20 w-3 h-3 bg-secondary rounded-full blur-sm opacity-60"
        />
        <motion.div
          animate={{ y: [0, -15, 0] }}
          transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
          className="absolute bottom-1/3 left-1/4 w-2 h-2 bg-accent rounded-full blur-sm opacity-60"
        />
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, y: [0, 10, 0] }}
        transition={{
          opacity: { delay: 1.5, duration: 0.5 },
          y: { repeat: Infinity, duration: 2, ease: 'easeInOut' },
        }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10"
      >
        <div className="w-6 h-10 border-2 border-primary/50 rounded-full flex justify-center pt-2 backdrop-blur-sm">
          <motion.div
            animate={{ y: [0, 12, 0], opacity: [1, 0, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-1 h-3 bg-primary rounded-full"
          />
        </div>
      </motion.div>
    </section>
  );
}

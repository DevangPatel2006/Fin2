import { motion } from 'framer-motion';
import { Sparkles, TrendingUp, Brain, MessageCircle } from 'lucide-react';
import LuxuryHero from '@/components/LuxuryHero';
import InvestorCarousel from '@/components/InvestorCarousel';
import FeatureCard from '@/components/FeatureCard';
import DashboardPreview from '@/components/DashboardPreview';
import TestimonialGrid from '@/components/TestimonialGrid';
import Footer from '@/components/Footer';

const features = [
  {
    icon: Sparkles,
    title: 'Track Your Spending with AI Clarity',
    description: 'Understand every rupee with intelligent categorization and insights that reveal your true spending patterns.',
  },
  {
    icon: TrendingUp,
    title: 'Forecast Your Financial Future',
    description: 'AI-powered predictions help you visualize where your money will be in 6 months, 1 year, or 5 years.',
  },
  {
    icon: Brain,
    title: 'Smart Investment Tips',
    description: 'Get personalized investment recommendations based on your goals, risk profile, and market conditions.',
  },
  {
    icon: MessageCircle,
    title: 'Chat with Your Finance Assistant',
    description: '24/7 AI chat support for all your money questions. Like having a CFO in your pocket.',
  },
];

const Index = () => {
  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      {/* Luxury Hero Section */}
      <LuxuryHero />

      {/* Investor Carousel */}
      <InvestorCarousel />

      {/* Features Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-5xl font-bold mb-4 text-foreground">
              AI-Powered <span className="text-gradient-gold">Financial Superpowers</span>
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Everything you need to take control of your financial destiny
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <FeatureCard
                key={feature.title}
                icon={feature.icon}
                title={feature.title}
                description={feature.description}
                delay={index * 0.1}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Dashboard Preview */}
      <DashboardPreview />

      {/* Testimonials */}
      <TestimonialGrid />

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Index;

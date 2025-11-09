import { motion } from 'framer-motion';
import { CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

const benefits = [
  'Real-time spending insights with AI analysis',
  'AI tax planning that grows your savings',
  'Smart budgeting that adapts to your lifestyle',
  'Personalized investment recommendations',
  'Automated savings goals tracking',
  'Financial health score and trends',
];

export default function DashboardPreview() {
  return (
    <section className="py-32 relative overflow-hidden border-y border-primary/10">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-primary/5 to-background" />
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-[128px]" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-secondary/20 rounded-full blur-[128px]" />

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Your Financial <span className="text-gradient-indigo">Command Center</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Beautiful insights. Intelligent predictions. All in one elegant dashboard.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Dashboard Mockup */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            <div className="glass-card p-6 relative z-10">
              {/* Mockup Header */}
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-foreground">Financial Overview</h3>
                <div className="flex gap-2">
                  <div className="w-3 h-3 rounded-full bg-accent"></div>
                  <div className="w-3 h-3 rounded-full bg-secondary"></div>
                  <div className="w-3 h-3 rounded-full bg-primary"></div>
                </div>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-muted/50 p-4 rounded-lg">
                  <p className="text-xs text-muted-foreground mb-1">Total Balance</p>
                  <p className="text-2xl font-bold text-gradient-gold">₹45,890</p>
                </div>
                <div className="bg-muted/50 p-4 rounded-lg">
                  <p className="text-xs text-muted-foreground mb-1">This Month</p>
                  <p className="text-2xl font-bold text-primary">+12.5%</p>
                </div>
              </div>

              {/* Chart Placeholder */}
              <div className="h-48 bg-muted/30 rounded-lg flex items-end gap-2 p-4">
                {[40, 65, 45, 80, 55, 90, 75].map((height, i) => (
                  <div
                    key={i}
                    className="flex-1 bg-gradient-to-t from-primary to-secondary rounded-t animate-glow-pulse"
                    style={{ height: `${height}%`, animationDelay: `${i * 0.1}s` }}
                  />
                ))}
              </div>

              {/* Recent Activity */}
              <div className="mt-4 space-y-2">
                {['Coffee Shop', 'Grocery Store', 'Gas Station'].map((item, i) => (
                  <div key={i} className="flex justify-between items-center p-2 bg-muted/30 rounded">
                    <span className="text-sm text-foreground">{item}</span>
                    <span className="text-sm text-muted-foreground">-₹{(i + 1) * 150}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Glow effect */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-secondary/20 blur-3xl -z-10" />
          </motion.div>

          {/* Benefits List */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-foreground">
              Everything You Need in{' '}
              <span className="text-gradient-indigo">One Dashboard</span>
            </h2>

            <p className="text-muted-foreground mb-8 text-lg">
              Manage your entire financial life with AI-powered insights and automation.
            </p>

            <div className="space-y-4 mb-8">
              {benefits.map((benefit, index) => (
                <motion.div
                  key={benefit}
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-start gap-3"
                >
                  <CheckCircle2 className="w-6 h-6 text-primary flex-shrink-0 mt-0.5" />
                  <span className="text-foreground">{benefit}</span>
                </motion.div>
              ))}
            </div>

            <Button variant="luxury" size="xl" className="glow-cyan">
              Explore the Dashboard
            </Button>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowLeft, Target, Shield, Sparkles, Users } from "lucide-react";
import { Button } from "@/components/ui/button";

const AboutUs = () => {
  const values = [
    {
      icon: Shield,
      title: "Privacy First",
      description: "Your financial data is encrypted and protected with industry-leading security standards."
    },
    {
      icon: Sparkles,
      title: "AI-Powered Insights",
      description: "Smart analytics help you understand spending patterns and achieve financial goals faster."
    },
    {
      icon: Target,
      title: "Goal-Oriented",
      description: "Set personalized financial goals and track progress with intelligent recommendations."
    },
    {
      icon: Users,
      title: "User-Centric",
      description: "Built with simplicity in mind, making financial management accessible to everyone."
    }
  ];

  return (
    <div className="min-h-screen bg-luxury-black text-foreground">
      {/* Header */}
      <header className="border-b border-border/10 bg-background/50 backdrop-blur-xl sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4">
          <Link to="/help">
            <Button variant="ghost" size="sm" className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back to Help Center
            </Button>
          </Link>
        </div>
      </header>

      <div className="container mx-auto max-w-5xl px-6 py-12">
        {/* Hero */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h1 className="text-5xl md:text-6xl font-bold mb-6 text-gradient-hero">About Us</h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            We're on a mission to democratize financial intelligence by making powerful money management 
            tools accessible to everyone through AI-powered insights.
          </p>
        </motion.div>

        {/* Story */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="glass-card p-10 mb-12"
        >
          <h2 className="text-3xl font-bold mb-6 text-gradient-indigo">Our Story</h2>
          <div className="space-y-4 text-muted-foreground leading-relaxed">
            <p>
              Founded in 2024, our platform was born from a simple observation: managing personal finances 
              shouldn't require a degree in economics or expensive financial advisors. Yet millions struggle 
              daily with budgeting, saving, and achieving their financial goals.
            </p>
            <p>
              We built this AI-powered financial coach to bridge that gap. By combining cutting-edge 
              artificial intelligence with intuitive design, we've created a tool that understands your 
              unique financial situation and provides personalized guidance every step of the way.
            </p>
            <p>
              Our team of engineers, designers, and financial experts work tirelessly to ensure your 
              financial data remains secure while delivering insights that actually help you make better 
              money decisions.
            </p>
          </div>
        </motion.div>

        {/* Values */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mb-12"
        >
          <h2 className="text-3xl font-bold mb-8 text-center text-gradient-indigo">Our Values</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {values.map((value, index) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 + index * 0.1 }}
                className="glass-card p-8 hover:neon-border-indigo transition-all duration-300"
              >
                <value.icon className="h-10 w-10 text-primary glow-indigo mb-4" />
                <h3 className="text-xl font-bold mb-3">{value.title}</h3>
                <p className="text-muted-foreground">{value.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Disclaimer */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="glass-card p-8 border-2 border-secondary/30 mb-12"
        >
          <h2 className="text-2xl font-bold text-secondary mb-4">Important Notice</h2>
          <p className="text-muted-foreground leading-relaxed">
            We are a financial tracking and analytics platform. We are <strong>NOT</strong> financial advisors, 
            tax professionals, certified accountants, or investment advisors. All insights, recommendations, 
            and analytics provided by our platform are for <strong>informational purposes only</strong> and 
            should not be considered as professional financial, investment, or tax advice.
          </p>
          <p className="text-muted-foreground leading-relaxed mt-4">
            Always consult with qualified professionals such as certified financial planners, tax advisors, 
            or accountants before making significant financial decisions or filing taxes.
          </p>
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="text-center"
        >
          <h2 className="text-3xl font-bold mb-4 text-gradient-indigo">Ready to Get Started?</h2>
          <p className="text-muted-foreground mb-6">
            Join thousands of users who are taking control of their financial future
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Link to="/dashboard">
              <Button variant="luxury" size="lg">Start Tracking</Button>
            </Link>
            <Link to="/contact">
              <Button variant="glass" size="lg">Contact Us</Button>
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default AboutUs;

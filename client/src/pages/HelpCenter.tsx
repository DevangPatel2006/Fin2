import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Shield, Mail, Info, FileText, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

const HelpCenter = () => {
  const sections = [
    {
      icon: Shield,
      title: "Privacy Policy",
      description: "Learn how we protect and handle your financial data",
      link: "/privacy-policy",
      color: "text-primary",
    },
    {
      icon: Mail,
      title: "Contact Us",
      description: "Get in touch with our support team",
      link: "/contact",
      color: "text-secondary",
    },
    {
      icon: Info,
      title: "About Us",
      description: "Learn more about our mission and values",
      link: "/about",
      color: "text-accent",
    },
    {
      icon: FileText,
      title: "Terms of Service",
      description: "Review our terms and conditions",
      link: "/terms",
      color: "text-tertiary",
    },
  ];

  return (
    <div className="min-h-screen bg-luxury-black text-foreground">
      {/* Header */}
      <header className="border-b border-border/10 bg-background/50 backdrop-blur-xl sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4">
          <Link to="/">
            <Button variant="ghost" size="sm" className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back to Home
            </Button>
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-6">
        <div className="container mx-auto max-w-4xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-5xl md:text-6xl font-bold mb-6 text-gradient-hero">
              Help Center
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Everything you need to know about our platform, privacy, and how
              we handle your financial data
            </p>
          </motion.div>
        </div>
      </section>

      {/* Help Sections */}
      <section className="py-12 px-6 pb-20">
        <div className="container mx-auto max-w-6xl">
          <div className="grid md:grid-cols-2 gap-6">
            {sections.map((section, index) => (
              <motion.div
                key={section.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Link to={section.link}>
                  <div className="glass-card p-8 hover:neon-border-indigo transition-all duration-300 group h-full">
                    <section.icon
                      className={`h-12 w-12 mb-4 ${section.color}`}
                      style={{ background: "transparent", boxShadow: "none" }}
                    />

                    <h3 className="text-2xl font-bold mb-3 group-hover:text-gradient-indigo transition-all">
                      {section.title}
                    </h3>
                    <p className="text-muted-foreground">
                      {section.description}
                    </p>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default HelpCenter;

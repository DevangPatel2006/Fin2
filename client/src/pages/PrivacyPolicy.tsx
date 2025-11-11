import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

const PrivacyPolicy = () => {
  const sections = [
    {
      title: "Information We Collect",
      content: [
        "Personal identification information (name, email address, phone number)",
        "Financial information (transaction data, account balances, goals)",
        "Usage data and analytics",
        "Device information and IP addresses"
      ]
    },
    {
      title: "How We Use Your Information",
      content: [
        "To provide and maintain our financial tracking services",
        "To analyze spending patterns and provide insights",
        "To send notifications about your financial goals",
        "To improve our services and user experience",
        "To comply with legal obligations"
      ]
    },
    {
      title: "Data Security",
      content: [
        "We use industry-standard encryption (AES-256) for data storage",
        "All data transmission uses SSL/TLS encryption",
        "Regular security audits and penetration testing",
        "Two-factor authentication available for account protection",
        "Data is stored in secure, compliant data centers"
      ]
    },
    {
      title: "Financial Data & Tax Information",
      content: [
        "We do NOT store your banking credentials or credit card numbers",
        "Transaction data is encrypted and stored securely",
        "We do NOT provide tax advice or file taxes on your behalf",
        "Our insights are for informational purposes only",
        "You are responsible for reporting income and expenses to tax authorities",
        "Always consult a qualified tax professional for tax advice"
      ]
    },
    {
      title: "Third-Party Services",
      content: [
        "We may use third-party analytics and cloud services",
        "We do NOT sell your personal or financial data",
        "Third parties are bound by strict confidentiality agreements",
        "You can opt-out of analytics tracking in Settings"
      ]
    },
    {
      title: "Your Rights",
      content: [
        "Access your personal data at any time",
        "Request correction of inaccurate data",
        "Request deletion of your account and data",
        "Export your financial data in standard formats",
        "Opt-out of marketing communications",
        "Lodge a complaint with data protection authorities"
      ]
    },
    {
      title: "Data Retention",
      content: [
        "We retain your data as long as your account is active",
        "Financial records retained for 7 years (tax compliance)",
        "You can request data deletion at any time",
        "Some data may be retained for legal compliance"
      ]
    },
    {
      title: "Children's Privacy",
      content: [
        "Our service is NOT intended for users under 18 years old",
        "We do not knowingly collect data from minors",
        "If we discover minor data, it will be deleted immediately"
      ]
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

      {/* Content */}
      <div className="container mx-auto max-w-4xl px-6 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-5xl font-bold mb-4 text-gradient-hero">Privacy Policy</h1>
          <p className="text-muted-foreground mb-2">Last Updated: {new Date().toLocaleDateString()}</p>
          
          {/* Disclaimer */}
          <div className="glass-card p-6 my-8 border-2 border-secondary/30">
            <h2 className="text-xl font-bold text-secondary mb-3">Important Legal Disclaimer</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              This application is a financial tracking tool only. We are NOT financial advisors, tax professionals, 
              or accountants. All insights, recommendations, and analytics provided are for informational purposes 
              only and should not be considered as professional financial, investment, or tax advice. Always consult 
              with qualified professionals for financial planning, investment decisions, and tax obligations.
            </p>
          </div>

          {/* Sections */}
          <div className="space-y-8">
            {sections.map((section, index) => (
              <motion.section
                key={section.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.05 }}
                className="glass-card p-8"
              >
                <h2 className="text-2xl font-bold mb-4 text-gradient-indigo">
                  {section.title}
                </h2>
                <ul className="space-y-3">
                  {section.content.map((item, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <span className="text-accent mt-1">•</span>
                      <span className="text-muted-foreground flex-1">{item}</span>
                    </li>
                  ))}
                </ul>
              </motion.section>
            ))}
          </div>

          {/* Contact */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="glass-card p-8 mt-8"
          >
            <h2 className="text-2xl font-bold mb-4 text-gradient-indigo">Questions About Privacy?</h2>
            <p className="text-muted-foreground mb-4">
              If you have any questions about this Privacy Policy or how we handle your data, please contact us.
            </p>
            <Link to="/contact">
              <Button variant="luxury">Contact Us</Button>
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;

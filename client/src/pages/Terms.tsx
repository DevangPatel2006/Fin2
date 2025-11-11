import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

const Terms = () => {
  const sections = [
    {
      title: "Acceptance of Terms",
      content: [
        "By accessing or using our service, you agree to be bound by these Terms",
        "If you disagree with any part of the terms, you may not access the service",
        "We reserve the right to modify these terms at any time",
        "Continued use of the service constitutes acceptance of modified terms"
      ]
    },
    {
      title: "Description of Service",
      content: [
        "We provide a financial tracking and analytics platform",
        "The service includes transaction tracking, goal setting, and AI-powered insights",
        "Features may be added, modified, or removed at our discretion",
        "Service availability is not guaranteed and may experience downtime"
      ]
    },
    {
      title: "User Accounts",
      content: [
        "You must be at least 18 years old to use this service",
        "You are responsible for maintaining the security of your account",
        "You must provide accurate and complete information",
        "One account per user; account sharing is prohibited",
        "We reserve the right to terminate accounts that violate these terms"
      ]
    },
    {
      title: "Financial Information Disclaimer",
      content: [
        "We are NOT financial advisors, tax professionals, or accountants",
        "All insights and recommendations are for informational purposes only",
        "Do NOT rely on our service for professional financial or tax advice",
        "You are solely responsible for your financial decisions",
        "Consult qualified professionals for financial planning and tax matters",
        "We are not liable for any financial losses resulting from use of our service"
      ]
    },
    {
      title: "Data Accuracy",
      content: [
        "You are responsible for the accuracy of data you input",
        "We do not verify the accuracy of user-provided financial information",
        "Insights are based on the data you provide",
        "Incorrect data may result in inaccurate insights and recommendations"
      ]
    },
    {
      title: "Prohibited Uses",
      content: [
        "Do not use the service for illegal activities",
        "Do not attempt to hack, reverse engineer, or compromise security",
        "Do not share, sell, or distribute your account access",
        "Do not input false or misleading information",
        "Do not use automated tools to scrape or access the service"
      ]
    },
    {
      title: "Intellectual Property",
      content: [
        "All content, features, and functionality are owned by us",
        "You may not copy, modify, or distribute our intellectual property",
        "User-generated content remains your property",
        "You grant us a license to use your data to provide the service"
      ]
    },
    {
      title: "Limitation of Liability",
      content: [
        "Service is provided 'as is' without warranties of any kind",
        "We are not liable for any indirect, incidental, or consequential damages",
        "We are not responsible for financial losses from using the service",
        "Maximum liability is limited to fees paid in the last 12 months",
        "Some jurisdictions do not allow liability limitations"
      ]
    },
    {
      title: "Termination",
      content: [
        "You may terminate your account at any time",
        "We may terminate or suspend your account for terms violations",
        "Upon termination, your right to use the service ceases immediately",
        "Certain provisions survive termination (e.g., liability limitations)"
      ]
    },
    {
      title: "Governing Law",
      content: [
        "These terms are governed by applicable laws",
        "Disputes will be resolved through binding arbitration",
        "You waive the right to participate in class actions",
        "Legal proceedings must be filed within one year of the cause of action"
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

      <div className="container mx-auto max-w-4xl px-6 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-5xl font-bold mb-4 text-gradient-hero">Terms of Service</h1>
          <p className="text-muted-foreground mb-2">Last Updated: {new Date().toLocaleDateString()}</p>
          
          {/* Critical Disclaimer */}
          <div className="glass-card p-6 my-8 border-2 border-destructive/30">
            <h2 className="text-xl font-bold text-destructive mb-3">⚠️ Critical Legal Notice</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              <strong>NOT FINANCIAL OR TAX ADVICE:</strong> This platform provides financial tracking tools only. 
              We do NOT provide financial advice, tax advice, investment recommendations, or accounting services. 
              All information is for educational and informational purposes only. You are solely responsible for 
              your financial decisions and tax reporting obligations. Always consult licensed professionals 
              (CPAs, CFPs, tax advisors) for personalized guidance.
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
                  {index + 1}. {section.title}
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
            <h2 className="text-2xl font-bold mb-4 text-gradient-indigo">Questions About Terms?</h2>
            <p className="text-muted-foreground mb-4">
              If you have questions about these Terms of Service, please contact our legal team.
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

export default Terms;

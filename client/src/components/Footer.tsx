import React from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Github, Linkedin, Twitter } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Footer(): JSX.Element {
  const navigate = useNavigate();

  return (
    <footer
      className="relative py-16 border-t border-primary/20 bg-transparent"
      role="contentinfo"
    >
      {/* Top glow line */}
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-primary to-transparent" />

      <div className="container mx-auto px-4 relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center max-w-2xl mx-auto"
        >
          <h2
            className="
    max-w-fit mx-auto 
    text-2xl sm:text-3xl md:text-4xl 
    font-bold mb-4 text-foreground 
    leading-tight text-center
    whitespace-normal md:whitespace-nowrap
  "
          >
            Ready to <span className="text-gradient-indigo">master</span> your
            money with <span className="text-gradient-indigo">AI?</span>
          </h2>

          <p className="text-muted-foreground mb-8 text-base sm:text-lg px-3">
            Join thousands of users transforming their financial future
          </p>

          <motion.div
            animate={{ y: [0, -6, 0] }}
            transition={{ repeat: Infinity, duration: 1.6, ease: "easeInOut" }}
          >
            <Button
              variant="luxury"
              size="lg"
              className="mb-10 glow-cyan w-full sm:w-auto mx-auto"
              type="button"
              onClick={() => navigate("/signup")}
            >
              Join the Beta
            </Button>
          </motion.div>

          {/* Social Links */}
          <div className="flex justify-center gap-4 sm:gap-6 mb-8">
            <a
              href="#"
              aria-label="LinkedIn"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 sm:p-3 rounded-full bg-muted/30 hover:bg-primary/20 transition-all duration-300 hover:scale-110 group"
            >
              <Linkedin className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
            </a>

            <a
              href="#"
              aria-label="GitHub"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 sm:p-3 rounded-full bg-muted/30 hover:bg-primary/20 transition-all duration-300 hover:scale-110 group"
            >
              <Github className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
            </a>

            <a
              href="#"
              aria-label="Twitter"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 sm:p-3 rounded-full bg-muted/30 hover:bg-primary/20 transition-all duration-300 hover:scale-110 group"
            >
              <Twitter className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
            </a>
          </div>

          {/* Copyright */}
          <div className="text-xs sm:text-sm text-muted-foreground space-y-2 pb-4">
            <p>
              © {new Date().getFullYear()} FinLanza — Educational use only
            </p>
          </div>
        </motion.div>

        {/* Bottom glow effect */}
        <div
          className="absolute bottom-0 left-1/2 -translate-x-1/2 w-60 sm:w-80 h-20 bg-primary/10 blur-3xl rounded-full pointer-events-none"
          aria-hidden="true"
        />
      </div>
    </footer>
  );
}

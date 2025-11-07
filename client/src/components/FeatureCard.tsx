import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';

interface FeatureCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  delay?: number;
}

export default function FeatureCard({ icon: Icon, title, description, delay = 0 }: FeatureCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay, duration: 0.5 }}
      whileHover={{ y: -10, scale: 1.02 }}
      className="glass-card p-8 group hover:neon-border-indigo transition-all duration-500 cursor-pointer"
    >
      <div className="mb-4 inline-flex p-3 rounded-xl bg-primary/10 group-hover:bg-primary/20 transition-colors">
        <Icon className="w-8 h-8 text-primary group-hover:scale-110 transition-transform" />
      </div>
      
      <h3 className="text-xl font-semibold mb-3 text-foreground group-hover:text-gradient-indigo transition-all">
        {title}
      </h3>
      
      <p className="text-muted-foreground leading-relaxed">
        {description}
      </p>

      <div className="mt-4 h-1 w-0 bg-gradient-to-r from-primary to-secondary group-hover:w-full transition-all duration-500 rounded-full" />
    </motion.div>
  );
}

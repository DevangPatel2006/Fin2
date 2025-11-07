import { motion } from 'framer-motion';
import { Star } from 'lucide-react';

const testimonials = [
  {
    name: 'Priya Sharma',
    role: 'Software Engineer',
    content: 'I finally understand where my money goes. FinAIssist helped me identify spending patterns I never noticed.',
    rating: 5,
  },
  {
    name: 'Rahul Verma',
    role: 'Entrepreneur',
    content: 'The AI insights are game-changing. Saved ₹50,000 in three months by following smart recommendations.',
    rating: 5,
  },
  {
    name: 'Anita Desai',
    role: 'Teacher',
    content: 'Simple, elegant, and actually helpful. The financial forecast feature helps me plan for the future.',
    rating: 5,
  },
  {
    name: 'Vikram Singh',
    role: 'Marketing Manager',
    content: 'Best financial app I\'ve used. The chat feature feels like having a personal finance advisor 24/7.',
    rating: 5,
  },
  {
    name: 'Sneha Patel',
    role: 'Freelancer',
    content: 'Managing irregular income was tough. FinAIssist makes it easy with smart budgeting.',
    rating: 5,
  },
  {
    name: 'Arjun Malhotra',
    role: 'Doctor',
    content: 'Finally, a finance app that doesn\'t overwhelm me with complexity. Clean and powerful.',
    rating: 5,
  },
];

export default function TestimonialGrid() {
  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-foreground">
            Loved by <span className="text-gradient-gold">Thousands</span>
          </h2>
          <p className="text-muted-foreground text-lg">
            Join the community mastering their finances with AI
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="glass-card p-6 hover:neon-border-indigo transition-all duration-300"
            >
              <div className="flex gap-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-gold text-gold" />
                ))}
              </div>
              
              <p className="text-foreground/90 mb-4 italic">
                "{testimonial.content}"
              </p>
              
              <div className="border-t border-white/10 pt-4">
                <p className="font-semibold text-foreground">{testimonial.name}</p>
                <p className="text-sm text-muted-foreground">{testimonial.role}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

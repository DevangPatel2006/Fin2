import { motion } from 'framer-motion';

const shapes = [
  {
    id: 1,
    gradient: 'from-primary/20 via-violet/20 to-transparent',
    size: 'w-96 h-96',
    position: 'top-20 -left-20',
    duration: 12,
    delay: 0,
  },
  {
    id: 2,
    gradient: 'from-secondary/20 via-primary/20 to-transparent',
    size: 'w-[500px] h-[500px]',
    position: 'top-40 right-0',
    duration: 15,
    delay: 2,
  },
  {
    id: 3,
    gradient: 'from-accent/20 via-primary/20 to-transparent',
    size: 'w-80 h-80',
    position: 'bottom-40 left-20',
    duration: 13,
    delay: 1,
  },
  {
    id: 4,
    gradient: 'from-violet/20 via-secondary/20 to-transparent',
    size: 'w-96 h-96',
    position: 'bottom-20 right-40',
    duration: 14,
    delay: 3,
  },
  {
    id: 5,
    gradient: 'from-primary/15 via-accent/15 to-transparent',
    size: 'w-64 h-64',
    position: 'top-1/3 left-1/4',
    duration: 16,
    delay: 4,
  },
];

export default function FloatingGradients() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {shapes.map((shape) => (
        <motion.div
          key={shape.id}
          className={`absolute ${shape.size} ${shape.position} bg-gradient-radial ${shape.gradient} rounded-full blur-3xl opacity-50`}
          animate={{
            y: [0, -30, 0],
            x: [0, 15, 0],
            scale: [1, 1.1, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: shape.duration,
            delay: shape.delay,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      ))}

      {/* Vignette overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-transparent to-background opacity-60" />
      <div className="absolute inset-0 bg-gradient-to-r from-background via-transparent to-background opacity-40" />
    </div>
  );
}

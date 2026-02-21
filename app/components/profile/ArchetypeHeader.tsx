import { motion } from 'framer-motion';

interface ArchetypeHeaderProps {
  name: string;
  coreSentence: string;
}

export function ArchetypeHeader({ name, coreSentence }: ArchetypeHeaderProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className="relative text-center py-12 px-6 rounded-2xl overflow-hidden"
      style={{
        background: 'radial-gradient(ellipse at 50% 40%, var(--color-accent-glow) 0%, var(--color-paper-warm) 70%)',
      }}
    >
      {/* Decorative concentric circles */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        {[180, 240, 300].map((size) => (
          <div
            key={size}
            className="absolute rounded-full border border-accent/6"
            style={{ width: size, height: size }}
          />
        ))}
      </div>

      <h1 className="relative z-10 text-[28px] sm:text-4xl font-display text-ink leading-tight">{name}</h1>
      <div className="w-10 h-0.5 bg-accent/30 mx-auto mt-4 mb-3" />
      <p className="relative z-10 text-lg sm:text-xl text-ink-soft italic leading-relaxed max-w-90 mx-auto">
        {coreSentence}
      </p>
    </motion.div>
  );
}

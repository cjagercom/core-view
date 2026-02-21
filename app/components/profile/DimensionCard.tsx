import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import type { DimensionScore } from '~/types/profile';
import { dimensions } from '~/data/dimensions';
import { motion, AnimatePresence } from 'framer-motion';

interface DimensionCardProps {
  score: DimensionScore;
  description?: string;
}

export function DimensionCard({ score, description }: DimensionCardProps) {
  const [expanded, setExpanded] = useState(false);
  const dim = dimensions.find((d) => d.id === score.dimensionId);
  if (!dim) return null;

  return (
    <button
      className="w-full text-left rounded-(--radius-card) border border-paper-dark bg-white p-4 transition-all"
      onClick={() => setExpanded(!expanded)}
    >
      <div className="flex justify-between items-center mb-3">
        <span className="font-medium text-ink">{dim.name}</span>
        <ChevronDown
          size={20}
          className={`text-ink-muted transition-transform duration-300 ${expanded ? 'rotate-180' : ''}`}
        />
      </div>
      <div className="flex justify-between text-xs text-ink-muted mb-2">
        <span>{dim.leftPole}</span>
        <span>{dim.rightPole}</span>
      </div>
      <div
        className="relative h-3 rounded-full overflow-visible"
        style={{
          background:
            'linear-gradient(to right, var(--color-accent-light), var(--color-paper-warm), var(--color-warm-light))',
        }}
      >
        <div
          className="absolute top-1/2 -translate-y-1/2 w-4.5 h-4.5 rounded-full bg-accent border-2 border-white transition-all"
          style={{
            left: `calc(${score.score}% - 9px)`,
            boxShadow: '0 1px 4px rgba(17, 94, 89, 0.3)',
          }}
        />
      </div>
      <div className="text-center mt-1.5">
        <span className="text-xs font-medium text-ink-soft">{score.score}</span>
      </div>
      <AnimatePresence>
        {expanded && description && (
          <motion.p
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="mt-3 text-sm text-ink-soft leading-relaxed"
          >
            {description}
          </motion.p>
        )}
      </AnimatePresence>
    </button>
  );
}

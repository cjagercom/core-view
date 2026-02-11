import { AnimatePresence, motion } from 'framer-motion';
import type { ReactNode } from 'react';

interface StepTransitionProps {
  stepKey: string;
  children: ReactNode;
}

export function StepTransition({ stepKey, children }: StepTransitionProps) {
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={stepKey}
        initial={{ opacity: 0, x: 40 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -40 }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}

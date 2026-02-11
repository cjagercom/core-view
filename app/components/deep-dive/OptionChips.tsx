import { motion } from 'framer-motion';

interface OptionChipsProps {
  options: string[];
  onSelect: (option: string) => void;
  disabled?: boolean;
}

export function OptionChips({ options, onSelect, disabled }: OptionChipsProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.2 }}
      className="flex flex-col gap-2"
    >
      {options.map((option, i) => (
        <motion.button
          key={i}
          whileTap={{ scale: 0.97 }}
          onClick={() => onSelect(option)}
          disabled={disabled}
          className="w-full px-4 py-3 rounded-xl border border-paper-dark text-sm text-ink text-center
                     hover:border-accent hover:text-accent transition-colors
                     disabled:opacity-50 disabled:cursor-not-allowed
                     active:bg-accent active:text-white active:border-accent"
        >
          {option}
        </motion.button>
      ))}
    </motion.div>
  );
}

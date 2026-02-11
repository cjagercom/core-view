import { Link } from 'react-router';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import { Button } from '~/components/ui/Button';

export function FeedbackComplete() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center min-h-[60vh] text-center px-5"
    >
      <div className="w-16 h-16 rounded-full bg-accent-glow flex items-center justify-center mb-6">
        <Check size={32} className="text-accent" />
      </div>
      <h1 className="font-display text-2xl text-ink mb-3">Thank you</h1>
      <p className="text-ink-soft max-w-xs mb-2">Your perspective has been recorded.</p>
      <p className="text-ink-muted text-sm max-w-xs mb-10">It's completely anonymous.</p>

      <p className="text-ink-soft text-sm mb-4">Curious about your own core traits?</p>
      <Link to="/" className="w-full max-w-xs">
        <Button>Discover your profile</Button>
      </Link>
    </motion.div>
  );
}

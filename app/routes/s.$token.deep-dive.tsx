import { useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router';
import type { MetaFunction } from 'react-router';
import { DeepDiveChat, type LLMCompletion } from '~/components/deep-dive/DeepDiveChat';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, CheckCircle } from 'lucide-react';
import { Button } from '~/components/ui/Button';

export const meta: MetaFunction = () => [{ name: 'robots', content: 'noindex, nofollow' }];

export default function DeepDivePage() {
  const { token } = useParams();
  const navigate = useNavigate();
  const [completed, setCompleted] = useState(false);
  const [result, setResult] = useState<LLMCompletion | null>(null);

  const handleComplete = useCallback((completion: LLMCompletion) => {
    setResult(completion);
    setCompleted(true);
  }, []);

  if (!token) {
    return (
      <div className="min-h-dvh bg-paper flex items-center justify-center">
        <p className="text-ink-muted">Invalid session</p>
      </div>
    );
  }

  return (
    <div className="min-h-dvh bg-paper">
      <div className="w-full max-w-[480px] mx-auto px-5 flex flex-col" style={{ height: '100dvh' }}>
        {/* Header */}
        <div className="flex items-center gap-3 py-4 border-b border-paper-dark">
          <button
            onClick={() => navigate(`/s/${token}`)}
            className="p-1 text-ink-muted hover:text-ink transition-colors"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="font-display text-lg text-ink">Deep-dive</h1>
            <p className="text-xs text-ink-muted">Exploring the patterns behind your answers</p>
          </div>
        </div>

        {/* Chat or completion */}
        <AnimatePresence mode="wait">
          {!completed ? (
            <motion.div
              key="chat"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex-1 min-h-0 flex flex-col"
            >
              <DeepDiveChat sessionId={token} endpoint="deep-dive" onComplete={handleComplete} />
            </motion.div>
          ) : (
            <motion.div
              key="done"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex-1 flex flex-col items-center justify-center gap-6 py-12"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
              >
                <CheckCircle size={48} className="text-accent" />
              </motion.div>
              <div className="text-center">
                <h2 className="font-display text-xl text-ink mb-2">Profile updated</h2>
                <p className="text-sm text-ink-soft max-w-[300px]">
                  Your scores have been refined based on our conversation.
                  {result?.archetype_note && (
                    <span className="block mt-2 text-ink-muted text-xs">{result.archetype_note}</span>
                  )}
                </p>
              </div>
              <Button onClick={() => navigate(`/s/${token}`, { replace: true })}>View updated profile</Button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

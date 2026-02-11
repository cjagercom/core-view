import { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import { FeedbackForm } from '~/components/feedback/FeedbackForm';
import { FeedbackComplete } from '~/components/feedback/FeedbackComplete';
import { Button } from '~/components/ui/Button';
import type { FeedbackQuestion, FeedbackResponse } from '~/types/feedback';
import { motion } from 'framer-motion';

type Phase = 'intro' | 'questions' | 'open_text' | 'submitted';

export default function FeedbackPage() {
  const { token } = useParams();
  const [questions, setQuestions] = useState<FeedbackQuestion[]>([]);
  const [loading, setLoading] = useState(true);
  const [inactive, setInactive] = useState(false);
  const [error, setError] = useState(false);
  const [phase, setPhase] = useState<Phase>('intro');
  const [submitting, setSubmitting] = useState(false);
  const [responses, setResponses] = useState<FeedbackResponse[]>([]);
  const [openText, setOpenText] = useState('');

  useEffect(() => {
    if (!token) return;

    async function loadForm() {
      try {
        const res = await fetch(`/api/feedback/${token}`);
        if (res.status === 410) {
          setInactive(true);
          setLoading(false);
          return;
        }
        if (!res.ok) {
          setError(true);
          setLoading(false);
          return;
        }
        const data = await res.json();
        setQuestions(data.questions);
      } catch {
        setError(true);
      } finally {
        setLoading(false);
      }
    }

    loadForm();
  }, [token]);

  function handleQuestionsComplete(feedbackResponses: FeedbackResponse[]) {
    setResponses(feedbackResponses);
    setPhase('open_text');
  }

  async function handleFinalSubmit() {
    setSubmitting(true);
    try {
      const res = await fetch(`/api/feedback/${token}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          responses,
          openText: openText.trim() || undefined,
        }),
      });
      if (res.ok) {
        setPhase('submitted');
      }
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-dvh bg-paper flex items-center justify-center">
        <motion.div
          className="w-12 h-12 rounded-full border-4 border-accent border-t-transparent"
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
        />
      </div>
    );
  }

  if (inactive) {
    return (
      <div className="min-h-dvh bg-paper flex items-center justify-center px-5">
        <div className="text-center">
          <h1 className="font-display text-xl text-ink mb-2">Link inactive</h1>
          <p className="text-sm text-ink-muted">This feedback link is no longer active.</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-dvh bg-paper flex items-center justify-center px-5">
        <div className="text-center">
          <h1 className="font-display text-xl text-ink mb-2">Not found</h1>
          <p className="text-sm text-ink-muted">This feedback link could not be found.</p>
        </div>
      </div>
    );
  }

  if (phase === 'submitted') {
    return <FeedbackComplete />;
  }

  if (phase === 'intro') {
    return (
      <div className="min-h-dvh bg-paper">
        <div className="w-full max-w-[480px] mx-auto px-5 py-16 flex flex-col items-center text-center">
          <p className="text-xs font-bold tracking-[0.2em] text-ink-muted mb-8">C O R E V I E W</p>

          <h1 className="font-display text-2xl text-ink mb-4">Someone asked for your perspective.</h1>
          <p className="text-ink-soft leading-relaxed mb-2">
            Answer 6 short questions about how you experience this person.
          </p>
          <p className="text-ink-soft leading-relaxed mb-2">Takes about 3 minutes.</p>
          <p className="text-ink-muted text-sm mb-10">Your answers are anonymous.</p>

          <Button onClick={() => setPhase('questions')}>Let's start</Button>
        </div>
      </div>
    );
  }

  if (phase === 'open_text') {
    return (
      <div className="min-h-dvh bg-paper">
        <div className="w-full max-w-[480px] mx-auto px-5 py-8">
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
            <h2 className="text-lg font-medium text-ink mb-2">One last thing</h2>
            <p className="text-sm text-ink-soft mb-6">
              Is there anything else you'd like to share about this person? A story, an observation, or something that
              makes them uniquely them?
            </p>

            <textarea
              value={openText}
              onChange={(e) => setOpenText(e.target.value)}
              placeholder="Optional — write as much or as little as you like..."
              className="w-full h-32 p-4 rounded-lg border border-primary/10 bg-white text-sm text-ink placeholder:text-ink-muted/50 outline-none focus:border-accent/40 resize-none"
            />

            <div className="flex flex-col gap-3 mt-6">
              <Button onClick={handleFinalSubmit} disabled={submitting}>
                {submitting ? 'Submitting...' : 'Submit feedback'}
              </Button>
              <button
                onClick={handleFinalSubmit}
                disabled={submitting}
                className="text-sm text-ink-muted hover:text-ink transition-colors"
              >
                Skip and submit
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-dvh bg-paper">
      <div className="w-full max-w-[480px] mx-auto px-5 py-8">
        <FeedbackForm questions={questions} onSubmit={handleQuestionsComplete} submitting={false} />
      </div>
    </div>
  );
}

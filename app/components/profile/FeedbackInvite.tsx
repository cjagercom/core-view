import { useState, useCallback } from 'react';
import { Button } from '~/components/ui/Button';

interface FeedbackInviteProps {
  sessionId: string;
  feedbackToken?: string | null;
  feedbackEnabled: boolean;
  feedbackLinkActive: boolean;
  feedbackCount: number;
}

export function FeedbackInvite({
  sessionId,
  feedbackToken,
  feedbackEnabled,
  feedbackLinkActive,
  feedbackCount,
}: FeedbackInviteProps) {
  const [token, setToken] = useState(feedbackToken);
  const [active, setActive] = useState(feedbackLinkActive);
  const [copied, setCopied] = useState(false);
  const [creating, setCreating] = useState(false);

  const feedbackUrl = token ? `${window.location.origin}/f/${token}` : '';

  const handleCreate = useCallback(async () => {
    setCreating(true);
    try {
      const res = await fetch(`/api/session/${sessionId}/feedback`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'create' }),
      });
      const data = await res.json();
      setToken(data.feedbackToken);
      setActive(true);
    } finally {
      setCreating(false);
    }
  }, [sessionId]);

  const handleToggle = useCallback(async () => {
    await fetch(`/api/session/${sessionId}/feedback`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'toggle' }),
    });
    setActive((prev) => !prev);
  }, [sessionId]);

  const handleShare = useCallback(async () => {
    const shareText = `Hey! I just did this personality assessment and I'm curious how you see me. Could you fill in this 3-minute questionnaire? It's anonymous. ${feedbackUrl}`;

    if (navigator.share) {
      try {
        await navigator.share({ title: 'Core-View Feedback', text: shareText });
        return;
      } catch {
        /* fall through */
      }
    }

    await navigator.clipboard.writeText(feedbackUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [feedbackUrl]);

  if (!feedbackEnabled && !token) {
    return (
      <div className="mt-8 p-5 rounded-xl bg-white border border-primary/10">
        <h3 className="text-lg font-medium text-primary mb-2">Get feedback</h3>
        <p className="text-sm text-muted mb-4">
          Curious how others see you? Share a short questionnaire with people who know you. Their answers are anonymous
          — you'll only see aggregated results after 3+ responses.
        </p>
        <Button onClick={handleCreate} variant="secondary" disabled={creating}>
          {creating ? 'Creating...' : 'Create feedback link'}
        </Button>
      </div>
    );
  }

  return (
    <div className="mt-8 p-5 rounded-xl bg-white border border-primary/10">
      <h3 className="text-lg font-medium text-primary mb-2">Feedback</h3>

      {feedbackCount > 0 && (
        <p className="text-sm text-muted mb-3">
          {feedbackCount} {feedbackCount === 1 ? 'response' : 'responses'} received
          {feedbackCount < 3 && ` — ${3 - feedbackCount} more needed to see results`}
        </p>
      )}

      {active ? (
        <div className="space-y-3">
          <div className="flex items-center gap-2 p-3 bg-surface rounded-lg">
            <input readOnly value={feedbackUrl} className="flex-1 text-xs text-muted bg-transparent outline-none" />
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={async () => {
                await navigator.clipboard.writeText(feedbackUrl);
                setCopied(true);
                setTimeout(() => setCopied(false), 2000);
              }}
              className="flex-1 min-w-30 px-4 py-2.5 rounded-lg border border-ink/10 text-sm font-medium text-ink hover:bg-paper-dark/30 transition-colors"
            >
              {copied ? 'Copied!' : 'Copy link'}
            </button>
            {navigator.share && (
              <Button onClick={handleShare} variant="secondary" className="flex-1 min-w-30">
                Share
              </Button>
            )}
            <button
              onClick={handleToggle}
              className="text-xs text-muted hover:text-primary transition-colors px-3 py-2.5"
            >
              Disable link
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          <p className="text-sm text-muted">Feedback link is currently disabled.</p>
          <button onClick={handleToggle} className="text-sm text-accent hover:text-primary transition-colors">
            Re-enable feedback link
          </button>
        </div>
      )}
    </div>
  );
}

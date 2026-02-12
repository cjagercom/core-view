import { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router';
import type { MetaFunction } from 'react-router';

export const meta: MetaFunction = () => [
  { title: 'Your Profile \u2014 Core-View' },
  { name: 'robots', content: 'noindex, nofollow' },
];
import { archetypes } from '~/data/archetypes';
import { ArchetypeHeader } from '~/components/profile/ArchetypeHeader';
import { RadarChart } from '~/components/profile/RadarChart';
import { DimensionCard } from '~/components/profile/DimensionCard';
import { StreamingProfileText } from '~/components/profile/StreamingProfileText';
import { SaveLinkPrompt } from '~/components/profile/SaveLinkPrompt';
import { FeedbackInvite } from '~/components/profile/FeedbackInvite';
import { ShareButton } from '~/components/profile/ShareButton';
import { Footer } from '~/components/ui/Footer';
import { Button } from '~/components/ui/Button';
import { aggregateFeedback } from '~/engine/feedback-scoring';
import { Sparkles, AlertTriangle, ArrowRight, Lock, Trash2, Check } from 'lucide-react';
import { Link } from 'react-router';
import type { DimensionScore } from '~/types/profile';
import type { DimensionId } from '~/types/questions';
import type { FeedbackResponse } from '~/types/feedback';
import { motion } from 'framer-motion';

interface SessionData {
  id: string;
  status: string;
  current_step: string;
  session_number: number;
  responses: unknown[];
  dimension_accumulator: Record<DimensionId, { sum: number; count: number }>;
  profile: {
    dimensions: DimensionScore[];
    archetypeId: string;
    archetypeName: string;
    archetypeDistance: number;
    completedAt: string;
  } | null;
  llm_profile_text: string | null;
  profile_text_versions: {
    text: string;
    generatedAt: string;
    feedbackCount: number;
    hasDeepDive: boolean;
    hasReconciliation: boolean;
  }[];
  writing_text: string | null;
  feedback_token: string | null;
  feedback_enabled: boolean;
  feedback_responses: FeedbackResponse[][] | null;
  feedback_link_active: boolean;
  deep_dive_adjustments: unknown | null;
  deep_dive_messages: unknown[];
  reconciliation_adjustments: unknown | null;
  reconciliation_messages: unknown[];
  profile_v1: {
    dimensions: DimensionScore[];
    archetypeId: string;
    archetypeName: string;
  } | null;
  profile_v2: {
    dimensions: DimensionScore[];
    archetypeId: string;
    archetypeName: string;
  } | null;
  finalized_at: string | null;
  final_profile_text: string | null;
}

export default function SessionPage() {
  const { token } = useParams();
  const navigate = useNavigate();
  const [session, setSession] = useState<SessionData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [finalizing, setFinalizing] = useState(false);
  const [finalText, setFinalText] = useState('');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showFinalizeConfirm, setShowFinalizeConfirm] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [deleted, setDeleted] = useState(false);

  useEffect(() => {
    if (!token) return;

    async function loadSession() {
      try {
        const res = await fetch(`/api/session?id=${token}`);
        if (!res.ok) {
          setError('Session not found');
          setLoading(false);
          return;
        }
        const data = await res.json();
        const sess = data.session as SessionData;

        // If session is complete but profile hasn't been computed yet,
        // trigger profile computation via the profile API endpoint
        if (!sess.profile && sess.status !== 'in_progress') {
          try {
            const profileRes = await fetch(`/api/session/${token}/profile`);
            // Cancel any streaming body to avoid hanging
            if (profileRes.body) {
              await profileRes.body.cancel().catch(() => {});
            }
          } catch {
            // Profile computation may have partially succeeded
          }
          // Re-fetch session — profile should now be saved in DB
          try {
            const refetch = await fetch(`/api/session?id=${token}`);
            if (refetch.ok) {
              const refreshed = await refetch.json();
              setSession(refreshed.session);
              setLoading(false);
              return;
            }
          } catch {
            // Fall through to use original session data
          }
        }

        setSession(sess);
      } catch {
        setError('Failed to load session');
      } finally {
        setLoading(false);
      }
    }

    loadSession();
  }, [token]);

  // Inject a dynamic PWA manifest so "Add to Home Screen" opens this profile
  useEffect(() => {
    if (!token) return;
    const link = document.createElement('link');
    link.rel = 'manifest';
    link.href = `/api/manifest/${token}`;
    document.head.appendChild(link);
    return () => {
      document.head.removeChild(link);
    };
  }, [token]);

  const handleFinalize = useCallback(async () => {
    if (!token) return;
    setShowFinalizeConfirm(false);
    setFinalizing(true);

    try {
      const res = await fetch(`/api/session/${token}/finalize`, {
        method: 'POST',
      });

      if (!res.ok) {
        setFinalizing(false);
        return;
      }

      const contentType = res.headers.get('Content-Type') || '';
      if (contentType.includes('application/json')) {
        const data = await res.json();
        setFinalText(data.finalProfileText || '');
        setFinalizing(false);
        setSession((prev) =>
          prev
            ? {
                ...prev,
                finalized_at: data.finalizedAt || new Date().toISOString(),
                final_profile_text: data.finalProfileText,
              }
            : prev,
        );
        return;
      }

      // Stream the response
      const reader = res.body?.getReader();
      if (!reader) {
        setFinalizing(false);
        return;
      }

      const decoder = new TextDecoder();
      let accumulated = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        accumulated += decoder.decode(value, { stream: true });
        setFinalText(accumulated);
      }

      setFinalizing(false);
      setSession((prev) =>
        prev ? { ...prev, finalized_at: new Date().toISOString(), final_profile_text: accumulated } : prev,
      );
    } catch {
      setFinalizing(false);
    }
  }, [token]);

  const handleDelete = useCallback(async () => {
    if (!token) return;
    setShowDeleteConfirm(false);
    setDeleting(true);

    try {
      const res = await fetch(`/api/session/${token}/delete`, {
        method: 'DELETE',
      });
      if (res.ok) {
        setDeleted(true);
        setTimeout(() => navigate('/'), 2000);
      }
    } finally {
      setDeleting(false);
    }
  }, [token, navigate]);

  if (deleted) {
    return (
      <div className="min-h-dvh bg-paper flex items-center justify-center px-5">
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center">
          <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center mx-auto mb-4">
            <Check size={24} className="text-accent" />
          </div>
          <h1 className="font-display text-xl text-ink mb-2">Profile deleted</h1>
          <p className="text-sm text-ink-muted">All data has been removed. Redirecting...</p>
        </motion.div>
      </div>
    );
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

  if (error || !session) {
    return (
      <div className="min-h-dvh bg-paper flex items-center justify-center px-5">
        <div className="text-center">
          <h1 className="font-display text-xl text-ink mb-2">Session not found</h1>
          <p className="text-sm text-ink-muted">{error || 'This session link may be invalid or expired.'}</p>
        </div>
      </div>
    );
  }

  if (session.status === 'in_progress') {
    navigate(`/session/${session.current_step}`, { replace: true });
    return null;
  }

  const profile = session.profile;
  if (!profile) {
    return (
      <div className="min-h-dvh bg-paper flex items-center justify-center px-5">
        <div className="flex flex-col items-center gap-4">
          <motion.div
            className="w-10 h-10 rounded-full border-4 border-accent border-t-transparent"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          />
          <p className="text-sm text-ink-muted">Computing your profile...</p>
        </div>
      </div>
    );
  }

  const archetype = archetypes.find((a) => a.id === profile.archetypeId);
  if (!archetype) {
    return (
      <div className="min-h-dvh bg-paper flex items-center justify-center px-5">
        <p className="text-ink-muted">Unknown archetype</p>
      </div>
    );
  }

  const scores = profile.dimensions;
  const feedbackResponses = session.feedback_responses || [];
  const flatFeedback = feedbackResponses.flat();
  const hasFeedback = flatFeedback.length >= 3;
  const feedbackScores = hasFeedback ? aggregateFeedback(flatFeedback) : null;
  const sessionUrl = `${typeof window !== 'undefined' ? window.location.origin : ''}/s/${token}`;

  // Determine previous scores for ghost overlay (pre-deep-dive or pre-reconciliation snapshot)
  const previousScores = session.profile_v2?.dimensions ?? session.profile_v1?.dimensions ?? undefined;
  const hasDeepDive = !!session.deep_dive_adjustments;
  const hasReconciliation = !!session.reconciliation_adjustments;
  const isFinalized = !!session.finalized_at;

  // Check if the latest profile text version matches current journey state
  const versions = session.profile_text_versions || [];
  const latestVersion = versions.length > 0 ? versions[versions.length - 1] : null;
  const versionIsFresh =
    latestVersion &&
    latestVersion.feedbackCount === feedbackResponses.length &&
    latestVersion.hasDeepDive === hasDeepDive &&
    latestVersion.hasReconciliation === hasReconciliation;
  const profileCachedText = versionIsFresh ? latestVersion.text : undefined;

  // Render the profile text content based on finalization state
  const profileTextContent = isFinalized ? session.final_profile_text || finalText : null;

  return (
    <div className="min-h-dvh bg-paper pb-24">
      <div className="w-full max-w-[480px] mx-auto px-5">
        {/* Top bar: logo + finalized badge */}
        <div className="flex items-center justify-between pt-5 pb-2">
          <Link to="/" className="flex items-center gap-2 text-ink-muted hover:text-ink transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" className="w-6 h-6">
              <polygon
                points="16,2 29,11 25,27 7,27 3,11"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinejoin="round"
              />
              <polygon points="16,8 23,14 21,23 11,23 9,14" fill="#0D9488" opacity="0.3" />
            </svg>
            <span className="text-xs font-bold tracking-[0.15em] uppercase">Core-View</span>
          </Link>
          {isFinalized && (
            <div className="flex items-center gap-1.5 text-xs text-ink-muted">
              <Lock size={11} />
              <span>
                {session.finalized_at
                  ? new Date(session.finalized_at).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    })
                  : 'Finalized'}
              </span>
            </div>
          )}
        </div>

        <ArchetypeHeader name={archetype.name} coreSentence={archetype.coreSentence} />

        <RadarChart scores={scores} previousScores={previousScores} feedbackScores={feedbackScores ?? undefined} />

        <div className="mt-8">
          {/* Show final profile text if finalized, otherwise streaming profile text */}
          {isFinalized && profileTextContent ? (
            <FinalProfileText text={profileTextContent} />
          ) : finalizing ? (
            <FinalizingIndicator text={finalText} />
          ) : (
            <StreamingProfileText sessionId={token!} cachedText={profileCachedText} />
          )}
        </div>

        <div className="mt-8 flex flex-col gap-3">
          {scores.map((score) => {
            const feedbackValue = feedbackScores?.[score.dimensionId];
            return (
              <div key={score.dimensionId}>
                <DimensionCard score={score} description={archetype.dimensionTexts[score.dimensionId]} />
                {hasFeedback && feedbackValue !== undefined && Math.abs(score.score - feedbackValue) > 10 && (
                  <p className="text-xs text-ink-muted mt-1 ml-1">
                    You see yourself at {score.score}, others see {feedbackValue}
                  </p>
                )}
              </div>
            );
          })}
        </div>

        <div className="mt-8">
          <h3 className="font-display text-lg text-ink mb-3">Strengths</h3>
          <ul className="flex flex-col gap-2">
            {archetype.strengths.map((s) => (
              <li key={s} className="flex items-start gap-2 text-sm text-ink-soft">
                <Sparkles size={16} className="text-accent mt-0.5 shrink-0" />
                <span>{s}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-6">
          <h3 className="font-display text-lg text-ink mb-3">Watch-outs</h3>
          <ul className="flex flex-col gap-2">
            {archetype.watchOuts.map((w) => (
              <li key={w} className="flex items-start gap-2 text-sm text-ink-soft">
                <AlertTriangle size={16} className="text-warm mt-0.5 shrink-0" />
                <span>{w}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-10">
          <SaveLinkPrompt sessionUrl={sessionUrl} />
        </div>

        {/* Journey section — only when not finalized */}
        {!isFinalized && (
          <JourneySection
            token={token!}
            hasDeepDive={hasDeepDive}
            hasFeedback={hasFeedback}
            hasReconciliation={hasReconciliation}
            feedbackResponses={feedbackResponses}
            session={session}
            navigate={navigate}
            showFinalizeConfirm={showFinalizeConfirm}
            setShowFinalizeConfirm={setShowFinalizeConfirm}
            handleFinalize={handleFinalize}
          />
        )}

        {/* Delete section — always visible */}
        <div className="mt-12 mb-8 pt-8 border-t border-primary/5">
          {showDeleteConfirm ? (
            <div className="rounded-xl border border-red-200 bg-red-50 p-5">
              <p className="text-sm text-ink font-medium mb-2">Delete your profile permanently?</p>
              <p className="text-xs text-ink-muted mb-4">
                This will remove all your data from our database. Your profile URL will stop working. This cannot be
                undone.
              </p>
              <div className="flex gap-2">
                <button
                  onClick={handleDelete}
                  disabled={deleting}
                  className="px-4 py-2.5 rounded-lg bg-red-600 text-white text-sm font-medium hover:bg-red-700 transition-colors disabled:opacity-50"
                >
                  {deleting ? 'Deleting...' : 'Yes, delete everything'}
                </button>
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="px-4 py-2 text-sm text-ink-muted hover:text-ink transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <button
              onClick={() => setShowDeleteConfirm(true)}
              className="flex items-center gap-2 text-sm text-ink-muted hover:text-red-600 transition-colors"
            >
              <Trash2 size={14} />
              Delete profile and all data
            </button>
          )}
        </div>

        <Footer />
      </div>

      <ShareButton sessionId={token} />
    </div>
  );
}

/** Structured journey section showing recommended flow */
function JourneySection({
  token,
  hasDeepDive,
  hasFeedback,
  hasReconciliation,
  feedbackResponses,
  session,
  navigate,
  showFinalizeConfirm,
  setShowFinalizeConfirm,
  handleFinalize,
}: {
  token: string;
  hasDeepDive: boolean;
  hasFeedback: boolean;
  hasReconciliation: boolean;
  feedbackResponses: unknown[];
  session: SessionData;
  navigate: (path: string) => void;
  showFinalizeConfirm: boolean;
  setShowFinalizeConfirm: (v: boolean) => void;
  handleFinalize: () => void;
}) {
  // Determine which step is the recommended next action
  const hasFeedbackLink = !!session.feedback_token;
  const pendingReconciliation = hasFeedback && !hasReconciliation;
  const allDone = hasDeepDive && (!hasFeedback || hasReconciliation);

  type StepState = 'done' | 'active' | 'upcoming' | 'optional';

  const deepDiveState: StepState = hasDeepDive ? 'done' : 'active';
  const feedbackState: StepState = hasFeedback ? 'done' : hasDeepDive ? 'active' : 'optional';
  const reconciliationState: StepState = hasReconciliation
    ? 'done'
    : hasFeedback
      ? hasDeepDive
        ? 'active'
        : 'upcoming'
      : 'optional';

  return (
    <div className="mt-10">
      <h3 className="font-display text-lg text-ink mb-2">Your journey</h3>
      <p className="text-sm text-ink-muted mb-5">
        {allDone
          ? "All steps completed. You can finalize your profile whenever you're ready."
          : "Complete these steps for the richest possible profile. Finalize when you're done."}
      </p>

      <div className="flex flex-col gap-3">
        {/* Step 1: Deep-dive */}
        <JourneyStep
          number={1}
          title="Deep-dive conversation"
          description={
            hasDeepDive
              ? 'Scores refined based on conversation'
              : 'Refine your scores in a conversation with an AI coach'
          }
          state={deepDiveState}
          action={!hasDeepDive ? () => navigate(`/s/${token}/deep-dive`) : undefined}
          actionLabel="Start deep-dive"
        />

        {/* Step 2: Collect feedback */}
        <JourneyStep
          number={2}
          title="Collect feedback from others"
          description={
            hasFeedback
              ? `${feedbackResponses.length} responses received`
              : hasFeedbackLink
                ? 'Share your feedback link — need 3+ responses'
                : 'Share a short questionnaire with people who know you'
          }
          state={feedbackState}
          optional
        />

        {/* Show feedback invite inline when it's the right time */}
        {!hasFeedback && (
          <div className="ml-9">
            <FeedbackInvite
              sessionId={token}
              feedbackToken={session.feedback_token}
              feedbackEnabled={session.feedback_enabled}
              feedbackLinkActive={session.feedback_link_active}
              feedbackCount={feedbackResponses.length}
            />
          </div>
        )}

        {/* Step 3: Reconciliation */}
        <JourneyStep
          number={3}
          title="Reconcile feedback"
          description={
            hasReconciliation
              ? "Profile integrates self + others' perception"
              : !hasFeedback
                ? 'Available after collecting 3+ feedback responses'
                : 'Explore gaps between how you see yourself and how others see you'
          }
          state={reconciliationState}
          action={pendingReconciliation ? () => navigate(`/s/${token}/reconciliation`) : undefined}
          actionLabel="Start reconciliation"
          optional
        />

        {/* Step 4: Finalize */}
        <div className="mt-3 pt-3 border-t border-primary/5">
          <JourneyStep
            number={4}
            title="Finalize your profile"
            description={
              allDone
                ? 'Lock your profile and generate a comprehensive final portrait'
                : 'Complete the steps above first for the richest final profile'
            }
            state={allDone ? 'active' : 'upcoming'}
          />
          <div className="ml-9 mt-2">
            {showFinalizeConfirm ? (
              <div className="flex flex-col gap-2">
                <p className="text-sm text-ink font-medium">
                  {allDone ? "Are you sure? This can't be undone." : 'Some steps are incomplete. Finalize anyway?'}
                </p>
                <div className="flex gap-2">
                  <Button onClick={handleFinalize}>
                    <span className="inline-flex items-center gap-2">
                      <Lock size={14} /> Finalize
                    </span>
                  </Button>
                  <button
                    onClick={() => setShowFinalizeConfirm(false)}
                    className="px-3 py-1.5 text-sm text-ink-muted hover:text-ink transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <button
                onClick={() => setShowFinalizeConfirm(true)}
                className="inline-flex items-center gap-1.5 text-sm font-medium text-accent hover:text-accent/80 transition-colors"
              >
                <Lock size={14} /> Finalize profile <ArrowRight size={14} />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

/** Single step in the journey */
function JourneyStep({
  number,
  title,
  description,
  state,
  action,
  actionLabel,
  optional,
}: {
  number: number;
  title: string;
  description: string;
  state: 'done' | 'active' | 'upcoming' | 'optional';
  action?: () => void;
  actionLabel?: string;
  optional?: boolean;
}) {
  const iconColors = {
    done: 'bg-accent text-white',
    active: 'bg-accent/10 text-accent border border-accent/30',
    upcoming: 'bg-primary/5 text-ink-muted',
    optional: 'bg-primary/5 text-ink-muted',
  };

  return (
    <div className="flex gap-3">
      <div
        className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 text-xs font-medium ${iconColors[state]}`}
      >
        {state === 'done' ? <Check size={14} /> : number}
      </div>
      <div className="flex-1 min-w-0 pt-0.5">
        <p
          className={`text-sm font-medium ${state === 'done' ? 'text-ink-muted line-through' : state === 'active' ? 'text-ink' : 'text-ink-muted'}`}
        >
          {title}
          {(state === 'optional' || optional) && (
            <span className="ml-1.5 text-xs font-normal text-ink-muted">(optional)</span>
          )}
        </p>
        <p className="text-xs text-ink-muted mt-0.5">{description}</p>
        {action && state === 'active' && (
          <button
            onClick={action}
            className="mt-2 inline-flex items-center gap-1.5 text-sm font-medium text-accent hover:text-accent/80 transition-colors"
          >
            {actionLabel} <ArrowRight size={14} />
          </button>
        )}
      </div>
    </div>
  );
}

/** Renders the finalized profile text with markdown formatting */
function FinalProfileText({ text }: { text: string }) {
  const html = text
    .split(/\n{2,}/)
    .map((p) => p.trim())
    .filter(Boolean)
    .map((p) => {
      const formatted = p
        .replace(/\*\*(.+?)\*\*/g, '<strong class="font-semibold text-ink">$1</strong>')
        .replace(/(?<!\*)\*(?!\*)(.+?)(?<!\*)\*(?!\*)/g, '<em>$1</em>');
      if (/^<strong[^>]*>.+<\/strong>$/.test(formatted.trim())) {
        return `<h4 class="font-display text-base text-ink mt-6 mb-1">${formatted}</h4>`;
      }
      return `<p>${formatted}</p>`;
    })
    .join('');

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="text-sm text-ink-soft leading-relaxed space-y-3 [&_p]:mb-0 [&_h4]:mb-0"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}

/** Shows the finalizing progress indicator with streaming text */
function FinalizingIndicator({ text }: { text: string }) {
  if (!text) {
    return (
      <motion.div className="space-y-3" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <div className="flex items-center gap-3 mb-4">
          <motion.div
            className="w-5 h-5 rounded-full border-2 border-accent border-t-transparent"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          />
          <p className="text-sm text-ink-muted">Writing your final profile...</p>
        </div>
        <div className="h-4 bg-primary/5 rounded w-full animate-pulse" />
        <div className="h-4 bg-primary/5 rounded w-5/6 animate-pulse" />
        <div className="h-4 bg-primary/5 rounded w-4/6 animate-pulse" />
      </motion.div>
    );
  }

  return <FinalProfileText text={text} />;
}

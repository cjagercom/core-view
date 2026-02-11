import { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router';
import { useSession, useSessionDispatch } from '~/lib/session-store';
import { normalizeScores } from '~/engine/scoring';
import { matchArchetype } from '~/engine/archetypes';
import { encodeProfile } from '~/engine/profile-encoder';
import { motion } from 'framer-motion';

// Pentagon points (same as favicon) centered on 120x120 viewBox
const PENTAGON_POINTS = [
  [60, 6], // top
  [114, 42], // top-right
  [93, 108], // bottom-right
  [27, 108], // bottom-left
  [6, 42], // top-left
] as const;

function buildPathData(pts: readonly (readonly [number, number])[]): string {
  return `${pts.map((p, i) => `${i === 0 ? 'M' : 'L'}${p[0]},${p[1]}`).join(' ')} Z`;
}

// Calculate total perimeter for stroke-dasharray animation
function perimeter(pts: readonly (readonly [number, number])[]): number {
  let total = 0;
  for (let i = 0; i < pts.length; i++) {
    const a = pts[i];
    const b = pts[(i + 1) % pts.length];
    total += Math.sqrt((b[0] - a[0]) ** 2 + (b[1] - a[1]) ** 2);
  }
  return total;
}

const PERIMETER = perimeter(PENTAGON_POINTS);
const PATH_D = buildPathData(PENTAGON_POINTS);

export default function ProcessingStep() {
  const session = useSession();
  const dispatch = useSessionDispatch();
  const navigate = useNavigate();
  const [showText, setShowText] = useState(false);
  const cancelledRef = useRef(false);

  // Set the current step for the progress bar
  useEffect(() => {
    dispatch({ type: 'SET_STEP', step: 'processing' });
  }, [dispatch]);

  useEffect(() => {
    const textTimer = setTimeout(() => setShowText(true), 1000);
    return () => clearTimeout(textTimer);
  }, []);

  useEffect(() => {
    cancelledRef.current = false;

    async function processAndNavigate() {
      // Minimum animation duration
      await new Promise((resolve) => setTimeout(resolve, 3000));
      if (cancelledRef.current) return;

      const token = sessionStorage.getItem('core-view_session_token');

      // Save final step data to DB and WAIT for it to complete
      if (token) {
        try {
          await fetch(`/api/session/${token}/step`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              step: 'processing',
              responses: session.responses,
              dimensionAccumulator: session.dimensionAccumulator,
            }),
          });
        } catch {
          // Continue to navigation even if save fails
        }
      }

      if (cancelledRef.current) return;

      if (token) {
        navigate(`/s/${token}`, { replace: true });
      } else {
        // Fallback to Phase 1 URL-encoded profile
        const scores = normalizeScores(session.dimensionAccumulator);
        const archetype = matchArchetype(scores);
        const profile = {
          dimensions: scores,
          archetype,
          completedAt: new Date().toISOString(),
        };
        const encodedToken = encodeProfile(profile);
        navigate(`/profile/${encodedToken}`, { replace: true });
      }
    }

    processAndNavigate();
    return () => {
      cancelledRef.current = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [navigate, session.dimensionAccumulator, session.responses]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-8">
      <svg width="120" height="120" viewBox="0 0 120 120" fill="none">
        {/* Pentagon stroke drawing animation */}
        <motion.path
          d={PATH_D}
          stroke="var(--color-accent-mid)"
          strokeWidth="2.5"
          strokeLinejoin="round"
          fill="none"
          initial={{ strokeDasharray: PERIMETER, strokeDashoffset: PERIMETER }}
          animate={{ strokeDashoffset: 0 }}
          transition={{ duration: 2.5, ease: 'easeInOut' }}
        />
        {/* Interior fill fades in after stroke completes */}
        <motion.path
          d={PATH_D}
          fill="var(--color-accent-mid)"
          stroke="none"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.15 }}
          transition={{ delay: 2.0, duration: 0.5, ease: 'easeIn' }}
        />
      </svg>

      <motion.p
        className="text-sm text-ink-muted"
        initial={{ opacity: 0 }}
        animate={{ opacity: showText ? 1 : 0 }}
        transition={{ duration: 0.5 }}
      >
        Building your profile...
      </motion.p>
    </div>
  );
}

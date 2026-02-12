import { useState, useCallback } from 'react';
import { Link, useNavigate } from 'react-router';
import type { MetaFunction } from 'react-router';
import { Clock, ShieldOff, Link as LinkIcon, ArrowRight } from 'lucide-react';

export const meta: MetaFunction = () => [
  { title: "Core-View \u2014 Discover who you are beneath everything you've learned" },
  {
    name: 'description',
    content:
      "A 12-minute personality assessment that goes deeper than Myers-Briggs. Based on who you were as a child, not who you've become. No account needed.",
  },
];
import { Button } from '~/components/ui/Button';
import { Footer } from '~/components/ui/Footer';
import { HomeSharePanel } from '~/components/ui/HomeSharePanel';
import { motion } from 'framer-motion';

function PentagonIcon() {
  return (
    <motion.svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 32 32"
      className="w-12 h-12"
      animate={{ scale: [1, 1.03, 1] }}
      transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
    >
      <polygon
        points="16,2 29,11 25,27 7,27 3,11"
        fill="none"
        stroke="#115E59"
        strokeWidth="2.5"
        strokeLinejoin="round"
      />
      <polygon points="16,8 23,14 21,23 11,23 9,14" fill="#0D9488" opacity="0.3" />
    </motion.svg>
  );
}

const SELLING_POINTS = [
  { icon: Clock, title: '12 minutes, no account needed', desc: 'A quick guided session, entirely in your browser' },
  {
    icon: ShieldOff,
    title: 'Based on who you already were as a child',
    desc: 'Bypass professional conditioning, find your core',
  },
  {
    icon: LinkIcon,
    title: 'Share your profile with a single link',
    desc: 'Your profile is saved with a personal link',
  },
];

const STEPS = [
  { num: '\u2460', text: 'Answer a few warm-up questions' },
  { num: '\u2461', text: 'Revisit who you were as a child' },
  { num: '\u2462', text: 'Rank what matters to you under time pressure' },
  { num: '\u2463', text: 'Reflect in your own words' },
  { num: '\u2464', text: 'Receive your personalized profile' },
];

export default function LandingPage() {
  const navigate = useNavigate();
  const [starting, setStarting] = useState(false);

  const handleStart = useCallback(async () => {
    setStarting(true);
    try {
      const res = await fetch('/api/session', { method: 'POST' });
      if (res.ok) {
        const { token } = await res.json();
        sessionStorage.setItem('core-view_session_token', token);
      }
    } catch {
      // If API fails, continue without persistence
    }
    navigate('/session/warmup');
  }, [navigate]);

  return (
    <div className="min-h-dvh bg-paper">
      <div className="w-full max-w-[480px] mx-auto px-5 py-12 flex flex-col items-center">
        {/* Hero */}
        <PentagonIcon />
        <h1 className="mt-6 text-sm font-bold tracking-[0.2em] text-ink uppercase">Core-View</h1>
        <p className="mt-4 text-2xl sm:text-[28px] font-display text-ink-soft italic text-center leading-snug">
          Discover who you are beneath everything you've learned
        </p>

        {/* Selling points */}
        <div className="mt-12 flex flex-col gap-5 w-full">
          {SELLING_POINTS.map((point, i) => (
            <motion.div
              key={i}
              className="flex items-start gap-4 text-left"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + i * 0.1, duration: 0.4, ease: 'easeOut' }}
            >
              <span className="w-10 h-10 rounded-full bg-accent-glow flex items-center justify-center shrink-0 mt-0.5">
                <point.icon size={20} className="text-accent" />
              </span>
              <div>
                <p className="font-medium text-ink">{point.title}</p>
                <p className="text-sm text-ink-soft mt-0.5">{point.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* CTA 1 */}
        <div className="mt-10 w-full">
          <Button onClick={handleStart} disabled={starting}>
            {starting ? 'Creating session...' : 'Start your session'}
            {!starting && <ArrowRight size={18} className="inline ml-2 -mt-0.5" />}
          </Button>
        </div>

        {/* How it works */}
        <div className="mt-16 w-full">
          <div className="flex items-center gap-3 mb-6">
            <div className="flex-1 h-px bg-paper-dark" />
            <h2 className="font-display text-xl text-ink">How it works</h2>
            <div className="flex-1 h-px bg-paper-dark" />
          </div>

          <div className="flex flex-col gap-4">
            {STEPS.map((step, i) => (
              <div key={i} className="flex items-start gap-3">
                <span className="text-accent font-medium text-lg">{step.num}</span>
                <p className="text-ink-soft">{step.text}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Methodology teaser */}
        <div className="mt-12 w-full bg-paper-warm rounded-[var(--radius-card)] p-6">
          <p className="text-sm text-ink-soft leading-relaxed">
            Core-View uses a combination of situational scenarios, timed exercises, and reflective writing to look past
            your professional habits and find the patterns that were already there when you were a child.
          </p>
          <Link
            to="/about"
            className="text-sm text-accent-mid hover:text-accent mt-3 inline-block underline underline-offset-2"
          >
            Learn more about our methodology
          </Link>
        </div>

        <HomeSharePanel />

        <Footer />
      </div>
    </div>
  );
}

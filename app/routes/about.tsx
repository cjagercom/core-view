import { useState, useCallback } from 'react';
import { Link, useNavigate } from 'react-router';
import type { MetaFunction } from 'react-router';
import { Footer } from '~/components/ui/Footer';

export const meta: MetaFunction = () => [
  { title: 'About Core-View \u2014 Methodology & five dimensions' },
  {
    name: 'description',
    content:
      'How Core-View works: childhood scenarios, timed rankings, and reflective writing mapped across five personality dimensions. Learn about the methodology.',
  },
];
import { LogoLink } from '~/components/ui/LogoLink';
import { Button } from '~/components/ui/Button';
import { ExternalLink, ArrowRight } from 'lucide-react';

const dimensionCards = [
  {
    emoji: '\u26A1',
    name: 'Energy Orientation',
    left: 'Internal',
    right: 'External',
    description:
      "Where do you draw your energy from? Some people recharge in solitude, others through interaction. This isn't about being shy or outgoing \u2014 it's about what fills your tank.",
  },
  {
    emoji: '\uD83D\uDD0D',
    name: 'Information Processing',
    left: 'Deep',
    right: 'Broad',
    description:
      'Do you go deep into a few things, or wide across many? Specialists and generalists both thrive \u2014 but in different environments.',
  },
  {
    emoji: '\uD83E\uDDED',
    name: 'Uncertainty Tolerance',
    left: 'Structure',
    right: 'Exploration',
    description:
      "How do you respond to the unknown? Some people need a plan before they move. Others feel most alive when the path isn't clear yet.",
  },
  {
    emoji: '\uD83E\uDD1D',
    name: 'Social Orientation',
    left: 'Autonomous',
    right: 'Connecting',
    description:
      "Do you operate best independently or in collaboration? This isn't about liking people \u2014 it's about where you do your best work.",
  },
  {
    emoji: '\u23F1\uFE0F',
    name: 'Response Pattern',
    left: 'Reflective',
    right: 'Reactive',
    description:
      'When pressure hits, do you pause or act? Neither is better \u2014 but knowing your pattern helps you use it well.',
  },
];

function SectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-4 mt-16 mb-6">
      <div className="h-px flex-1 bg-paper-dark" />
      <h2 className="font-display text-xl text-ink shrink-0">{children}</h2>
      <div className="h-px flex-1 bg-paper-dark" />
    </div>
  );
}

export default function AboutPage() {
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
      <div className="w-full max-w-[480px] mx-auto px-5 pb-12">
        <LogoLink />

        <SectionHeading>What is Core-View?</SectionHeading>

        <div className="max-w-[420px] flex flex-col gap-4 text-ink-soft leading-relaxed">
          <p>
            Most personality tests ask you who you are today. Core-View asks a different question: who were you before
            the world started shaping you?
          </p>
          <p>
            We believe your most fundamental traits — how you process information, where you draw energy, how you
            respond under pressure — were already visible when you were a child. Professional life layers habits on top
            of those traits, but it doesn't replace them.
          </p>
          <p>
            Core-View uses a 12-minute guided session to look beneath those layers and find the patterns that were
            always there.
          </p>
        </div>

        <SectionHeading>The five dimensions</SectionHeading>

        <p className="text-ink-soft leading-relaxed mb-6 max-w-[420px]">
          Your profile maps you across five spectrums. There are no good or bad scores — every position has strengths.
        </p>

        <div className="flex flex-col gap-3">
          {dimensionCards.map((dim) => (
            <div key={dim.name} className="bg-paper-warm rounded-[var(--radius-card)] p-6">
              <div className="flex items-center gap-2 mb-3">
                <span className="w-8 h-8 rounded-full bg-accent-glow flex items-center justify-center text-sm">
                  {dim.emoji}
                </span>
                <h3 className="font-medium text-ink">{dim.name}</h3>
              </div>
              <div className="flex items-center gap-2 mb-3">
                <span className="text-xs text-ink-muted">{dim.left}</span>
                <div className="flex-1 h-1 rounded-full bg-gradient-to-r from-accent/20 to-warm/20" />
                <span className="text-xs text-ink-muted">{dim.right}</span>
              </div>
              <p className="text-sm text-ink-soft leading-relaxed">{dim.description}</p>
            </div>
          ))}
        </div>

        <SectionHeading>How the session works</SectionHeading>

        <div className="max-w-[420px] flex flex-col gap-6 text-ink-soft leading-relaxed">
          <p>The session has four parts, each designed to reveal something different:</p>

          <div className="flex flex-col gap-5">
            {[
              {
                num: '\u2460',
                title: 'Warm-up',
                text: 'A few easy questions about your preferences. No right answers, no pressure. This eases you in and gives us a baseline.',
              },
              {
                num: '\u2461',
                title: 'Childhood scenarios',
                text: "We place you in situations from ages 7-12 and ask what you'd do. This is the heart of Core-View. Your professional habits haven't formed yet at that age, so your answers reveal patterns that predate your career.",
              },
              {
                num: '\u2462',
                title: 'Timed rankings',
                text: "You rank values and preferences under time pressure. The clock is intentional: when you don't have time to overthink, your instinctive priorities surface. How quickly you respond matters as much as what you choose.",
              },
              {
                num: '\u2463',
                title: 'Reflective writing',
                text: "One open prompt, two minutes. We don't analyze what you write \u2014 we observe how you write. How quickly you start, how long you go, whether you pause to think. These micro-behaviors reveal your natural processing style.",
              },
            ].map((step) => (
              <div key={step.num} className="flex gap-3">
                <span className="text-accent text-lg shrink-0 mt-0.5">{step.num}</span>
                <div>
                  <h3 className="font-medium text-ink mb-1">{step.title}</h3>
                  <p className="text-sm">{step.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <SectionHeading>Why childhood?</SectionHeading>

        <div className="max-w-[420px]">
          <div className="border-l-3 border-accent bg-accent-glow rounded-r-lg p-5 mb-6">
            <p className="font-display text-lg text-ink italic leading-relaxed">
              "The person you are at 8 years old is remarkably similar to the person you are at 40. The difference is
              everything you've layered on top."
            </p>
          </div>

          <div className="flex flex-col gap-4 text-ink-soft leading-relaxed">
            <p>
              Research in developmental psychology consistently shows that core personality traits — temperament, social
              orientation, risk tolerance — are largely stable from early childhood. What changes is how we express
              them.
            </p>
            <p>
              A child who built things alone in their room might become a software architect or a solo consultant. The
              underlying pattern — deep focus, autonomy, building — is the same. Core-View looks for those patterns.
            </p>
          </div>
        </div>

        <SectionHeading>How scoring works</SectionHeading>

        <div className="max-w-[420px] flex flex-col gap-4 text-ink-soft leading-relaxed">
          <p>
            Your answers are scored across the five spectrums using a deterministic algorithm — no AI involved in the
            scoring itself. Each answer nudges your scores in specific directions.
          </p>
          <p>
            For timed exercises, faster responses carry more weight. When you answer quickly, you're likely acting on
            instinct rather than deliberation — and instinct is what we're after.
          </p>
          <p>
            Your final scores are matched to the nearest archetype from a set of 48 personality profiles. Then, an AI
            model writes a personalized narrative that goes beyond the archetype — picking up on contradictions,
            tensions, and unique patterns in your specific responses.
          </p>
        </div>

        <SectionHeading>Follow-up sessions</SectionHeading>

        <div className="max-w-[420px] flex flex-col gap-4 text-ink-soft leading-relaxed">
          <p>
            After your first session, you can optionally take a shorter follow-up. These sessions are generated
            specifically for you, targeting the dimensions where your profile is least certain. Each follow-up makes
            your profile more accurate.
          </p>
        </div>

        <SectionHeading>Feedback from others</SectionHeading>

        <div className="max-w-[420px] flex flex-col gap-4 text-ink-soft leading-relaxed">
          <p>
            You can share an anonymous questionnaire with people who know you. They answer 6 quick questions about how
            they experience you. After 3 or more people respond, you'll see how your self-image compares to how others
            perceive you.
          </p>
          <p>
            The feedback is completely anonymous. The people you invite never see your profile, and you never see their
            individual answers — only the aggregate.
          </p>
        </div>

        <SectionHeading>Privacy</SectionHeading>

        <div className="max-w-[420px] flex flex-col gap-4 text-ink-soft leading-relaxed">
          <p>
            Core-View is designed to know as little about you as possible. No account, no email, no cookies, no
            tracking. Your session is linked to a random token — a meaningless string that we can't connect to you.
          </p>
          <Link
            to="/privacy"
            className="text-accent-mid hover:text-accent underline underline-offset-2 transition-colors"
          >
            Read our full privacy page
          </Link>
        </div>

        <SectionHeading>Built by PinkPollos</SectionHeading>

        <div className="max-w-[420px] flex flex-col gap-4 text-ink-soft leading-relaxed">
          <p>Core-View is made by PinkPollos, a studio that builds thoughtful digital products.</p>
          <a
            href="https://www.pinkpollos.com"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-accent-mid hover:text-accent transition-colors"
          >
            Visit pinkpollos.com
            <ExternalLink size={14} />
          </a>
        </div>

        <div className="mt-16">
          <Button onClick={handleStart} disabled={starting}>
            {starting ? 'Creating session...' : 'Start your session'}
            {!starting && <ArrowRight size={18} className="inline ml-2 -mt-0.5" />}
          </Button>
        </div>

        <Footer />
      </div>
    </div>
  );
}

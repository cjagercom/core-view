import type { MetaFunction } from 'react-router';
import { Footer } from '~/components/ui/Footer';
import { LogoLink } from '~/components/ui/LogoLink';
import { ExternalLink } from 'lucide-react';
import { buildMeta } from '~/lib/seo';

export const meta: MetaFunction = ({ matches }) => {
  const parentMeta = matches.flatMap((match) => match.meta ?? []);
  return buildMeta(
    {
      title: 'Privacy \u2014 Core-View',
      description:
        'Core-View is designed to know as little about you as possible. No account, no email, no cookies, no tracking.',
      url: '/privacy',
    },
    parentMeta,
  );
};

export default function PrivacyPage() {
  return (
    <div className="min-h-dvh bg-paper">
      <div className="w-full max-w-[480px] mx-auto px-5 pb-12">
        <LogoLink />

        <h1 className="font-display text-3xl text-ink mb-6">Privacy</h1>

        <div className="max-w-[420px] flex flex-col gap-8 text-ink-soft leading-relaxed">
          <p className="text-lg text-ink">Core-View is designed to know as little about you as possible.</p>

          <section>
            <h2 className="font-display text-xl text-ink mb-3">What we store</h2>
            <p className="mb-3">When you take a session, we store:</p>
            <ul className="flex flex-col gap-1.5 ml-1">
              {[
                'Your answers to the questions',
                'Your free-text writing response',
                'Timing data (how quickly you answered)',
                'Your computed personality scores',
                'Your AI-generated profile text (and previous versions)',
                'Deep-dive and reconciliation conversation messages, if you use those features',
                'Anonymous feedback responses from people you invite',
              ].map((item) => (
                <li key={item} className="flex items-start gap-2">
                  <span className="text-ink-muted mt-1.5 shrink-0 w-1.5 h-1.5 rounded-full bg-ink-muted" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <p className="mt-3">
              This data is linked to a random session token — a meaningless string of characters. We don't know who you
              are.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl text-ink mb-3">What we don't store</h2>
            <ul className="flex flex-col gap-1.5 ml-1">
              {[
                'No name',
                'No email address',
                'No IP address',
                'No device information',
                'No cookies',
                'No tracking pixels',
              ].map((item) => (
                <li key={item} className="flex items-start gap-2">
                  <span className="text-ink-muted mt-1.5 shrink-0 w-1.5 h-1.5 rounded-full bg-ink-muted" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </section>

          <section>
            <h2 className="font-display text-xl text-ink mb-3">How your session works</h2>
            <p>
              Your session URL (the link you bookmark) is the only way to access your data. We cannot look up your
              session because we don't know who it belongs to. If you lose your link, your data is effectively
              inaccessible — even to us.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl text-ink mb-3">Feedback from others</h2>
            <p>
              If you share a feedback link, the people who respond are also anonymous. We don't know who they are or how
              you shared the link with them. Their responses are stored as anonymous data points attached to your
              session.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl text-ink mb-3">AI processing</h2>
            <p>
              Your session data is sent to an AI model (Claude by Anthropic) to generate your personalized profile text.
              If you use the deep-dive or reconciliation features, those conversations also go through the same AI
              model. This data is not used to train AI models and is not retained by the AI provider after processing.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl text-ink mb-3">Analytics</h2>
            <p>
              We collect anonymous, first-party usage events (e.g. "a session was started", "a step was completed") to
              understand how the product is used. These events contain no personal information and cannot be linked to
              you. We do not use any third-party analytics services.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl text-ink mb-3">Data deletion</h2>
            <p>
              You can delete your profile and all associated data directly from your profile page — no need to contact
              anyone. Alternatively, reach out to us with your session token and we'll remove it manually.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl text-ink mb-3">Contact</h2>
            <p>Core-View is built by PinkPollos.</p>
            <a
              href="https://www.pinkpollos.com"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-accent-mid hover:text-accent transition-colors mt-1"
            >
              pinkpollos.com
              <ExternalLink size={14} />
            </a>
          </section>
        </div>

        <Footer />
      </div>
    </div>
  );
}

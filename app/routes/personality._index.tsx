import { useState, useCallback } from 'react';
import { Link, useNavigate } from 'react-router';
import type { MetaFunction } from 'react-router';
import { archetypes } from '~/data/archetypes';
import { LogoLink } from '~/components/ui/LogoLink';
import { Footer } from '~/components/ui/Footer';
import { Button } from '~/components/ui/Button';
import { buildMeta } from '~/lib/seo';
import { ArrowRight } from 'lucide-react';

export const meta: MetaFunction = ({ matches }) => {
  const parentMeta = matches.flatMap((match) => match.meta ?? []);
  return buildMeta(
    {
      title: 'Personality Archetypes — Core-View',
      description:
        'Explore 48 personality archetypes across five dimensions: Energy, Processing, Uncertainty Tolerance, Social Orientation, and Response Pattern. Discover which one fits you.',
      url: '/personality',
    },
    parentMeta,
  );
};

export default function PersonalityHubPage() {
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
      <div className="w-full max-w-120 mx-auto px-5 pb-12">
        <LogoLink />

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'CollectionPage',
              name: 'Personality Archetypes',
              description: 'Explore 48 personality archetypes across five dimensions.',
              url: 'https://www.core-view.app/personality',
              isPartOf: {
                '@type': 'WebSite',
                name: 'Core-View',
                url: 'https://www.core-view.app',
              },
            }),
          }}
        />

        <h1 className="font-display text-3xl text-ink mb-3">Personality Archetypes</h1>
        <p className="text-ink-soft leading-relaxed mb-8">
          Core-View maps your personality across five dimensions — Energy, Processing, Uncertainty Tolerance, Social
          Orientation, and Response Pattern — and matches you to one of 48 archetypes. Each archetype represents a
          unique combination of traits that were already visible in childhood.
        </p>

        <div className="flex flex-col gap-3">
          {archetypes.map((archetype) => (
            <Link
              key={archetype.id}
              to={`/personality/${archetype.id}`}
              className="group block rounded-xl border border-paper-dark bg-white p-5 hover:border-accent/30 hover:shadow-sm transition-all"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <h2 className="font-display text-base text-ink group-hover:text-accent transition-colors">
                    {archetype.name}
                  </h2>
                  <p className="text-sm text-ink-soft mt-1 leading-relaxed">{archetype.coreSentence}</p>
                </div>
                <ArrowRight
                  size={16}
                  className="text-ink-muted group-hover:text-accent shrink-0 mt-1 transition-colors"
                />
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-12 text-center">
          <p className="text-ink-soft mb-4">Which archetype are you?</p>
          <Button onClick={handleStart} disabled={starting}>
            {starting ? 'Creating session...' : 'Take the assessment'}
            {!starting && <ArrowRight size={18} className="inline ml-2 -mt-0.5" />}
          </Button>
        </div>

        <Footer />
      </div>
    </div>
  );
}

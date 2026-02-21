import { Link, useNavigate } from 'react-router';
import type { MetaFunction } from 'react-router';
import type { Route } from './+types/personality.$slug';
import { archetypes } from '~/data/archetypes';
import { dimensions } from '~/data/dimensions';
import { ArchetypeHeader } from '~/components/profile/ArchetypeHeader';
import { RadarChart } from '~/components/profile/RadarChart';
import { DimensionCard } from '~/components/profile/DimensionCard';
import { LogoLink } from '~/components/ui/LogoLink';
import { Footer } from '~/components/ui/Footer';
import { Button } from '~/components/ui/Button';
import { buildMeta, buildBreadcrumbs } from '~/lib/seo';
import { Sparkles, AlertTriangle, ArrowRight, ArrowLeft } from 'lucide-react';
import { useState, useCallback } from 'react';
import type { DimensionScore } from '~/types/profile';

export async function loader({ params }: Route.LoaderArgs) {
  const archetype = archetypes.find((a) => a.id === params.slug);
  if (!archetype) {
    throw new Response('Not found', { status: 404 });
  }
  return { archetype };
}

export const meta: MetaFunction<typeof loader> = ({ data, matches }) => {
  if (!data) return [{ title: 'Not Found — Core-View' }];
  const { archetype } = data;
  const parentMeta = matches.flatMap((match) => match.meta ?? []);
  return buildMeta(
    {
      title: `${archetype.name} — Personality Archetype | Core-View`,
      description: `${archetype.coreSentence} ${archetype.description.slice(0, 120)}...`,
      url: `/personality/${archetype.id}`,
      type: 'article',
    },
    parentMeta,
  );
};

export default function ArchetypePage({ loaderData }: Route.ComponentProps) {
  const { archetype } = loaderData;
  const navigate = useNavigate();
  const [starting, setStarting] = useState(false);

  const scores: DimensionScore[] = dimensions.map((dim) => ({
    dimensionId: dim.id,
    score: archetype.centroid[dim.id],
    confidence: 10,
  }));

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

  const breadcrumbs = buildBreadcrumbs([
    { name: 'Home', path: '/' },
    { name: 'Personality Archetypes', path: '/personality' },
    { name: archetype.name, path: `/personality/${archetype.id}` },
  ]);

  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: archetype.name,
    description: archetype.coreSentence,
    url: `https://www.core-view.app/personality/${archetype.id}`,
    author: { '@type': 'Organization', name: 'PinkPollos', url: 'https://www.pinkpollos.com' },
    publisher: { '@type': 'Organization', name: 'Core-View', url: 'https://www.core-view.app' },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `https://www.core-view.app/personality/${archetype.id}`,
    },
  };

  return (
    <div className="min-h-dvh bg-paper pb-24">
      <div className="w-full max-w-120 mx-auto px-5">
        <LogoLink />

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify([breadcrumbs, articleSchema]) }}
        />

        {/* Breadcrumb nav */}
        <nav className="text-xs text-ink-muted mb-6 flex items-center gap-1.5 flex-wrap">
          <Link to="/" className="hover:text-ink transition-colors">
            Home
          </Link>
          <span>/</span>
          <Link to="/personality" className="hover:text-ink transition-colors">
            Archetypes
          </Link>
          <span>/</span>
          <span className="text-ink-soft">{archetype.name}</span>
        </nav>

        <ArchetypeHeader name={archetype.name} coreSentence={archetype.coreSentence} />

        <div className="mt-8">
          <p className="text-sm text-ink-soft leading-relaxed">{archetype.description}</p>
        </div>

        <RadarChart scores={scores} />

        <div className="mt-8 flex flex-col gap-3">
          {scores.map((score) => (
            <DimensionCard
              key={score.dimensionId}
              score={score}
              description={archetype.dimensionTexts[score.dimensionId]}
            />
          ))}
        </div>

        <div className="mt-8">
          <h2 className="font-display text-lg text-ink mb-3">Strengths</h2>
          <div className="flex flex-col gap-2.5">
            {archetype.strengths.map((s) => (
              <div key={s} className="flex items-start gap-3 p-3.5 rounded-xl bg-accent-glow border border-accent/10">
                <div className="w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center shrink-0">
                  <Sparkles size={16} className="text-accent" />
                </div>
                <span className="text-sm text-ink-soft pt-1">{s}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-6">
          <h2 className="font-display text-lg text-ink mb-3">Watch-outs</h2>
          <div className="flex flex-col gap-2.5">
            {archetype.watchOuts.map((w) => (
              <div key={w} className="flex items-start gap-3 p-3.5 rounded-xl bg-warm-light/50 border border-warm/10">
                <div className="w-8 h-8 rounded-full bg-warm/10 flex items-center justify-center shrink-0">
                  <AlertTriangle size={16} className="text-warm" />
                </div>
                <span className="text-sm text-ink-soft pt-1">{w}</span>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="mt-12 text-center">
          <p className="text-ink-soft mb-4">Is this your archetype? Find out in 12 minutes.</p>
          <Button onClick={handleStart} disabled={starting}>
            {starting ? 'Creating session...' : 'Discover your own archetype'}
            {!starting && <ArrowRight size={18} className="inline ml-2 -mt-0.5" />}
          </Button>
        </div>

        {/* Back link */}
        <div className="mt-8 text-center">
          <Link
            to="/personality"
            className="inline-flex items-center gap-1.5 text-sm text-ink-muted hover:text-ink transition-colors"
          >
            <ArrowLeft size={14} /> Explore all archetypes
          </Link>
        </div>

        <Footer />
      </div>
    </div>
  );
}

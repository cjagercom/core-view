import { useParams } from 'react-router';
import { decodeProfile } from '~/engine/profile-encoder';
import { archetypes } from '~/data/archetypes';
import { ArchetypeHeader } from '~/components/profile/ArchetypeHeader';
import { RadarChart } from '~/components/profile/RadarChart';
import { DimensionCard } from '~/components/profile/DimensionCard';
import { ShareButton } from '~/components/profile/ShareButton';
import { Footer } from '~/components/ui/Footer';
import { Sparkles, AlertTriangle } from 'lucide-react';
import type { DimensionScore } from '~/types/profile';
import type { DimensionId } from '~/types/questions';

const DIMENSIONS: DimensionId[] = ['energy', 'processing', 'uncertainty', 'social', 'response'];

export default function ProfilePage() {
  const { token } = useParams();

  if (!token) {
    return <div className="p-5 text-center text-ink-muted">Invalid profile link</div>;
  }

  let decoded;
  try {
    decoded = decodeProfile(token);
  } catch {
    return <div className="p-5 text-center text-ink-muted">Invalid profile link</div>;
  }

  const archetype = archetypes.find((a) => a.id === decoded.a);
  if (!archetype) {
    return <div className="p-5 text-center text-ink-muted">Unknown archetype</div>;
  }

  const scores: DimensionScore[] = DIMENSIONS.map((dim, i) => ({
    dimensionId: dim,
    score: decoded.d[i] ?? 50,
    confidence: 10,
  }));

  return (
    <div className="min-h-dvh bg-paper pb-24">
      <div className="w-full max-w-[480px] mx-auto px-5">
        <ArchetypeHeader name={archetype.name} coreSentence={archetype.coreSentence} />

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

        <div className="mt-10 mb-6 text-center">
          <p className="text-sm text-ink-muted">Coming soon: deepen your profile with follow-up sessions</p>
        </div>

        <Footer />
      </div>

      <ShareButton />
    </div>
  );
}

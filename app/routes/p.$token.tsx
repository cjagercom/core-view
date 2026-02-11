import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router';
import { archetypes } from '~/data/archetypes';
import { ArchetypeHeader } from '~/components/profile/ArchetypeHeader';
import { DimensionCard } from '~/components/profile/DimensionCard';
import { RadarChart } from '~/components/profile/RadarChart';
import { Footer } from '~/components/ui/Footer';
import { LogoLink } from '~/components/ui/LogoLink';
import { Button } from '~/components/ui/Button';
import { Sparkles, AlertTriangle } from 'lucide-react';
import type { DimensionScore } from '~/types/profile';
import { motion } from 'framer-motion';

export default function SharedProfilePage() {
  const { token } = useParams();
  const [profile, setProfile] = useState<{
    dimensions: DimensionScore[];
    archetypeId: string;
    archetypeName: string;
  } | null>(null);
  const [profileText, setProfileText] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!token) return;

    async function loadProfile() {
      try {
        const res = await fetch(`/api/share/${token}`);
        if (!res.ok) {
          setError(true);
          setLoading(false);
          return;
        }
        const data = await res.json();
        if (data.profile) {
          setProfile(data.profile);
          if (data.profileText) setProfileText(data.profileText);
        } else {
          setError(true);
        }
      } catch {
        setError(true);
      } finally {
        setLoading(false);
      }
    }

    loadProfile();
  }, [token]);

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

  if (error || !profile) {
    return (
      <div className="min-h-dvh bg-paper flex items-center justify-center px-5">
        <div className="text-center">
          <h1 className="font-display text-xl text-ink mb-2">Profile not found</h1>
          <p className="text-sm text-ink-muted mb-6">This profile link may be invalid.</p>
          <Link to="/">
            <Button>Discover your own profile</Button>
          </Link>
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

  return (
    <div className="min-h-dvh bg-paper pb-24">
      <div className="w-full max-w-[480px] mx-auto px-5">
        <LogoLink />
        <p className="text-center text-xs text-ink-muted pb-2">You're viewing someone's Core-View profile</p>

        <ArchetypeHeader name={archetype.name} coreSentence={archetype.coreSentence} />
        <RadarChart scores={scores} />

        {profileText && (
          <div className="mt-8">
            <ProfileText text={profileText} />
          </div>
        )}

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

        <Footer />
      </div>

      <div className="fixed bottom-0 left-0 right-0 p-4 bg-paper border-t border-paper-dark">
        <div className="max-w-[480px] mx-auto">
          <Link to="/">
            <Button>Discover your own profile</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

function ProfileText({ text }: { text: string }) {
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

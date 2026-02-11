import type { Profile, ProfileToken } from '~/types/profile';

export function encodeProfile(profile: Profile): string {
  const token: ProfileToken = {
    d: (['energy', 'processing', 'uncertainty', 'social', 'response'] as const).map(
      (dim) => profile.dimensions.find((s) => s.dimensionId === dim)?.score ?? 50,
    ),
    a: profile.archetype.id,
    t: Math.floor(new Date(profile.completedAt).getTime() / 1000),
  };
  return btoa(JSON.stringify(token)).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

export function decodeProfile(token: string): ProfileToken {
  const padded = token.replace(/-/g, '+').replace(/_/g, '/');
  return JSON.parse(atob(padded));
}

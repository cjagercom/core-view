import type { DimensionId } from '~/types/questions';
import type { DimensionScore, Archetype } from '~/types/profile';
import { archetypes } from '~/data/archetypes';

const DIMENSIONS: DimensionId[] = ['energy', 'processing', 'uncertainty', 'social', 'response'];

export function matchArchetype(scores: DimensionScore[]): Archetype {
  const scoreMap = Object.fromEntries(scores.map((s) => [s.dimensionId, s.score])) as Record<DimensionId, number>;

  let bestMatch: Archetype = archetypes[0];
  let bestDistance = Infinity;

  for (const arch of archetypes) {
    const distance = Math.sqrt(DIMENSIONS.reduce((sum, dim) => sum + (scoreMap[dim] - arch.centroid[dim]) ** 2, 0));
    if (distance < bestDistance) {
      bestDistance = distance;
      bestMatch = arch;
    }
  }
  return bestMatch;
}

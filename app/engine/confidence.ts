import type { DimensionScore } from '~/types/profile';
import type { DimensionId } from '~/types/questions';

export function getLowestConfidenceDimensions(scores: DimensionScore[], threshold: number = 5): DimensionId[] {
  return scores
    .filter((s) => s.confidence < threshold)
    .sort((a, b) => a.confidence - b.confidence)
    .map((s) => s.dimensionId);
}

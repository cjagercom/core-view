import type { DimensionId, DimensionScoreMap } from '~/types/questions';
import type { DimensionScore } from '~/types/profile';
import { getReactionTimeMultiplier } from './reaction-time';

const DIMENSIONS: DimensionId[] = ['energy', 'processing', 'uncertainty', 'social', 'response'];

export function createAccumulator(): Record<DimensionId, { sum: number; count: number }> {
  return {
    energy: { sum: 0, count: 0 },
    processing: { sum: 0, count: 0 },
    uncertainty: { sum: 0, count: 0 },
    social: { sum: 0, count: 0 },
    response: { sum: 0, count: 0 },
  };
}

export function accumulateScores(
  accumulator: Record<DimensionId, { sum: number; count: number }>,
  scores: DimensionScoreMap,
  weight: number = 1.0,
): void {
  for (const [dim, value] of Object.entries(scores) as [DimensionId, number][]) {
    if (value !== undefined) {
      accumulator[dim].sum += value * weight;
      accumulator[dim].count += 1;
    }
  }
}

export function accumulateRankingScores(
  accumulator: Record<DimensionId, { sum: number; count: number }>,
  rankedItems: { dimensionWeights: DimensionScoreMap }[],
  reactionTimeMs: number,
  timeLimitMs: number,
  inverted: boolean = false,
): void {
  const reactionTimeMultiplier = getReactionTimeMultiplier(reactionTimeMs, timeLimitMs);
  const positionMultipliers = inverted ? [-1.0, -0.5, 0.5, 1.0] : [1.0, 0.5, -0.5, -1.0];

  for (let i = 0; i < rankedItems.length; i++) {
    const item = rankedItems[i];
    for (const [dim, baseWeight] of Object.entries(item.dimensionWeights) as [DimensionId, number][]) {
      if (baseWeight !== undefined) {
        const score = baseWeight * positionMultipliers[i] * reactionTimeMultiplier;
        accumulator[dim].sum += score;
        accumulator[dim].count += 1;
      }
    }
  }
}

export function applyWritingMeta(
  accumulator: Record<DimensionId, { sum: number; count: number }>,
  metadata: {
    timeToFirstKeystrokeMs?: number;
    totalCharacters?: number;
    pauseCount?: number;
  },
): void {
  if (metadata.timeToFirstKeystrokeMs !== undefined) {
    if (metadata.timeToFirstKeystrokeMs < 3000) {
      accumulateScores(accumulator, { response: 8 });
    } else if (metadata.timeToFirstKeystrokeMs > 8000) {
      accumulateScores(accumulator, { response: -8 });
    }
  }

  if (metadata.totalCharacters !== undefined) {
    if (metadata.totalCharacters > 400) {
      accumulateScores(accumulator, { processing: -5 });
    } else if (metadata.totalCharacters < 100) {
      accumulateScores(accumulator, { processing: 5 });
    }
  }

  if (metadata.pauseCount !== undefined) {
    if (metadata.pauseCount > 3) {
      accumulateScores(accumulator, { response: -5 });
    } else if (metadata.pauseCount === 0) {
      accumulateScores(accumulator, { response: 5 });
    }
  }
}

export function normalizeScores(accumulator: Record<DimensionId, { sum: number; count: number }>): DimensionScore[] {
  return DIMENSIONS.map((dim) => {
    const { sum, count } = accumulator[dim];
    if (count === 0) return { dimensionId: dim, score: 50, confidence: 0 };
    const average = sum / count;
    // Map from [-8, +8] range to [0, 100] — tighter range spreads scores
    // across more of the spectrum, enabling better archetype differentiation
    const normalized = Math.round(Math.min(100, Math.max(0, (average + 8) * (100 / 16))));
    return { dimensionId: dim, score: normalized, confidence: count };
  });
}

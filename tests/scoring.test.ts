import { describe, it, expect } from 'vitest';
import {
  createAccumulator,
  accumulateScores,
  accumulateRankingScores,
  applyWritingMeta,
  normalizeScores,
} from '~/engine/scoring';
import { getReactionTimeMultiplier } from '~/engine/reaction-time';
import { matchArchetype } from '~/engine/archetypes';
import { encodeProfile, decodeProfile } from '~/engine/profile-encoder';
import { archetypes } from '~/data/archetypes';
import type { DimensionScore, Profile } from '~/types/profile';

describe('Reaction Time Multiplier', () => {
  it('returns 1.3 for fast responses (< 40% of time)', () => {
    expect(getReactionTimeMultiplier(2000, 8000)).toBe(1.3);
    expect(getReactionTimeMultiplier(0, 8000)).toBe(1.3);
  });

  it('returns 1.0 for normal responses (40-80% of time)', () => {
    expect(getReactionTimeMultiplier(4000, 8000)).toBe(1.0);
    expect(getReactionTimeMultiplier(6000, 8000)).toBe(1.0);
  });

  it('returns 0.7 for slow responses (> 80% of time)', () => {
    expect(getReactionTimeMultiplier(7000, 8000)).toBe(0.7);
    expect(getReactionTimeMultiplier(8000, 8000)).toBe(0.7);
  });
});

describe('Score Accumulation', () => {
  it('accumulates basic scores', () => {
    const acc = createAccumulator();
    accumulateScores(acc, { energy: 5, processing: -3 });
    expect(acc.energy.sum).toBe(5);
    expect(acc.energy.count).toBe(1);
    expect(acc.processing.sum).toBe(-3);
    expect(acc.processing.count).toBe(1);
    expect(acc.uncertainty.sum).toBe(0);
    expect(acc.uncertainty.count).toBe(0);
  });

  it('accumulates with weight', () => {
    const acc = createAccumulator();
    accumulateScores(acc, { energy: 10 }, 1.3);
    expect(acc.energy.sum).toBeCloseTo(13);
  });

  it('accumulates multiple responses', () => {
    const acc = createAccumulator();
    accumulateScores(acc, { energy: 5 });
    accumulateScores(acc, { energy: -3 });
    expect(acc.energy.sum).toBe(2);
    expect(acc.energy.count).toBe(2);
  });
});

describe('Ranking Score Accumulation', () => {
  it('applies position multipliers correctly', () => {
    const acc = createAccumulator();
    const items = [
      { dimensionWeights: { energy: 10 } },
      { dimensionWeights: { energy: 10 } },
      { dimensionWeights: { energy: 10 } },
      { dimensionWeights: { energy: 10 } },
    ];
    // Normal reaction time
    accumulateRankingScores(acc, items, 5000, 10000, false);
    // Positions: 10*1.0 + 10*0.5 + 10*-0.5 + 10*-1.0 = 10 + 5 - 5 - 10 = 0
    expect(acc.energy.sum).toBeCloseTo(0);
    expect(acc.energy.count).toBe(4);
  });

  it('applies inverted multipliers for give-up-first ranking', () => {
    const acc = createAccumulator();
    const items = [
      { dimensionWeights: { social: 10 } },
      { dimensionWeights: { social: 10 } },
      { dimensionWeights: { social: 10 } },
      { dimensionWeights: { social: 10 } },
    ];
    accumulateRankingScores(acc, items, 5000, 10000, true);
    // Inverted: 10*-1.0 + 10*-0.5 + 10*0.5 + 10*1.0 = -10 -5 +5 +10 = 0
    expect(acc.social.sum).toBeCloseTo(0);
  });

  it('applies reaction time multiplier to ranking scores', () => {
    const acc = createAccumulator();
    const items = [
      { dimensionWeights: { energy: 10 } },
      { dimensionWeights: { energy: 0 } },
      { dimensionWeights: { energy: 0 } },
      { dimensionWeights: { energy: 0 } },
    ];
    // Fast reaction time = 1.3 multiplier
    accumulateRankingScores(acc, items, 1000, 8000, false);
    // First item: 10 * 1.0 (position) * 1.3 (reaction) = 13
    expect(acc.energy.sum).toBeCloseTo(13);
  });
});

describe('Writing Meta Scoring', () => {
  it('applies fast keystroke score', () => {
    const acc = createAccumulator();
    applyWritingMeta(acc, { timeToFirstKeystrokeMs: 2000 });
    expect(acc.response.sum).toBe(8);
  });

  it('applies slow keystroke score', () => {
    const acc = createAccumulator();
    applyWritingMeta(acc, { timeToFirstKeystrokeMs: 9000 });
    expect(acc.response.sum).toBe(-8);
  });

  it('applies long writing score', () => {
    const acc = createAccumulator();
    applyWritingMeta(acc, { totalCharacters: 500 });
    expect(acc.processing.sum).toBe(-5);
  });

  it('applies short writing score', () => {
    const acc = createAccumulator();
    applyWritingMeta(acc, { totalCharacters: 50 });
    expect(acc.processing.sum).toBe(5);
  });

  it('applies no-pause score', () => {
    const acc = createAccumulator();
    applyWritingMeta(acc, { pauseCount: 0 });
    expect(acc.response.sum).toBe(5);
  });

  it('applies many-pauses score', () => {
    const acc = createAccumulator();
    applyWritingMeta(acc, { pauseCount: 5 });
    expect(acc.response.sum).toBe(-5);
  });
});

describe('Score Normalization', () => {
  it('returns 50 for empty accumulator', () => {
    const acc = createAccumulator();
    const scores = normalizeScores(acc);
    scores.forEach((s) => {
      expect(s.score).toBe(50);
      expect(s.confidence).toBe(0);
    });
  });

  it('normalizes positive scores correctly', () => {
    const acc = createAccumulator();
    acc.energy.sum = 15;
    acc.energy.count = 1;
    const scores = normalizeScores(acc);
    const energy = scores.find((s) => s.dimensionId === 'energy')!;
    // (15 + 15) * (100/30) = 30 * 3.33 = 100
    expect(energy.score).toBe(100);
  });

  it('normalizes negative scores correctly', () => {
    const acc = createAccumulator();
    acc.energy.sum = -15;
    acc.energy.count = 1;
    const scores = normalizeScores(acc);
    const energy = scores.find((s) => s.dimensionId === 'energy')!;
    // (-15 + 15) * (100/30) = 0
    expect(energy.score).toBe(0);
  });

  it('normalizes zero average to 50', () => {
    const acc = createAccumulator();
    acc.energy.sum = 0;
    acc.energy.count = 5;
    const scores = normalizeScores(acc);
    const energy = scores.find((s) => s.dimensionId === 'energy')!;
    expect(energy.score).toBe(50);
  });

  it('clamps to 0-100 range', () => {
    const acc = createAccumulator();
    acc.energy.sum = 100;
    acc.energy.count = 1;
    const scores = normalizeScores(acc);
    const energy = scores.find((s) => s.dimensionId === 'energy')!;
    expect(energy.score).toBeLessThanOrEqual(100);

    const acc2 = createAccumulator();
    acc2.energy.sum = -100;
    acc2.energy.count = 1;
    const scores2 = normalizeScores(acc2);
    const energy2 = scores2.find((s) => s.dimensionId === 'energy')!;
    expect(energy2.score).toBeGreaterThanOrEqual(0);
  });
});

describe('Archetype Matching', () => {
  it('matches the quiet strategist for very low scores', () => {
    const scores: DimensionScore[] = [
      { dimensionId: 'energy', score: 20, confidence: 10 },
      { dimensionId: 'processing', score: 15, confidence: 10 },
      { dimensionId: 'uncertainty', score: 20, confidence: 10 },
      { dimensionId: 'social', score: 20, confidence: 10 },
      { dimensionId: 'response', score: 15, confidence: 10 },
    ];
    const match = matchArchetype(scores);
    expect(match.id).toBe('quiet-strategist');
  });

  it('matches the enthusiast for very high scores', () => {
    const scores: DimensionScore[] = [
      { dimensionId: 'energy', score: 85, confidence: 10 },
      { dimensionId: 'processing', score: 70, confidence: 10 },
      { dimensionId: 'uncertainty', score: 70, confidence: 10 },
      { dimensionId: 'social', score: 80, confidence: 10 },
      { dimensionId: 'response', score: 80, confidence: 10 },
    ];
    const match = matchArchetype(scores);
    expect(match.id).toBe('enthusiast');
  });

  it('matches the connector for high social scores', () => {
    const scores: DimensionScore[] = [
      { dimensionId: 'energy', score: 65, confidence: 10 },
      { dimensionId: 'processing', score: 50, confidence: 10 },
      { dimensionId: 'uncertainty', score: 50, confidence: 10 },
      { dimensionId: 'social', score: 90, confidence: 10 },
      { dimensionId: 'response', score: 55, confidence: 10 },
    ];
    const match = matchArchetype(scores);
    expect(match.id).toBe('connector');
  });

  it('returns a valid archetype for any score', () => {
    const scores: DimensionScore[] = [
      { dimensionId: 'energy', score: 50, confidence: 10 },
      { dimensionId: 'processing', score: 50, confidence: 10 },
      { dimensionId: 'uncertainty', score: 50, confidence: 10 },
      { dimensionId: 'social', score: 50, confidence: 10 },
      { dimensionId: 'response', score: 50, confidence: 10 },
    ];
    const match = matchArchetype(scores);
    expect(match).toBeDefined();
    expect(match.id).toBeTruthy();
    expect(archetypes.some((a) => a.id === match.id)).toBe(true);
  });
});

describe('Profile Encoder', () => {
  it('encodes and decodes a profile correctly', () => {
    const profile: Profile = {
      dimensions: [
        { dimensionId: 'energy', score: 75, confidence: 10 },
        { dimensionId: 'processing', score: 30, confidence: 10 },
        { dimensionId: 'uncertainty', score: 60, confidence: 10 },
        { dimensionId: 'social', score: 85, confidence: 10 },
        { dimensionId: 'response', score: 45, confidence: 10 },
      ],
      archetype: archetypes[0],
      completedAt: '2025-01-15T12:00:00.000Z',
    };

    const encoded = encodeProfile(profile);
    expect(typeof encoded).toBe('string');
    expect(encoded.length).toBeGreaterThan(0);

    const decoded = decodeProfile(encoded);
    expect(decoded.d).toEqual([75, 30, 60, 85, 45]);
    expect(decoded.a).toBe(archetypes[0].id);
    expect(decoded.t).toBe(Math.floor(new Date('2025-01-15T12:00:00.000Z').getTime() / 1000));
  });

  it('produces URL-safe tokens', () => {
    const profile: Profile = {
      dimensions: [
        { dimensionId: 'energy', score: 50, confidence: 5 },
        { dimensionId: 'processing', score: 50, confidence: 5 },
        { dimensionId: 'uncertainty', score: 50, confidence: 5 },
        { dimensionId: 'social', score: 50, confidence: 5 },
        { dimensionId: 'response', score: 50, confidence: 5 },
      ],
      archetype: archetypes[0],
      completedAt: new Date().toISOString(),
    };

    const encoded = encodeProfile(profile);
    expect(encoded).not.toMatch(/[+/=]/);
  });
});

describe('Archetypes Data', () => {
  it('has 48 archetypes', () => {
    expect(archetypes.length).toBe(48);
  });

  it('all archetypes have unique ids', () => {
    const ids = archetypes.map((a) => a.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('all archetypes have valid centroid scores (0-100)', () => {
    for (const arch of archetypes) {
      for (const dim of ['energy', 'processing', 'uncertainty', 'social', 'response'] as const) {
        expect(arch.centroid[dim]).toBeGreaterThanOrEqual(0);
        expect(arch.centroid[dim]).toBeLessThanOrEqual(100);
      }
    }
  });

  it('all archetypes have required fields', () => {
    for (const arch of archetypes) {
      expect(arch.name).toBeTruthy();
      expect(arch.coreSentence).toBeTruthy();
      expect(arch.description).toBeTruthy();
      expect(arch.strengths.length).toBeGreaterThan(0);
      expect(arch.watchOuts.length).toBeGreaterThan(0);
      for (const dim of ['energy', 'processing', 'uncertainty', 'social', 'response'] as const) {
        expect(arch.dimensionTexts[dim]).toBeTruthy();
      }
    }
  });
});

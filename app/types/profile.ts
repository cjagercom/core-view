import type { DimensionId } from './questions';

export interface DimensionScore {
  dimensionId: DimensionId;
  score: number; // 0-100
  confidence: number; // number of data points
}

export interface Archetype {
  id: string;
  name: string;
  coreSentence: string;
  description: string;
  dimensionTexts: Record<DimensionId, string>;
  strengths: string[];
  watchOuts: string[];
  centroid: Record<DimensionId, number>;
}

export interface Profile {
  dimensions: DimensionScore[];
  archetype: Archetype;
  completedAt: string;
}

export interface ProfileToken {
  d: number[]; // [energy, processing, uncertainty, social, response]
  a: string; // archetype id
  t: number; // unix seconds
}

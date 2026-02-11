export type DimensionId = 'energy' | 'processing' | 'uncertainty' | 'social' | 'response';
export type DimensionScoreMap = Partial<Record<DimensionId, number>>;

export interface WarmupQuestion {
  id: string;
  question: string;
  options: { id: string; label: string; dimensionScores: DimensionScoreMap }[];
}

export interface Scenario {
  id: string;
  ageContext: string;
  prompt: string;
  options: { id: string; label: string; dimensionScores: DimensionScoreMap }[];
}

export interface RankingSet {
  id: string;
  prompt: string;
  timeLimitMs: number;
  items: { id: string; label: string; dimensionWeights: DimensionScoreMap }[];
}

export interface WritingPrompt {
  id: string;
  prompt: string;
  timeLimitMs: number;
  followUpQuestions: {
    id: string;
    question: string;
    options: { id: string; label: string; dimensionScores: DimensionScoreMap }[];
  }[];
}

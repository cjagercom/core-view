import type { DimensionScoreMap } from './questions';

export interface FeedbackQuestion {
  id: string;
  question: string;
  options: { id: string; label: string; dimensionScores: DimensionScoreMap }[];
}

export interface FeedbackResponse {
  questionId: string;
  optionId: string;
  submittedAt: string;
}

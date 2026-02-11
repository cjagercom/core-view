import type { DimensionId, DimensionScoreMap } from './questions';

export type WizardStep = 'warmup' | 'scenarios' | 'ranking' | 'writing' | 'processing';

export interface SessionResponse {
  questionId: string;
  questionType: 'warmup' | 'scenario' | 'ranking' | 'writing' | 'reflection';
  answer: string | string[];
  reactionTimeMs?: number;
  metadata?: {
    timeToFirstKeystrokeMs?: number;
    totalCharacters?: number;
    pauseCount?: number;
  };
}

export interface SessionState {
  currentStep: WizardStep;
  responses: SessionResponse[];
  startedAt: string;
  dimensionAccumulator: Record<DimensionId, { sum: number; count: number }>;
}

export type SessionAction =
  | { type: 'ADD_RESPONSE'; payload: SessionResponse; scores: DimensionScoreMap }
  | {
      type: 'ADD_RANKING_RESPONSE';
      payload: SessionResponse;
      scores: DimensionScoreMap;
      reactionTimeMs: number;
      timeLimitMs: number;
    }
  | { type: 'SET_STEP'; step: WizardStep }
  | { type: 'RESET' };

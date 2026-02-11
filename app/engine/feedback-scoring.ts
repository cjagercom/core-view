import type { DimensionId } from '~/types/questions';
import type { FeedbackResponse } from '~/types/feedback';
import { feedbackQuestions } from '~/data/feedback-questions';

const DIMENSIONS: DimensionId[] = ['energy', 'processing', 'uncertainty', 'social', 'response'];

export function aggregateFeedback(responses: FeedbackResponse[]): Record<DimensionId, number> {
  const sums: Record<DimensionId, { sum: number; count: number }> = {
    energy: { sum: 0, count: 0 },
    processing: { sum: 0, count: 0 },
    uncertainty: { sum: 0, count: 0 },
    social: { sum: 0, count: 0 },
    response: { sum: 0, count: 0 },
  };

  for (const resp of responses) {
    const question = feedbackQuestions.find((q) => q.id === resp.questionId);
    if (!question) continue;
    const option = question.options.find((o) => o.id === resp.optionId);
    if (!option) continue;

    for (const [dim, value] of Object.entries(option.dimensionScores) as [DimensionId, number][]) {
      if (value !== undefined) {
        sums[dim].sum += value;
        sums[dim].count += 1;
      }
    }
  }

  const result = {} as Record<DimensionId, number>;
  for (const dim of DIMENSIONS) {
    if (sums[dim].count === 0) {
      result[dim] = 50;
    } else {
      const average = sums[dim].sum / sums[dim].count;
      result[dim] = Math.round(Math.min(100, Math.max(0, (average + 15) * (100 / 30))));
    }
  }
  return result;
}

import { useState, useCallback, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router';
import { rankingSets } from '~/data/questions/rankings';
import { useSessionDispatch, usePersist } from '~/lib/session-store';
import { TimedRanking } from '~/components/wizard/TimedRanking';
import { StepTransition } from '~/components/wizard/StepTransition';
import { accumulateRankingScores, createAccumulator } from '~/engine/scoring';
import type { DimensionId } from '~/types/questions';
import type { SessionResponse } from '~/types/session';

export default function RankingStep() {
  const [rankingIndex, setRankingIndex] = useState(0);
  const dispatch = useSessionDispatch();
  const { persistStep } = usePersist();
  const navigate = useNavigate();
  const stepResponses = useRef<SessionResponse[]>([]);

  useEffect(() => {
    dispatch({ type: 'SET_STEP', step: 'ranking' });
  }, [dispatch]);

  const handleComplete = useCallback(
    (rankedIds: string[], elapsedMs: number) => {
      const rankingSet = rankingSets[rankingIndex];
      const rankedItems = rankedIds.map((id) => rankingSet.items.find((item) => item.id === id)!);
      const isInverted = rankingSet.id === 'r3';

      const tempAcc = createAccumulator();
      accumulateRankingScores(tempAcc, rankedItems, elapsedMs, rankingSet.timeLimitMs, isInverted);

      const scores: Partial<Record<DimensionId, number>> = {};
      for (const dim of ['energy', 'processing', 'uncertainty', 'social', 'response'] as DimensionId[]) {
        if (tempAcc[dim].count > 0) {
          scores[dim] = tempAcc[dim].sum / tempAcc[dim].count;
        }
      }

      const response: SessionResponse = {
        questionId: rankingSet.id,
        questionType: 'ranking',
        answer: rankedIds,
        reactionTimeMs: elapsedMs,
      };

      dispatch({
        type: 'ADD_RESPONSE',
        payload: response,
        scores,
      });

      stepResponses.current.push(response);

      if (rankingIndex < rankingSets.length - 1) {
        setRankingIndex((prev) => prev + 1);
      } else {
        setTimeout(() => {
          persistStep('ranking', stepResponses.current);
        }, 0);
        navigate('/session/writing');
      }
    },
    [rankingIndex, dispatch, navigate, persistStep],
  );

  const rankingSet = rankingSets[rankingIndex];

  return (
    <StepTransition stepKey={`ranking-${rankingIndex}`}>
      <TimedRanking
        key={rankingSet.id}
        prompt={rankingSet.prompt}
        items={rankingSet.items}
        timeLimitMs={rankingSet.timeLimitMs}
        onComplete={handleComplete}
      />
    </StepTransition>
  );
}

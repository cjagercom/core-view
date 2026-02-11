import { useState, useCallback, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router';
import { writingPrompts } from '~/data/questions/writing-prompts';
import { useSessionDispatch, usePersist } from '~/lib/session-store';
import { WritingPrompt as WritingPromptComponent } from '~/components/wizard/WritingPrompt';
import { ReflectionQuestion } from '~/components/wizard/ReflectionQuestion';
import { StepTransition } from '~/components/wizard/StepTransition';
import { applyWritingMeta, createAccumulator } from '~/engine/scoring';
import type { DimensionId } from '~/types/questions';
import type { SessionResponse } from '~/types/session';

export default function WritingStep() {
  const [phase, setPhase] = useState<'writing' | 'followup'>('writing');
  const [followUpIndex, setFollowUpIndex] = useState(0);
  const dispatch = useSessionDispatch();
  const { persistStep } = usePersist();
  const navigate = useNavigate();
  const stepResponses = useRef<SessionResponse[]>([]);
  const writingTextRef = useRef<string>('');

  const prompt = writingPrompts[0];

  useEffect(() => {
    dispatch({ type: 'SET_STEP', step: 'writing' });
  }, [dispatch]);

  const handleWritingComplete = useCallback(
    (
      text: string,
      metadata: {
        timeToFirstKeystrokeMs: number;
        totalCharacters: number;
        pauseCount: number;
      },
    ) => {
      const tempAcc = createAccumulator();
      applyWritingMeta(tempAcc, metadata);

      const scores: Partial<Record<DimensionId, number>> = {};
      for (const dim of ['energy', 'processing', 'uncertainty', 'social', 'response'] as DimensionId[]) {
        if (tempAcc[dim].count > 0) {
          scores[dim] = tempAcc[dim].sum / tempAcc[dim].count;
        }
      }

      const response: SessionResponse = {
        questionId: prompt.id,
        questionType: 'writing',
        answer: text,
        metadata,
      };

      dispatch({
        type: 'ADD_RESPONSE',
        payload: response,
        scores,
      });

      stepResponses.current.push(response);
      writingTextRef.current = text;

      setPhase('followup');
    },
    [dispatch],
  );

  const handleFollowUpAnswer = useCallback(
    (optionId: string) => {
      const followUp = prompt.followUpQuestions[followUpIndex];
      const option = followUp.options.find((o) => o.id === optionId);
      if (!option) return;

      const response: SessionResponse = {
        questionId: followUp.id,
        questionType: 'reflection',
        answer: optionId,
      };

      dispatch({
        type: 'ADD_RESPONSE',
        payload: response,
        scores: option.dimensionScores,
      });

      stepResponses.current.push(response);

      if (followUpIndex < prompt.followUpQuestions.length - 1) {
        setFollowUpIndex((prev) => prev + 1);
      } else {
        setTimeout(() => {
          persistStep('writing', stepResponses.current, writingTextRef.current);
        }, 0);
        navigate('/session/processing');
      }
    },
    [followUpIndex, dispatch, navigate, persistStep],
  );

  if (phase === 'writing') {
    return (
      <StepTransition stepKey="writing">
        <WritingPromptComponent
          prompt={prompt.prompt}
          timeLimitMs={prompt.timeLimitMs}
          onComplete={handleWritingComplete}
        />
      </StepTransition>
    );
  }

  const followUp = prompt.followUpQuestions[followUpIndex];

  return (
    <StepTransition stepKey={`followup-${followUpIndex}`}>
      <ReflectionQuestion question={followUp.question} options={followUp.options} onAnswer={handleFollowUpAnswer} />
    </StepTransition>
  );
}

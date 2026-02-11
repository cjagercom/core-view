import { useState, useCallback, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router';
import { warmupQuestions } from '~/data/questions/warmup';
import { useSessionDispatch, usePersist } from '~/lib/session-store';
import { QuestionCard } from '~/components/wizard/QuestionCard';
import { StepTransition } from '~/components/wizard/StepTransition';
import type { SessionResponse } from '~/types/session';

export default function WarmupStep() {
  const [questionIndex, setQuestionIndex] = useState(0);
  const dispatch = useSessionDispatch();
  const { persistStep } = usePersist();
  const navigate = useNavigate();
  const stepResponses = useRef<SessionResponse[]>([]);

  useEffect(() => {
    dispatch({ type: 'SET_STEP', step: 'warmup' });
  }, [dispatch]);

  const handleAnswer = useCallback(
    (optionId: string) => {
      const question = warmupQuestions[questionIndex];
      const option = question.options.find((o) => o.id === optionId);
      if (!option) return;

      const response: SessionResponse = {
        questionId: question.id,
        questionType: 'warmup',
        answer: optionId,
      };

      dispatch({
        type: 'ADD_RESPONSE',
        payload: response,
        scores: option.dimensionScores,
      });

      stepResponses.current.push(response);

      if (questionIndex < warmupQuestions.length - 1) {
        setQuestionIndex((prev) => prev + 1);
      } else {
        // Persist step — setTimeout(0) ensures React has flushed the dispatch
        // so persistStep's stateRef has the latest accumulator
        setTimeout(() => {
          persistStep('warmup', stepResponses.current);
        }, 0);
        navigate('/session/scenarios');
      }
    },
    [questionIndex, dispatch, navigate, persistStep],
  );

  const question = warmupQuestions[questionIndex];

  return (
    <StepTransition stepKey={`warmup-${questionIndex}`}>
      <QuestionCard question={question.question} options={question.options} onAnswer={handleAnswer} />
    </StepTransition>
  );
}

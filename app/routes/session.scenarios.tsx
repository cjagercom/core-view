import { useState, useCallback, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router';
import { scenarios } from '~/data/questions/scenarios';
import { useSessionDispatch, usePersist } from '~/lib/session-store';
import { ScenarioCard } from '~/components/wizard/ScenarioCard';
import { StepTransition } from '~/components/wizard/StepTransition';
import { Button } from '~/components/ui/Button';
import type { SessionResponse } from '~/types/session';

export default function ScenariosStep() {
  const [showIntro, setShowIntro] = useState(true);
  const [scenarioIndex, setScenarioIndex] = useState(0);
  const dispatch = useSessionDispatch();
  const { persistStep } = usePersist();
  const navigate = useNavigate();
  const stepResponses = useRef<SessionResponse[]>([]);

  useEffect(() => {
    dispatch({ type: 'SET_STEP', step: 'scenarios' });
  }, [dispatch]);

  const handleAnswer = useCallback(
    (optionId: string) => {
      const scenario = scenarios[scenarioIndex];
      const option = scenario.options.find((o) => o.id === optionId);
      if (!option) return;

      const response: SessionResponse = {
        questionId: scenario.id,
        questionType: 'scenario',
        answer: optionId,
      };

      dispatch({
        type: 'ADD_RESPONSE',
        payload: response,
        scores: option.dimensionScores,
      });

      stepResponses.current.push(response);

      if (scenarioIndex < scenarios.length - 1) {
        setScenarioIndex((prev) => prev + 1);
      } else {
        setTimeout(() => {
          persistStep('scenarios', stepResponses.current);
        }, 0);
        navigate('/session/ranking');
      }
    },
    [scenarioIndex, dispatch, navigate, persistStep],
  );

  if (showIntro) {
    return (
      <StepTransition stepKey="scenario-intro">
        <div className="flex flex-col items-center text-center py-8">
          <p className="text-4xl mb-6">&#x1F9D2;</p>
          <h2 className="font-display text-2xl text-ink mb-3">Back to childhood</h2>
          <p className="text-ink-soft leading-relaxed mb-2 max-w-xs">
            The next questions take you back to specific ages.
          </p>
          <p className="text-ink-soft leading-relaxed mb-8 max-w-xs">
            Try to answer as the child you were, not who you are today.
          </p>
          <Button onClick={() => setShowIntro(false)}>I'm ready</Button>
        </div>
      </StepTransition>
    );
  }

  const scenario = scenarios[scenarioIndex];

  return (
    <StepTransition stepKey={`scenario-${scenarioIndex}`}>
      <ScenarioCard
        ageContext={scenario.ageContext}
        prompt={scenario.prompt}
        options={scenario.options}
        onAnswer={handleAnswer}
      />
    </StepTransition>
  );
}

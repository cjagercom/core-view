import { CircleCheck, CircleDot, Circle } from 'lucide-react';
import type { WizardStep } from '~/types/session';

const STEPS: { key: WizardStep; label: string }[] = [
  { key: 'warmup', label: 'Warm-up' },
  { key: 'scenarios', label: 'Scenarios' },
  { key: 'ranking', label: 'Rankings' },
  { key: 'writing', label: 'Writing' },
  { key: 'processing', label: 'Results' },
];

const TIME_ESTIMATES: Record<WizardStep, string> = {
  warmup: 'About 11 minutes remaining',
  scenarios: 'About 9 minutes remaining',
  ranking: 'About 6 minutes remaining',
  writing: 'About 4 minutes remaining',
  processing: 'Almost done',
};

export function ProgressBar({ currentStep }: { currentStep: WizardStep }) {
  const currentIndex = STEPS.findIndex((s) => s.key === currentStep);

  return (
    <div className="w-full sticky top-0 bg-paper pb-3 pt-1 -mx-5 px-5 border-b border-paper-dark z-10">
      <div className="flex items-center mb-2">
        {STEPS.map((step, i) => (
          <div key={step.key} className="flex items-center flex-1 last:flex-none">
            {i < currentIndex ? (
              <CircleCheck size={16} className="text-accent shrink-0" />
            ) : i === currentIndex ? (
              <CircleDot size={16} className="text-accent shrink-0" />
            ) : (
              <Circle size={16} className="text-paper-dark shrink-0" />
            )}
            {i < STEPS.length - 1 && (
              <div className={`flex-1 h-px mx-1 ${i < currentIndex ? 'bg-accent' : 'bg-paper-dark'}`} />
            )}
          </div>
        ))}
      </div>
      <div className="flex justify-between">
        {STEPS.map((step, i) => (
          <span key={step.key} className={`text-[10px] ${i === currentIndex ? 'text-ink' : 'text-ink-muted'}`}>
            {step.label}
          </span>
        ))}
      </div>
      <p className="text-xs text-ink-muted text-center mt-1">{TIME_ESTIMATES[currentStep]}</p>
    </div>
  );
}

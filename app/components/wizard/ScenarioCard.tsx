import { useState, useCallback } from 'react';
import { OptionSelector } from '~/components/ui/OptionSelector';

interface ScenarioCardProps {
  ageContext: string;
  prompt: string;
  options: { id: string; label: string }[];
  onAnswer: (optionId: string) => void;
}

export function ScenarioCard({ ageContext, prompt, options, onAnswer }: ScenarioCardProps) {
  const [selected, setSelected] = useState<string | null>(null);

  const handleSelect = useCallback(
    (id: string) => {
      if (selected) return;
      setSelected(id);
      setTimeout(() => onAnswer(id), 400);
    },
    [selected, onAnswer],
  );

  return (
    <div className="flex flex-col gap-5">
      <h2 className="font-display text-2xl text-ink">{ageContext}</h2>
      <p className="text-ink-soft leading-relaxed">{prompt}</p>
      <p className="text-sm italic text-ink-muted">Go with your first instinct.</p>
      <OptionSelector options={options} selected={selected} onSelect={handleSelect} />
    </div>
  );
}

import { useState, useCallback } from 'react';
import { OptionSelector } from '~/components/ui/OptionSelector';

interface QuestionCardProps {
  question: string;
  options: { id: string; label: string }[];
  onAnswer: (optionId: string) => void;
}

export function QuestionCard({ question, options, onAnswer }: QuestionCardProps) {
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
    <div className="flex flex-col gap-6">
      <h2 className="text-lg font-medium text-primary">{question}</h2>
      <OptionSelector options={options} selected={selected} onSelect={handleSelect} />
    </div>
  );
}

import { cn } from '~/lib/utils';

interface Option {
  id: string;
  label: string;
}

interface OptionSelectorProps {
  options: Option[];
  selected: string | null;
  onSelect: (id: string) => void;
}

export function OptionSelector({ options, selected, onSelect }: OptionSelectorProps) {
  return (
    <div className="flex flex-col gap-3">
      {options.map((option) => (
        <button
          key={option.id}
          onClick={() => onSelect(option.id)}
          disabled={selected !== null}
          className={cn(
            'w-full text-left rounded-[var(--radius-card)] p-4 px-5 border-2 transition-all duration-200 min-h-[48px]',
            selected === option.id
              ? 'border-accent bg-accent-light shadow-[0_0_0_1px_var(--color-accent)]'
              : selected !== null
                ? 'border-paper-dark bg-white opacity-50'
                : 'border-paper-dark bg-white hover:border-accent-mid hover:bg-accent-glow',
          )}
        >
          <span className="text-base font-medium text-ink">{option.label}</span>
        </button>
      ))}
    </div>
  );
}

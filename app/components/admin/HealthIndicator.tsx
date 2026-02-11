export type Health = 'green' | 'yellow' | 'red';

interface HealthIndicatorProps {
  health: Health;
  label: string;
}

const COLORS: Record<Health, string> = {
  green: 'bg-green-500',
  yellow: 'bg-yellow-500',
  red: 'bg-red-500',
};

const _ICONS: Record<Health, string> = {
  green: '\u{1F7E2}',
  yellow: '\u{1F7E1}',
  red: '\u{1F534}',
};

export function HealthIndicator({ health, label }: HealthIndicatorProps) {
  return (
    <span className="inline-flex items-center gap-1.5 text-sm">
      <span className={`w-2.5 h-2.5 rounded-full ${COLORS[health]}`} />
      <span>{label}</span>
    </span>
  );
}

export function getCompletionHealth(rate: number): Health {
  if (rate >= 70) return 'green';
  if (rate >= 50) return 'yellow';
  return 'red';
}

export function getDistributionHealth(maxPercent: number): Health {
  if (maxPercent <= 50) return 'green';
  if (maxPercent <= 65) return 'yellow';
  return 'red';
}

export function getArchetypeHealth(maxPercent: number, minCount: number): Health {
  if (maxPercent > 20 || minCount === 0) return 'red';
  if (maxPercent > 12) return 'yellow';
  return 'green';
}

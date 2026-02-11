import { HealthIndicator, getCompletionHealth } from './HealthIndicator';

interface FunnelStep {
  step: string;
  completions: number;
}

interface FunnelChartProps {
  data: FunnelStep[];
  totalStarted: number;
}

const STEP_LABELS: Record<string, string> = {
  warmup: 'Warm-up',
  scenarios: 'Scenarios',
  ranking: 'Rankings',
  writing: 'Writing',
  processing: 'Processing',
};

const STEP_ORDER = ['warmup', 'scenarios', 'ranking', 'writing', 'processing'];

export function FunnelChart({ data, totalStarted }: FunnelChartProps) {
  const stepMap = Object.fromEntries(data.map((d) => [d.step, d.completions]));
  const completionRate = totalStarted > 0 ? Math.round(((stepMap.processing || 0) / totalStarted) * 100) : 0;

  return (
    <div className="bg-white rounded-xl p-5 border border-gray-100">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-medium">Session Funnel</h3>
        <HealthIndicator health={getCompletionHealth(completionRate)} label={`${completionRate}% completion`} />
      </div>

      <div className="space-y-2">
        <div className="flex items-center gap-3">
          <span className="text-sm w-24 text-gray-500">Started</span>
          <div className="flex-1 bg-gray-100 rounded-full h-6 relative">
            <div className="bg-blue-500 h-6 rounded-full" style={{ width: '100%' }} />
            <span className="absolute inset-0 flex items-center justify-center text-xs text-white font-medium">
              {totalStarted}
            </span>
          </div>
          <span className="text-sm w-12 text-right text-gray-500">100%</span>
        </div>

        {STEP_ORDER.map((step) => {
          const count = stepMap[step] || 0;
          const pct = totalStarted > 0 ? Math.round((count / totalStarted) * 100) : 0;
          return (
            <div key={step} className="flex items-center gap-3">
              <span className="text-sm w-24 text-gray-500">{STEP_LABELS[step] || step}</span>
              <div className="flex-1 bg-gray-100 rounded-full h-6 relative">
                <div className="bg-blue-500 h-6 rounded-full transition-all" style={{ width: `${pct}%` }} />
                <span
                  className="absolute inset-0 flex items-center justify-center text-xs font-medium"
                  style={{ color: pct > 50 ? 'white' : '#6B7280' }}
                >
                  {count}
                </span>
              </div>
              <span className="text-sm w-12 text-right text-gray-500">{pct}%</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

import { HealthIndicator, getDistributionHealth } from './HealthIndicator';

interface AnswerData {
  question_id: string;
  option_id: string;
  count: number;
}

interface AnswerDistributionProps {
  data: AnswerData[];
}

export function AnswerDistribution({ data }: AnswerDistributionProps) {
  // Group by question
  const grouped: Record<string, { option_id: string; count: number }[]> = {};
  for (const row of data) {
    if (!grouped[row.question_id]) grouped[row.question_id] = [];
    grouped[row.question_id].push({ option_id: row.option_id, count: row.count });
  }

  const questions = Object.entries(grouped).sort(([a], [b]) => a.localeCompare(b));

  return (
    <div className="bg-white rounded-xl p-5 border border-gray-100">
      <h3 className="text-lg font-medium mb-4">Answer Distribution</h3>

      {questions.length === 0 ? (
        <p className="text-sm text-gray-400">No data yet</p>
      ) : (
        <div className="space-y-4">
          {questions.map(([qId, options]) => {
            const total = options.reduce((sum, o) => sum + o.count, 0);
            const maxPct = total > 0 ? Math.round((Math.max(...options.map((o) => o.count)) / total) * 100) : 0;

            return (
              <div key={qId}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium">{qId}</span>
                  <HealthIndicator health={getDistributionHealth(maxPct)} label={`max ${maxPct}%`} />
                </div>
                <div className="flex gap-1 h-4">
                  {options.map((opt) => {
                    const pct = total > 0 ? (opt.count / total) * 100 : 0;
                    return (
                      <div
                        key={opt.option_id}
                        className="bg-blue-400 rounded-sm relative group"
                        style={{ width: `${pct}%`, minWidth: pct > 0 ? '2px' : '0' }}
                        title={`${opt.option_id}: ${opt.count} (${Math.round(pct)}%)`}
                      />
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

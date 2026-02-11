import { HealthIndicator } from './HealthIndicator';
import type { Health } from './HealthIndicator';

interface LLMData {
  call_type: string;
  calls: number;
  avg_input_tokens: number;
  avg_output_tokens: number;
  avg_duration_ms: number;
}

interface LLMOperationsProps {
  data: LLMData[];
}

// Sonnet 4.5 pricing
const INPUT_COST_PER_TOKEN = 3 / 1_000_000;
const OUTPUT_COST_PER_TOKEN = 15 / 1_000_000;

function getLatencyHealth(ms: number): Health {
  if (ms < 4000) return 'green';
  if (ms < 8000) return 'yellow';
  return 'red';
}

export function LLMOperations({ data }: LLMOperationsProps) {
  const totalCalls = data.reduce((sum, d) => sum + d.calls, 0);
  const totalCost = data.reduce((sum, d) => {
    const inputCost = d.calls * d.avg_input_tokens * INPUT_COST_PER_TOKEN;
    const outputCost = d.calls * d.avg_output_tokens * OUTPUT_COST_PER_TOKEN;
    return sum + inputCost + outputCost;
  }, 0);

  return (
    <div className="bg-white rounded-xl p-5 border border-gray-100">
      <h3 className="text-lg font-medium mb-4">LLM Operations</h3>

      <div className="grid grid-cols-3 gap-4 mb-4">
        <div className="text-center p-3 bg-gray-50 rounded-lg">
          <div className="text-2xl font-bold text-primary">{totalCalls}</div>
          <div className="text-xs text-gray-500">Total calls</div>
        </div>
        <div className="text-center p-3 bg-gray-50 rounded-lg">
          <div className="text-2xl font-bold text-primary">${totalCost.toFixed(2)}</div>
          <div className="text-xs text-gray-500">Est. cost</div>
        </div>
        <div className="text-center p-3 bg-gray-50 rounded-lg">
          <div className="text-2xl font-bold text-primary">
            {totalCalls > 0 ? `$${(totalCost / totalCalls).toFixed(3)}` : '$0'}
          </div>
          <div className="text-xs text-gray-500">Per call</div>
        </div>
      </div>

      {data.length === 0 ? (
        <p className="text-sm text-gray-400">No LLM calls yet</p>
      ) : (
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-gray-500 border-b">
              <th className="pb-2">Type</th>
              <th className="pb-2">Calls</th>
              <th className="pb-2">Avg tokens</th>
              <th className="pb-2">Latency</th>
            </tr>
          </thead>
          <tbody>
            {data.map((row) => (
              <tr key={row.call_type} className="border-b border-gray-50">
                <td className="py-2 font-medium">{row.call_type}</td>
                <td className="py-2">{row.calls}</td>
                <td className="py-2 text-gray-500">
                  {row.avg_input_tokens ?? 0}in / {row.avg_output_tokens ?? 0}out
                </td>
                <td className="py-2">
                  <HealthIndicator
                    health={getLatencyHealth(row.avg_duration_ms)}
                    label={`${(row.avg_duration_ms / 1000).toFixed(1)}s`}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

import { HealthIndicator, getArchetypeHealth } from './HealthIndicator';

interface ArchetypeData {
  archetype_id: string;
  count: number;
}

interface ArchetypeHeatmapProps {
  data: ArchetypeData[];
}

export function ArchetypeHeatmap({ data }: ArchetypeHeatmapProps) {
  const total = data.reduce((sum, d) => sum + d.count, 0);
  const maxPct = total > 0 ? Math.round((Math.max(...data.map((d) => d.count)) / total) * 100) : 0;
  const minCount = data.length > 0 ? Math.min(...data.map((d) => d.count)) : 0;
  const maxCount = data.length > 0 ? Math.max(...data.map((d) => d.count)) : 0;

  return (
    <div className="bg-white rounded-xl p-5 border border-gray-100">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-medium">Archetype Distribution</h3>
        <HealthIndicator health={getArchetypeHealth(maxPct, minCount)} label={`${data.length} types, max ${maxPct}%`} />
      </div>

      {data.length === 0 ? (
        <p className="text-sm text-gray-400">No data yet</p>
      ) : (
        <div className="flex flex-wrap gap-1">
          {data.map((item) => {
            const pct = total > 0 ? (item.count / total) * 100 : 0;
            const intensity = maxCount > 0 ? item.count / maxCount : 0;
            return (
              <div
                key={item.archetype_id}
                className="rounded px-2 py-1 text-xs"
                style={{
                  backgroundColor: `rgba(59, 130, 246, ${0.1 + intensity * 0.6})`,
                  color: intensity > 0.5 ? 'white' : '#1A3A5C',
                }}
                title={`${item.archetype_id}: ${item.count} (${pct.toFixed(1)}%)`}
              >
                {item.archetype_id.replace(/-/g, ' ')} ({item.count})
              </div>
            );
          })}
        </div>
      )}

      <div className="mt-3 text-xs text-gray-400">
        Total profiles: {total} | Unique archetypes: {data.length}/48
      </div>
    </div>
  );
}

import { HealthIndicator } from './HealthIndicator';
import type { Health } from './HealthIndicator';

interface EngagementData {
  event_type: string;
  count: number;
}

interface EngagementMetricsProps {
  data: EngagementData[];
  totalCompleted: number;
}

interface Metric {
  label: string;
  eventType: string;
  thresholds: { green: number; yellow: number };
}

const METRICS: Metric[] = [
  { label: 'Link save rate', eventType: 'link_saved', thresholds: { green: 60, yellow: 40 } },
  { label: 'Profile share rate', eventType: 'profile_shared', thresholds: { green: 20, yellow: 10 } },
  { label: 'Follow-up start rate', eventType: 'followup_started', thresholds: { green: 15, yellow: 5 } },
  { label: 'Feedback creation rate', eventType: 'feedback_link_created', thresholds: { green: 10, yellow: 3 } },
  { label: 'Deep-dive unlock clicks', eventType: 'deep_dive_unlock_clicked', thresholds: { green: 30, yellow: 15 } },
];

function getHealth(rate: number, thresholds: { green: number; yellow: number }): Health {
  if (rate >= thresholds.green) return 'green';
  if (rate >= thresholds.yellow) return 'yellow';
  return 'red';
}

export function EngagementMetrics({ data, totalCompleted }: EngagementMetricsProps) {
  const eventMap = Object.fromEntries(data.map((d) => [d.event_type, d.count]));

  return (
    <div className="bg-white rounded-xl p-5 border border-gray-100">
      <h3 className="text-lg font-medium mb-4">Engagement & Retention</h3>

      <div className="space-y-3">
        {METRICS.map((metric) => {
          const count = eventMap[metric.eventType] || 0;
          const rate = totalCompleted > 0 ? Math.round((count / totalCompleted) * 100) : 0;
          return (
            <div key={metric.eventType} className="flex items-center justify-between">
              <span className="text-sm text-gray-600">{metric.label}</span>
              <div className="flex items-center gap-3">
                <span className="text-sm font-medium">
                  {count} ({rate}%)
                </span>
                <HealthIndicator health={getHealth(rate, metric.thresholds)} label="" />
              </div>
            </div>
          );
        })}

        {/* Additional standalone metrics */}
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">Feedback responses</span>
          <span className="text-sm font-medium">{eventMap.feedback_submitted || 0}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">Return visits</span>
          <span className="text-sm font-medium">{eventMap.return_visit || 0}</span>
        </div>
      </div>
    </div>
  );
}

import type { LoaderFunctionArgs } from 'react-router';
import { useLoaderData, useSearchParams, useNavigation } from 'react-router';
import { validateBasicAuth, unauthorizedResponse } from '~/lib/auth.server';
import { fetchAdminData } from '~/lib/admin-queries.server';
import { DashboardLayout } from '~/components/admin/DashboardLayout';
import { FunnelChart } from '~/components/admin/FunnelChart';
import { AnswerDistribution } from '~/components/admin/AnswerDistribution';
import { ArchetypeHeatmap } from '~/components/admin/ArchetypeHeatmap';
import { EngagementMetrics } from '~/components/admin/EngagementMetrics';
import { LLMOperations } from '~/components/admin/LLMOperations';
import { HealthIndicator, getCompletionHealth } from '~/components/admin/HealthIndicator';

export async function loader({ request }: LoaderFunctionArgs) {
  if (!validateBasicAuth(request)) {
    throw unauthorizedResponse();
  }

  const url = new URL(request.url);
  const days = parseInt(url.searchParams.get('days') || '30', 10);

  const data = await fetchAdminData(days);
  return data;
}

interface DashboardData {
  period: number;
  funnel: { step: string; completions: number }[];
  answerDistribution: { question_id: string; option_id: string; count: number }[];
  archetypeDistribution: { archetype_id: string; count: number }[];
  dimensionScores: Record<string, number>[];
  engagement: { event_type: string; count: number }[];
  llm: {
    call_type: string;
    calls: number;
    avg_input_tokens: number;
    avg_output_tokens: number;
    avg_duration_ms: number;
  }[];
  sessions: { started: number; completed: number };
  error?: string;
}

export default function AdminDashboard() {
  const data = useLoaderData<DashboardData>();
  const [searchParams, setSearchParams] = useSearchParams();
  const navigation = useNavigation();

  const period = parseInt(searchParams.get('days') || '30', 10);
  const isLoading = navigation.state === 'loading';

  const handlePeriodChange = (days: number) => {
    setSearchParams({ days: String(days) });
  };

  if (data.error) {
    return (
      <div className="min-h-dvh bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-xl font-medium text-gray-900 mb-2">Admin Dashboard</h1>
          <p className="text-sm text-red-500">{data.error}</p>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-dvh bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 rounded-full border-2 border-blue-500 border-t-transparent animate-spin mx-auto mb-3" />
          <p className="text-sm text-gray-500">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  const completionRate =
    data.sessions.started > 0 ? Math.round((data.sessions.completed / data.sessions.started) * 100) : 0;

  return (
    <DashboardLayout period={period} onPeriodChange={handlePeriodChange}>
      {/* Health Summary */}
      <div className="bg-white rounded-xl p-5 border border-gray-100">
        <h3 className="text-lg font-medium mb-3">Overall Health</h3>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <div className="text-center p-3 bg-gray-50 rounded-lg">
            <HealthIndicator health={getCompletionHealth(completionRate)} label="" />
            <div className="text-sm font-medium mt-1">Funnel</div>
            <div className="text-xs text-gray-500">{completionRate}% completion</div>
          </div>
          <div className="text-center p-3 bg-gray-50 rounded-lg">
            <div className="text-sm font-medium">Content</div>
            <div className="text-xs text-gray-500">{data.answerDistribution.length > 0 ? 'Active' : 'No data'}</div>
          </div>
          <div className="text-center p-3 bg-gray-50 rounded-lg">
            <div className="text-sm font-medium">Archetypes</div>
            <div className="text-xs text-gray-500">{data.archetypeDistribution.length} types</div>
          </div>
          <div className="text-center p-3 bg-gray-50 rounded-lg">
            <div className="text-sm font-medium">Engagement</div>
            <div className="text-xs text-gray-500">{data.engagement.reduce((s, e) => s + e.count, 0)} events</div>
          </div>
          <div className="text-center p-3 bg-gray-50 rounded-lg">
            <div className="text-sm font-medium">LLM</div>
            <div className="text-xs text-gray-500">{data.llm.reduce((s, l) => s + l.calls, 0)} calls</div>
          </div>
        </div>
      </div>

      <FunnelChart data={data.funnel} totalStarted={data.sessions.started} />
      <AnswerDistribution data={data.answerDistribution} />
      <ArchetypeHeatmap data={data.archetypeDistribution} />
      <EngagementMetrics data={data.engagement} totalCompleted={data.sessions.completed} />
      <LLMOperations data={data.llm} />
    </DashboardLayout>
  );
}

import { getDb } from '~/lib/db';

export async function fetchAdminData(days: number) {
  const sql = getDb();

  const [
    funnelData,
    answerDistribution,
    archetypeDistribution,
    dimensionScores,
    engagementData,
    llmData,
    sessionCounts,
  ] = await Promise.all([
    // Funnel: count unique sessions per step (dedup repeated calls)
    sql`
      SELECT event_data->>'step' as step,
             COUNT(DISTINCT event_data->>'sessionId')::int as completions
      FROM analytics_events
      WHERE event_type = 'step_completed'
        AND occurred_at > NOW() - MAKE_INTERVAL(days => ${days})
      GROUP BY event_data->>'step'
    `,
    // Answer distribution: count unique sessions per question+option
    sql`
      SELECT event_data->>'questionId' as question_id,
             event_data->>'optionId' as option_id,
             COUNT(DISTINCT event_data->>'sessionId')::int as count
      FROM analytics_events
      WHERE event_type = 'question_answered'
        AND occurred_at > NOW() - MAKE_INTERVAL(days => ${days})
      GROUP BY event_data->>'questionId', event_data->>'optionId'
      ORDER BY question_id, count DESC
    `,
    // Archetype distribution
    sql`
      SELECT event_data->>'archetypeId' as archetype_id, COUNT(*)::int as count
      FROM analytics_events
      WHERE event_type = 'archetype_assigned'
        AND occurred_at > NOW() - MAKE_INTERVAL(days => ${days})
      GROUP BY event_data->>'archetypeId'
      ORDER BY count DESC
    `,
    // Dimension score distributions
    sql`
      SELECT event_data
      FROM analytics_events
      WHERE event_type = 'dimension_scores'
        AND occurred_at > NOW() - MAKE_INTERVAL(days => ${days})
    `,
    // Engagement events
    sql`
      SELECT event_type, COUNT(*)::int as count
      FROM analytics_events
      WHERE event_type IN ('link_saved', 'profile_shared', 'followup_started', 'feedback_link_created', 'feedback_submitted', 'return_visit')
        AND occurred_at > NOW() - MAKE_INTERVAL(days => ${days})
      GROUP BY event_type
    `,
    // LLM operations
    sql`
      SELECT
        event_data->>'callType' as call_type,
        COUNT(*)::int as calls,
        AVG((event_data->>'inputTokens')::numeric)::int as avg_input_tokens,
        AVG((event_data->>'outputTokens')::numeric)::int as avg_output_tokens,
        AVG((event_data->>'durationMs')::numeric)::int as avg_duration_ms
      FROM analytics_events
      WHERE event_type = 'llm_call'
        AND occurred_at > NOW() - MAKE_INTERVAL(days => ${days})
      GROUP BY event_data->>'callType'
    `,
    // Total session counts: unique sessions
    sql`
      SELECT
        COUNT(DISTINCT CASE WHEN event_type = 'session_started' THEN event_data->>'sessionId' END)::int as started,
        COUNT(DISTINCT CASE WHEN event_type = 'session_completed' THEN event_data->>'sessionId' END)::int as completed
      FROM analytics_events
      WHERE occurred_at > NOW() - MAKE_INTERVAL(days => ${days})
    `,
  ]);

  return {
    period: days,
    funnel: funnelData,
    answerDistribution,
    archetypeDistribution,
    dimensionScores: dimensionScores.map((r) => r.event_data),
    engagement: engagementData,
    llm: llmData,
    sessions: sessionCounts[0] || { started: 0, completed: 0 },
  };
}

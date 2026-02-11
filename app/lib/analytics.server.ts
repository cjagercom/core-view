import { getDb } from '~/lib/db';

/**
 * Fire-and-forget server-side event tracking.
 * Never throws — silently swallows errors to avoid breaking the main flow.
 */
export function trackEventServer(type: string, data: Record<string, unknown> = {}) {
  try {
    const sql = getDb();
    sql`
      INSERT INTO analytics_events (event_type, event_data)
      VALUES (${type}, ${JSON.stringify(data)}::jsonb)
    `.catch(() => {});
  } catch {
    // Silently ignore
  }
}

import type { ActionFunctionArgs } from 'react-router';
import { getDb } from '~/lib/db';

export async function action({ request }: ActionFunctionArgs) {
  if (request.method !== 'POST') {
    return new Response(null, { status: 405 });
  }

  try {
    const { type, data } = (await request.json()) as { type: string; data: Record<string, unknown> };
    const sql = getDb();
    await sql`
      INSERT INTO analytics_events (event_type, event_data)
      VALUES (${type}, ${JSON.stringify(data)}::jsonb)
    `;
  } catch {
    // Fire-and-forget: silently ignore analytics errors
  }

  return new Response(null, { status: 204 });
}

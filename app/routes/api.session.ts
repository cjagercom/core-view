import type { ActionFunctionArgs, LoaderFunctionArgs } from 'react-router';
import { getDb } from '~/lib/db';
import { generateSessionToken } from '~/lib/tokens';
import { createAccumulator } from '~/engine/scoring';
import { trackEventServer } from '~/lib/analytics.server';

export async function loader({ request }: LoaderFunctionArgs) {
  const url = new URL(request.url);
  const id = url.searchParams.get('id');
  if (!id) {
    return Response.json({ error: 'Missing session id' }, { status: 400 });
  }

  const sql = getDb();
  const rows = await sql`
    SELECT id, status, current_step, session_number, responses,
           dimension_accumulator, profile, llm_profile_text, writing_text,
           feedback_token, feedback_enabled, feedback_responses, feedback_link_active,
           feedback_open_texts, finalized_at, final_profile_text,
           deep_dive_adjustments, deep_dive_messages,
           reconciliation_adjustments, reconciliation_messages,
           profile_v1, profile_v2,
           profile_text_versions,
           created_at, last_active_at
    FROM sessions WHERE id = ${id}
  `;

  if (rows.length === 0) {
    return Response.json({ error: 'Session not found' }, { status: 404 });
  }

  const session = rows[0];
  await sql`UPDATE sessions SET last_active_at = NOW() WHERE id = ${id}`;

  return Response.json({ session });
}

export async function action({ request }: ActionFunctionArgs) {
  if (request.method !== 'POST') {
    return Response.json({ error: 'Method not allowed' }, { status: 405 });
  }

  const sql = getDb();
  const token = generateSessionToken();
  const accumulator = createAccumulator();

  await sql`
    INSERT INTO sessions (id, dimension_accumulator)
    VALUES (${token}, ${JSON.stringify(accumulator)})
  `;

  trackEventServer('session_started', { sessionId: token });

  return Response.json({ token });
}

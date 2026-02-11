import type { ActionFunctionArgs, LoaderFunctionArgs } from 'react-router';
import { getDb } from '~/lib/db';
import { generateFeedbackToken } from '~/lib/tokens';
import { trackEventServer } from '~/lib/analytics.server';

export async function loader({ params }: LoaderFunctionArgs) {
  const { id } = params;
  if (!id) return Response.json({ error: 'Missing session id' }, { status: 400 });

  const sql = getDb();
  const rows = await sql`
    SELECT feedback_token, feedback_enabled, feedback_link_active,
           feedback_responses
    FROM sessions WHERE id = ${id}
  `;

  if (rows.length === 0) {
    return Response.json({ error: 'Session not found' }, { status: 404 });
  }

  const session = rows[0];
  return Response.json({
    feedbackToken: session.feedback_token,
    feedbackEnabled: session.feedback_enabled,
    feedbackLinkActive: session.feedback_link_active,
    feedbackCount: Array.isArray(session.feedback_responses) ? (session.feedback_responses as unknown[]).length : 0,
  });
}

export async function action({ request, params }: ActionFunctionArgs) {
  const { id } = params;
  if (!id) return Response.json({ error: 'Missing session id' }, { status: 400 });

  const sql = getDb();

  if (request.method === 'POST') {
    const body = (await request.json()) as { action: 'create' | 'toggle' };

    if (body.action === 'create') {
      const feedbackToken = generateFeedbackToken();
      await sql`
        UPDATE sessions SET
          feedback_token = ${feedbackToken},
          feedback_enabled = true,
          feedback_link_active = true
        WHERE id = ${id}
      `;
      trackEventServer('feedback_link_created', { sessionId: id });
      return Response.json({ feedbackToken });
    }

    if (body.action === 'toggle') {
      await sql`
        UPDATE sessions SET
          feedback_link_active = NOT feedback_link_active
        WHERE id = ${id}
      `;
      return Response.json({ success: true });
    }

    return Response.json({ error: 'Invalid action' }, { status: 400 });
  }

  return Response.json({ error: 'Method not allowed' }, { status: 405 });
}

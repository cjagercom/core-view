import type { ActionFunctionArgs } from 'react-router';
import { getDb } from '~/lib/db';
import { generateShareToken } from '~/lib/tokens';
import { trackEventServer } from '~/lib/analytics.server';

export async function action({ request, params }: ActionFunctionArgs) {
  const { id } = params;
  if (!id) return Response.json({ error: 'Missing session id' }, { status: 400 });

  if (request.method !== 'POST') {
    return Response.json({ error: 'Method not allowed' }, { status: 405 });
  }

  const body = (await request.json()) as { action: 'create' };

  if (body.action === 'create') {
    const sql = getDb();

    const rows = await sql`
      SELECT share_token FROM sessions WHERE id = ${id}
    `;

    if (rows.length === 0) {
      return Response.json({ error: 'Session not found' }, { status: 404 });
    }

    // Idempotent: return existing token if already created
    if (rows[0].share_token) {
      return Response.json({ shareToken: rows[0].share_token });
    }

    const shareToken = generateShareToken();
    await sql`
      UPDATE sessions SET share_token = ${shareToken}
      WHERE id = ${id}
    `;

    trackEventServer('share_link_created', { sessionId: id });
    return Response.json({ shareToken });
  }

  return Response.json({ error: 'Invalid action' }, { status: 400 });
}

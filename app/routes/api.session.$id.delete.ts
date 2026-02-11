import type { ActionFunctionArgs } from 'react-router';
import { getDb } from '~/lib/db';

export async function action({ request, params }: ActionFunctionArgs) {
  if (request.method !== 'DELETE') {
    return Response.json({ error: 'Method not allowed' }, { status: 405 });
  }

  const { id } = params;
  if (!id) return Response.json({ error: 'Missing session id' }, { status: 400 });

  const sql = getDb();
  const result = await sql`DELETE FROM sessions WHERE id = ${id}`;

  if (result.length === 0 && (result as unknown as { count: number }).count === 0) {
    // Even if no rows deleted, return success (idempotent)
  }

  return Response.json({ success: true });
}

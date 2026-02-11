import type { LoaderFunctionArgs } from 'react-router';
import { getDb } from '~/lib/db';

export async function loader({ params }: LoaderFunctionArgs) {
  const { token } = params;
  if (!token) return Response.json({ error: 'Missing share token' }, { status: 400 });

  const sql = getDb();
  const rows = await sql`
    SELECT profile, llm_profile_text, final_profile_text, finalized_at
    FROM sessions WHERE share_token = ${token}
  `;

  if (rows.length === 0) {
    return Response.json({ error: 'Profile not found' }, { status: 404 });
  }

  const session = rows[0];
  if (!session.profile) {
    return Response.json({ error: 'Profile not yet available' }, { status: 404 });
  }

  // Return ONLY public-safe data — no session ID, no raw responses, no feedback
  const profileText = session.finalized_at ? session.final_profile_text : (session.llm_profile_text ?? null);

  return Response.json({
    profile: session.profile,
    profileText,
  });
}

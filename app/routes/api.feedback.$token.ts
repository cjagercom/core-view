import type { ActionFunctionArgs, LoaderFunctionArgs } from 'react-router';
import { getDb } from '~/lib/db';
import { feedbackQuestions } from '~/data/feedback-questions';
import type { FeedbackResponse } from '~/types/feedback';
import { trackEventServer } from '~/lib/analytics.server';

export async function loader({ params }: LoaderFunctionArgs) {
  const { token } = params;
  if (!token) return Response.json({ error: 'Missing feedback token' }, { status: 400 });

  const sql = getDb();
  const rows = await sql`
    SELECT feedback_link_active FROM sessions WHERE feedback_token = ${token}
  `;

  if (rows.length === 0) {
    return Response.json({ error: 'Feedback link not found' }, { status: 404 });
  }

  if (!rows[0].feedback_link_active) {
    return Response.json({ error: 'This feedback link is no longer active', active: false }, { status: 410 });
  }

  return Response.json({ active: true, questions: feedbackQuestions });
}

export async function action({ request, params }: ActionFunctionArgs) {
  if (request.method !== 'POST') {
    return Response.json({ error: 'Method not allowed' }, { status: 405 });
  }

  const { token } = params;
  if (!token) return Response.json({ error: 'Missing feedback token' }, { status: 400 });

  const sql = getDb();
  const rows = await sql`
    SELECT id, feedback_link_active, feedback_responses FROM sessions WHERE feedback_token = ${token}
  `;

  if (rows.length === 0) {
    return Response.json({ error: 'Feedback link not found' }, { status: 404 });
  }

  if (!rows[0].feedback_link_active) {
    return Response.json({ error: 'This feedback link is no longer active' }, { status: 410 });
  }

  const body = (await request.json()) as { responses: FeedbackResponse[]; openText?: string };
  const existingResponses = (rows[0].feedback_responses as FeedbackResponse[][]) || [];
  const allResponses = [...existingResponses, body.responses];

  if (body.openText) {
    await sql`
      UPDATE sessions SET
        feedback_responses = ${JSON.stringify(allResponses)}::jsonb,
        feedback_open_texts = COALESCE(feedback_open_texts, '[]'::jsonb) || ${JSON.stringify([body.openText])}::jsonb
      WHERE feedback_token = ${token}
    `;
  } else {
    await sql`
      UPDATE sessions SET
        feedback_responses = ${JSON.stringify(allResponses)}::jsonb
      WHERE feedback_token = ${token}
    `;
  }

  trackEventServer('feedback_submitted', { feedbackToken: token, responseCount: allResponses.length });

  return Response.json({ success: true });
}

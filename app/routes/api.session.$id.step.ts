import type { ActionFunctionArgs } from 'react-router';
import { getDb } from '~/lib/db';
import type { SessionResponse, WizardStep } from '~/types/session';
import { trackEventServer } from '~/lib/analytics.server';

const STEP_ORDER: WizardStep[] = ['warmup', 'scenarios', 'ranking', 'writing', 'processing'];

function getNextStep(current: WizardStep): WizardStep | null {
  const idx = STEP_ORDER.indexOf(current);
  return idx >= 0 && idx < STEP_ORDER.length - 1 ? STEP_ORDER[idx + 1] : null;
}

export async function action({ request, params }: ActionFunctionArgs) {
  if (request.method !== 'POST') {
    return Response.json({ error: 'Method not allowed' }, { status: 405 });
  }

  const { id } = params;
  if (!id) return Response.json({ error: 'Missing session id' }, { status: 400 });

  const body = (await request.json()) as {
    step: WizardStep;
    responses: SessionResponse[];
    dimensionAccumulator: Record<string, { sum: number; count: number }>;
    writingText?: string;
  };

  const sql = getDb();

  const rows = await sql`SELECT id, responses, status FROM sessions WHERE id = ${id}`;
  if (rows.length === 0) {
    return Response.json({ error: 'Session not found' }, { status: 404 });
  }

  const session = rows[0];
  if (session.status !== 'in_progress') {
    return Response.json({ error: 'Session is not in progress' }, { status: 400 });
  }

  const existingResponses = (session.responses as SessionResponse[]) || [];
  const allResponses = [...existingResponses, ...body.responses];
  const nextStep = getNextStep(body.step);
  const isComplete = body.step === 'processing';

  await sql`
    UPDATE sessions SET
      responses = ${JSON.stringify(allResponses)}::jsonb,
      dimension_accumulator = ${JSON.stringify(body.dimensionAccumulator)}::jsonb,
      current_step = ${nextStep ?? body.step},
      status = ${isComplete ? 'completed' : 'in_progress'},
      last_active_at = NOW(),
      writing_text = COALESCE(${body.writingText ?? null}, writing_text)
    WHERE id = ${id}
  `;

  // Track step completion
  trackEventServer('step_completed', { sessionId: id, step: body.step });

  // Track individual question answers
  for (const r of body.responses) {
    if (r.questionType === 'warmup' || r.questionType === 'scenario' || r.questionType === 'reflection') {
      trackEventServer('question_answered', {
        sessionId: id,
        questionId: r.questionId,
        optionId: typeof r.answer === 'string' ? r.answer : undefined,
      });
    }
  }

  // Track session completion
  if (isComplete) {
    trackEventServer('session_completed', { sessionId: id });
  }

  return Response.json({ nextStep, success: true });
}

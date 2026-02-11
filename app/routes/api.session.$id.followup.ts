import type { LoaderFunctionArgs } from 'react-router';
import { generateText } from 'ai';
import { getDb } from '~/lib/db';
import { getAnthropicModel, buildLLMContext, FOLLOWUP_SYSTEM_PROMPT } from '~/lib/llm';
import { getLowestConfidenceDimensions } from '~/engine/confidence';
import type { DimensionScore } from '~/types/profile';
import { trackEventServer } from '~/lib/analytics.server';

export async function loader({ params }: LoaderFunctionArgs) {
  const { id } = params;
  if (!id) return Response.json({ error: 'Missing session id' }, { status: 400 });

  const sql = getDb();
  const rows = await sql`
    SELECT id, status, session_number, responses, dimension_accumulator,
           profile, writing_text, feedback_responses
    FROM sessions WHERE id = ${id}
  `;

  if (rows.length === 0) {
    return Response.json({ error: 'Session not found' }, { status: 404 });
  }

  const session = rows[0];
  const profile = session.profile as {
    dimensions: DimensionScore[];
    archetypeName: string;
    archetypeDistance: number;
  };

  if (!profile) {
    return Response.json({ error: 'Session has no completed profile' }, { status: 400 });
  }

  const lowestConfidenceDims = getLowestConfidenceDimensions(profile.dimensions);

  if (lowestConfidenceDims.length === 0) {
    return Response.json({ error: 'All dimensions have sufficient confidence' }, { status: 400 });
  }

  const context = buildLLMContext({
    dimensionScores: profile.dimensions,
    archetypeName: profile.archetypeName,
    archetypeDistance: profile.archetypeDistance,
    sessionNumber: session.session_number as number,
    responses:
      (session.responses as {
        questionId: string;
        questionType: string;
        answer: string | string[];
        reactionTimeMs?: number;
      }[]) || [],
    writingText: session.writing_text as string | undefined,
    feedbackResponses: (session.feedback_responses as unknown[]) || [],
  });

  const model = getAnthropicModel();
  const llmStartTime = Date.now();
  const result = await generateText({
    model,
    system: FOLLOWUP_SYSTEM_PROMPT,
    prompt: `${context}\n\nLowest confidence dimensions: ${lowestConfidenceDims.join(', ')}`,
  });

  trackEventServer('llm_call', {
    callType: 'followup',
    sessionId: id,
    inputTokens: result.usage?.promptTokens ?? 0,
    outputTokens: result.usage?.completionTokens ?? 0,
    durationMs: Date.now() - llmStartTime,
  });
  trackEventServer('followup_started', { sessionId: id });

  let questions;
  try {
    const jsonMatch = result.text.match(/\[[\s\S]*\]/);
    if (!jsonMatch) throw new Error('No JSON array found in LLM response');
    questions = JSON.parse(jsonMatch[0]);
  } catch {
    return Response.json({ error: 'Failed to parse follow-up questions' }, { status: 500 });
  }

  // Increment session number
  await sql`
    UPDATE sessions SET
      session_number = session_number + 1,
      status = 'in_progress',
      current_step = 'warmup'
    WHERE id = ${id}
  `;

  return Response.json({ questions, targetDimensions: lowestConfidenceDims });
}

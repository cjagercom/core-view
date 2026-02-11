import type { ActionFunctionArgs } from 'react-router';
import { streamText } from 'ai';
import { getDb } from '~/lib/db';
import { getAnthropicModel, buildLLMContext, FINAL_PROFILE_SYSTEM_PROMPT } from '~/lib/llm';
import type { DimensionScore } from '~/types/profile';
import { trackEventServer } from '~/lib/analytics.server';

export async function action({ request, params }: ActionFunctionArgs) {
  if (request.method !== 'POST') {
    return Response.json({ error: 'Method not allowed' }, { status: 405 });
  }

  const { id } = params;
  if (!id) return Response.json({ error: 'Missing session id' }, { status: 400 });

  const sql = getDb();
  const rows = await sql`
    SELECT id, status, session_number, responses, profile, writing_text,
           feedback_responses, feedback_open_texts,
           deep_dive_messages, reconciliation_messages,
           finalized_at, final_profile_text
    FROM sessions WHERE id = ${id}
  `;

  if (rows.length === 0) {
    return Response.json({ error: 'Session not found' }, { status: 404 });
  }

  const session = rows[0];

  if (session.finalized_at) {
    // Already finalized — return cached text
    return Response.json({
      finalProfileText: session.final_profile_text,
      finalizedAt: session.finalized_at,
    });
  }

  const profile = session.profile as {
    dimensions: DimensionScore[];
    archetypeId: string;
    archetypeName: string;
    archetypeDistance: number;
  };

  if (!profile) {
    return Response.json({ error: 'Profile not computed yet' }, { status: 400 });
  }

  // Mark as finalized immediately and disable feedback
  await sql`
    UPDATE sessions SET
      finalized_at = NOW(),
      feedback_link_active = false
    WHERE id = ${id}
  `;

  const feedbackResponses = (session.feedback_responses as unknown[]) || [];
  const feedbackOpenTexts = (session.feedback_open_texts as string[]) || [];
  const deepDiveMessages = (session.deep_dive_messages as { role: string; content: string }[]) || [];
  const reconciliationMessages = (session.reconciliation_messages as { role: string; content: string }[]) || [];

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
    feedbackResponses,
    feedbackOpenTexts,
    deepDiveMessages,
    reconciliationMessages,
  });

  const model = getAnthropicModel();
  const llmStartTime = Date.now();
  const result = streamText({
    model,
    system: FINAL_PROFILE_SYSTEM_PROMPT,
    messages: [
      { role: 'user', content: context },
      {
        role: 'user',
        content:
          'Now write the final profile. CRITICAL: You MUST use **bold section headers** on their own line, **bold** for key phrases, and *italic* for rhetorical questions. Start your response with a **bold section header**.',
      },
    ],
  });

  // Save the final text to DB once complete
  result.text
    .then(async (fullText) => {
      if (fullText.trim()) {
        await sql`
        UPDATE sessions SET final_profile_text = ${fullText.trim()}
        WHERE id = ${id}
      `;
      }
    })
    .catch(() => {});

  // Track LLM usage separately
  result.usage
    .then((usage) => {
      trackEventServer('llm_call', {
        callType: 'finalize',
        sessionId: id,
        inputTokens: usage?.promptTokens ?? 0,
        outputTokens: usage?.completionTokens ?? 0,
        durationMs: Date.now() - llmStartTime,
      });
    })
    .catch(() => {});

  return result.toTextStreamResponse();
}

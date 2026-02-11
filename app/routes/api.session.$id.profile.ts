import type { LoaderFunctionArgs } from 'react-router';
import { streamText } from 'ai';
import { getDb } from '~/lib/db';
import { getAnthropicModel, buildLLMContext, PROFILE_SYSTEM_PROMPT } from '~/lib/llm';
import { normalizeScores } from '~/engine/scoring';
import { matchArchetype } from '~/engine/archetypes';
import type { DimensionId } from '~/types/questions';
import type { DimensionScore } from '~/types/profile';
import { trackEventServer } from '~/lib/analytics.server';

const DIMENSIONS: DimensionId[] = ['energy', 'processing', 'uncertainty', 'social', 'response'];

export async function loader({ params }: LoaderFunctionArgs) {
  const { id } = params;
  if (!id) return Response.json({ error: 'Missing session id' }, { status: 400 });

  const sql = getDb();
  const rows = await sql`
    SELECT id, status, session_number, responses, dimension_accumulator,
           profile, llm_profile_text, writing_text, feedback_responses,
           feedback_open_texts, deep_dive_messages, reconciliation_messages,
           deep_dive_adjustments, reconciliation_adjustments,
           profile_text_versions
    FROM sessions WHERE id = ${id}
  `;

  if (rows.length === 0) {
    return Response.json({ error: 'Session not found' }, { status: 404 });
  }

  const session = rows[0];

  // If profile not yet computed, compute it now
  if (!session.profile) {
    const accumulator = session.dimension_accumulator as Record<DimensionId, { sum: number; count: number }>;
    const scores = normalizeScores(accumulator);
    const archetype = matchArchetype(scores);
    const archetypeDistance = Math.sqrt(
      DIMENSIONS.reduce((sum, dim) => {
        const score = scores.find((s) => s.dimensionId === dim)?.score ?? 50;
        return sum + (score - archetype.centroid[dim]) ** 2;
      }, 0),
    );

    const profile = {
      dimensions: scores,
      archetypeId: archetype.id,
      archetypeName: archetype.name,
      archetypeDistance,
      completedAt: new Date().toISOString(),
    };

    await sql`
      UPDATE sessions SET
        profile = ${JSON.stringify(profile)}::jsonb,
        status = ${`session_${session.session_number}_complete`}
      WHERE id = ${id}
    `;

    session.profile = profile;
    session.status = `session_${session.session_number}_complete`;

    // Track profile generation events
    const scoreMap = Object.fromEntries(scores.map((s) => [s.dimensionId, s.score]));
    trackEventServer('dimension_scores', scoreMap);
    trackEventServer('archetype_assigned', { archetypeId: archetype.id, archetypeName: archetype.name });
  }

  const feedbackResponses = (session.feedback_responses as unknown[]) || [];
  const feedbackOpenTexts = (session.feedback_open_texts as string[]) || [];
  const deepDiveMessages = (session.deep_dive_messages as { role: string; content: string }[]) || [];
  const reconciliationMessages = (session.reconciliation_messages as { role: string; content: string }[]) || [];

  // Determine current journey state for cache comparison
  const currentMeta = {
    feedbackCount: feedbackResponses.length,
    hasDeepDive: !!session.deep_dive_adjustments,
    hasReconciliation: !!session.reconciliation_adjustments,
  };

  // Check if we have a valid cached version that matches current state
  const versions =
    (session.profile_text_versions as {
      text: string;
      generatedAt: string;
      feedbackCount: number;
      hasDeepDive: boolean;
      hasReconciliation: boolean;
    }[]) || [];
  const latest = versions.length > 0 ? versions[versions.length - 1] : null;

  if (
    latest &&
    latest.feedbackCount === currentMeta.feedbackCount &&
    latest.hasDeepDive === currentMeta.hasDeepDive &&
    latest.hasReconciliation === currentMeta.hasReconciliation
  ) {
    return Response.json({
      profile: session.profile,
      llmText: latest.text,
      cached: true,
    });
  }

  // Stream LLM profile text
  const profile = session.profile as {
    dimensions: DimensionScore[];
    archetypeId: string;
    archetypeName: string;
    archetypeDistance: number;
  };

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
    system: PROFILE_SYSTEM_PROMPT,
    messages: [
      { role: 'user', content: context },
      {
        role: 'user',
        content:
          'Now write the profile. CRITICAL: You MUST use **bold section headers** on their own line, **bold** for key phrases, and *italic* for rhetorical questions. Start your response with a **bold section header**.',
      },
    ],
  });

  // Save the full text as a new version once the model finishes
  result.text
    .then(async (fullText) => {
      if (fullText.trim()) {
        const newVersion = {
          text: fullText.trim(),
          generatedAt: new Date().toISOString(),
          ...currentMeta,
        };
        await sql`
        UPDATE sessions SET
          llm_profile_text = ${fullText.trim()},
          profile_text_versions = COALESCE(profile_text_versions, '[]'::jsonb) || ${JSON.stringify([newVersion])}::jsonb
        WHERE id = ${id}
      `;
      }
    })
    .catch(() => {});

  // Track LLM usage separately
  result.usage
    .then((usage) => {
      trackEventServer('llm_call', {
        callType: 'profile',
        sessionId: id,
        inputTokens: usage?.promptTokens ?? 0,
        outputTokens: usage?.completionTokens ?? 0,
        durationMs: Date.now() - llmStartTime,
      });
    })
    .catch(() => {});

  // Stream text to the client
  return result.toTextStreamResponse({
    headers: {
      'X-Profile-Data': encodeURIComponent(JSON.stringify(session.profile)),
    },
  });
}

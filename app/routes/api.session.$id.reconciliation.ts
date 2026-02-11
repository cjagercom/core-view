import type { ActionFunctionArgs } from 'react-router';
import { streamText } from 'ai';
import { getDb } from '~/lib/db';
import { getAnthropicModel, buildLLMContext, RECONCILIATION_SYSTEM_PROMPT } from '~/lib/llm';
import { aggregateFeedback } from '~/engine/feedback-scoring';
import type { DimensionId } from '~/types/questions';
import type { DimensionScore } from '~/types/profile';
import type { FeedbackResponse } from '~/types/feedback';
import { trackEventServer } from '~/lib/analytics.server';

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export async function action({ request, params }: ActionFunctionArgs) {
  if (request.method !== 'POST') {
    return Response.json({ error: 'Method not allowed' }, { status: 405 });
  }

  const { id } = params;
  if (!id) return Response.json({ error: 'Missing session id' }, { status: 400 });

  const body = (await request.json()) as { message: string };
  const sql = getDb();

  const rows = await sql`
    SELECT id, status, session_number, responses, dimension_accumulator,
           profile, writing_text, feedback_responses,
           deep_dive_messages, reconciliation_messages, reconciliation_adjustments
    FROM sessions WHERE id = ${id}
  `;

  if (rows.length === 0) {
    return Response.json({ error: 'Session not found' }, { status: 404 });
  }

  const session = rows[0];
  if (!session.profile) {
    return Response.json({ error: 'Profile not yet computed' }, { status: 400 });
  }
  if (session.reconciliation_adjustments) {
    return Response.json({ error: 'Reconciliation already completed' }, { status: 400 });
  }

  const feedbackResponses = (session.feedback_responses as FeedbackResponse[][]) || [];
  const flatFeedback = feedbackResponses.flat();
  if (flatFeedback.length < 3) {
    return Response.json({ error: 'Need at least 3 feedback responses' }, { status: 400 });
  }

  const profile = session.profile as {
    dimensions: DimensionScore[];
    archetypeId: string;
    archetypeName: string;
    archetypeDistance: number;
  };

  const feedbackScores = aggregateFeedback(flatFeedback);

  // Build conversation history
  const existingMessages = (session.reconciliation_messages as ChatMessage[]) || [];
  const isStart = body.message === '';

  if (!isStart) {
    // Avoid duplicating the user message on retry
    const lastMsg = existingMessages[existingMessages.length - 1];
    if (!(lastMsg && lastMsg.role === 'user' && lastMsg.content === body.message)) {
      existingMessages.push({ role: 'user', content: body.message });
    }
  }

  // Strip trailing empty/broken assistant messages and check for an unprocessed completion
  while (existingMessages.length > 0) {
    const lastMsg = existingMessages[existingMessages.length - 1];
    if (lastMsg.role !== 'assistant') break;

    const trimmed = lastMsg.content.trim();
    if (!trimmed) {
      existingMessages.pop();
      continue;
    }

    try {
      let checkStr = trimmed;
      const fence = checkStr.match(/```(?:json)?\s*([\s\S]*?)```/);
      if (fence) checkStr = fence[1].trim();
      checkStr = checkStr.replace(/:\s*\+(\d)/g, ': $1');
      const checkParsed = JSON.parse(checkStr);
      if (checkParsed.complete && checkParsed.dimension_adjustments) {
        const adjustments = checkParsed.dimension_adjustments as Record<string, number>;
        const boosts = (checkParsed.confidence_boosts || {}) as Record<string, number>;
        const dims = [...profile.dimensions];

        for (const d of dims) {
          const adj = adjustments[d.dimensionId] ?? 0;
          const boost = boosts[d.dimensionId] ?? 0;
          d.score = Math.round(Math.min(100, Math.max(0, d.score + adj)));
          d.confidence += boost;
        }

        const { matchArchetype } = await import('~/engine/archetypes');
        const newArchetype = matchArchetype(dims);
        const DIMENSIONS_CHECK: DimensionId[] = ['energy', 'processing', 'uncertainty', 'social', 'response'];
        const newDistance = Math.sqrt(
          DIMENSIONS_CHECK.reduce((sum, dim) => {
            const score = dims.find((s) => s.dimensionId === dim)?.score ?? 50;
            return sum + (score - newArchetype.centroid[dim]) ** 2;
          }, 0),
        );

        const updatedProfile = {
          ...profile,
          dimensions: dims,
          archetypeId: newArchetype.id,
          archetypeName: newArchetype.name,
          archetypeDistance: newDistance,
        };

        await sql`
          UPDATE sessions SET
            reconciliation_messages = ${JSON.stringify(existingMessages)}::jsonb,
            reconciliation_adjustments = ${JSON.stringify(checkParsed)}::jsonb,
            profile_v2 = profile,
            profile = ${JSON.stringify(updatedProfile)}::jsonb,
            last_active_at = NOW()
          WHERE id = ${id}
        `;

        return new Response(JSON.stringify(checkParsed), {
          headers: { 'Content-Type': 'text/plain; charset=utf-8' },
        });
      }
      break;
    } catch {
      existingMessages.pop();
    }
  }

  // Build context
  const sessionContext = buildLLMContext({
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
    feedbackResponses: flatFeedback,
  });

  // Build perception gap summary
  const DIMENSIONS: DimensionId[] = ['energy', 'processing', 'uncertainty', 'social', 'response'];
  const gapSummary = DIMENSIONS.map((dim) => {
    const selfScore = profile.dimensions.find((d) => d.dimensionId === dim)?.score ?? 50;
    const fbScore = feedbackScores[dim] ?? 50;
    const delta = fbScore - selfScore;
    return { dimension: dim, selfScore, feedbackScore: fbScore, delta, absDelta: Math.abs(delta) };
  }).sort((a, b) => b.absDelta - a.absDelta);

  const gapText = gapSummary
    .filter((g) => g.absDelta > 5)
    .map(
      (g) =>
        `- ${g.dimension}: Self = ${g.selfScore}, Others = ${g.feedbackScore} (delta: ${g.delta > 0 ? '+' : ''}${g.delta})`,
    )
    .join('\n');

  // Build LLM messages
  const llmMessages: { role: 'user' | 'assistant'; content: string }[] = [];

  const startPrompt = `Here is the user's session data:\n\n${sessionContext}\n\nPerception gaps (sorted by magnitude):\n${gapText}\n\nNumber of feedback respondents: ${feedbackResponses.length}\n\nPlease start the reconciliation conversation with your first question, focusing on the largest gap.`;

  llmMessages.push({ role: 'user', content: startPrompt });

  for (const msg of existingMessages) {
    // Skip empty messages — Anthropic API rejects empty content blocks
    if (!msg.content.trim()) continue;
    llmMessages.push({ role: msg.role, content: msg.content });
  }

  const model = getAnthropicModel();
  const llmStartTime = Date.now();
  const result = streamText({
    model,
    system: RECONCILIATION_SYSTEM_PROMPT,
    messages: llmMessages,
  });

  result.usage
    .then((usage) => {
      trackEventServer('llm_call', {
        callType: 'reconciliation',
        sessionId: id,
        inputTokens: usage?.promptTokens ?? 0,
        outputTokens: usage?.completionTokens ?? 0,
        durationMs: Date.now() - llmStartTime,
      });
    })
    .catch(() => {});

  if (!isStart) {
    sql`
      UPDATE sessions SET
        reconciliation_messages = ${JSON.stringify(existingMessages)}::jsonb,
        last_active_at = NOW()
      WHERE id = ${id}
    `.catch(() => {});
  }

  const response = result.toTextStreamResponse();
  const { readable, writable } = new TransformStream();
  const writer = writable.getWriter();
  const reader = response.body!.getReader();
  let fullText = '';

  (async () => {
    let streamError = false;
    try {
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        fullText += new TextDecoder().decode(value);
        await writer.write(value);
      }
    } catch (err) {
      streamError = true;
      try {
        await writer.abort(err);
      } catch {
        /* already closed */
      }
    } finally {
      if (!streamError) await writer.close();

      // Don't save empty assistant messages — they'd cause Anthropic API errors on retry
      if (!fullText.trim()) return;
      const updatedMessages = [...existingMessages, { role: 'assistant' as const, content: fullText.trim() }];

      try {
        let jsonStr = fullText.trim();
        const fenceMatch = jsonStr.match(/```(?:json)?\s*([\s\S]*?)```/);
        if (fenceMatch) jsonStr = fenceMatch[1].trim();
        // Strip leading '+' on numbers (e.g. +8 → 8) — JSON doesn't allow it
        jsonStr = jsonStr.replace(/:\s*\+(\d)/g, ': $1');
        const parsed = JSON.parse(jsonStr);

        if (parsed.complete) {
          await sql`
            UPDATE sessions SET
              reconciliation_messages = ${JSON.stringify(updatedMessages)}::jsonb,
              reconciliation_adjustments = ${JSON.stringify(parsed)}::jsonb,
              profile_v2 = profile,
              last_active_at = NOW()
            WHERE id = ${id}
          `;

          // Apply adjustments
          const adjustments = parsed.dimension_adjustments as Record<string, number>;
          const boosts = parsed.confidence_boosts as Record<string, number>;
          const dims = [...profile.dimensions];

          for (const d of dims) {
            const adj = adjustments[d.dimensionId] ?? 0;
            const boost = boosts[d.dimensionId] ?? 0;
            d.score = Math.round(Math.min(100, Math.max(0, d.score + adj)));
            d.confidence += boost;
          }

          const { matchArchetype } = await import('~/engine/archetypes');
          const newArchetype = matchArchetype(dims);
          const newDistance = Math.sqrt(
            DIMENSIONS.reduce((sum, dim) => {
              const score = dims.find((s) => s.dimensionId === dim)?.score ?? 50;
              return sum + (score - newArchetype.centroid[dim]) ** 2;
            }, 0),
          );

          const updatedProfile = {
            ...profile,
            dimensions: dims,
            archetypeId: newArchetype.id,
            archetypeName: newArchetype.name,
            archetypeDistance: newDistance,
          };

          await sql`
            UPDATE sessions SET
              profile = ${JSON.stringify(updatedProfile)}::jsonb
            WHERE id = ${id}
          `;
        } else {
          await sql`
            UPDATE sessions SET
              reconciliation_messages = ${JSON.stringify(updatedMessages)}::jsonb,
              last_active_at = NOW()
            WHERE id = ${id}
          `;
        }
      } catch {
        await sql`
          UPDATE sessions SET
            reconciliation_messages = ${JSON.stringify(updatedMessages)}::jsonb,
            last_active_at = NOW()
          WHERE id = ${id}
        `.catch(() => {});
      }
    }
  })();

  return new Response(readable, {
    headers: response.headers,
  });
}

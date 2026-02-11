import type { ActionFunctionArgs } from 'react-router';
import { generateText } from 'ai';
import { getDb } from '~/lib/db';
import { getAnthropicModel, buildLLMContext, DEEP_DIVE_SYSTEM_PROMPT } from '~/lib/llm';
import type { DimensionId } from '~/types/questions';
import type { DimensionScore } from '~/types/profile';
import { matchArchetype } from '~/engine/archetypes';
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
           profile, writing_text, deep_dive_messages, deep_dive_adjustments
    FROM sessions WHERE id = ${id}
  `;

  if (rows.length === 0) {
    return Response.json({ error: 'Session not found' }, { status: 404 });
  }

  const session = rows[0];
  if (!session.profile) {
    return Response.json({ error: 'Profile not yet computed' }, { status: 400 });
  }
  if (session.deep_dive_adjustments) {
    return Response.json({ error: 'Deep-dive already completed' }, { status: 400 });
  }

  const profile = session.profile as {
    dimensions: DimensionScore[];
    archetypeId: string;
    archetypeName: string;
    archetypeDistance: number;
  };

  // Build conversation history
  const existingMessages = (session.deep_dive_messages as ChatMessage[]) || [];
  const isStart = body.message === '';

  if (!isStart) {
    // Avoid duplicating the user message on retry
    const lastMsg = existingMessages[existingMessages.length - 1];
    if (!(lastMsg && lastMsg.role === 'user' && lastMsg.content === body.message)) {
      existingMessages.push({ role: 'user', content: body.message });
    }
  }

  // Strip trailing empty/broken assistant messages and check for an unprocessed completion
  // (e.g. a previous response with +8 that failed to parse, or an empty response from a failed retry)
  while (existingMessages.length > 0) {
    const lastMsg = existingMessages[existingMessages.length - 1];
    if (lastMsg.role !== 'assistant') break;

    const trimmed = lastMsg.content.trim();

    // Empty assistant message — remove and keep checking
    if (!trimmed) {
      existingMessages.pop();
      continue;
    }

    // Try to parse as a completion JSON
    try {
      let checkStr = trimmed;
      const fence = checkStr.match(/```(?:json)?\s*([\s\S]*?)```/);
      if (fence) checkStr = fence[1].trim();
      checkStr = checkStr.replace(/:\s*\+(\d)/g, ': $1');
      const checkParsed = JSON.parse(checkStr);
      if (checkParsed.complete && checkParsed.dimension_adjustments) {
        // This was a completion that failed to be applied — apply it now
        const adjustments = checkParsed.dimension_adjustments as Record<string, number>;
        const boosts = (checkParsed.confidence_boosts || {}) as Record<string, number>;
        const dims = [...profile.dimensions];

        for (const d of dims) {
          const adj = adjustments[d.dimensionId] ?? 0;
          const boost = boosts[d.dimensionId] ?? 0;
          d.score = Math.round(Math.min(100, Math.max(0, d.score + adj)));
          d.confidence += boost;
        }

        const newArchetype = matchArchetype(dims);
        const DIMENSIONS: DimensionId[] = ['energy', 'processing', 'uncertainty', 'social', 'response'];
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
            deep_dive_messages = ${JSON.stringify(existingMessages)}::jsonb,
            deep_dive_adjustments = ${JSON.stringify(checkParsed)}::jsonb,
            profile_v1 = profile,
            profile = ${JSON.stringify(updatedProfile)}::jsonb,
            last_active_at = NOW()
          WHERE id = ${id}
        `;

        // Return the completion directly — no need to call the LLM again
        return new Response(JSON.stringify(checkParsed), {
          headers: { 'Content-Type': 'text/plain; charset=utf-8' },
        });
      }
      // Valid JSON but not a completion — it's a normal question, keep it
      break;
    } catch {
      // Not valid JSON even with sanitization — strip and keep checking
      existingMessages.pop();
    }
  }

  // Build the full context for the LLM
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
  });

  // Build messages array for LLM
  const llmMessages: { role: 'user' | 'assistant'; content: string }[] = [];

  // First message is always the session context
  if (existingMessages.length === 0) {
    llmMessages.push({
      role: 'user',
      content: `Here is the user's session data:\n\n${sessionContext}\n\nPlease start the deep-dive conversation with your first question.`,
    });
  } else {
    llmMessages.push({
      role: 'user',
      content: `Here is the user's session data:\n\n${sessionContext}\n\nPlease start the deep-dive conversation with your first question.`,
    });
    // Add conversation history — skip empty messages (Anthropic rejects empty content)
    for (const msg of existingMessages) {
      if (!msg.content.trim()) continue;
      llmMessages.push({ role: msg.role, content: msg.content });
    }
  }

  // Resume: return full conversation history so the UI can restore state
  if (isStart && existingMessages.length > 0) {
    const lastMsg = existingMessages[existingMessages.length - 1];
    if (lastMsg.role === 'assistant' && lastMsg.content.trim()) {
      return Response.json({ resume: true, messages: existingMessages });
    }
  }

  const model = getAnthropicModel();
  const llmStartTime = Date.now();

  // Save the user message to DB (fire-and-forget)
  if (!isStart) {
    sql`
      UPDATE sessions SET
        deep_dive_messages = ${JSON.stringify(existingMessages)}::jsonb,
        last_active_at = NOW()
      WHERE id = ${id}
    `.catch(() => {});
  }

  let fullText: string;
  try {
    const result = await generateText({
      model,
      system: DEEP_DIVE_SYSTEM_PROMPT,
      messages: llmMessages,
      maxTokens: 4096,
    });
    fullText = result.text;

    trackEventServer('llm_call', {
      callType: 'deep_dive',
      sessionId: id,
      inputTokens: result.usage?.promptTokens ?? 0,
      outputTokens: result.usage?.completionTokens ?? 0,
      durationMs: Date.now() - llmStartTime,
    });
  } catch (err) {
    console.error('[deep-dive] LLM call failed:', err);
    const msg = err instanceof Error ? err.message : 'Unknown error';
    return Response.json({ error: `AI error: ${msg}` }, { status: 502 });
  }

  if (!fullText.trim()) {
    return Response.json({ error: 'Empty response from AI — please retry' }, { status: 502 });
  }

  // Save assistant response and apply adjustments
  const updatedMessages = [...existingMessages, { role: 'assistant' as const, content: fullText.trim() }];

  // Check if the response is a completion (fire-and-forget DB writes)
  try {
    let jsonStr = fullText.trim();
    const fenceMatch = jsonStr.match(/```(?:json)?\s*([\s\S]*?)```/);
    if (fenceMatch) jsonStr = fenceMatch[1].trim();
    jsonStr = jsonStr.replace(/:\s*\+(\d)/g, ': $1');
    const parsed = JSON.parse(jsonStr);

    if (parsed.complete) {
      await sql`
        UPDATE sessions SET
          deep_dive_messages = ${JSON.stringify(updatedMessages)}::jsonb,
          deep_dive_adjustments = ${JSON.stringify(parsed)}::jsonb,
          profile_v1 = profile,
          last_active_at = NOW()
        WHERE id = ${id}
      `;

      const adjustments = parsed.dimension_adjustments as Record<string, number>;
      const boosts = parsed.confidence_boosts as Record<string, number>;
      const dims = [...profile.dimensions];

      for (const d of dims) {
        const adj = adjustments[d.dimensionId] ?? 0;
        const boost = boosts[d.dimensionId] ?? 0;
        d.score = Math.round(Math.min(100, Math.max(0, d.score + adj)));
        d.confidence += boost;
      }

      const newArchetype = matchArchetype(dims);
      const DIMENSIONS: DimensionId[] = ['energy', 'processing', 'uncertainty', 'social', 'response'];
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
          deep_dive_messages = ${JSON.stringify(updatedMessages)}::jsonb,
          last_active_at = NOW()
        WHERE id = ${id}
      `;
    }
  } catch {
    await sql`
      UPDATE sessions SET
        deep_dive_messages = ${JSON.stringify(updatedMessages)}::jsonb,
        last_active_at = NOW()
      WHERE id = ${id}
    `.catch(() => {});
  }

  return new Response(fullText, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
}

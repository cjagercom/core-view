import { useState, useRef, useEffect, useCallback } from 'react';
import { ChatMessage } from './ChatMessage';
import { OptionChips } from './OptionChips';
import { ChatInput } from './ChatInput';
import { motion } from 'framer-motion';

interface LLMQuestion {
  question: string;
  type: 'free_text' | 'options';
  options?: string[];
  dimension_target?: string;
  probing?: string;
  context_note?: string;
  gap_being_explored?: {
    dimension: string;
    self_score: number;
    feedback_score: number;
    delta: number;
  };
}

export interface LLMCompletion {
  complete: true;
  dimension_adjustments: Record<string, number>;
  confidence_boosts: Record<string, number>;
  narrative_update?: string;
  reconciliation_narrative?: string;
  archetype_note?: string;
  integrated_score_rationale?: Record<string, string>;
}

interface Message {
  role: 'assistant' | 'user';
  content: string;
}

interface DeepDiveChatProps {
  sessionId: string;
  endpoint: 'deep-dive' | 'reconciliation';
  onComplete: (result: LLMCompletion) => void;
}

export function DeepDiveChat({ sessionId, endpoint, onComplete }: DeepDiveChatProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState<LLMQuestion | null>(null);
  const [streaming, setStreaming] = useState(false);
  const [questionCount, setQuestionCount] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const lastUserMessage = useRef<string>('');
  const scrollRef = useRef<HTMLDivElement>(null);
  const hasStarted = useRef(false);

  const scrollToBottom = useCallback(() => {
    setTimeout(() => {
      scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
    }, 100);
  }, []);

  const isRetrying = useRef(false);

  const sendMessage = useCallback(
    async (userMessage: string, retry = false) => {
      // Add user message to chat (unless it's the start signal or a retry)
      if (userMessage && !retry) {
        setMessages((prev) => [...prev, { role: 'user', content: userMessage }]);
      }

      lastUserMessage.current = userMessage;
      isRetrying.current = retry;
      setStreaming(true);
      setCurrentQuestion(null);
      setError(null);
      scrollToBottom();

      try {
        const res = await fetch(`/api/session/${sessionId}/${endpoint}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ message: userMessage }),
        });

        if (!res.ok) {
          const data = await res.json().catch(() => ({}));
          throw new Error(data.error || 'Failed to get response');
        }

        // Read streaming response
        const reader = res.body?.getReader();
        if (!reader) throw new Error('No response body');

        const decoder = new TextDecoder();
        let accumulated = '';

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          accumulated += decoder.decode(value, { stream: true });
        }

        // Parse the complete response
        // The LLM might wrap JSON in markdown code fences — strip them
        let jsonStr = accumulated.trim();
        if (!jsonStr) {
          throw new Error('Empty response from server');
        }
        const fenceMatch = jsonStr.match(/```(?:json)?\s*([\s\S]*?)```/);
        if (fenceMatch) jsonStr = fenceMatch[1].trim();
        // Strip leading '+' on numbers (e.g. +8 → 8) — JSON doesn't allow it
        jsonStr = jsonStr.replace(/:\s*\+(\d)/g, ': $1');

        let parsed: Record<string, unknown>;
        try {
          parsed = JSON.parse(jsonStr);
        } catch {
          // Try to extract JSON object from mixed text (LLM sometimes adds preamble)
          const jsonMatch = jsonStr.match(/\{[\s\S]*\}/);
          if (jsonMatch) {
            parsed = JSON.parse(jsonMatch[0].replace(/:\s*\+(\d)/g, ': $1'));
          } else {
            throw new Error('Invalid response format — please retry');
          }
        }

        setStreaming(false);

        if (parsed.complete) {
          // Session complete
          setMessages((prev) => [
            ...prev,
            {
              role: 'assistant',
              content:
                parsed.narrative_update ||
                parsed.reconciliation_narrative ||
                'Your profile has been updated based on our conversation.',
            },
          ]);
          scrollToBottom();
          onComplete(parsed as LLMCompletion);
        } else {
          // New question
          const q = parsed as LLMQuestion;
          setQuestionCount((prev) => prev + 1);
          setMessages((prev) => [...prev, { role: 'assistant', content: q.question }]);
          setCurrentQuestion(q);
          scrollToBottom();
        }
      } catch (err) {
        setStreaming(false);
        setError((err as Error).message || 'Something went wrong');
      }
    },
    [sessionId, endpoint, onComplete, scrollToBottom],
  );

  // Auto-start on mount
  useEffect(() => {
    if (hasStarted.current) return;
    hasStarted.current = true;
    sendMessage('');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sendMessage]);

  const handleOptionSelect = useCallback(
    (option: string) => {
      setCurrentQuestion(null);
      sendMessage(option);
    },
    [sendMessage],
  );

  const handleTextSubmit = useCallback(
    (text: string) => {
      setCurrentQuestion(null);
      sendMessage(text);
    },
    [sendMessage],
  );

  const handleRetry = useCallback(() => {
    setError(null);
    sendMessage(lastUserMessage.current, true);
  }, [sendMessage]);

  return (
    <div className="flex flex-col h-full">
      {/* Progress indicator */}
      <div className="flex items-center justify-between px-1 py-2 text-xs text-ink-muted">
        <span>Question {questionCount} of ~12</span>
        <span className="flex gap-1">
          {Array.from({ length: 12 }).map((_, i) => (
            <span key={i} className={`w-1.5 h-1.5 rounded-full ${i < questionCount ? 'bg-accent' : 'bg-paper-dark'}`} />
          ))}
        </span>
      </div>

      {/* Messages */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto space-y-3 py-4 min-h-0">
        {messages.map((msg, i) => (
          <ChatMessage key={i} role={msg.role} content={msg.content} />
        ))}

        {/* Streaming indicator — always show typing dots (response is JSON, not user-facing text) */}
        {streaming && (
          <motion.div className="flex gap-1.5 px-4 py-3" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                className="w-2 h-2 rounded-full bg-accent/40"
                animate={{ y: [0, -6, 0] }}
                transition={{ duration: 0.6, delay: i * 0.15, repeat: Infinity }}
              />
            ))}
          </motion.div>
        )}
      </div>

      {/* Error */}
      {error && (
        <div className="px-4 py-2 text-sm text-red-600 bg-red-50 rounded-lg mb-2 flex items-center justify-between gap-2">
          <span>{error}</span>
          <button
            onClick={handleRetry}
            className="shrink-0 px-3 py-1 text-xs font-medium text-red-700 bg-red-100 hover:bg-red-200 rounded-md transition-colors"
          >
            Retry
          </button>
        </div>
      )}

      {/* Input area */}
      {!streaming && currentQuestion && (
        <div className="pt-2 pb-4">
          {currentQuestion.type === 'options' && currentQuestion.options ? (
            <OptionChips options={currentQuestion.options} onSelect={handleOptionSelect} />
          ) : (
            <ChatInput onSend={handleTextSubmit} />
          )}
        </div>
      )}
    </div>
  );
}

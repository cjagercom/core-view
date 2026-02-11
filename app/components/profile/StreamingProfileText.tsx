import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

interface StreamingProfileTextProps {
  sessionId: string;
  cachedText?: string;
}

export function StreamingProfileText({ sessionId, cachedText }: StreamingProfileTextProps) {
  const [text, setText] = useState(cachedText ?? '');
  const [loading, setLoading] = useState(!cachedText);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (cachedText) return;

    const controller = new AbortController();

    async function fetchStream() {
      try {
        const res = await fetch(`/api/session/${sessionId}/profile`, {
          signal: controller.signal,
        });

        if (!res.ok) {
          setError(true);
          setLoading(false);
          return;
        }

        // Check if response is cached JSON
        const contentType = res.headers.get('Content-Type') || '';
        if (contentType.includes('application/json')) {
          const data = await res.json();
          setText(data.llmText);
          setLoading(false);
          return;
        }

        // Stream the response
        const reader = res.body?.getReader();
        if (!reader) {
          setError(true);
          setLoading(false);
          return;
        }

        const decoder = new TextDecoder();
        let accumulated = '';

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          accumulated += decoder.decode(value, { stream: true });
          setText(accumulated);
        }

        setLoading(false);
      } catch (err) {
        if ((err as Error).name !== 'AbortError') {
          setError(true);
          setLoading(false);
        }
      }
    }

    fetchStream();
    return () => controller.abort();
  }, [sessionId, cachedText]);

  if (error) {
    return (
      <div className="text-sm text-muted italic">
        Unable to generate personalized profile text. Your scores and archetype are still accurate.
      </div>
    );
  }

  if (loading && !text) {
    return (
      <motion.div className="space-y-3" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <div className="h-4 bg-primary/5 rounded w-full animate-pulse" />
        <div className="h-4 bg-primary/5 rounded w-5/6 animate-pulse" />
        <div className="h-4 bg-primary/5 rounded w-4/6 animate-pulse" />
        <p className="text-xs text-muted mt-4">Writing your personalized profile...</p>
      </motion.div>
    );
  }

  // Convert markdown to HTML: **bold**, *italic*, split paragraphs
  const html = text
    .split(/\n{2,}/)
    .map((p) => p.trim())
    .filter(Boolean)
    .map((p) => {
      // Apply markdown formatting
      const formatted = p
        .replace(/\*\*(.+?)\*\*/g, '<strong class="font-semibold text-ink">$1</strong>')
        .replace(/(?<!\*)\*(?!\*)(.+?)(?<!\*)\*(?!\*)/g, '<em>$1</em>');
      // Check if this paragraph is ONLY a bold line (section header)
      if (/^<strong[^>]*>.+<\/strong>$/.test(formatted.trim())) {
        return `<h4 class="font-display text-base text-ink mt-6 mb-1">${formatted}</h4>`;
      }
      return `<p>${formatted}</p>`;
    })
    .join('');

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="text-sm text-ink-soft leading-relaxed space-y-3 [&_p]:mb-0 [&_h4]:mb-0"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}

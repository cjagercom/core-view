import { useState, useCallback, useRef, useEffect } from 'react';
import { Button } from '~/components/ui/Button';

interface WritingPromptProps {
  prompt: string;
  timeLimitMs: number;
  onComplete: (
    text: string,
    metadata: {
      timeToFirstKeystrokeMs: number;
      totalCharacters: number;
      pauseCount: number;
    },
  ) => void;
}

export function WritingPrompt({ prompt, timeLimitMs, onComplete }: WritingPromptProps) {
  const [text, setText] = useState('');
  const [done, setDone] = useState(false);
  const startTimeRef = useRef(Date.now());
  const firstKeystrokeRef = useRef<number | null>(null);
  const lastKeystrokeRef = useRef<number>(Date.now());
  const pauseCountRef = useRef(0);
  const [elapsed, setElapsed] = useState(0);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const now = Date.now();
    if (firstKeystrokeRef.current === null) {
      firstKeystrokeRef.current = now - startTimeRef.current;
    }
    // Count pauses > 3 seconds
    if (now - lastKeystrokeRef.current > 3000 && lastKeystrokeRef.current !== startTimeRef.current) {
      pauseCountRef.current += 1;
    }
    lastKeystrokeRef.current = now;
    setText(e.target.value);
  }, []);

  const handleDone = useCallback(() => {
    if (done) return;
    setDone(true);
    onComplete(text, {
      timeToFirstKeystrokeMs: firstKeystrokeRef.current ?? timeLimitMs,
      totalCharacters: text.length,
      pauseCount: pauseCountRef.current,
    });
  }, [done, text, onComplete, timeLimitMs]);

  useEffect(() => {
    startTimeRef.current = Date.now();
    const interval = setInterval(() => {
      const now = Date.now();
      const e = now - startTimeRef.current;
      setElapsed(e);
      if (e >= timeLimitMs) {
        clearInterval(interval);
        handleDone();
      }
    }, 200);
    return () => clearInterval(interval);
  }, [timeLimitMs, handleDone]);

  const progress = Math.min(1, elapsed / timeLimitMs);

  return (
    <div className="flex flex-col gap-5 h-full">
      <h2 className="text-lg font-medium text-primary">{prompt}</h2>
      <div className="w-full h-1 bg-primary/10 rounded-full overflow-hidden">
        <div className="h-full bg-accent/40 transition-all duration-200" style={{ width: `${progress * 100}%` }} />
      </div>
      <textarea
        className="flex-1 w-full min-h-[200px] p-4 text-base rounded-lg border-2 border-primary/10 bg-white resize-none focus:outline-none focus:border-accent transition-colors"
        placeholder="Start writing..."
        value={text}
        onChange={handleChange}
        disabled={done}
      />
      <Button variant="secondary" onClick={handleDone} disabled={done}>
        Done
      </Button>
    </div>
  );
}

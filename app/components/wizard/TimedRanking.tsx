import { useState, useCallback, useRef } from 'react';
import { Timer } from '~/components/ui/Timer';
import { Button } from '~/components/ui/Button';
import { motion } from 'framer-motion';

interface RankingItem {
  id: string;
  label: string;
}

interface TimedRankingProps {
  prompt: string;
  items: RankingItem[];
  timeLimitMs: number;
  onComplete: (rankedIds: string[], elapsedMs: number) => void;
}

export function TimedRanking({ prompt, items, timeLimitMs, onComplete }: TimedRankingProps) {
  const [phase, setPhase] = useState<'intro' | 'ranking'>('intro');
  const [ranked, setRanked] = useState<RankingItem[]>(items);
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const dragIndexRef = useRef<number | null>(null);
  const [completed, setCompleted] = useState(false);
  const startTimeRef = useRef(Date.now());
  const listRef = useRef<HTMLDivElement>(null);
  const touchDragIndex = useRef<number | null>(null);

  const handleStart = useCallback(() => {
    startTimeRef.current = Date.now();
    setPhase('ranking');
  }, []);

  const handleTimerComplete = useCallback(() => {
    if (completed) return;
    setCompleted(true);
    const elapsed = Date.now() - startTimeRef.current;
    onComplete(
      ranked.map((i) => i.id),
      elapsed,
    );
  }, [completed, ranked, onComplete]);

  const handleSubmit = useCallback(() => {
    if (completed) return;
    setCompleted(true);
    const elapsed = Date.now() - startTimeRef.current;
    onComplete(
      ranked.map((i) => i.id),
      elapsed,
    );
  }, [completed, ranked, onComplete]);

  const moveItem = useCallback((fromIndex: number, toIndex: number) => {
    setRanked((prev) => {
      const next = [...prev];
      const [item] = next.splice(fromIndex, 1);
      next.splice(toIndex, 0, item);
      return next;
    });
  }, []);

  const getItemIndexAtY = useCallback((clientY: number): number | null => {
    if (!listRef.current) return null;
    const children = Array.from(listRef.current.children) as HTMLElement[];
    for (let i = 0; i < children.length; i++) {
      const rect = children[i].getBoundingClientRect();
      if (clientY >= rect.top && clientY <= rect.bottom) return i;
    }
    return null;
  }, []);

  const handleTouchStart = useCallback((index: number) => {
    touchDragIndex.current = index;
    setDragIndex(index);
  }, []);

  const handleTouchMove = useCallback(
    (e: React.TouchEvent) => {
      if (touchDragIndex.current === null) return;
      e.preventDefault();
      const touch = e.touches[0];
      const overIndex = getItemIndexAtY(touch.clientY);
      if (overIndex !== null && overIndex !== touchDragIndex.current) {
        moveItem(touchDragIndex.current, overIndex);
        touchDragIndex.current = overIndex;
        setDragIndex(overIndex);
      }
    },
    [getItemIndexAtY, moveItem],
  );

  const handleTouchEnd = useCallback(() => {
    touchDragIndex.current = null;
    setDragIndex(null);
  }, []);

  if (phase === 'intro') {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col gap-6 items-center text-center"
      >
        <div className="w-16 h-16 rounded-full bg-accent/10 flex items-center justify-center">
          <svg
            width="28"
            height="28"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#3B82F6"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="12" cy="12" r="10" />
            <polyline points="12 6 12 12 16 14" />
          </svg>
        </div>
        <div>
          <h2 className="text-xl font-bold text-primary mb-2">Timed ranking</h2>
          <p className="text-base text-muted leading-relaxed">Next up: put four items in order of importance to you.</p>
          <p className="text-base text-muted leading-relaxed mt-2">
            You'll have <strong className="text-primary">{Math.round(timeLimitMs / 1000)} seconds</strong>. Use the
            arrows to reorder, then confirm. Go with your gut!
          </p>
        </div>
        <div className="w-full mt-2">
          <p className="text-lg font-medium text-primary mb-4">"{prompt}"</p>
          <Button onClick={handleStart}>Start</Button>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="flex flex-col gap-5 items-center">
      <Timer durationMs={timeLimitMs} onComplete={handleTimerComplete} />
      <h2 className="text-lg font-medium text-primary text-center">{prompt}</h2>
      <div
        ref={listRef}
        className="w-full flex flex-col gap-2"
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {ranked.map((item, index) => (
          <motion.div
            key={item.id}
            layout={dragIndex === null}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className={`flex items-center gap-3 p-4 rounded-lg border-2 bg-white select-none touch-none ${
              dragIndex === index ? 'border-accent shadow-lg opacity-50' : 'border-primary/10'
            }`}
            draggable
            onDragStart={(e) => {
              dragIndexRef.current = index;
              setDragIndex(index);
              if ('dataTransfer' in e && (e as any).dataTransfer) {
                (e as any).dataTransfer.effectAllowed = 'move';
                (e as any).dataTransfer.setData('text/plain', '');
              }
            }}
            onDragEnd={() => {
              dragIndexRef.current = null;
              setDragIndex(null);
            }}
            onDragOver={(e) => {
              e.preventDefault();
              if (dragIndexRef.current !== null && dragIndexRef.current !== index) {
                moveItem(dragIndexRef.current, index);
                dragIndexRef.current = index;
                setDragIndex(index);
              }
            }}
            onDrop={(e) => {
              e.preventDefault();
              dragIndexRef.current = null;
              setDragIndex(null);
            }}
            onTouchStart={() => handleTouchStart(index)}
          >
            <span className="w-7 h-7 flex items-center justify-center rounded-full bg-accent/10 text-accent font-bold text-sm shrink-0">
              {index + 1}
            </span>
            <span className="flex-1 text-base">{item.label}</span>
            <div className="flex flex-col gap-1 shrink-0">
              <button
                className="text-muted hover:text-primary p-1 min-h-[32px] min-w-[32px] flex items-center justify-center"
                onClick={() => index > 0 && moveItem(index, index - 1)}
                disabled={index === 0}
                aria-label="Move up"
              >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M8 4L4 8h8L8 4z" fill="currentColor" />
                </svg>
              </button>
              <button
                className="text-muted hover:text-primary p-1 min-h-[32px] min-w-[32px] flex items-center justify-center"
                onClick={() => index < ranked.length - 1 && moveItem(index, index + 1)}
                disabled={index === ranked.length - 1}
                aria-label="Move down"
              >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M8 12L4 8h8l-4 4z" fill="currentColor" />
                </svg>
              </button>
            </div>
          </motion.div>
        ))}
      </div>
      <Button onClick={handleSubmit} disabled={completed}>
        Confirm order
      </Button>
    </div>
  );
}

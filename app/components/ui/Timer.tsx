import { useEffect, useState, useRef } from 'react';

interface TimerProps {
  durationMs: number;
  onComplete: () => void;
  size?: number;
}

export function Timer({ durationMs, onComplete, size = 80 }: TimerProps) {
  const [elapsed, setElapsed] = useState(0);
  const startRef = useRef(Date.now());
  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;

  useEffect(() => {
    startRef.current = Date.now();
    const interval = setInterval(() => {
      const now = Date.now();
      const newElapsed = now - startRef.current;
      setElapsed(newElapsed);
      if (newElapsed >= durationMs) {
        clearInterval(interval);
        onCompleteRef.current();
      }
    }, 50);
    return () => clearInterval(interval);
  }, [durationMs]);

  const remaining = Math.max(0, durationMs - elapsed);
  const seconds = Math.ceil(remaining / 1000);
  const progress = 1 - remaining / durationMs;
  const isWarning = remaining < 3000;

  const radius = (size - 8) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference * (1 - progress);

  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={4}
          className="text-primary/10"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          strokeWidth={4}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          className={`transition-colors duration-300 ${isWarning ? 'stroke-warm' : 'stroke-accent'}`}
        />
      </svg>
      <span className={`absolute text-xl font-bold ${isWarning ? 'text-warm' : 'text-primary'}`}>{seconds}</span>
    </div>
  );
}

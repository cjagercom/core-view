import { useState, useRef, useEffect } from 'react';
import { Send } from 'lucide-react';
import { motion } from 'framer-motion';

interface ChatInputProps {
  onSend: (message: string) => void;
  disabled?: boolean;
  placeholder?: string;
}

export function ChatInput({ onSend, disabled, placeholder = 'Type your answer...' }: ChatInputProps) {
  const [value, setValue] = useState('');
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (!disabled) inputRef.current?.focus();
  }, [disabled]);

  const autoResize = () => {
    const el = inputRef.current;
    if (!el) return;
    el.style.height = 'auto';
    el.style.height = `${Math.min(el.scrollHeight, 120)}px`;
  };

  const handleSubmit = () => {
    const trimmed = value.trim();
    if (!trimmed || disabled) return;
    onSend(trimmed);
    setValue('');
    if (inputRef.current) inputRef.current.style.height = 'auto';
  };

  return (
    <div className="flex items-center gap-2">
      <div className="relative flex-1 flex">
        <textarea
          ref={inputRef}
          value={value}
          onChange={(e) => {
            setValue(e.target.value);
            autoResize();
          }}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              handleSubmit();
            }
          }}
          disabled={disabled}
          placeholder={placeholder}
          rows={1}
          className="w-full resize-none rounded-2xl border-2 border-paper-dark bg-white px-4 py-3 leading-5
                     text-sm sm:text-base text-ink placeholder:text-ink-muted
                     focus:outline-none focus:border-accent
                     disabled:opacity-50 disabled:cursor-not-allowed"
          style={{ minHeight: '48px', maxHeight: '120px', overflow: 'hidden' }}
        />
        {disabled && (
          <motion.div
            className="absolute inset-0 rounded-2xl"
            animate={{ opacity: [0.3, 0.6, 0.3] }}
            transition={{ duration: 2, repeat: Infinity }}
            style={{ background: 'linear-gradient(90deg, transparent, rgba(13,148,136,0.05), transparent)' }}
          />
        )}
      </div>
      <button
        onClick={handleSubmit}
        disabled={disabled || !value.trim()}
        className="shrink-0 w-12 h-12 rounded-2xl bg-accent text-white flex items-center justify-center
                   hover:bg-[#0F766E] transition-colors
                   disabled:opacity-30 disabled:cursor-not-allowed"
      >
        <Send size={20} />
      </button>
    </div>
  );
}

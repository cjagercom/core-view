import { motion } from 'framer-motion';

interface ChatMessageProps {
  role: 'assistant' | 'user';
  content: string;
  streaming?: boolean;
}

export function ChatMessage({ role, content, streaming }: ChatMessageProps) {
  const isUser = role === 'user';

  // Convert markdown to HTML: **bold** and *italic*
  const html = content
    .replace(/\*\*(.+?)\*\*/g, '<strong class="font-semibold">$1</strong>')
    .replace(/(?<!\*)\*(?!\*)(.+?)(?<!\*)\*(?!\*)/g, '<em>$1</em>')
    .replace(/\n/g, '<br/>');

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}
    >
      <div
        className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
          isUser ? 'bg-accent text-white rounded-br-md' : 'bg-paper-warm text-ink-soft rounded-bl-md'
        }`}
      >
        <span dangerouslySetInnerHTML={{ __html: html }} />
        {streaming && (
          <motion.span
            className="inline-block w-1.5 h-4 bg-current ml-0.5 -mb-0.5"
            animate={{ opacity: [1, 0] }}
            transition={{ duration: 0.8, repeat: Infinity }}
          />
        )}
      </div>
    </motion.div>
  );
}

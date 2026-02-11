import { useState } from 'react';
import type { FeedbackQuestion, FeedbackResponse } from '~/types/feedback';
import { motion, AnimatePresence } from 'framer-motion';

interface FeedbackFormProps {
  questions: FeedbackQuestion[];
  onSubmit: (responses: FeedbackResponse[]) => void;
  submitting?: boolean;
}

export function FeedbackForm({ questions, onSubmit, submitting }: FeedbackFormProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [responses, setResponses] = useState<FeedbackResponse[]>([]);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);

  const question = questions[currentIndex];
  const isLast = currentIndex === questions.length - 1;

  function handleSelect(optionId: string) {
    setSelectedOption(optionId);

    setTimeout(() => {
      const response: FeedbackResponse = {
        questionId: question.id,
        optionId,
        submittedAt: new Date().toISOString(),
      };

      const newResponses = [...responses, response];

      if (isLast) {
        onSubmit(newResponses);
      } else {
        setResponses(newResponses);
        setSelectedOption(null);
        setCurrentIndex((prev) => prev + 1);
      }
    }, 400);
  }

  return (
    <div>
      <div className="mb-6">
        <div className="flex gap-1 mb-2">
          {questions.map((_, i) => (
            <div
              key={i}
              className={`h-1 flex-1 rounded-full transition-colors ${
                i < currentIndex ? 'bg-accent' : i === currentIndex ? 'bg-accent/50' : 'bg-primary/10'
              }`}
            />
          ))}
        </div>
        <p className="text-xs text-muted">
          {currentIndex + 1} of {questions.length}
        </p>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={question.id}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
        >
          <h2 className="text-lg font-medium text-primary mb-6">{question.question}</h2>

          <div className="flex flex-col gap-3">
            {question.options.map((option) => (
              <button
                key={option.id}
                onClick={() => handleSelect(option.id)}
                disabled={!!selectedOption || submitting}
                className={`w-full text-left p-4 rounded-lg border transition-all ${
                  selectedOption === option.id
                    ? 'border-accent bg-accent/5'
                    : 'border-primary/10 hover:border-primary/20'
                }`}
              >
                <span className="text-sm text-primary">{option.label}</span>
              </button>
            ))}
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

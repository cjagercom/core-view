import { QuestionCard } from './QuestionCard';

interface ReflectionQuestionProps {
  question: string;
  options: { id: string; label: string }[];
  onAnswer: (optionId: string) => void;
}

export function ReflectionQuestion({ question, options, onAnswer }: ReflectionQuestionProps) {
  return <QuestionCard question={question} options={options} onAnswer={onAnswer} />;
}

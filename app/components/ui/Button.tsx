import { cn } from '~/lib/utils';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost';
}

export function Button({ variant = 'primary', className, children, ...props }: ButtonProps) {
  return (
    <button
      className={cn(
        'w-full text-base transition-all duration-200',
        variant === 'primary' &&
          'min-h-[56px] rounded-[var(--radius-button)] bg-accent text-white font-bold px-8 py-4 hover:bg-[#0F766E] active:scale-[0.98]',
        variant === 'secondary' &&
          'min-h-[56px] rounded-[var(--radius-button)] bg-transparent text-accent font-bold px-8 py-4 border-2 border-paper-dark hover:border-accent',
        variant === 'ghost' &&
          'bg-transparent text-accent-mid font-medium text-sm px-4 py-2 underline underline-offset-[3px]',
        'disabled:opacity-50 disabled:cursor-not-allowed',
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
}

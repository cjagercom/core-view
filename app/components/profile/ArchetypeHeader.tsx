interface ArchetypeHeaderProps {
  name: string;
  coreSentence: string;
}

export function ArchetypeHeader({ name, coreSentence }: ArchetypeHeaderProps) {
  return (
    <div className="text-center py-10">
      <h1 className="text-[28px] sm:text-4xl font-display text-ink leading-tight">{name}</h1>
      <p className="mt-3 text-lg sm:text-xl text-ink-soft italic leading-relaxed">{coreSentence}</p>
    </div>
  );
}

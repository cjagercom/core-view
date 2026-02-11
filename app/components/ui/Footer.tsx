import { Link } from 'react-router';
import { ExternalLink } from 'lucide-react';

export function Footer() {
  return (
    <footer className="mt-24 pt-6 border-t border-paper-dark w-full text-center">
      <p className="text-[13px] text-ink-muted flex items-center justify-center gap-1.5 flex-wrap">
        Built by{' '}
        <a
          href="https://www.pinkpollos.com"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 hover:text-ink-soft transition-colors"
        >
          PinkPollos <ExternalLink size={14} />
        </a>
        <span>&middot;</span>
        <Link to="/privacy" className="hover:text-ink-soft transition-colors">
          Privacy
        </Link>
        <span>&middot;</span>
        <Link to="/about" className="hover:text-ink-soft transition-colors">
          About
        </Link>
      </p>
    </footer>
  );
}

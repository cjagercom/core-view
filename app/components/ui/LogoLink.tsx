import { Link } from 'react-router';

export function LogoLink() {
  return (
    <div className="pt-5 pb-2">
      <Link to="/" className="inline-flex items-center gap-2 text-ink-muted hover:text-ink transition-colors">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" className="w-6 h-6">
          <polygon
            points="16,2 29,11 25,27 7,27 3,11"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinejoin="round"
          />
          <polygon points="16,8 23,14 21,23 11,23 9,14" fill="#0D9488" opacity="0.3" />
        </svg>
        <span className="text-xs font-bold tracking-[0.15em] uppercase">Core-View</span>
      </Link>
    </div>
  );
}

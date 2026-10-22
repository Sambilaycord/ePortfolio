/** The site's mark: a mug with steam curling off it. Decorative, so it is hidden from assistive tech. */
export function SteamingMug({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" aria-hidden="true" className={className} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <g>
        <path className="desk-steam" d="M11 9c-1.5-1.6 1.5-2.6 0-4.4" />
        <path className="desk-steam" d="M16 9c-1.5-1.6 1.5-2.6 0-4.4" />
        <path className="desk-steam" d="M21 9c-1.5-1.6 1.5-2.6 0-4.4" />
      </g>
      <path d="M6 13h19v6a8 8 0 0 1-8 8h-3a8 8 0 0 1-8-8z" fill="currentColor" fillOpacity="0.15" />
      <path d="M25 15h1.5a3 3 0 0 1 0 6H24.5" />
    </svg>
  );
}

export function Logo({ className = "" }: { className?: string }) {
  return (
    <span className={`inline-flex items-center gap-2.5 ${className}`}>
      <span className="relative grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-brand-accent to-amber-500 text-brand-bg shadow-lg shadow-amber-500/20">
        {/* simple mixer-fader glyph */}
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
          <path d="M6 3v18M12 3v18M18 3v18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          <rect x="3.5" y="7" width="5" height="3.2" rx="1.2" fill="#0b1120" />
          <rect x="9.5" y="12" width="5" height="3.2" rx="1.2" fill="#0b1120" />
          <rect x="15.5" y="9" width="5" height="3.2" rx="1.2" fill="#0b1120" />
        </svg>
      </span>
      <span className="flex flex-col leading-none">
        <span className="text-sm font-bold tracking-tight text-brand-text">
          CrossBridge
        </span>
        <span className="text-[11px] font-medium uppercase tracking-widest text-brand-muted">
          Sound Training
        </span>
      </span>
    </span>
  );
}

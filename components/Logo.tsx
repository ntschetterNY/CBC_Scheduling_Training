/**
 * CrossBridge Church wordmark — a circular badge with a stylized "C / bridge"
 * glyph next to the two-line wordmark. `tone="light"` is for dark (teal)
 * backgrounds like the footer; the default suits light backgrounds.
 */
export function Logo({
  className = "",
  tone = "dark",
}: {
  className?: string;
  tone?: "dark" | "light";
}) {
  const isLight = tone === "light";
  const badgeBg = isLight ? "#ffffff" : "#1e5162";
  const glyph = isLight ? "#1e5162" : "#ffffff";
  const primary = isLight ? "#ffffff" : "#1e5162";
  const secondary = isLight ? "rgba(255,255,255,0.75)" : "#5d6b70";

  return (
    <span className={`inline-flex items-center gap-2.5 ${className}`}>
      <span
        className="grid h-9 w-9 shrink-0 place-items-center rounded-full"
        style={{ backgroundColor: badgeBg }}
        aria-hidden
      >
        <svg width="22" height="22" viewBox="0 0 48 48" fill="none">
          {/* stylized C */}
          <path
            d="M35 15.5a14 14 0 1 0 0 17"
            stroke={glyph}
            strokeWidth="5"
            strokeLinecap="round"
          />
          {/* bridge / cross stroke sweeping through the C */}
          <path
            d="M20 24c4-6 11-8 17-4"
            stroke={glyph}
            strokeWidth="5"
            strokeLinecap="round"
          />
        </svg>
      </span>
      <span className="flex flex-col leading-none">
        <span
          className="font-sans text-[15px] font-extrabold uppercase tracking-[0.12em]"
          style={{ color: primary }}
        >
          CrossBridge
        </span>
        <span
          className="font-sans text-[9px] font-semibold uppercase tracking-[0.42em]"
          style={{ color: secondary }}
        >
          Church
        </span>
      </span>
    </span>
  );
}

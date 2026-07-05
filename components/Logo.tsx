/**
 * CrossBridge Church logo — the black circular badge with the stylized
 * brushstroke "C" next to the two-line "CROSSBRIDGE / CHURCH" wordmark.
 *
 * `tone="light"` inverts the lockup for dark backgrounds (e.g. the teal
 * footer): a white badge with a black glyph and white wordmark. The default
 * `tone="dark"` is the standard black mark for light backgrounds.
 */
export function Logo({
  className = "",
  tone = "dark",
}: {
  className?: string;
  tone?: "dark" | "light";
}) {
  const isLight = tone === "light";
  const badgeBg = isLight ? "#ffffff" : "#101010";
  const glyph = isLight ? "#101010" : "#ffffff";
  const primary = isLight ? "#ffffff" : "#101010";
  const secondary = isLight ? "rgba(255,255,255,0.8)" : "#101010";

  return (
    <span className={`inline-flex items-center gap-2.5 ${className}`}>
      <span
        className="grid h-9 w-9 shrink-0 place-items-center rounded-full"
        style={{ backgroundColor: badgeBg }}
        aria-hidden
      >
        {/* Stylized brushstroke "C" */}
        <svg width="24" height="24" viewBox="0 0 100 100" fill="none">
          <path
            d="M72.3 14.4 A42 42 0 1 0 72.3 85.6 L64.8 68.9 A24 24 0 1 1 64.8 31.1 Q60 22 72.3 14.4 Z"
            fill={glyph}
          />
        </svg>
      </span>
      <span className="flex flex-col leading-none">
        <span
          className="font-sans text-[15px] font-extrabold uppercase tracking-[0.01em]"
          style={{ color: primary }}
        >
          CrossBridge
        </span>
        <span
          className="font-sans text-[9px] font-semibold uppercase tracking-[0.32em]"
          style={{ color: secondary }}
        >
          Church
        </span>
      </span>
    </span>
  );
}

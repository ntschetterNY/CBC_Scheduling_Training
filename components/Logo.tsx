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
        {/* Stylized brushstroke "C" with the rising tail flick */}
        <svg width="24" height="24" viewBox="0 0 100 100" fill="none">
          <path
            d="M93,15 C78,8 58,8 46,12 C23.9,12 6,29.9 6,52 C6,74.1 23.9,92 46,92 C68.1,92 79,88 76.6,77.7 L61.3,64.9 C57,70 51,72 46,72 C34.95,72 26,63.05 26,52 C26,40.95 34.95,32 46,32 C57.05,32 59,36 61.3,39.1 C70,30 84,22 93,15 Z"
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

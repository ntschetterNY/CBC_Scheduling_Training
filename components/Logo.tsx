import Image from "next/image";

/**
 * CrossBridge Church logo — the official PNG lockup (black circular badge with
 * the stylized brushstroke "C" next to the two-line "CROSSBRIDGE / CHURCH"
 * wordmark), served from `public/logo.png`.
 *
 * The source art is black on a transparent background, so it reads correctly on
 * light surfaces. `tone="light"` is for dark surfaces (e.g. the teal footer):
 * a CSS color inversion flips the same artwork to a white badge with a black
 * glyph and a white wordmark, preserving its transparency — no separate asset
 * required.
 */
export function Logo({
  className = "",
  tone = "dark",
}: {
  className?: string;
  tone?: "dark" | "light";
}) {
  const isLight = tone === "light";

  return (
    <Image
      src="/logo.png"
      alt="CrossBridge Church"
      width={484}
      height={86}
      priority
      className={`h-9 w-auto ${className}`}
      style={isLight ? { filter: "invert(1)" } : undefined}
    />
  );
}

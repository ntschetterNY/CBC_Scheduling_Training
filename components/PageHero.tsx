import Link from "next/link";
import type { ReactNode } from "react";

const widths = {
  "3xl": "max-w-3xl",
  "5xl": "max-w-5xl",
  "6xl": "max-w-6xl",
  "7xl": "max-w-7xl",
} as const;

/**
 * Teal page header band shared by every app page — the same deep-teal
 * gradient, gold eyebrow, and light sans title as the landing-page hero,
 * so inner pages carry the CrossBridge look.
 */
export function PageHero({
  eyebrow,
  title,
  description,
  icon,
  backHref,
  backLabel,
  actions,
  width = "5xl",
}: {
  eyebrow?: ReactNode;
  title: ReactNode;
  description?: ReactNode;
  icon?: ReactNode;
  backHref?: string;
  backLabel?: string;
  actions?: ReactNode;
  width?: keyof typeof widths;
}) {
  return (
    <section className="relative overflow-hidden bg-brand-teal">
      <div
        className="pointer-events-none absolute inset-0 opacity-90"
        style={{
          background:
            "radial-gradient(120% 90% at 50% -10%, #2f6a7b 0%, #1e5162 45%, #163e4a 100%)",
        }}
      />
      <div
        className={`relative mx-auto ${widths[width]} px-4 py-10 sm:px-6 sm:py-12`}
      >
        {backHref && (
          <Link
            href={backHref}
            className="mb-4 inline-flex items-center gap-1 font-sans text-xs font-semibold text-white/70 transition-colors hover:text-white"
          >
            ← {backLabel ?? "Back"}
          </Link>
        )}
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div className="flex items-start gap-4">
            {icon && (
              <span className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-white/10 text-2xl ring-1 ring-white/20">
                {icon}
              </span>
            )}
            <div>
              {eyebrow && (
                <p className="font-sans text-[11px] font-semibold uppercase tracking-[0.28em] text-brand-accent">
                  {eyebrow}
                </p>
              )}
              <h1 className="mt-2 font-sans text-3xl font-light tracking-tight text-white sm:text-4xl">
                {title}
              </h1>
              {description && (
                <p className="mt-3 max-w-2xl font-serif text-[15px] leading-relaxed text-white/75">
                  {description}
                </p>
              )}
            </div>
          </div>
          {actions && <div className="shrink-0 pb-1">{actions}</div>}
        </div>
      </div>
    </section>
  );
}

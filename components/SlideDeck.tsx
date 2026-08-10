"use client";

import { useEffect, useRef, useState } from "react";
import type { ModuleSlide } from "@/lib/curriculum";

/**
 * Slide-deck viewer for a module's source slides (the Safety & Security lesson
 * decks live in public/safety-slides/<slug>/). Shows one slide at a time with
 * prev/next controls, a counter, a thumbnail strip, and a full-screen lightbox.
 */
export function SlideDeck({
  slides,
  title = "Lesson slides",
}: {
  slides: ModuleSlide[];
  title?: string;
}) {
  const [current, setCurrent] = useState(0);
  const [lightbox, setLightbox] = useState(false);
  const thumbStripRef = useRef<HTMLDivElement>(null);

  const count = slides.length;
  const clamp = (n: number) => (n + count) % count;
  const go = (n: number) => setCurrent(clamp(n));

  // Keep the active thumbnail scrolled into view as the slide changes.
  useEffect(() => {
    const strip = thumbStripRef.current;
    const active = strip?.querySelector<HTMLElement>(`[data-idx="${current}"]`);
    active?.scrollIntoView({ block: "nearest", inline: "center", behavior: "smooth" });
  }, [current]);

  // Arrow-key navigation (and Escape to close the lightbox).
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") go(current + 1);
      else if (e.key === "ArrowLeft") go(current - 1);
      else if (e.key === "Escape") setLightbox(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [current, count]);

  if (count === 0) return null;
  const slide = slides[current];

  return (
    <section className="card overflow-hidden">
      <div className="flex items-center justify-between border-b border-brand-border px-5 py-4">
        <div>
          <h3 className="text-sm font-semibold text-brand-text">{title}</h3>
          <p className="mt-0.5 text-xs text-brand-muted">
            The original training slides for this lesson. Use ← / → to move
            through them, or click a slide to enlarge.
          </p>
        </div>
        <span className="shrink-0 rounded-full bg-brand-surface px-2.5 py-1 text-xs font-semibold text-brand-muted">
          {current + 1} / {count}
        </span>
      </div>

      <div className="p-4">
        {/* Main slide */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setLightbox(true)}
            className="block w-full overflow-hidden rounded-xl border border-brand-border bg-white"
            aria-label="Enlarge slide"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={slide.src}
              alt={slide.alt}
              className="mx-auto max-h-[70vh] w-full object-contain"
            />
          </button>

          {count > 1 && (
            <>
              <NavButton side="left" onClick={() => go(current - 1)} />
              <NavButton side="right" onClick={() => go(current + 1)} />
            </>
          )}
        </div>

        {/* Caption */}
        {slide.alt && (
          <p className="mt-3 text-center text-sm font-medium text-brand-text/90">
            {slide.alt}
          </p>
        )}

        {/* Thumbnail strip */}
        {count > 1 && (
          <div
            ref={thumbStripRef}
            className="mt-4 flex gap-2 overflow-x-auto pb-1"
          >
            {slides.map((s, i) => (
              <button
                key={s.src}
                type="button"
                data-idx={i}
                onClick={() => go(i)}
                aria-label={`Go to slide ${i + 1}`}
                aria-current={i === current}
                className={`relative shrink-0 overflow-hidden rounded-md border bg-white transition-all ${
                  i === current
                    ? "border-brand-accent ring-2 ring-brand-accent/40"
                    : "border-brand-border opacity-70 hover:opacity-100"
                }`}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={s.src}
                  alt=""
                  className="h-14 w-24 object-cover"
                  loading="lazy"
                />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Lightbox */}
      {lightbox && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
          onClick={() => setLightbox(false)}
          role="dialog"
          aria-modal="true"
          aria-label={slide.alt || "Slide"}
        >
          <button
            type="button"
            onClick={() => setLightbox(false)}
            className="absolute right-4 top-4 rounded-full bg-white/10 px-3 py-1.5 text-sm font-semibold text-white hover:bg-white/20"
          >
            Close ✕
          </button>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={slide.src}
            alt={slide.alt}
            className="max-h-[90vh] max-w-[95vw] object-contain"
            onClick={(e) => e.stopPropagation()}
          />
          {count > 1 && (
            <>
              <NavButton
                side="left"
                onClick={(e) => {
                  e.stopPropagation();
                  go(current - 1);
                }}
                variant="dark"
              />
              <NavButton
                side="right"
                onClick={(e) => {
                  e.stopPropagation();
                  go(current + 1);
                }}
                variant="dark"
              />
            </>
          )}
        </div>
      )}
    </section>
  );
}

function NavButton({
  side,
  onClick,
  variant = "light",
}: {
  side: "left" | "right";
  onClick: (e: React.MouseEvent) => void;
  variant?: "light" | "dark";
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={side === "left" ? "Previous slide" : "Next slide"}
      className={`absolute top-1/2 -translate-y-1/2 grid h-10 w-10 place-items-center rounded-full text-lg font-bold shadow-md transition-colors ${
        side === "left" ? "left-2" : "right-2"
      } ${
        variant === "dark"
          ? "bg-white/15 text-white hover:bg-white/30"
          : "bg-white/90 text-brand-text hover:bg-white"
      }`}
    >
      {side === "left" ? "‹" : "›"}
    </button>
  );
}

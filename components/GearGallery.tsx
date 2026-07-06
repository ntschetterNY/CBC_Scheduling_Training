"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Photo gallery of the core Allen & Heath gear. Each card shows the real
 * product photo from /public/products/<file> when it exists, and falls back
 * to a clean labelled placeholder until the photo is dropped in. To add the
 * real photos, place these files in `public/products/`:
 *   sq-6.jpg   me-500.jpg   ar2412.jpg
 * (any web image format works — update the `img` paths if you use .png/.webp)
 */

type Gear = {
  name: string;
  model: string;
  img: string;
  emoji: string;
  where: string;
  blurb: string;
};

const GEAR: Gear[] = [
  {
    name: "Allen & Heath SQ-6",
    model: "48-channel digital console · 24+1 faders",
    img: "/products/sq-6.jpg",
    emoji: "🎛️",
    where: "In the booth",
    blurb:
      "The heart of our system. Every input is mixed here into the house, stream, hallway, and monitor feeds.",
  },
  {
    name: "Allen & Heath ME-500",
    model: "16-channel personal monitor mixer",
    img: "/products/me-500.png",
    emoji: "🎧",
    where: "On stage",
    blurb:
      "Each musician's personal in-ear mixer. They dial in how much of themselves and the band they hear — so vocal monitors are off your plate at the console.",
  },
  {
    name: "Allen & Heath AR2412",
    model: "24-in / 12-out remote stage box (AudioRack)",
    img: "/products/ar2412.jpg",
    emoji: "🔌",
    where: "On stage",
    blurb:
      "The stage box. It collects the stage mics and DIs and sends them all to the SQ-6 over a single SLink cable.",
  },
];

function GearCard({ g }: { g: Gear }) {
  const [broken, setBroken] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  // If the photo 404s before React hydrates, the onError event is missed, so
  // also check for an already-failed image once on mount.
  useEffect(() => {
    const el = imgRef.current;
    if (el && el.complete && el.naturalWidth === 0) setBroken(true);
  }, []);

  return (
    <div className="card overflow-hidden">
      <div className="relative aspect-[4/3] bg-white">
        {!broken ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            ref={imgRef}
            src={g.img}
            alt={g.name}
            className="h-full w-full object-contain"
            onError={() => setBroken(true)}
          />
        ) : (
          <div className="flex h-full w-full flex-col items-center justify-center gap-1 text-brand-muted">
            <span className="text-4xl" aria-hidden>
              {g.emoji}
            </span>
            <span className="text-[11px] font-medium">Photo coming</span>
          </div>
        )}
        <span className="absolute left-2 top-2 rounded-full bg-brand-teal/90 px-2 py-0.5 text-[10px] font-bold text-white">
          {g.where}
        </span>
      </div>
      <div className="p-4">
        <h4 className="font-sans font-bold text-brand-text">{g.name}</h4>
        <p className="mt-0.5 text-[11px] font-semibold uppercase tracking-wide text-brand-accentDark">
          {g.model}
        </p>
        <p className="prose-body mt-2 text-sm">{g.blurb}</p>
      </div>
    </div>
  );
}

export function GearGallery({ title = "Our gear — the real hardware" }: { title?: string }) {
  return (
    <section className="card overflow-hidden">
      <div className="border-b border-brand-border px-5 py-4">
        <h3 className="text-sm font-semibold text-brand-text">{title}</h3>
        <p className="mt-0.5 text-xs text-brand-muted">
          The three pieces of Allen &amp; Heath gear at the center of our system
          — the console, the personal monitors, and the stage box.
        </p>
      </div>
      <div className="grid gap-4 p-4 sm:grid-cols-3">
        {GEAR.map((g) => (
          <GearCard key={g.name} g={g} />
        ))}
      </div>
    </section>
  );
}

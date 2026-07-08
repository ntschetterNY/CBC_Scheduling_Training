"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Photo gallery of our sound hardware, grouped by where it physically lives:
 * the Sound Booth, the Sound Rack Room (off the stage), and the stage itself.
 * Each card shows the real product photo from /public/products/<file> when it
 * exists, and falls back to a clean labelled placeholder until the photo is
 * dropped in. See public/products/README.md for the expected filenames.
 */

type Gear = {
  name: string;
  model: string;
  img: string;
  emoji: string;
  /** Physical location — used to group the cards. */
  where: string;
  /** Short parenthetical from the inventory (e.g. "Pastor 1 & 2"). */
  detail?: string;
  blurb: string;
};

/** Location groups, in the order they render. */
const LOCATIONS: { key: string; title: string; note: string }[] = [
  {
    key: "Sound Booth",
    title: "In the Sound Booth",
    note: "Where you mix — the console, the wireless receivers, and the RF and amp gear that lives up front with you.",
  },
  {
    key: "Sound Rack Room",
    title: "In the Sound Rack Room",
    note: "The equipment room off the stage — the stage box, house amps, system processors, and conditioned power.",
  },
  {
    key: "On stage",
    title: "On the stage",
    note: "The gear the musicians touch directly.",
  },
];

const GEAR: Gear[] = [
  // ── In the Sound Booth ─────────────────────────────────────────────
  {
    name: "Allen & Heath SQ-6",
    model: "48-channel digital console · 24+1 faders",
    img: "/products/sq-6.png",
    emoji: "🎛️",
    where: "Sound Booth",
    blurb:
      "The heart of our system. Every input is mixed here into the house, stream, hallway, and monitor feeds.",
  },
  {
    name: "Shure SLXD4",
    model: "Digital wireless receiver",
    img: "/products/slxd4.png",
    emoji: "🎙️",
    where: "Sound Booth",
    detail: "Pastor 1 & 2",
    blurb:
      "The digital wireless receivers for the two pastor mics. Clean, dependable RF for the spoken word — the most important channels of the service.",
  },
  {
    name: "Sennheiser EW 100",
    model: "Wireless mic systems",
    img: "/products/ew100.png",
    emoji: "🎙️",
    where: "Sound Booth",
    detail: "Yellow · Orange · White",
    blurb:
      "Wireless receivers for three of our color-coded worship vocal mics. Each color maps to a fixed channel, group, and DCA on the board.",
  },
  {
    name: "Sennheiser XS Wireless 2",
    model: "Wireless mic systems",
    img: "/products/xsw2.png",
    emoji: "🎙️",
    where: "Sound Booth",
    detail: "Green · Blue",
    blurb:
      "Wireless receivers for the Green vocal mic and the Blue announcement mic. Remember: turn the Blue mic on before unmuting it, or it creates static.",
  },
  {
    name: "Antenna Distribution System",
    model: "RF amplifier & antennas",
    img: "/products/antenna-distro.png",
    emoji: "📡",
    where: "Sound Booth",
    detail: "Amplifier + antennas",
    blurb:
      "Combines all the wireless receivers onto one shared pair of antennas and boosts the signal, so every handheld gets solid, drop-free reception across the room.",
  },
  {
    name: "Crown XTi 2000",
    model: "Power amplifier",
    img: "/products/xti-2000.png",
    emoji: "🔊",
    where: "Sound Booth",
    detail: "Hallway speakers",
    blurb:
      "The power amp that drives the hallway/lobby speakers, fed by the console's hallway output (local outputs 13 & 14).",
  },

  // ── In the Sound Rack Room ─────────────────────────────────────────
  {
    name: "Allen & Heath AR2412",
    model: "24-in / 12-out remote stage box (AudioRack)",
    img: "/products/ar2412.jpg",
    emoji: "🔌",
    where: "Sound Rack Room",
    detail: "Stage box",
    blurb:
      "The stage box. It collects the stage mics and DIs and sends them all to the SQ-6 over a single SLink cable.",
  },
  {
    name: "Crown CX404",
    model: "4-channel power amplifier",
    img: "/products/cx404.png",
    emoji: "🔊",
    where: "Sound Rack Room",
    detail: "Mids · Highs · Lows",
    blurb:
      "The main house power amp. Its channels drive the low, mid, and high sections of the main speakers after the system processor splits the signal.",
  },
  {
    name: "dbx DriveRack PA",
    model: "Loudspeaker management processor",
    img: "/products/driverack-pa.png",
    emoji: "🎚️",
    where: "Sound Rack Room",
    detail: "System processor",
    blurb:
      "The loudspeaker management processor between the console's main output and the house amps — it handles crossover, EQ, and speaker protection so the mains stay clean and safe.",
  },
  {
    name: "Allen & Heath ME-U",
    model: "ME personal-mixer hub",
    img: "/products/me-u.png",
    emoji: "🔀",
    where: "Sound Rack Room",
    detail: "Network switch",
    blurb:
      "The PoE network hub for the personal monitor system. It powers and connects the ME-500 mixers, distributing the stage mix to each musician over a single Cat5 cable.",
  },
  {
    name: "Rane AD 22d",
    model: "Digital delay line",
    img: "/products/rane-ad22d.png",
    emoji: "🎚️",
    where: "Sound Rack Room",
    detail: "Middle & rear zones",
    blurb:
      "A digital delay for the middle and rear speaker zones. It delays those fill speakers so their sound arrives in time with the mains, keeping the room coherent front to back.",
  },
  {
    name: "PD-420VS",
    model: "Conditioned power distribution system",
    img: "/products/pd420vs.png",
    emoji: "⚡",
    where: "Sound Rack Room",
    detail: "Power sequencing",
    blurb:
      "The conditioned power distribution and sequencing unit for the rack. It filters the incoming power and brings the amps and processors up in the right order to protect the gear.",
  },

  // ── On the stage ───────────────────────────────────────────────────
  {
    name: "Allen & Heath ME-500",
    model: "16-channel personal monitor mixer",
    img: "/products/me-500.png",
    emoji: "🎧",
    where: "On stage",
    blurb:
      "Each musician's personal in-ear mixer. They dial in how much of themselves and the band they hear — so vocal monitors are off your plate at the console.",
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
        {g.detail && (
          <span className="absolute right-2 top-2 rounded-full bg-brand-accent/90 px-2 py-0.5 text-[10px] font-bold text-white">
            {g.detail}
          </span>
        )}
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
          Every piece of our sound system, grouped by where it lives — the
          booth, the rack room off the stage, and the stage itself.
        </p>
      </div>
      <div className="space-y-6 p-4">
        {LOCATIONS.map((loc) => {
          const items = GEAR.filter((g) => g.where === loc.key);
          if (items.length === 0) return null;
          return (
            <div key={loc.key}>
              <div className="mb-3 flex items-center gap-2">
                <span className="rounded-full bg-brand-teal/90 px-2.5 py-0.5 text-[11px] font-bold text-white">
                  {loc.title}
                </span>
                <span className="text-xs text-brand-muted">{loc.note}</span>
              </div>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {items.map((g) => (
                  <GearCard key={g.name} g={g} />
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

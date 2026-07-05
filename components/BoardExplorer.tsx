"use client";

import { useState } from "react";

type Hotspot = {
  id: string;
  label: string;
  blurb: string;
  /** position on the SVG viewBox (0-1000 x, 0-560 y) */
  x: number;
  y: number;
  w: number;
  h: number;
};

const HOTSPOTS: Hotspot[] = [
  {
    id: "faders",
    label: "Fader Bays",
    blurb:
      "Motorized fader strips arranged in switchable Layers. Each strip has a fader, a Mute, a PAFL (listen) key, and a color-coded Select key. This is your primary hands-on mixing surface.",
    x: 40,
    y: 150,
    w: 560,
    h: 360,
  },
  {
    id: "mutegroups",
    label: "Mute Groups (top-right)",
    blurb:
      "The top-right buttons mute or unmute a whole GROUP of inputs at once — Vocals, Instruments, Drums, Keys. RED means muted. Unmute groups as the band comes in; mute what isn't in use.",
    x: 630,
    y: 60,
    w: 330,
    h: 90,
  },
  {
    id: "screen",
    label: "Touchscreen",
    blurb:
      "Color touchscreen showing the selected channel's processing (HPF, EQ, compressor), meters, routing, and Scenes. Press a channel's Select key to focus it, then adjust with the screen or rotaries.",
    x: 630,
    y: 170,
    w: 330,
    h: 130,
  },
  {
    id: "scenes",
    label: "Scene Recall Keys",
    blurb:
      "Soft keys for Scenes. Buttons 1–6 recall scenes and control MUTES only (not levels). Button 7 STORES the current setup. We recall 'Singing R1' to start and re-store it with Button 7 once dialed in.",
    x: 630,
    y: 320,
    w: 330,
    h: 90,
  },
  {
    id: "layers",
    label: "Layer Buttons (A/B/C/D)",
    blurb:
      "Bottom-left Layer buttons cycle the faders through pages: A = all inputs, B = DCAs / Groups / FX, C = AUX (monitor) controls, D = vocal inputs. Learn where each thing lives so you're not hunting mid-song.",
    x: 40,
    y: 60,
    w: 560,
    h: 70,
  },
  {
    id: "master",
    label: "Master & AUX",
    blurb:
      "The master section holds the main L/R control and PAFL level. On Layer C the faders become AUX (monitor) sends — how you build each musician's ME-500 in-ear mix.",
    x: 630,
    y: 430,
    w: 330,
    h: 90,
  },
];

export function BoardExplorer() {
  const [active, setActive] = useState<string>("faders");
  const current = HOTSPOTS.find((h) => h.id === active)!;

  return (
    <div className="card overflow-hidden">
      <div className="border-b border-brand-border px-5 py-4">
        <h3 className="text-sm font-semibold text-brand-text">
          Interactive Board Explorer
        </h3>
        <p className="mt-0.5 text-xs text-brand-muted">
          Tap a region of the SQ-6 to learn what it does.
        </p>
      </div>

      <div className="grid gap-0 lg:grid-cols-[1.6fr_1fr]">
        {/* Diagram */}
        <div className="bg-brand-surface p-4">
          <svg
            viewBox="0 0 1000 560"
            className="h-auto w-full select-none"
            role="group"
            aria-label="Allen & Heath SQ-6 console diagram"
          >
            {/* chassis */}
            <rect x="10" y="20" width="980" height="520" rx="22" fill="#1b2c32" stroke="#33505a" strokeWidth="2" />

            {HOTSPOTS.map((h) => {
              const isActive = h.id === active;
              return (
                <g key={h.id} className="cursor-pointer" onClick={() => setActive(h.id)}>
                  <rect
                    x={h.x}
                    y={h.y}
                    width={h.w}
                    height={h.h}
                    rx="12"
                    fill={isActive ? "rgba(216,162,60,0.20)" : "#26414a"}
                    stroke={isActive ? "#d8a23c" : "#3a5c66"}
                    strokeWidth={isActive ? 3 : 1.5}
                  />
                  <text
                    x={h.x + 14}
                    y={h.y + 26}
                    fill={isActive ? "#d8a23c" : "#9fb4bb"}
                    fontSize="18"
                    fontWeight="700"
                    fontFamily="Helvetica Neue, system-ui, sans-serif"
                  >
                    {h.label}
                  </text>
                </g>
              );
            })}

            {/* decorative fader lines inside the fader bay */}
            {Array.from({ length: 8 }).map((_, i) => (
              <g key={i}>
                <line
                  x1={80 + i * 66}
                  y1={210}
                  x2={80 + i * 66}
                  y2={480}
                  stroke="#3a5c66"
                  strokeWidth="3"
                  strokeLinecap="round"
                />
                <rect
                  x={72 + i * 66}
                  y={300 + ((i * 37) % 120)}
                  width="16"
                  height="26"
                  rx="4"
                  fill={active === "faders" ? "#d8a23c" : "#5b7d88"}
                />
              </g>
            ))}
          </svg>
        </div>

        {/* Info panel */}
        <div className="border-t border-brand-border p-5 lg:border-l lg:border-t-0">
          <div className="flex flex-wrap gap-2">
            {HOTSPOTS.map((h) => (
              <button
                key={h.id}
                onClick={() => setActive(h.id)}
                className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                  h.id === active
                    ? "bg-brand-accent text-brand-bg"
                    : "border border-brand-border bg-brand-surface text-brand-muted hover:text-brand-text"
                }`}
              >
                {h.label}
              </button>
            ))}
          </div>
          <h4 className="mt-4 text-lg font-bold text-brand-accent">
            {current.label}
          </h4>
          <p className="prose-body mt-2">{current.blurb}</p>
        </div>
      </div>
    </div>
  );
}

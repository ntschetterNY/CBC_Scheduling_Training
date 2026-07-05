"use client";

import { useState } from "react";
import Link from "next/link";

type Hotspot = {
  id: string;
  label: string;
  blurb: string;
  /** deep-link to the module that covers this region in depth */
  moduleSlug?: string;
  moduleTitle?: string;
  /** position on the SVG viewBox (0-1000 x, 0-600 y) */
  x: number;
  y: number;
  w: number;
  h: number;
};

const HOTSPOTS: Hotspot[] = [
  {
    id: "layers",
    label: "Layer Buttons (A/B/C/D)",
    blurb:
      "Bottom-left Layer buttons swap the faders between pages: A = all inputs, B = DCAs / Groups / FX, C = AUX (monitor) controls, D = vocal inputs. Learn where each lives so you're not hunting mid-song.",
    moduleSlug: "board-layout",
    moduleTitle: "Board Layout, Layers & Soft Keys",
    x: 40,
    y: 60,
    w: 560,
    h: 66,
  },
  {
    id: "faders",
    label: "Fader Bays",
    blurb:
      "Motorized fader strips arranged in switchable Layers. Each strip has a fader, a Mute, a PAFL (listen) key, and a color-coded Select key. This is your primary hands-on mixing surface.",
    moduleSlug: "board-layout",
    moduleTitle: "Board Layout, Layers & Soft Keys",
    x: 40,
    y: 150,
    w: 560,
    h: 300,
  },
  {
    id: "selectkeys",
    label: "Select / Mute / PAFL keys",
    blurb:
      "The row under each fader: SELECT focuses that channel (screen + rotaries follow it — it changes nothing you hear), MUTE silences it (red = muted), and PAFL lets you solo-listen to find a problem channel.",
    moduleSlug: "mutes-blue",
    moduleTitle: "Mute Groups, Channels & the Blue Mic",
    x: 40,
    y: 468,
    w: 560,
    h: 74,
  },
  {
    id: "mutegroups",
    label: "Mute Groups (top-right)",
    blurb:
      "The top-right buttons mute or unmute a whole GROUP of inputs at once — Vocals, Instruments, Drums, Keys. RED means muted. Unmute groups as the band comes in; mute what isn't in use.",
    moduleSlug: "mutes-blue",
    moduleTitle: "Mute Groups, Channels & the Blue Mic",
    x: 636,
    y: 60,
    w: 330,
    h: 84,
  },
  {
    id: "screen",
    label: "Touchscreen",
    blurb:
      "Color touchscreen showing the selected channel's processing (HPF, EQ, compressor), meters, routing, and Scenes. Press a channel's Select key to focus it, then adjust with the screen or rotaries.",
    moduleSlug: "eq",
    moduleTitle: "EQ at CrossBridge",
    x: 636,
    y: 166,
    w: 330,
    h: 128,
  },
  {
    id: "rotaries",
    label: "Rotary Encoders",
    blurb:
      "The row of knobs under the screen controls the focused channel's gain, HPF, EQ bands, and dynamics. What they do changes with what's on screen — select a channel first, then turn.",
    moduleSlug: "compression",
    moduleTitle: "Compression",
    x: 636,
    y: 314,
    w: 330,
    h: 60,
  },
  {
    id: "scenes",
    label: "Scene Recall Keys",
    blurb:
      "Soft keys for Scenes. Buttons 1–6 recall scenes and control MUTES only (not levels). We recall 'Singing R1' to start each service (select YES on power-up) — and never overwrite the baseline. Button 7 stores, but only for rare, team-approved changes.",
    moduleSlug: "scenes",
    moduleTitle: "Scenes: Recall & Store",
    x: 636,
    y: 396,
    w: 330,
    h: 78,
  },
  {
    id: "master",
    label: "Master & AUX",
    blurb:
      "The master section holds the main L/R control and PAFL level. On Layer C the faders become AUX (monitor) sends — the Pastor, Drums, Comms, Stream and FX buses. Vocalists now set their own in-ear level on their ME-500.",
    moduleSlug: "monitors-aux",
    moduleTitle: "Monitors: AUX Sends & ME-500s",
    x: 636,
    y: 496,
    w: 330,
    h: 60,
  },
];

export function BoardExplorer({ showModuleLinks = true }: { showModuleLinks?: boolean }) {
  const [active, setActive] = useState<string>("faders");
  const current = HOTSPOTS.find((h) => h.id === active)!;

  return (
    <div className="card overflow-hidden">
      <div className="border-b border-brand-border px-5 py-4">
        <h3 className="text-sm font-semibold text-brand-text">
          Interactive SQ-6 Guide
        </h3>
        <p className="mt-0.5 text-xs text-brand-muted">
          Tap a region of the Allen &amp; Heath SQ-6 to learn what it does — and jump to the module that covers it.
        </p>
      </div>

      <div className="grid gap-0 lg:grid-cols-[1.6fr_1fr]">
        {/* Diagram */}
        <div className="bg-brand-surface p-4">
          <svg
            viewBox="0 0 1000 600"
            className="h-auto w-full select-none"
            role="group"
            aria-label="Allen & Heath SQ-6 console diagram"
          >
            {/* chassis */}
            <rect x="10" y="20" width="980" height="560" rx="22" fill="#1b2c32" stroke="#33505a" strokeWidth="2" />

            {/* --- static detail: layer buttons --- */}
            {["A", "B", "C", "D"].map((l, i) => (
              <g key={l}>
                <rect x={60 + i * 70} y={74} width={54} height={38} rx="7" fill={active === "layers" ? "#d8a23c" : "#2f4a54"} stroke="#3a5c66" />
                <text x={60 + i * 70 + 27} y={99} textAnchor="middle" fontSize="18" fontWeight="700" fill={active === "layers" ? "#1b2c32" : "#cfe0e5"} fontFamily="Helvetica Neue, system-ui, sans-serif">
                  {l}
                </text>
              </g>
            ))}

            {/* --- static detail: faders --- */}
            {Array.from({ length: 8 }).map((_, i) => {
              const fx = 72 + i * 66;
              return (
                <g key={i}>
                  <line x1={fx} y1={165} x2={fx} y2={445} stroke="#3a5c66" strokeWidth="3" strokeLinecap="round" />
                  <rect x={fx - 9} y={300 + ((i * 37) % 110)} width="18" height="30" rx="4" fill={active === "faders" ? "#d8a23c" : "#5b7d88"} />
                  {/* select/mute keys */}
                  <rect x={fx - 13} y={476} width="26" height="22" rx="4" fill={active === "selectkeys" ? "#d8a23c" : "#26414a"} stroke="#3a5c66" />
                  <rect x={fx - 13} y={504} width="26" height="22" rx="4" fill={active === "selectkeys" ? "#bf4640" : "#26414a"} stroke="#3a5c66" />
                </g>
              );
            })}

            {/* --- static detail: mute group buttons --- */}
            {Array.from({ length: 8 }).map((_, i) => (
              <rect key={i} x={648 + (i % 4) * 78} y={i < 4 ? 74 : 108} width="66" height="26" rx="6" fill={active === "mutegroups" ? "#bf4640" : "#33505a"} stroke="#40626d" />
            ))}

            {/* --- static detail: rotary encoders --- */}
            {Array.from({ length: 6 }).map((_, i) => (
              <circle key={i} cx={676 + i * 52} cy={344} r="17" fill={active === "rotaries" ? "#d8a23c" : "#2f4a54"} stroke="#40626d" strokeWidth="2" />
            ))}

            {/* --- static detail: scene keys --- */}
            {Array.from({ length: 7 }).map((_, i) => (
              <g key={i}>
                <rect x={648 + i * 44} y={410} width="34" height="34" rx="6" fill={i === 6 ? (active === "scenes" ? "#3d8b6b" : "#2f4a54") : active === "scenes" ? "#d8a23c" : "#2f4a54"} stroke="#40626d" />
                <text x={648 + i * 44 + 17} y={432} textAnchor="middle" fontSize="14" fontWeight="700" fill="#1b2c32" fontFamily="Helvetica Neue, system-ui, sans-serif">
                  {i + 1}
                </text>
              </g>
            ))}

            {/* --- clickable hotspot overlays --- */}
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
                    fill={isActive ? "rgba(216,162,60,0.16)" : "transparent"}
                    stroke={isActive ? "#d8a23c" : "#3a5c66"}
                    strokeWidth={isActive ? 3 : 1.25}
                    strokeDasharray={isActive ? "none" : "5 5"}
                  />
                  <text
                    x={h.x + 12}
                    y={h.y + 20}
                    fill={isActive ? "#d8a23c" : "#7f9aa2"}
                    fontSize="14"
                    fontWeight="700"
                    fontFamily="Helvetica Neue, system-ui, sans-serif"
                  >
                    {h.label}
                  </text>
                </g>
              );
            })}
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
                    ? "bg-brand-accent text-white"
                    : "border border-brand-border bg-white text-brand-muted hover:text-brand-text"
                }`}
              >
                {h.label}
              </button>
            ))}
          </div>
          <h4 className="mt-4 text-lg font-bold text-brand-accentDark">
            {current.label}
          </h4>
          <p className="prose-body mt-2">{current.blurb}</p>
          {showModuleLinks && current.moduleSlug && (
            <Link
              href={`/learn/${current.moduleSlug}`}
              className="btn-secondary mt-4 text-xs"
            >
              Open “{current.moduleTitle}” →
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}

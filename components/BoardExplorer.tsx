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

/**
 * Regions of the ACTUAL Allen & Heath SQ-6 surface, laid out to match the
 * real console: a 24+1 motorized fader bay on the left (three banks of eight
 * plus the Main/LR master), the fader Layer keys, and — on the right — the 7"
 * touchscreen framed by 4 Soft Rotaries, the screen keys, and the block of 16
 * assignable SoftKeys that we program for mute groups and scene recall.
 */
const HOTSPOTS: Hotspot[] = [
  {
    id: "layers",
    label: "Fader Layers",
    blurb:
      "The SQ-6 has more channels than faders, so six switchable LAYERS re-use the same strips as different 'pages'. At CrossBridge we use four: A = all inputs, B = DCAs / Groups / FX, C = AUX (monitor) sends, D = vocal inputs. Press a Layer key and every fader instantly becomes that page.",
    moduleSlug: "board-layout",
    moduleTitle: "Board Layout, Layers & Soft Keys",
    x: 626,
    y: 96,
    w: 84,
    h: 232,
  },
  {
    id: "faders",
    label: "Fader Bays (24 + Main)",
    blurb:
      "Twenty-four motorized faders in three banks of eight, plus the Main/LR master on the right. What each fader controls depends on the Layer you're on. These are your primary hands-on mixing surface.",
    moduleSlug: "board-layout",
    moduleTitle: "Board Layout, Layers & Soft Keys",
    x: 44,
    y: 96,
    w: 520,
    h: 262,
  },
  {
    id: "selectkeys",
    label: "Sel / PAFL / Mute keys",
    blurb:
      "Each strip has a color-coded SELECT key (focuses that channel so the screen + Soft Rotaries follow it — it changes nothing you hear), a PAFL key (solo-listen to find a problem channel), and a MUTE key (red = muted). A signal/peak meter sits at the top of every strip.",
    moduleSlug: "mutes-blue",
    moduleTitle: "Mute Groups, Channels & the Blue Mic",
    x: 44,
    y: 384,
    w: 520,
    h: 92,
  },
  {
    id: "master",
    label: "Main / LR Master",
    blurb:
      "The +1 master fader controls the Main L/R — the house mix the congregation hears. On Layer C the fader strips become the AUX (monitor) sends: the Pastor, Drums, Comms, Stream and FX buses. Vocalists set their own in-ear level on their ME-500.",
    moduleSlug: "monitors-aux",
    moduleTitle: "Monitors: AUX Sends & ME-500s",
    x: 574,
    y: 96,
    w: 48,
    h: 340,
  },
  {
    id: "rotaries",
    label: "Soft Rotaries (4)",
    blurb:
      "Four assignable encoders with little LCDs frame the top of the screen. Assign them to the parameters you reach for most — HPF, gain, an EQ band, a send level — for the selected channel. Turn one and it adjusts that value without diving into a menu.",
    moduleSlug: "compression",
    moduleTitle: "Compression",
    x: 720,
    y: 60,
    w: 258,
    h: 54,
  },
  {
    id: "screen",
    label: "7\" Touchscreen",
    blurb:
      "The capacitive touchscreen shows the selected channel's processing (HPF, PEQ, compressor), meters, routing, and Scenes. Touch a parameter, then fine-tune with the screen rotary or a Soft Rotary. The Screen Select keys beneath it jump between Home, Meters, Routing and Setup.",
    moduleSlug: "eq",
    moduleTitle: "EQ at CrossBridge",
    x: 716,
    y: 124,
    w: 262,
    h: 176,
  },
  {
    id: "softkeys-mutes",
    label: "Mute-group SoftKeys",
    blurb:
      "The SQ-6 has 16 assignable SoftKeys. We program the left group as MUTE-GROUP keys — one press mutes or unmutes a whole family of inputs (Vocals, Instruments, Drums, Keys). RED means muted. Unmute groups as the band comes in; mute what isn't in use.",
    moduleSlug: "mutes-blue",
    moduleTitle: "Mute Groups, Channels & the Blue Mic",
    x: 716,
    y: 328,
    w: 128,
    h: 150,
  },
  {
    id: "softkeys-scenes",
    label: "Scene-recall SoftKeys",
    blurb:
      "The rest of the SoftKeys are our SCENE-RECALL keys. Recalling 'Singing R1' at the start of each service (select YES on power-up) resets the MUTES to the known-good baseline — it doesn't touch your fader levels. One key is reserved to STORE, used only for rare, team-approved changes.",
    moduleSlug: "scenes",
    moduleTitle: "Scenes: Recall & Store",
    x: 850,
    y: 328,
    w: 128,
    h: 150,
  },
];

/** Realistic channel-family colors for the Select keys, left → right. */
const SEL_COLORS = [
  "#3d8b6b", "#3d8b6b", "#3f78c4", "#bf4640", "#bf4640", "#bf4640", "#bf4640", "#cfd6d5",
  "#c98a2f", "#c98a2f", "#a24f96", "#a24f96", "#c98a2f", "#c98a2f", "#a24f96", "#a24f96",
  "#37a0ad", "#37a0ad", "#37a0ad", "#37a0ad", "#37a0ad", "#bf4640", "#a24f96", "#cfd6d5",
];

// ---- fader-strip geometry (shared by the art + hotspots) ----
const STRIP_START = 54;
const STRIP_PITCH = 20;
const BANK_GAP = 16;
const stripX = (i: number) => STRIP_START + i * STRIP_PITCH + Math.floor(i / 8) * BANK_GAP;
const MASTER_X = 592;

export function BoardExplorer({ showModuleLinks = true }: { showModuleLinks?: boolean }) {
  const [active, setActive] = useState<string>("faders");
  const current = HOTSPOTS.find((h) => h.id === active)!;
  const isOn = (id: string) => active === id;

  return (
    <div className="card overflow-hidden">
      <div className="border-b border-brand-border px-5 py-4">
        <h3 className="text-sm font-semibold text-brand-text">
          Interactive SQ-6 Guide
        </h3>
        <p className="mt-0.5 text-xs text-brand-muted">
          A map of the real Allen &amp; Heath SQ-6 surface — tap a region to
          learn what it does and jump to the module that covers it.
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
            <rect x="10" y="18" width="980" height="564" rx="20" fill="#1b2c32" stroke="#33505a" strokeWidth="2" />
            <rect x="20" y="28" width="960" height="544" rx="14" fill="#20343b" stroke="#2b444d" strokeWidth="1" />

            {/* ---- 24 channel fader strips + Main master ---- */}
            {Array.from({ length: 25 }).map((_, i) => {
              const master = i === 24;
              const fx = master ? MASTER_X : stripX(i);
              const sel = master ? "#d8a23c" : SEL_COLORS[i];
              const knobY = master ? 300 : 180 + ((i * 29) % 150);
              const fadersOn = master ? isOn("master") : isOn("faders");
              const keysOn = !master && isOn("selectkeys");
              return (
                <g key={i}>
                  {/* signal/peak meter */}
                  <rect x={fx - 7} y={104} width="14" height="6" rx="1.5" fill="#2a4048" />
                  <rect x={fx - 7} y={104} width="10" height="6" rx="1.5" fill={i % 3 === 0 ? "#e0b24a" : "#3d8b6b"} opacity="0.85" />
                  {/* color select key */}
                  <rect x={fx - 8} y={116} width="16" height="16" rx="3" fill={keysOn ? "#d8a23c" : sel} stroke="#12232a" strokeWidth="0.75" />
                  {/* fader track */}
                  <line x1={fx} y1={148} x2={fx} y2={372} stroke="#3a5c66" strokeWidth="3" strokeLinecap="round" />
                  {/* fader knob */}
                  <rect x={fx - 8} y={knobY} width="16" height="26" rx="3" fill={fadersOn ? "#d8a23c" : master ? "#c98a2f" : "#5b7d88"} stroke="#12232a" strokeWidth="0.75" />
                  <line x1={fx - 5} y1={knobY + 13} x2={fx + 5} y2={knobY + 13} stroke="#12232a" strokeWidth="1" opacity="0.7" />
                  {/* PAFL + Mute keys */}
                  <rect x={fx - 8} y={386} width="16" height="18" rx="3" fill={keysOn ? "#d8a23c" : "#26414a"} stroke="#3a5c66" strokeWidth="0.75" />
                  <rect x={fx - 8} y={408} width="16" height="18" rx="3" fill={keysOn ? "#bf4640" : "#26414a"} stroke="#3a5c66" strokeWidth="0.75" />
                </g>
              );
            })}
            {/* master label */}
            <text x={MASTER_X} y={444} textAnchor="middle" fontSize="10" fontWeight="700" fill="#9fb4bb" fontFamily="Helvetica Neue, system-ui, sans-serif">
              MAIN LR
            </text>

            {/* ---- Fader Layer keys (6) ---- */}
            {["A", "B", "C", "D", "5", "6"].map((l, i) => {
              const ly = 112 + i * 36;
              const houseLayer = i < 4;
              return (
                <g key={l}>
                  <rect x={636} y={ly} width={64} height={28} rx="5" fill={isOn("layers") ? "#d8a23c" : houseLayer ? "#2f4a54" : "#243a42"} stroke="#40626d" strokeWidth="1" />
                  <text x={636 + 12} y={ly + 19} fontSize="13" fontWeight="700" fill={isOn("layers") ? "#1b2c32" : houseLayer ? "#cfe0e5" : "#6f8b93"} fontFamily="Helvetica Neue, system-ui, sans-serif">
                    {l}
                  </text>
                  <text x={636 + 58} y={ly + 18} textAnchor="end" fontSize="8" fill={isOn("layers") ? "#1b2c32" : "#7f9aa2"} fontFamily="Helvetica Neue, system-ui, sans-serif">
                    {["inputs", "DCA/Grp", "AUX", "vocals", "", ""][i]}
                  </text>
                </g>
              );
            })}

            {/* ---- Soft Rotaries (4, with LCDs) ---- */}
            {Array.from({ length: 4 }).map((_, i) => {
              const cx = 762 + i * 64;
              return (
                <g key={i}>
                  <rect x={cx - 22} y={68} width={44} height={14} rx="2" fill="#0f2129" stroke="#2b444d" strokeWidth="0.75" />
                  <rect x={cx - 19} y={71} width={38} height={8} rx="1" fill={isOn("rotaries") ? "#d8a23c" : "#2f5f5a"} opacity="0.85" />
                  <circle cx={cx} cy={98} r="14" fill={isOn("rotaries") ? "#d8a23c" : "#2f4a54"} stroke="#40626d" strokeWidth="2" />
                  <circle cx={cx} cy={98} r="4" fill="#12232a" />
                </g>
              );
            })}

            {/* ---- 7" Touchscreen ---- */}
            <rect x={720} y={128} width={254} height={148} rx="8" fill={isOn("screen") ? "#123b40" : "#0f2b30"} stroke={isOn("screen") ? "#d8a23c" : "#2f5763"} strokeWidth={isOn("screen") ? 2.5 : 1.5} />
            {/* screen mini-EQ curve to hint at content */}
            <path d="M736 236 C 790 236, 812 176, 852 176 S 928 214, 958 200" fill="none" stroke={isOn("screen") ? "#d8a23c" : "#4f8f97"} strokeWidth="2" opacity="0.9" />
            <line x1={736} y1={236} x2={958} y2={236} stroke="#2f5763" strokeWidth="1" />
            {[0, 1, 2, 3].map((i) => (
              <rect key={i} x={742 + i * 54} y={244} width={40} height={22} rx="2" fill="#173e44" stroke="#2f5763" strokeWidth="0.75" />
            ))}
            <text x={847} y={150} textAnchor="middle" fontSize="10" fontWeight="700" fill={isOn("screen") ? "#d8a23c" : "#6fb0b8"} fontFamily="Helvetica Neue, system-ui, sans-serif">
              CH 4 · YELLOW
            </text>

            {/* screen select keys + screen encoder */}
            {Array.from({ length: 6 }).map((_, i) => (
              <rect key={i} x={720 + i * 34} y={286} width={26} height={16} rx="3" fill="#26414a" stroke="#3a5c66" strokeWidth="0.75" />
            ))}
            <circle cx={958} cy={296} r="13" fill="#2f4a54" stroke="#40626d" strokeWidth="2" />
            <circle cx={958} cy={296} r="3.5" fill="#12232a" />

            {/* ---- 16 assignable SoftKeys (2 rows of 8) ---- */}
            {Array.from({ length: 16 }).map((_, i) => {
              const col = i % 8;
              const row = Math.floor(i / 8);
              const sx = 720 + col * 32;
              const sy = 336 + row * 34;
              const muteSide = col < 4;
              const on = muteSide ? isOn("softkeys-mutes") : isOn("softkeys-scenes");
              const base = muteSide ? "#3a2a2c" : "#26414a";
              const accent = muteSide ? "#bf4640" : "#3d8b6b";
              return (
                <g key={i}>
                  <rect x={sx} y={sy} width={26} height={26} rx="4" fill={on ? "#d8a23c" : base} stroke={on ? "#d8a23c" : "#3a5c66"} strokeWidth="1" />
                  <circle cx={sx + 13} cy={sy + 8} r="2.5" fill={on ? "#1b2c32" : accent} />
                  <text x={sx + 13} y={sy + 21} textAnchor="middle" fontSize="8" fontWeight="700" fill={on ? "#1b2c32" : "#8fa6ad"} fontFamily="Helvetica Neue, system-ui, sans-serif">
                    {muteSide ? `M${i + 1}` : `S${i - 3}`}
                  </text>
                </g>
              );
            })}

            {/* ---- clickable hotspot overlays (outline always; label only when active) ---- */}
            {HOTSPOTS.map((h) => (
              <rect
                key={h.id}
                className="cursor-pointer"
                onClick={() => setActive(h.id)}
                x={h.x}
                y={h.y}
                width={h.w}
                height={h.h}
                rx="10"
                fill={h.id === active ? "rgba(216,162,60,0.14)" : "transparent"}
                stroke={h.id === active ? "#d8a23c" : "#3a5c66"}
                strokeWidth={h.id === active ? 3 : 1.25}
                strokeDasharray={h.id === active ? "none" : "5 5"}
              />
            ))}
            {/* active-region label — a clamped gold pill, so labels never collide */}
            {(() => {
              const pillW = current.label.length * 6.9 + 18;
              const pillX = Math.max(20, Math.min(current.x, 972 - pillW));
              const pillY = Math.max(24, current.y - 22);
              return (
                <g pointerEvents="none">
                  <rect x={pillX} y={pillY} width={pillW} height={19} rx="5" fill="#d8a23c" />
                  <text x={pillX + 9} y={pillY + 14} fill="#1b2c32" fontSize="12" fontWeight="700" fontFamily="Helvetica Neue, system-ui, sans-serif">
                    {current.label}
                  </text>
                </g>
              );
            })()}
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

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
  /** position on the SVG viewBox (0-1000 x, 0-640 y) */
  x: number;
  y: number;
  w: number;
  h: number;
};

/**
 * A map of the ACTUAL Allen & Heath SQ-6 surface, laid out to match the front
 * panel in the SQ Reference Guide. The board has three horizontal zones:
 *
 *   TOP POD  — SoftKeys 1–6 (left), Soft Rotaries, the Processing rotaries,
 *              the touchscreen, the EQ rotaries, SoftKeys 9–16 (right),
 *              the SQ-Drive (USB) port and the screen keys.
 *   MIDDLE   — the Routing keys, the per-channel Mute / Sel / PAFL keys, and
 *              the FX sends.
 *   BOTTOM   — Copy/Paste/Reset and the Layer keys (A–F), the 24 fader strips,
 *              the Master strip, and the Mix keys.
 *
 * At CrossBridge the assignable SoftKeys are what we program for mute groups
 * and scene recall.
 */
const HOTSPOTS: Hotspot[] = [
  // ---- TOP POD ----
  {
    id: "softkeys-l",
    label: "SoftKeys 1–6",
    blurb:
      "The SQ-6 has 16 assignable SoftKeys. At CrossBridge we program this left block for SCENE RECALL — recalling 'Singing R1' at the start of each service (select YES on power-up) resets the mutes to the known-good baseline without touching your fader levels.",
    moduleSlug: "scenes",
    moduleTitle: "Scenes: Recall & Store",
    x: 40,
    y: 62,
    w: 96,
    h: 120,
  },
  {
    id: "soft-rotaries",
    label: "Soft Rotaries",
    blurb:
      "Four assignable encoders. Assign them to the parameters you reach for most — HPF, gain, an EQ band, a send level — for the selected channel, so you can adjust without diving into a screen menu.",
    moduleSlug: "board-layout",
    moduleTitle: "Board Layout, Layers & Soft Keys",
    x: 40,
    y: 190,
    w: 150,
    h: 58,
  },
  {
    id: "processing",
    label: "Processing + rotaries",
    blurb:
      "The dedicated processing section for the selected channel: Preamp Gain, HPF, Gate and Compressor, with the Library and Insert keys. Turn these to shape the channel that's currently in focus.",
    moduleSlug: "compression",
    moduleTitle: "Compression",
    x: 208,
    y: 62,
    w: 150,
    h: 186,
  },
  {
    id: "touchscreen",
    label: "Touchscreen",
    blurb:
      "The 7\" capacitive touchscreen shows the selected channel's processing (HPF, PEQ, compressor), meters, routing and Scenes. Touch a parameter, then fine-tune it with a Soft Rotary. The screen keys beneath jump between Processing, Routing, FX, Scenes, Setup and I/O.",
    moduleSlug: "eq",
    moduleTitle: "EQ at CrossBridge",
    x: 398,
    y: 66,
    w: 190,
    h: 150,
  },
  {
    id: "eq",
    label: "EQ + rotaries",
    blurb:
      "The dedicated EQ section for the selected channel — the parametric bands (LF, LM, HM, HF) with Frequency, Gain and Width, plus GEQ. Shape a vocal or an instrument here; the touchscreen shows the curve as you turn.",
    moduleSlug: "eq",
    moduleTitle: "EQ at CrossBridge",
    x: 606,
    y: 62,
    w: 156,
    h: 186,
  },
  {
    id: "softkeys-r",
    label: "SoftKeys 9–16",
    blurb:
      "The right column of assignable SoftKeys. At CrossBridge we program these as MUTE-GROUP keys — one press mutes or unmutes a whole family of inputs (Vocals, Instruments, Drums, Keys). RED means muted; unmute groups as the band comes in.",
    moduleSlug: "mutes-blue",
    moduleTitle: "Mute Groups, Channels & the Blue Mic",
    x: 892,
    y: 62,
    w: 74,
    h: 186,
  },
  {
    id: "sqdrive",
    label: "SQ-Drive (USB) port",
    blurb:
      "The SQ-Drive USB port records the main mix (and multitrack) straight to a USB drive, and loads/stores Scenes and shows. Handy for capturing a service or moving our 'Singing R1' scene between consoles.",
    x: 812,
    y: 66,
    w: 66,
    h: 70,
  },
  // ---- MIDDLE ROW ----
  {
    id: "routing",
    label: "Routing keys",
    blurb:
      "Pre Fade, Assign and CH-to-All-Mix. With a mix selected, these decide where the selected channel is sent and whether its send is pre- or post-fader — the surface way to work the routing you see on the Routing screen.",
    moduleSlug: "input-patch",
    moduleTitle: "Reference: Input Patch & I/O",
    x: 40,
    y: 286,
    w: 88,
    h: 82,
  },
  {
    id: "mutesel",
    label: "Mute / Sel / PAFL keys",
    blurb:
      "The row above each fader: SELECT focuses that channel (screen + rotaries follow it — it changes nothing you hear), MUTE silences it (red = muted), and PAFL solo-listens to find a problem channel. A signal/peak meter sits on every strip.",
    moduleSlug: "mutes-blue",
    moduleTitle: "Mute Groups, Channels & the Blue Mic",
    x: 148,
    y: 262,
    w: 690,
    h: 108,
  },
  {
    id: "fxsends",
    label: "FX sends",
    blurb:
      "The four FX send masters. Sends here feed the internal effects engines (reverb, delay). Effects are usually taken POST-fader so the wet effect follows the vocal — the opposite of our pre-fade monitor sends.",
    moduleSlug: "monitors-aux",
    moduleTitle: "Monitors: AUX Sends & ME-500s",
    x: 892,
    y: 268,
    w: 74,
    h: 100,
  },
  // ---- BOTTOM ROW ----
  {
    id: "layers",
    label: "Layer keys (A–F)",
    blurb:
      "Six switchable LAYERS re-use the same faders as different 'pages'. At CrossBridge we use four: A = all inputs, B = DCAs / Groups / FX, C = AUX (monitor) sends, D = vocal inputs. Press a Layer key and every fader instantly becomes that page.",
    moduleSlug: "board-layout",
    moduleTitle: "Board Layout, Layers & Soft Keys",
    x: 40,
    y: 452,
    w: 88,
    h: 158,
  },
  {
    id: "faders",
    label: "Fader strips (24)",
    blurb:
      "Twenty-four motorized faders. What each one controls depends on the Layer you're on. This is your primary hands-on mixing surface — most of a service is spent here on Layer A (inputs) and Layer D (vocals).",
    moduleSlug: "board-layout",
    moduleTitle: "Board Layout, Layers & Soft Keys",
    x: 148,
    y: 388,
    w: 690,
    h: 224,
  },
  {
    id: "master",
    label: "Master strip",
    blurb:
      "The +1 master fader controls the Main L/R — the house mix the congregation hears. On Layer C the fader strips become the AUX (monitor) sends; the master follows the mix you have selected.",
    moduleSlug: "monitors-aux",
    moduleTitle: "Monitors: AUX Sends & ME-500s",
    x: 846,
    y: 388,
    w: 44,
    h: 224,
  },
  {
    id: "mixkeys",
    label: "Mix keys",
    blurb:
      "The Mix Select column. Press a Mix key and the whole surface flips to that mix — an AUX (monitor) send or an FX send — so the faders show every channel's send level into it. This is how you build a monitor mix.",
    moduleSlug: "monitors-aux",
    moduleTitle: "Monitors: AUX Sends & ME-500s",
    x: 900,
    y: 388,
    w: 66,
    h: 224,
  },
];

/** Realistic channel-family colors for the Select keys, left → right. */
const SEL_COLORS = [
  "#3d8b6b", "#3d8b6b", "#3f78c4", "#bf4640", "#bf4640", "#bf4640", "#bf4640", "#cfd6d5",
  "#c98a2f", "#c98a2f", "#a24f96", "#a24f96", "#c98a2f", "#c98a2f", "#a24f96", "#a24f96",
  "#37a0ad", "#37a0ad", "#37a0ad", "#37a0ad", "#37a0ad", "#bf4640", "#a24f96", "#cfd6d5",
];

// ---- fader-strip geometry (shared by the middle keys + the faders) ----
const STRIP_START = 158;
const STRIP_PITCH = 27;
const BANK_GAP = 12;
const stripX = (i: number) => STRIP_START + i * STRIP_PITCH + Math.floor(i / 8) * BANK_GAP;
const MASTER_X = 866;

export function BoardExplorer({ showModuleLinks = true }: { showModuleLinks?: boolean }) {
  const [active, setActive] = useState<string>("faders");
  const current = HOTSPOTS.find((h) => h.id === active)!;
  const isOn = (id: string) => active === id;
  const keyFill = (id: string, on = "#d8a23c", off = "#26414a") => (isOn(id) ? on : off);

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
            viewBox="0 0 1000 640"
            className="h-auto w-full select-none"
            role="group"
            aria-label="Allen & Heath SQ-6 console diagram"
          >
            {/* chassis + three zone plates */}
            <rect x="8" y="14" width="984" height="612" rx="20" fill="#1b2c32" stroke="#33505a" strokeWidth="2" />
            <rect x="22" y="26" width="956" height="228" rx="12" fill="#20343b" stroke="#2b444d" />
            <rect x="22" y="262" width="956" height="112" rx="12" fill="#1e3138" stroke="#2b444d" />
            <rect x="22" y="382" width="956" height="234" rx="12" fill="#20343b" stroke="#2b444d" />

            {/* ================= TOP POD ================= */}

            {/* SoftKeys 1–6 (left) */}
            {[0, 1, 2, 3].map((i) => (
              <rect key={i} x={48} y={70 + i * 26} width={78} height={18} rx="3" fill={keyFill("softkeys-l", "#d8a23c", "#3a2f24")} stroke="#4a3a26" />
            ))}
            {[0, 1].map((i) => (
              <rect key={i} x={48 + i * 42} y={178} width={36} height={18} rx="3" fill={keyFill("softkeys-l", "#d8a23c", "#3a2f24")} stroke="#4a3a26" />
            ))}

            {/* Soft Rotaries (4) */}
            {[0, 1, 2, 3].map((i) => {
              const cx = 60 + i * 34;
              return (
                <g key={i}>
                  <rect x={cx - 15} y={198} width={30} height={11} rx="2" fill="#0f2129" stroke="#2b444d" />
                  <circle cx={cx} cy={226} r="11" fill={keyFill("soft-rotaries", "#d8a23c", "#2f4a54")} stroke="#40626d" strokeWidth="1.5" />
                  <circle cx={cx} cy={226} r="3" fill="#12232a" />
                </g>
              );
            })}

            {/* Processing rotaries (Gain / HPF / Gate / Comp) */}
            {[
              { cx: 246, cy: 98 }, { cx: 246, cy: 150 }, { cx: 300, cy: 128 }, { cx: 300, cy: 196 }, { cx: 246, cy: 202 },
            ].map((p, i) => (
              <g key={i}>
                <circle cx={p.cx} cy={p.cy} r="14" fill={keyFill("processing", "#d8a23c", "#2f4a54")} stroke="#40626d" strokeWidth="1.5" />
                <circle cx={p.cx} cy={p.cy} r="3.5" fill="#12232a" />
              </g>
            ))}
            {[0, 1].map((i) => (
              <rect key={i} x={330} y={84 + i * 24} width={26} height={18} rx="3" fill={keyFill("processing", "#d8a23c", "#26414a")} stroke="#3a5c66" />
            ))}

            {/* Touchscreen */}
            <rect x={398} y={68} width={190} height={132} rx="7" fill={isOn("touchscreen") ? "#123b40" : "#0f2b30"} stroke={isOn("touchscreen") ? "#d8a23c" : "#2f5763"} strokeWidth={isOn("touchscreen") ? 2.5 : 1.5} />
            <path d="M412 160 C 452 160, 470 108, 500 108 S 560 140, 580 128" fill="none" stroke={isOn("touchscreen") ? "#d8a23c" : "#4f8f97"} strokeWidth="2" opacity="0.9" />
            <line x1={412} y1={160} x2={578} y2={160} stroke="#2f5763" strokeWidth="1" />
            <text x={493} y={86} textAnchor="middle" fontSize="9" fontWeight="700" fill={isOn("touchscreen") ? "#d8a23c" : "#6fb0b8"} fontFamily="Helvetica Neue, system-ui, sans-serif">CH 4 · YELLOW</text>
            {[0, 1, 2, 3].map((i) => (
              <rect key={i} x={410 + i * 44} y={170} width={34} height={20} rx="2" fill="#173e44" stroke="#2f5763" />
            ))}

            {/* EQ rotaries */}
            {[
              { cx: 700, cy: 96 }, { cx: 744, cy: 108 }, { cx: 722, cy: 150 }, { cx: 762, cy: 150 }, { cx: 744, cy: 194 }, { cx: 700, cy: 182 },
            ].map((p, i) => (
              <g key={i}>
                <circle cx={p.cx} cy={p.cy} r="13" fill={keyFill("eq", "#d8a23c", "#2f4a54")} stroke="#40626d" strokeWidth="1.5" />
                <circle cx={p.cx} cy={p.cy} r="3.5" fill="#12232a" />
              </g>
            ))}

            {/* SoftKeys 9–16 (right column) */}
            {Array.from({ length: 8 }).map((_, i) => (
              <rect key={i} x={900} y={70 + i * 22} width={58} height={16} rx="3" fill={keyFill("softkeys-r", "#d8a23c", "#3a2426")} stroke="#4a2a2c" />
            ))}

            {/* SQ-Drive / USB port */}
            <rect x={824} y={76} width={40} height={22} rx="3" fill={keyFill("sqdrive", "#d8a23c", "#26414a")} stroke="#3a5c66" />
            <rect x={834} y={82} width={20} height={10} rx="1.5" fill="#12232a" />

            {/* screen keys + SQ-6 logo */}
            {Array.from({ length: 9 }).map((_, i) => (
              <rect key={i} x={412 + i * 20} y={210} width={16} height={13} rx="2" fill="#26414a" stroke="#3a5c66" />
            ))}
            <text x={640} y={232} textAnchor="middle" fontSize="13" fontWeight="800" fill="#7f9aa2" fontFamily="Helvetica Neue, system-ui, sans-serif">SQ-6</text>

            {/* ================= MIDDLE ROW ================= */}

            {/* View + Routing keys */}
            <rect x={44} y={268} width={70} height={14} rx="3" fill="#26414a" stroke="#3a5c66" />
            {[0, 1, 2].map((i) => (
              <rect key={i} x={44} y={292 + i * 26} width={70} height={18} rx="3" fill={keyFill("routing", "#d8a23c", "#26414a")} stroke="#3a5c66" />
            ))}

            {/* per-channel Mute / Sel / PAFL + meter */}
            {Array.from({ length: 24 }).map((_, i) => {
              const fx = stripX(i);
              const on = isOn("mutesel");
              return (
                <g key={i}>
                  <rect x={fx - 6} y={268} width={12} height={5} rx="1.5" fill={i % 3 === 0 ? "#e0b24a" : "#3d8b6b"} opacity="0.85" />
                  <rect x={fx - 9} y={278} width={18} height={13} rx="2.5" fill={on ? "#bf4640" : "#26414a"} stroke="#3a5c66" />
                  <rect x={fx - 9} y={294} width={18} height={12} rx="2.5" fill={on ? "#d8a23c" : SEL_COLORS[i]} stroke="#12232a" strokeWidth="0.6" />
                  <ellipse cx={fx} cy={322} rx="8" ry="7" fill={on ? "#d8a23c" : "#2f4a54"} stroke="#40626d" />
                </g>
              );
            })}

            {/* FX sends (right) */}
            {Array.from({ length: 4 }).map((_, i) => (
              <g key={i}>
                <circle cx={921} cy={284 + i * 24} r="9" fill={keyFill("fxsends", "#d8a23c", "#2f4a54")} stroke="#40626d" />
                <circle cx={921} cy={284 + i * 24} r="2.5" fill="#12232a" />
              </g>
            ))}

            {/* ================= BOTTOM ROW ================= */}

            {/* Copy / Paste / Reset */}
            {[0, 1, 2].map((i) => (
              <rect key={i} x={44} y={394 + i * 20} width={70} height={15} rx="3" fill="#26414a" stroke="#3a5c66" />
            ))}

            {/* Layer keys A–F */}
            {["A", "B", "C", "D", "E", "F"].map((l, i) => {
              const ly = 458 + i * 25;
              const house = i < 4;
              return (
                <g key={l}>
                  <rect x={44} y={ly} width={70} height={20} rx="4" fill={isOn("layers") ? "#d8a23c" : house ? "#2f4a54" : "#243a42"} stroke="#40626d" />
                  <text x={52} y={ly + 14} fontSize="11" fontWeight="700" fill={isOn("layers") ? "#1b2c32" : house ? "#cfe0e5" : "#6f8b93"} fontFamily="Helvetica Neue, system-ui, sans-serif">{l}</text>
                  <text x={106} y={ly + 13} textAnchor="end" fontSize="7.5" fill={isOn("layers") ? "#1b2c32" : "#7f9aa2"} fontFamily="Helvetica Neue, system-ui, sans-serif">
                    {["inputs", "DCA/Grp", "AUX", "vocals", "", ""][i]}
                  </text>
                </g>
              );
            })}

            {/* 24 fader strips */}
            {Array.from({ length: 24 }).map((_, i) => {
              const fx = stripX(i);
              const knobY = 430 + ((i * 31) % 128);
              return (
                <g key={i}>
                  <line x1={fx} y1={410} x2={fx} y2={598} stroke="#3a5c66" strokeWidth="2.5" strokeLinecap="round" />
                  <rect x={fx - 8} y={knobY} width={16} height={26} rx="3" fill={isOn("faders") ? "#d8a23c" : "#e8edee"} stroke="#12232a" strokeWidth="0.75" />
                  <line x1={fx - 5} y1={knobY + 13} x2={fx + 5} y2={knobY + 13} stroke="#7a8a8f" strokeWidth="1" />
                </g>
              );
            })}

            {/* Master strip */}
            <rect x={MASTER_X - 20} y={392} width={40} height={16} rx="3" fill="#26414a" stroke="#3a5c66" />
            <text x={MASTER_X} y={404} textAnchor="middle" fontSize="8" fontWeight="700" fill="#9fb4bb" fontFamily="Helvetica Neue, system-ui, sans-serif">MASTER</text>
            <line x1={MASTER_X} y1={416} x2={MASTER_X} y2={598} stroke="#3a5c66" strokeWidth="2.5" strokeLinecap="round" />
            <rect x={MASTER_X - 8} y={470} width={16} height={26} rx="3" fill={isOn("master") ? "#d8a23c" : "#c98a2f"} stroke="#12232a" strokeWidth="0.75" />

            {/* Mix keys */}
            {Array.from({ length: 8 }).map((_, i) => (
              <g key={i}>
                <circle cx={930} cy={410 + i * 25} r="9" fill={keyFill("mixkeys", "#d8a23c", "#2f4a54")} stroke="#40626d" />
                <text x={930} y={414 + i * 25} textAnchor="middle" fontSize="8" fontWeight="700" fill={isOn("mixkeys") ? "#1b2c32" : "#8fa6ad"} fontFamily="Helvetica Neue, system-ui, sans-serif">{i + 1}</text>
              </g>
            ))}

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
                rx="9"
                fill={h.id === active ? "rgba(216,162,60,0.12)" : "transparent"}
                stroke={h.id === active ? "#d8a23c" : "#3a5c66"}
                strokeWidth={h.id === active ? 3 : 1.1}
                strokeDasharray={h.id === active ? "none" : "5 5"}
              />
            ))}
            {/* active-region label — a clamped gold pill, so labels never collide */}
            {(() => {
              const pillW = current.label.length * 6.9 + 18;
              const pillX = Math.max(20, Math.min(current.x, 972 - pillW));
              const pillY = Math.max(22, current.y - 22);
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

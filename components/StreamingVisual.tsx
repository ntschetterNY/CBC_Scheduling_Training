/**
 * StreamingVisual — annotated diagrams for the Live Streaming track.
 *
 * A section in lib/streaming-curriculum.ts sets `visual: "stream-…"` and
 * LessonVisual delegates those keys here (ModuleRunner renders it). Everything
 * is inline SVG — no external assets — so the diagrams stay crisp at any size
 * and readable in both light and dark mode.
 *
 * Several are deliberate recreations of the booth screenshots:
 *   "stream-ecamm-window"   — the Ecamm Live main window and its panels
 *   "stream-deck-grid"      — the 15-key Stream Deck service profile
 *   "stream-tablet-home"    — the sound-control tablet's home screen
 *   "stream-mixing-station" — the Mixing Station "Streaming" custom layout
 * Redraw those from a fresh screenshot whenever the booth layout changes.
 *
 * Keys:
 *   "stream-signal-map" | "stream-startup" | "stream-ecamm-window"
 *   "stream-scene-matrix" | "stream-deck-grid" | "stream-camera-switcher"
 *   "stream-no-signal" | "stream-audio-path" | "stream-service-timeline"
 *   "stream-tablet-home" | "stream-mixing-station" | "stream-monitor-out"
 */

const GOLD = "#d8a23c";
const TEAL = "#1e5162";
const TEAL2 = "#2c6373";
const DANGER = "#bf4640";
const SUCCESS = "#3d8b6b";
const INK = "#232b2e";
const MUTED = "#5d6b70";
const GRID = "#d9dedd";
const PANEL = "#f7f8f8";
const SURFACE = "#eef0ef";
const BLUE = "#3f78c4";
const SCREEN = "#1e272b"; // the dark chrome of Ecamm / the Stream Deck
const SCREEN2 = "#2b373c";
const SCREEN_TEXT = "#e6ebec";

const FONT = "Helvetica Neue, system-ui, sans-serif";

/* ------------------------------------------------------------------ */
/* Chrome                                                              */
/* ------------------------------------------------------------------ */

function Frame({
  title,
  caption,
  legend,
  children,
}: {
  title: string;
  caption?: string;
  /** Numbered callouts rendered under the diagram. */
  legend?: { n: number; label: string; text: string }[];
  children: React.ReactNode;
}) {
  return (
    <figure className="card overflow-hidden">
      <figcaption className="border-b border-brand-border px-5 py-3">
        <h4 className="text-sm font-semibold text-brand-text">{title}</h4>
      </figcaption>
      <div className="bg-brand-surface/40 p-4">{children}</div>
      {legend && (
        <ol className="grid gap-x-6 gap-y-2 border-t border-brand-border px-5 py-4 sm:grid-cols-2">
          {legend.map((l) => (
            <li key={l.n} className="flex gap-2.5 text-xs text-brand-text/85">
              <span className="mt-px grid h-5 w-5 shrink-0 place-items-center rounded-full bg-brand-teal text-[10px] font-bold text-white">
                {l.n}
              </span>
              <span>
                <span className="font-semibold text-brand-text">{l.label}</span>{" "}
                — {l.text}
              </span>
            </li>
          ))}
        </ol>
      )}
      {caption && (
        <p className="border-t border-brand-border px-5 py-3 text-xs text-brand-muted">
          {caption}
        </p>
      )}
    </figure>
  );
}

/** Every diagram sits on an explicit light panel so it reads in dark mode too. */
function Board({
  w,
  h,
  label,
  children,
}: {
  w: number;
  h: number;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <svg
      viewBox={`0 0 ${w} ${h}`}
      className="h-auto w-full"
      role="img"
      aria-label={label}
    >
      <rect x="0" y="0" width={w} height={h} rx="10" fill={PANEL} />
      {children}
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/* Primitives                                                          */
/* ------------------------------------------------------------------ */

function Arrow({
  x1,
  y1,
  x2,
  y2,
  color = MUTED,
  width = 2,
  dashed = false,
}: {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  color?: string;
  width?: number;
  dashed?: boolean;
}) {
  const dx = x2 - x1;
  const dy = y2 - y1;
  const len = Math.hypot(dx, dy) || 1;
  const ux = dx / len;
  const uy = dy / len;
  const head = 8;
  const bx = x2 - ux * head;
  const by = y2 - uy * head;
  const px = -uy;
  const py = ux;
  return (
    <g>
      <line
        x1={x1}
        y1={y1}
        x2={bx}
        y2={by}
        stroke={color}
        strokeWidth={width}
        strokeLinecap="round"
        strokeDasharray={dashed ? "5 5" : undefined}
      />
      <polygon
        points={`${x2},${y2} ${bx + px * 4.5},${by + py * 4.5} ${
          bx - px * 4.5
        },${by - py * 4.5}`}
        fill={color}
      />
    </g>
  );
}

function Box({
  x,
  y,
  w,
  h,
  title,
  sub,
  color = TEAL,
  fill = "#ffffff",
  titleSize = 12,
}: {
  x: number;
  y: number;
  w: number;
  h: number;
  title: string;
  sub?: string;
  color?: string;
  fill?: string;
  titleSize?: number;
}) {
  return (
    <g>
      <rect
        x={x}
        y={y}
        width={w}
        height={h}
        rx="8"
        fill={fill}
        stroke={color}
        strokeWidth="1.6"
      />
      <text
        x={x + w / 2}
        y={sub ? y + h / 2 - 3 : y + h / 2 + 4}
        textAnchor="middle"
        fontSize={titleSize}
        fontWeight="700"
        fill={INK}
        fontFamily={FONT}
      >
        {title}
      </text>
      {sub && (
        <text
          x={x + w / 2}
          y={y + h / 2 + 13}
          textAnchor="middle"
          fontSize="10"
          fill={MUTED}
          fontFamily={FONT}
        >
          {sub}
        </text>
      )}
    </g>
  );
}

/** A numbered callout badge that ties a region to the legend under the figure. */
function Badge({ x, y, n }: { x: number; y: number; n: number }) {
  return (
    <g>
      <circle cx={x} cy={y} r="9" fill={TEAL} stroke="#ffffff" strokeWidth="1.5" />
      <text
        x={x}
        y={y + 3.5}
        textAnchor="middle"
        fontSize="10"
        fontWeight="700"
        fill="#ffffff"
        fontFamily={FONT}
      >
        {n}
      </text>
    </g>
  );
}

function Label({
  x,
  y,
  children,
  size = 10,
  color = MUTED,
  anchor = "start",
  weight = 400,
}: {
  x: number;
  y: number;
  children: React.ReactNode;
  size?: number;
  color?: string;
  anchor?: "start" | "middle" | "end";
  weight?: number;
}) {
  return (
    <text
      x={x}
      y={y}
      fontSize={size}
      fill={color}
      textAnchor={anchor}
      fontWeight={weight}
      fontFamily={FONT}
    >
      {children}
    </text>
  );
}

/* ------------------------------------------------------------------ */
/* 1 · Signal map — what plugs into what                               */
/* ------------------------------------------------------------------ */

function SignalMap() {
  return (
    <Board w={700} h={330} label="How the streaming rig is connected">
      <Label x={16} y={22} weight={700} size={11} color={TEAL}>
        SOURCES
      </Label>
      <Label x={300} y={22} weight={700} size={11} color={TEAL}>
        THE BOOTH MAC
      </Label>
      <Label x={588} y={22} weight={700} size={11} color={TEAL}>
        OUT
      </Label>

      {/* sources */}
      <Box x={16} y={36} w={176} h={44} title="Camera A — MAIN" sub="close shot · HDMI → Cam Link" />
      <Box x={16} y={92} w={176} h={44} title="Camera B — WS" sub="wide shot · HDMI → Cam Link" />
      <Box x={16} y={148} w={176} h={44} title="Slides computer" sub="Proclaim — CBCR2" color={TEAL2} />
      <Box x={16} y={214} w={176} h={52} title="SQ-6 stream mix" sub="AUX 1 → Scarlett 2i2 USB" color={GOLD} />
      <Box x={16} y={278} w={176} h={36} title="Stream Deck" sub="15 keys" color={MUTED} titleSize={11} />

      {/* arrows in */}
      <Arrow x1={192} y1={58} x2={296} y2={110} />
      <Arrow x1={192} y1={114} x2={296} y2={125} />
      <Arrow x1={192} y1={170} x2={296} y2={140} color={TEAL2} />
      <Arrow x1={192} y1={240} x2={296} y2={168} color={GOLD} />
      <Arrow x1={192} y1={296} x2={296} y2={196} color={MUTED} dashed />
      <Label x={202} y={310} size={9}>
        controls Ecamm
      </Label>

      {/* the mac */}
      <rect x={300} y={60} width={210} height={200} rx="10" fill="#ffffff" stroke={TEAL} strokeWidth="2" />
      <rect x={300} y={60} width={210} height={30} rx="10" fill={TEAL} />
      <rect x={300} y={80} width={210} height={10} fill={TEAL} />
      <Label x={405} y={80} size={12} color="#ffffff" anchor="middle" weight={700}>
        Mac mini · Ecamm Live
      </Label>
      <Box x={316} y={104} w={178} h={36} title="Sources" sub="2 cameras + slides" color={GRID} fill={SURFACE} titleSize={11} />
      <Box x={316} y={148} w={178} h={36} title="Scenes" sub="the 11 saved looks" color={GRID} fill={SURFACE} titleSize={11} />
      <Box x={316} y={192} w={178} h={36} title="Audio mixer" sub="Scarlett · Movie · SFX" color={GRID} fill={SURFACE} titleSize={11} />
      <Label x={405} y={248} anchor="middle" size={10} color={MUTED}>
        one scene at a time goes out
      </Label>

      {/* outputs */}
      <Arrow x1={510} y1={120} x2={584} y2={96} color={SUCCESS} />
      <Arrow x1={510} y1={150} x2={584} y2={152} color={SUCCESS} />
      <Arrow x1={510} y1={190} x2={584} y2={212} color={MUTED} dashed />
      <Box x={584} y={74} w={100} h={44} title="YouTube" sub="live" color={SUCCESS} />
      <Box x={584} y={130} w={100} h={44} title="Facebook" sub="live" color={SUCCESS} />
      <Box x={584} y={190} w={100} h={44} title="Recording" sub="saved on the Mac" color={MUTED} />
    </Board>
  );
}

/* ------------------------------------------------------------------ */
/* 2 · Start-up order                                                  */
/* ------------------------------------------------------------------ */

function StartupOrder() {
  const steps = [
    { n: 1, t: "Cameras on", s: "both, give them a moment" },
    { n: 2, t: "Slides up", s: "Proclaim, on the network" },
    { n: 3, t: "Wake the Mac", s: "login is on the machine" },
    { n: 4, t: "Open Ecamm", s: "Stream Deck lights up" },
    { n: 5, t: "Check sources", s: "3 live pictures" },
    { n: 6, t: "Check audio", s: "Scarlett meter moving" },
    { n: 7, t: "OPENING LOOP", s: "and wait to go live" },
  ];
  return (
    <Board w={700} h={200} label="Start-up order for the streaming rig">
      {steps.map((s, i) => {
        const col = i % 4;
        const row = Math.floor(i / 4);
        const x = 18 + col * 170;
        const y = 30 + row * 84;
        const last = i === steps.length - 1;
        return (
          <g key={s.n}>
            <rect
              x={x}
              y={y}
              width={150}
              height={58}
              rx="8"
              fill="#ffffff"
              stroke={last ? GOLD : TEAL}
              strokeWidth={last ? 2 : 1.6}
            />
            <circle cx={x + 18} cy={y + 20} r="11" fill={last ? GOLD : TEAL} />
            <Label x={x + 18} y={y + 24} anchor="middle" size={11} color="#ffffff" weight={700}>
              {s.n}
            </Label>
            <Label x={x + 36} y={y + 24} size={11.5} color={INK} weight={700}>
              {s.t}
            </Label>
            <Label x={x + 12} y={y + 44} size={10}>
              {s.s}
            </Label>
            {col < 3 && i < steps.length - 1 && (
              <Arrow x1={x + 152} y1={y + 29} x2={x + 166} y2={y + 29} />
            )}
          </g>
        );
      })}
      {/* wrap arrow from step 4 down to step 5 */}
      <Arrow x1={603} y1={90} x2={603} y2={104} />
      <path d="M603 104 L603 110 L93 110 L93 114" fill="none" stroke={MUTED} strokeWidth="2" />
      <Arrow x1={93} y1={108} x2={93} y2={114} />
      <Label x={350} y={192} anchor="middle" size={10} color={MUTED}>
        Cameras and slides come up BEFORE Ecamm — otherwise the scenes open on the black “No Signal” card.
      </Label>
    </Board>
  );
}

/* ------------------------------------------------------------------ */
/* 3 · The Ecamm Live window (recreation of the booth screenshot)      */
/* ------------------------------------------------------------------ */

function Pill({
  x,
  y,
  w,
  h = 16,
  label,
  fill = SCREEN2,
  color = SCREEN_TEXT,
  size = 8.5,
}: {
  x: number;
  y: number;
  w: number;
  h?: number;
  label: string;
  fill?: string;
  color?: string;
  size?: number;
}) {
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} rx={h / 2} fill={fill} />
      <text
        x={x + w / 2}
        y={y + h / 2 + 3}
        textAnchor="middle"
        fontSize={size}
        fill={color}
        fontFamily={FONT}
        fontWeight="600"
      >
        {label}
      </text>
    </g>
  );
}

function DarkPanel({
  x,
  y,
  w,
  h,
  title,
  badge,
  titleSize = 8.5,
}: {
  x: number;
  y: number;
  w: number;
  h: number;
  title: string;
  /** Callout number, drawn at the left of the title bar so it never covers it. */
  badge?: number;
  titleSize?: number;
}) {
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} rx="6" fill={SCREEN} stroke="#000000" strokeOpacity="0.25" />
      <rect x={x} y={y} width={w} height={16} rx="6" fill={SCREEN2} />
      <rect x={x} y={y + 10} width={w} height={6} fill={SCREEN2} />
      <text
        x={badge !== undefined ? x + 22 : x + w / 2}
        y={y + 11.5}
        textAnchor={badge !== undefined ? "start" : "middle"}
        fontSize={titleSize}
        fill={SCREEN_TEXT}
        fontFamily={FONT}
        fontWeight="700"
      >
        {title}
      </text>
      {badge !== undefined && <Badge x={x + 10} y={y + 8} n={badge} />}
    </g>
  );
}

const SCENE_NAMES = [
  "TECH DIFF audio",
  "TECH DIFF MUTE",
  "OPENING LOOP",
  "SLIDES ONLY",
  "SPEAKER + SLIDES",
  "MAIN + SLIDES",
  "WS + SLIDES",
  "MAIN ONLY",
  "WS ONLY",
  "WS w/SLIDES",
  "ENDING LOOP",
];

function EcammWindow() {
  return (
    <Board w={720} h={470} label="Map of the Ecamm Live window and its panels">
      {/* ── main window ─────────────────────────────────────────── */}
      <rect x={10} y={10} width={452} height={300} rx="8" fill="#3193d6" />
      <rect x={10} y={10} width={452} height={34} rx="8" fill="#2b83c0" />
      <rect x={10} y={30} width={452} height={14} fill="#2b83c0" />
      <Pill x={34} y={19} w={92} label="WS + SLIDES  ▾" fill="#1d6ea6" />
      <Pill x={162} y={19} w={94} label="Stream & Record" fill="#1d6ea6" />
      <Pill x={266} y={19} w={54} label="◉  ▭  ▣" fill="#1d6ea6" />
      <Pill x={330} y={19} w={40} label="Pro" fill="#1d6ea6" />
      <Pill x={16} y={50} w={26} h={14} label="NDI" fill="#1d6ea6" size={7} />

      {/* program area — the two panes of the live scene */}
      <rect x={22} y={78} width={200} height={128} rx="6" fill="#0d0f10" />
      <Label x={122} y={140} anchor="middle" size={10} color="#8f9a9e">
        camera pane
      </Label>
      <Label x={122} y={156} anchor="middle" size={9} color="#6d787c">
        (“No Signal” when a camera is dark)
      </Label>
      <rect x={234} y={78} width={200} height={128} rx="6" fill="#f2efe4" />
      <Label x={334} y={136} anchor="middle" size={10} color={INK} weight={700}>
        slides pane
      </Label>
      <Label x={334} y={152} anchor="middle" size={9} color={MUTED}>
        from the Proclaim Mac
      </Label>

      <Pill x={36} y={278} w={90} label="✎  Preview Mode" fill="#1d6ea6" />
      <Pill x={396} y={278} w={44} label="New" fill="#1d6ea6" />

      {/* right tool rail */}
      {["▤", "🖼", "🎙", "✨", "♪", "💬", "👥", "⚙"].map((g, i) => (
        <g key={i}>
          <rect x={432} y={54 + i * 26} width={22} height={22} rx="5" fill="#1d6ea6" />
          <text
            x={443}
            y={69 + i * 26}
            textAnchor="middle"
            fontSize="10"
            fill={SCREEN_TEXT}
            fontFamily={FONT}
          >
            {g}
          </text>
        </g>
      ))}

      {/* ── scenes panel ────────────────────────────────────────── */}
      <DarkPanel x={472} y={10} w={118} h={216} title="Scenes (CrossBridge)" badge={5} titleSize={7.5} />
      {SCENE_NAMES.map((n, i) => (
        <g key={n}>
          <rect x={478} y={30 + i * 16} width={14} height={10} rx="2" fill={i === 6 ? GOLD : "#4a575c"} />
          <text
            x={496}
            y={39 + i * 16}
            fontSize="7.5"
            fill={i === 6 ? GOLD : SCREEN_TEXT}
            fontFamily={FONT}
            fontWeight={i === 6 ? 700 : 400}
          >
            {n}
          </text>
        </g>
      ))}
      <rect x={476} y={208} width={110} height={12} rx="4" fill={SCREEN2} />
      <Label x={531} y={217} anchor="middle" size={7} color="#9fadb2">
        + duplicate · folder · share · 🗑
      </Label>

      {/* ── overlays panel ──────────────────────────────────────── */}
      <DarkPanel x={472} y={234} w={118} h={128} title="Overlays" badge={6} />
      <Label x={478} y={264} size={7.5} color="#9fadb2" weight={700}>
        SHOW IN ALL SCENES
      </Label>
      {["Sorry We’re…", "Copy of Sor…", "Blurred for…"].map((t, i) => (
        <g key={t}>
          <text x={480} y={278 + i * 13} fontSize="7.5" fill={SCREEN_TEXT} fontFamily={FONT}>
            T {t}
          </text>
          <text x={566} y={278 + i * 13} fontSize="7.5" fill="#9fadb2" fontFamily={FONT}>
            ⚙ 👁
          </text>
        </g>
      ))}
      <Label x={478} y={330} size={7.5} color="#9fadb2" weight={700}>
        SHOW IN CURRENT SCENE
      </Label>
      <text x={480} y={344} fontSize="7.5" fill={SCREEN_TEXT} fontFamily={FONT}>
        ▥ 2 shot overlay
      </text>
      <Label x={478} y={357} size={7.5} color="#9fadb2" weight={700}>
        SHOW IN BACKGROUND
      </Label>

      {/* ── camera effects ──────────────────────────────────────── */}
      <DarkPanel x={598} y={10} w={112} h={244} title="Camera Effects" badge={7} />
      <rect x={604} y={30} width={100} height={13} rx="3" fill={SCREEN2} />
      <Label x={654} y={39} anchor="middle" size={7.5} color={SCREEN_TEXT}>
        Cam Link 4K ▾
      </Label>
      <Label x={604} y={54} size={7} color="#9fadb2">
        Resolution: 2160p30 (4K)
      </Label>
      <Label x={604} y={70} size={7.5} color={SCREEN_TEXT}>
        ☐ Green Screen
      </Label>
      <Label x={604} y={84} size={7.5} color={SCREEN_TEXT} weight={700}>
        Digital Zoom &amp; Pan
      </Label>
      <rect x={604} y={90} width={100} height={4} rx="2" fill="#4a575c" />
      <circle cx={640} cy={92} r="4" fill={SCREEN_TEXT} />
      <rect x={618} y={100} width={72} height={40} rx="3" fill="#0d0f10" />
      <Label x={604} y={156} size={7.5} color={SCREEN_TEXT} weight={700}>
        Picture Settings
      </Label>
      {["Brightness", "Temperature", "Tint", "Saturation", "Gamma"].map((s, i) => (
        <g key={s}>
          <text x={604} y={169 + i * 16} fontSize="7" fill="#9fadb2" fontFamily={FONT}>
            {s}
          </text>
          <rect x={604} y={172 + i * 16} width={100} height={3} rx="1.5" fill="#4a575c" />
          <circle cx={604 + 30 + i * 9} cy={173.5 + i * 16} r="3.5" fill={SCREEN_TEXT} />
        </g>
      ))}
      <rect x={604} y={252 - 12} width={100} height={11} rx="3" fill={SCREEN2} />
      <Label x={654} y={247} anchor="middle" size={7} color={SCREEN_TEXT}>
        Apply To All Scenes
      </Label>

      {/* ── camera switcher ─────────────────────────────────────── */}
      <DarkPanel x={598} y={262} w={112} h={198} title="Camera Switcher" badge={8} />
      <rect x={604} y={282} width={48} height={12} rx="3" fill={SCREEN2} />
      <rect x={656} y={282} width={48} height={12} rx="3" fill="#4a575c" />
      <Label x={628} y={291} anchor="middle" size={7} color={SCREEN_TEXT}>
        All Sources
      </Label>
      <Label x={680} y={291} anchor="middle" size={7} color={SCREEN_TEXT}>
        A/B
      </Label>
      {[
        { t: "A · Cam Link 4K 2", r: "MAIN", fill: "#5b4a3a" },
        { t: "B · Cam Link 4K", r: "WS", fill: "#0d0f10" },
        { t: "C · Proclaim", r: "SLIDES", fill: "#f2efe4" },
      ].map((c, i) => (
        <g key={c.t}>
          <rect x={604} y={300 + i * 52} width={100} height={32} rx="4" fill={c.fill} stroke="#4a575c" />
          <text x={604} y={341 + i * 52} fontSize="7" fill="#9fadb2" fontFamily={FONT}>
            {c.t}
          </text>
          <text x={704} y={341 + i * 52} textAnchor="end" fontSize="7" fill={SCREEN_TEXT} fontFamily={FONT} fontWeight="700">
            {c.r}
          </text>
        </g>
      ))}

      {/* ── sound levels / effects / bandwidth ──────────────────── */}
      <DarkPanel x={10} y={320} w={214} h={72} title="Sound Levels" badge={9} />
      {["Scarlett 2i2 USB", "Movie", "Sound Effects"].map((s, i) => (
        <g key={s}>
          <text x={18} y={348 + i * 15} fontSize="7.5" fill={SCREEN_TEXT} fontFamily={FONT}>
            {s}
          </text>
          <rect x={112} y={343 + i * 15} width={22} height={8} rx="2" fill="#4a575c" />
          <text x={123} y={349.5 + i * 15} textAnchor="middle" fontSize="6" fill={SCREEN_TEXT} fontFamily={FONT}>
            MUTE
          </text>
          <rect x={140} y={345 + i * 15} width={74} height={4} rx="2" fill="#4a575c" />
          <circle cx={140 + [66, 60, 20][i]} cy={347 + i * 15} r="4" fill={SCREEN_TEXT} />
        </g>
      ))}

      <DarkPanel x={232} y={320} w={110} h={140} title="Sound Effects" />
      {["Applause", "Bicycle Horn", "DJ Air Horn", "Glockenspiel", "Party Noise", "Triangle", "…music beds"].map(
        (s, i) => (
          <text key={s} x={240} y={348 + i * 15} fontSize="7.5" fill={SCREEN_TEXT} fontFamily={FONT}>
            ▶ {s}
          </text>
        )
      )}

      <DarkPanel x={10} y={400} w={214} h={60} title="Bandwidth Statistics" badge={10} />
      {[
        { c: DANGER, t: "Rolling Required Bandwidth" },
        { c: GOLD, t: "Rolling Average Throughput" },
        { c: "#9fadb2", t: "Momentary Actual / Required" },
      ].map((r, i) => (
        <g key={r.t}>
          <rect x={18} y={422 + i * 13} width={8} height={8} rx="2" fill={r.c} />
          <text x={32} y={429 + i * 13} fontSize="7.5" fill={SCREEN_TEXT} fontFamily={FONT}>
            {r.t}
          </text>
        </g>
      ))}

      {/* ── callout badges ──────────────────────────────────────── */}
      <Badge x={24} y={27} n={1} />
      <Badge x={152} y={27} n={2} />
      <Badge x={421} y={65} n={3} />
      <Badge x={26} y={286} n={4} />
    </Board>
  );
}

/* ------------------------------------------------------------------ */
/* 4 · The Stream Deck (recreation of the booth screenshot)            */
/* ------------------------------------------------------------------ */

const DECK_KEYS: {
  l1: string;
  l2?: string;
  kind: "scene" | "action";
  outline?: "live" | "selected";
}[] = [
  { l1: "OPENING", l2: "LOOP", kind: "scene", outline: "selected" },
  { l1: "SLIDES", l2: "ONLY", kind: "scene" },
  { l1: "SPEAKER", l2: "+ SLIDES", kind: "scene" },
  { l1: "MAIN", l2: "+ SLIDES", kind: "scene" },
  { l1: "WS", l2: "+ SLIDES", kind: "scene", outline: "live" },
  { l1: "MAIN", l2: "ONLY", kind: "scene" },
  { l1: "WS", l2: "ONLY", kind: "scene" },
  { l1: "WS", l2: "w/SLIDES", kind: "scene" },
  { l1: "Preview", l2: "Mode", kind: "action" },
  { l1: "→", l2: "next page", kind: "action" },
  { l1: "TECH DIFF", l2: "audio", kind: "scene" },
  { l1: "TECH DIFF", l2: "MUTE", kind: "scene" },
  { l1: "ENDING", l2: "LOOP", kind: "scene" },
  { l1: "Dashboard", kind: "action" },
  { l1: "Go Live", kind: "action" },
];

function DeckGrid() {
  const KW = 116;
  const KH = 96;
  const GAP = 12;
  const X0 = 22;
  const Y0 = 22;
  return (
    <Board w={700} h={360} label="The 15-key Stream Deck service layout">
      <rect x={8} y={8} width={684} height={330} rx="10" fill={SCREEN} />
      {DECK_KEYS.map((k, i) => {
        const col = i % 5;
        const row = Math.floor(i / 5);
        const x = X0 + col * (KW + GAP);
        const y = Y0 + row * (KH + GAP);
        const stroke =
          k.outline === "live" ? SUCCESS : k.outline === "selected" ? BLUE : "#3a464b";
        const isGoLive = k.l1 === "Go Live";
        return (
          <g key={i}>
            <rect
              x={x}
              y={y}
              width={KW}
              height={KH}
              rx="12"
              fill={isGoLive ? BLUE : k.kind === "action" ? "#141a1c" : "#10161a"}
              stroke={stroke}
              strokeWidth={k.outline ? 3 : 1.5}
            />
            {/* a suggestion of the scene thumbnail behind the label */}
            {k.kind === "scene" && (
              <rect x={x + 10} y={y + 10} width={KW - 20} height={KH - 42} rx="6" fill="#243036" />
            )}
            <text
              x={x + KW / 2}
              y={k.l2 ? y + KH - 24 : y + KH / 2 + 4}
              textAnchor="middle"
              fontSize={k.l1.length > 9 ? 11 : 13}
              fontWeight="700"
              fill={SCREEN_TEXT}
              fontFamily={FONT}
            >
              {k.l1}
            </text>
            {k.l2 && (
              <text
                x={x + KW / 2}
                y={y + KH - 10}
                textAnchor="middle"
                fontSize={11}
                fontWeight="700"
                fill={SCREEN_TEXT}
                fontFamily={FONT}
              >
                {k.l2}
              </text>
            )}
          </g>
        );
      })}
      {/* legend */}
      <g>
        <rect x={22} y={344} width={12} height={10} rx="3" fill="none" stroke={SUCCESS} strokeWidth="3" />
        <Label x={40} y={353} size={10} color={INK}>
          live on the stream
        </Label>
        <rect x={172} y={344} width={12} height={10} rx="3" fill="none" stroke={BLUE} strokeWidth="3" />
        <Label x={190} y={353} size={10} color={INK}>
          selected / staged
        </Label>
        <Label x={330} y={353} size={10} color={MUTED}>
          Confirm the outline colours in the booth — profiles can be restyled.
        </Label>
      </g>
    </Board>
  );
}

/* ------------------------------------------------------------------ */
/* 5 · Scene matrix                                                    */
/* ------------------------------------------------------------------ */

const SCENE_MATRIX: { name: string; main: boolean; ws: boolean; slides: boolean; use: string }[] = [
  { name: "OPENING LOOP", main: false, ws: false, slides: false, use: "Before the service — countdown loop" },
  { name: "SLIDES ONLY", main: false, ws: false, slides: true, use: "Videos, full lyric or scripture slides" },
  { name: "SPEAKER + SLIDES", main: true, ws: false, slides: true, use: "Teaching that leans on the screen" },
  { name: "MAIN + SLIDES", main: true, ws: false, slides: true, use: "The everyday sermon scene" },
  { name: "WS + SLIDES", main: false, ws: true, slides: true, use: "Worship — platform and the words" },
  { name: "WS w/SLIDES", main: false, ws: true, slides: true, use: "Wide shot carrying the slides inside it" },
  { name: "MAIN ONLY", main: true, ws: false, slides: false, use: "Prayer, testimony, blank screens" },
  { name: "WS ONLY", main: false, ws: true, slides: false, use: "Communion, baptism, people moving" },
  { name: "TECH DIFF audio", main: false, ws: false, slides: false, use: "Picture problem — sound still fine to send" },
  { name: "TECH DIFF MUTE", main: false, ws: false, slides: false, use: "Audio problem, or it must not go out" },
  { name: "ENDING LOOP", main: false, ws: false, slides: false, use: "After the service — closing card" },
];

function SceneMatrix() {
  const rowH = 26;
  const top = 44;
  return (
    <Board w={700} h={top + SCENE_MATRIX.length * rowH + 42} label="What each scene puts on the stream">
      <Label x={16} y={24} size={10.5} weight={700} color={TEAL}>
        SCENE
      </Label>
      {["MAIN", "WS", "SLIDES"].map((c, i) => (
        <Label key={c} x={214 + i * 52} y={24} size={10.5} weight={700} color={TEAL} anchor="middle">
          {c}
        </Label>
      ))}
      <Label x={380} y={24} size={10.5} weight={700} color={TEAL}>
        WHEN TO CALL IT
      </Label>
      <line x1={12} y1={32} x2={688} y2={32} stroke={GRID} strokeWidth="1.5" />
      {SCENE_MATRIX.map((r, i) => {
        const y = top + i * rowH;
        const card = !r.main && !r.ws && !r.slides;
        return (
          <g key={r.name}>
            {i % 2 === 1 && <rect x={12} y={y - 17} width={676} height={rowH} fill={SURFACE} />}
            <text x={16} y={y} fontSize="11" fontWeight="700" fill={INK} fontFamily={FONT}>
              {r.name}
            </text>
            {[r.main, r.ws, r.slides].map((on, c) => (
              <g key={c}>
                {on ? (
                  <circle cx={214 + c * 52} cy={y - 4} r="6" fill={TEAL} />
                ) : (
                  <circle cx={214 + c * 52} cy={y - 4} r="6" fill="none" stroke={GRID} strokeWidth="1.5" />
                )}
              </g>
            ))}
            {card && (
              <text x={332} y={y} fontSize="9" fill={GOLD} fontFamily={FONT} fontWeight="700">
                card
              </text>
            )}
            <text x={380} y={y} fontSize="10.5" fill={MUTED} fontFamily={FONT}>
              {r.use}
            </text>
          </g>
        );
      })}
      <Label x={16} y={top + SCENE_MATRIX.length * rowH + 12} size={10} color={MUTED}>
        Filled dot = that source is on screen; “card” = a full-frame holding card, no camera or slides.
      </Label>
      <Label x={16} y={top + SCENE_MATRIX.length * rowH + 28} size={10} color={MUTED}>
        “WS + SLIDES” and “WS w/SLIDES” use the same two sources arranged differently — look at both before a service.
      </Label>
    </Board>
  );
}

/* ------------------------------------------------------------------ */
/* 6 · Camera switcher                                                 */
/* ------------------------------------------------------------------ */

function CameraSwitcher() {
  return (
    <Board w={700} h={250} label="The Camera Switcher and our three video sources">
      <rect x={12} y={12} width={676} height={226} rx="8" fill={SCREEN} />
      <rect x={26} y={26} width={120} height={20} rx="5" fill={SCREEN2} />
      <rect x={152} y={26} width={70} height={20} rx="5" fill="#4a575c" />
      <Label x={86} y={40} anchor="middle" size={10} color={SCREEN_TEXT}>
        All Sources
      </Label>
      <Label x={187} y={40} anchor="middle" size={10} color={SCREEN_TEXT}>
        A/B
      </Label>

      {[
        {
          t: "Camera A",
          d: "Cam Link 4K 2",
          r: "MAIN — the close shot",
          fill: "#5b4a3a",
          note: "healthy: a live picture",
          noteColor: SUCCESS,
        },
        {
          t: "Camera B",
          d: "Cam Link 4K",
          r: "WS — the wide shot",
          fill: "#0d0f10",
          note: "“No Signal” = no HDMI arriving",
          noteColor: DANGER,
        },
        {
          t: "Camera C",
          d: "NATHANS-MAC … Proclaim",
          r: "SLIDES — the screen",
          fill: "#f2efe4",
          note: "another computer, not a camera",
          noteColor: GOLD,
        },
      ].map((c, i) => {
        const x = 26 + i * 220;
        return (
          <g key={c.t}>
            <rect x={x} y={62} width={200} height={92} rx="6" fill={c.fill} stroke="#4a575c" />
            {i === 1 && (
              <Label x={x + 100} y={112} anchor="middle" size={11} color="#8f9a9e" weight={700}>
                No Signal
              </Label>
            )}
            <text x={x} y={172} fontSize="12" fontWeight="700" fill={SCREEN_TEXT} fontFamily={FONT}>
              {c.t}
            </text>
            <text x={x} y={188} fontSize="10" fill="#9fadb2" fontFamily={FONT}>
              {c.d}
            </text>
            <text x={x} y={204} fontSize="10" fill={SCREEN_TEXT} fontFamily={FONT} fontWeight="600">
              {c.r}
            </text>
            <text x={x} y={222} fontSize="9.5" fill={c.noteColor} fontFamily={FONT}>
              {c.note}
            </text>
          </g>
        );
      })}
    </Board>
  );
}

/* ------------------------------------------------------------------ */
/* 7 · "No Signal" drill                                               */
/* ------------------------------------------------------------------ */

function NoSignalFlow() {
  const steps = [
    "Is the camera powered ON? (look at the camera)",
    "Has it gone to sleep on an idle timer?",
    "Is the HDMI seated — at BOTH ends?",
    "Is the Cam Link seated in the Mac’s USB port?",
    "Is the right device still selected in the Switcher?",
  ];
  return (
    <Board w={700} h={330} label="Working the No Signal card, in order">
      <rect x={16} y={16} width={200} height={80} rx="6" fill="#0d0f10" />
      <Label x={116} y={52} anchor="middle" size={12} color="#8f9a9e" weight={700}>
        No Signal
      </Label>
      <Label x={116} y={70} anchor="middle" size={9} color="#6d787c">
        the Cam Link sees no HDMI
      </Label>
      <Label x={232} y={44} size={11} color={INK} weight={700}>
        Ecamm is fine. The capture stick is fine.
      </Label>
      <Label x={232} y={60} size={10.5} color={MUTED}>
        Something upstream stopped sending a picture — work the list top to bottom.
      </Label>
      <Label x={232} y={80} size={10.5} color={GOLD} weight={700}>
        Meanwhile: run the service on the other camera.
      </Label>

      {steps.map((s, i) => {
        const y = 116 + i * 36;
        return (
          <g key={i}>
            <circle cx={32} cy={y + 12} r="11" fill={TEAL} />
            <Label x={32} y={y + 16} anchor="middle" size={11} color="#ffffff" weight={700}>
              {i + 1}
            </Label>
            <rect x={52} y={y} width={430} height={24} rx="6" fill="#ffffff" stroke={GRID} strokeWidth="1.4" />
            <text x={64} y={y + 16} fontSize="11" fill={INK} fontFamily={FONT}>
              {s}
            </text>
            <Arrow x1={490} y1={y + 12} x2={512} y2={y + 12} color={SUCCESS} />
            <text x={520} y={y + 16} fontSize="10" fill={SUCCESS} fontFamily={FONT} fontWeight="600">
              picture back? done
            </text>
            {i < steps.length - 1 && <Arrow x1={32} y1={y + 24} x2={32} y2={y + 34} />}
          </g>
        );
      })}
      <rect x={52} y={296} width={556} height={24} rx="6" fill="#ffffff" stroke={DANGER} strokeWidth="1.6" />
      <text x={64} y={312} fontSize="11" fill={DANGER} fontFamily={FONT} fontWeight="700">
        All five clean? Get the tech lead — and keep streaming on the good camera.
      </text>
    </Board>
  );
}

/* ------------------------------------------------------------------ */
/* 8 · Audio path                                                      */
/* ------------------------------------------------------------------ */

function AudioPath() {
  return (
    <Board w={700} h={230} label="The stream audio path and where to check it">
      <Box x={20} y={62} w={150} h={62} title="SQ-6 console" sub="AUX 1 · outs 11 & 12" color={GOLD} />
      <Label x={95} y={140} anchor="middle" size={9.5} color={MUTED}>
        the sound tech’s mix
      </Label>
      <Arrow x1={170} y1={93} x2={210} y2={93} color={GOLD} />
      <Box x={210} y={62} w={140} h={62} title="Scarlett 2i2" sub="USB audio interface" color={TEAL} />
      <Arrow x1={350} y1={93} x2={390} y2={93} color={TEAL} />

      {/* Ecamm's mixer, with the two checks you make inside it */}
      <rect x={390} y={46} width={190} height={94} rx="8" fill="#ffffff" stroke={TEAL} strokeWidth="1.6" />
      <Label x={485} y={64} anchor="middle" size={12} color={INK} weight={700}>
        Ecamm Sound Levels
      </Label>
      <rect x={402} y={74} width={166} height={24} rx="6" fill={SURFACE} />
      <Badge x={414} y={86} n={1} />
      <Label x={428} y={90} size={10} color={INK}>
        Scarlett mute &amp; fader
      </Label>
      <rect x={402} y={104} width={166} height={24} rx="6" fill={SURFACE} />
      <Badge x={414} y={116} n={2} />
      <Label x={428} y={120} size={10} color={INK}>
        is the meter moving?
      </Label>

      <Arrow x1={580} y1={93} x2={614} y2={93} color={SUCCESS} />
      <Box x={614} y={62} w={70} h={62} title="Stream" sub="YouTube" color={SUCCESS} titleSize={11} />

      <Badge x={228} y={62} n={3} />
      <Badge x={38} y={62} n={4} />

      <Label x={350} y={182} anchor="middle" size={11} color={INK} weight={700}>
        Silent-stream drill — 1 mute &amp; fader → 2 is the meter moving?
      </Label>
      <Label x={350} y={198} anchor="middle" size={11} color={INK} weight={700}>
        → 3 interface connected &amp; selected → 4 hand it to the sound booth
      </Label>
      <Label x={350} y={216} anchor="middle" size={10} color={MUTED}>
        If the room sounds fine the fault is downstream of the main mix — nobody hunts through input channels.
      </Label>
    </Board>
  );
}

/* ------------------------------------------------------------------ */
/* 9 · Service timeline                                                */
/* ------------------------------------------------------------------ */

function ServiceTimeline() {
  const segs = [
    { t: "Before the service", s: "OPENING LOOP", c: MUTED, note: "Go Live a few minutes early — then confirm on a phone" },
    { t: "Welcome & announcements", s: "MAIN + SLIDES", c: TEAL },
    { t: "Worship", s: "WS + SLIDES", c: TEAL2, note: "Hold it. A song is not a reason to cut every eight bars." },
    { t: "Scripture reading / prayer", s: "MAIN ONLY", c: TEAL },
    { t: "Sermon", s: "MAIN + SLIDES", c: TEAL2, note: "SPEAKER + SLIDES when the teaching leans on the screen" },
    { t: "Video", s: "SLIDES ONLY", c: TEAL, note: "Full-frame — never squeezed beside a camera" },
    { t: "Communion / baptism", s: "WS ONLY", c: TEAL2, note: "The room is the story" },
    { t: "Closing song", s: "WS + SLIDES", c: TEAL },
    { t: "After the benediction", s: "ENDING LOOP", c: MUTED, note: "Stop only after the loop has run a minute or two" },
  ];
  const rowH = 30;
  const top = 40;
  const H = top + segs.length * rowH + 34;
  return (
    <Board w={700} h={H} label="A typical service, scene by scene">
      <Label x={24} y={24} size={10.5} weight={700} color={TEAL}>
        SEGMENT
      </Label>
      <Label x={250} y={24} size={10.5} weight={700} color={TEAL}>
        SCENE
      </Label>
      <Label x={400} y={24} size={10.5} weight={700} color={TEAL}>
        NOTE
      </Label>
      <line x1={16} y1={30} x2={684} y2={30} stroke={GRID} strokeWidth="1.5" />
      <line x1={238} y1={top + 4} x2={238} y2={top + segs.length * rowH - 8} stroke={GRID} strokeWidth="2" />
      {segs.map((r, i) => {
        const y = top + i * rowH;
        const first = i === 0;
        const last = i === segs.length - 1;
        return (
          <g key={r.t}>
            {i % 2 === 1 && <rect x={16} y={y - 2} width={668} height={rowH} fill={SURFACE} />}
            <circle
              cx={238}
              cy={y + 13}
              r={first || last ? 7 : 5}
              fill={first ? SUCCESS : last ? DANGER : r.c}
            />
            <text x={228} y={y + 17} textAnchor="end" fontSize="11" fontWeight="700" fill={INK} fontFamily={FONT}>
              {r.t}
            </text>
            <rect x={252} y={y + 2} width={128} height={22} rx="6" fill="#ffffff" stroke={r.c} strokeWidth="1.5" />
            <text x={316} y={y + 17} textAnchor="middle" fontSize="10" fontWeight="700" fill={r.c} fontFamily={FONT}>
              {r.s}
            </text>
            {r.note && (
              <text x={396} y={y + 17} fontSize="10" fill={first || last ? INK : MUTED} fontFamily={FONT} fontWeight={first || last ? 700 : 400}>
                {r.note}
              </text>
            )}
          </g>
        );
      })}
      <Label x={350} y={H - 12} anchor="middle" size={10} color={MUTED}>
        Cut on boundaries — between songs, on the walk to the pulpit, as a video starts. Never mid-sentence.
      </Label>
    </Board>
  );
}

/* ------------------------------------------------------------------ */
/* 10 · The booth tablet — home screen                                 */
/* ------------------------------------------------------------------ */

/** The Mixing Station launcher icon: a dark tile with four little faders. */
function MsIcon({ x, y, s }: { x: number; y: number; s: number }) {
  return (
    <g>
      <rect x={x} y={y} width={s} height={s} rx={s * 0.22} fill="#0d1116" stroke="#39454c" strokeWidth="1" />
      <rect x={x + s * 0.1} y={y + s * 0.12} width={s * 0.8} height={s * 0.17} rx={s * 0.05} fill="#39b6e8" />
      <text
        x={x + s / 2}
        y={y + s * 0.255}
        textAnchor="middle"
        fontSize={s * 0.12}
        fontWeight="700"
        fill="#08121a"
        fontFamily={FONT}
        textLength={s * 0.72}
        lengthAdjust="spacingAndGlyphs"
      >
        Mixing Station
      </text>
      {[0, 1, 2, 3].map((i) => {
        const fx = x + s * (0.16 + i * 0.2);
        return (
          <g key={i}>
            <rect x={fx} y={y + s * 0.36} width={s * 0.11} height={s * 0.5} rx={s * 0.03} fill="#20272c" />
            <rect
              x={fx - s * 0.02}
              y={y + s * (0.44 + (i % 2) * 0.16)}
              width={s * 0.15}
              height={s * 0.07}
              rx={s * 0.02}
              fill="#c9d1d4"
            />
          </g>
        );
      })}
    </g>
  );
}

function TabletHome() {
  return (
    <Board w={700} h={452} label="The sound-control tablet home screen, with the Mixing Station app">
      {/* tablet shell */}
      <rect x={12} y={12} width={676} height={400} rx="20" fill="#181c22" />
      <rect x={24} y={24} width={652} height={376} rx="10" fill="#8f7fd0" />

      {/* wallpaper — soft folds, suggested rather than copied */}
      <path d="M24 320 C 140 210 210 330 300 250 C 390 170 470 300 560 220 C 620 168 660 250 676 226 L676 400 L24 400 Z" fill="#c98bbf" opacity="0.85" />
      <path d="M24 356 C 130 280 230 372 330 306 C 430 240 520 348 620 292 L676 268 L676 400 L24 400 Z" fill="#b8607f" opacity="0.8" />
      <path d="M24 26 C 120 90 190 40 280 96 C 360 146 430 70 520 120 C 590 158 640 110 676 132 L676 26 Z" fill="#8fa9ea" opacity="0.7" />

      {/* status bar */}
      <rect x={24} y={24} width={652} height={26} rx="10" fill="#000000" opacity="0.18" />
      <rect x={24} y={40} width={652} height={10} fill="#000000" opacity="0.18" />
      <Label x={38} y={42} size={11} color="#ffffff" weight={700}>
        11:16 AM
      </Label>
      <Label x={604} y={42} size={10} color="#ffffff" weight={700}>
        ᯤ  58%
      </Label>
      <Badge x={584} y={37} n={1} />

      {/* clock widget */}
      <text x={116} y={130} fontSize="46" fontWeight="300" fill="#ffffff" fontFamily={FONT}>
        11:16
      </text>
      <Label x={118} y={152} size={11} color="#ffffff">
        Sun, Aug 30
      </Label>
      <rect x={112} y={164} width={112} height={24} rx="12" fill="#ffffff" opacity="0.28" />
      <Label x={126} y={180} size={10} color="#ffffff" weight={600}>
        ⛈  Salisbury 77°
      </Label>

      {/* app folder */}
      <rect x={126} y={236} width={44} height={44} rx="10" fill="#ffffff" opacity="0.92" />
      {[0, 1, 2].map((r) =>
        [0, 1, 2].map((c) => (
          <rect
            key={`${r}-${c}`}
            x={133 + c * 11}
            y={243 + r * 11}
            width={8}
            height={8}
            rx="2"
            fill={["#3f78c4", "#3d8b6b", "#d8a23c", "#bf4640"][(r + c) % 4]}
          />
        )),
      )}
      <Label x={148} y={294} size={9.5} color="#ffffff" anchor="middle">
        Google
      </Label>

      {/* Mixing Station on the desktop */}
      <MsIcon x={548} y={88} s={54} />
      <Label x={575} y={158} size={9.5} color="#ffffff" anchor="middle" weight={600}>
        Mixing Station
      </Label>
      <Badge x={542} y={84} n={2} />

      {/* dock */}
      <rect x={244} y={330} width={212} height={54} rx="14" fill="#ffffff" opacity="0.22" />
      <MsIcon x={256} y={340} s={34} />
      <circle cx={324} cy={357} r="17" fill="#ffffff" />
      <text x={324} y={363} textAnchor="middle" fontSize="17" fontWeight="700" fill="#4285f4" fontFamily={FONT}>
        G
      </text>
      <rect x={358} y={340} width={34} height={34} rx="9" fill="#12161c" />
      <path d="M366 358 l8 -8 M372 364 l8 -8" stroke="#c26be0" strokeWidth="3" strokeLinecap="round" />
      <rect x={404} y={340} width={34} height={34} rx="9" fill="#ffffff" />
      {[0, 1].map((r) =>
        [0, 1].map((c) => (
          <rect key={`d${r}${c}`} x={411 + c * 11} y={347 + r * 11} width={8} height={8} rx="2" fill="#1e272b" />
        )),
      )}
      <Badge x={244} y={330} n={3} />

      {/* caption strip under the tablet */}
      <Label x={24} y={432} size={10.5} color={MUTED}>
        Landscape, on its stand in the booth. One tap on Mixing Station and you are on the console.
      </Label>
    </Board>
  );
}

/* ------------------------------------------------------------------ */
/* 11 · Mixing Station — the Streaming custom layout                   */
/* ------------------------------------------------------------------ */

const MS_STRIPS: {
  name: string;
  color: string;
  /** false = the strip has no ON button (a DCA), "mute" = muted */
  state: "on" | "mute" | "none";
  send: string;
  db: string;
  ch: string;
  /** fader position, 0 (bottom) … 1 (top) */
  pos: number;
  /** meter height, 0 … 1 */
  meter: number;
}[] = [
  { name: "Pstr 1", color: "#3d8b6b", state: "on", send: "Stream", db: "+0.6", ch: "Ch 1", pos: 0.62, meter: 0 },
  { name: "Pstr 2", color: "#3d8b6b", state: "on", send: "Stream", db: "-1.7", ch: "Ch 2", pos: 0.56, meter: 0 },
  { name: "Blue", color: "#3f78c4", state: "on", send: "Stream", db: "-2.2", ch: "Ch 3", pos: 0.52, meter: 0.34 },
  { name: "KbrdV", color: "#bf4640", state: "on", send: "Stream", db: "+0.9", ch: "Ch 8", pos: 0.62, meter: 0.12 },
  { name: "Yellow", color: "#bf4640", state: "on", send: "Stream", db: "-4.6", ch: "Ch 4", pos: 0.44, meter: 0.62 },
  { name: "Orange", color: "#bf4640", state: "on", send: "Stream", db: "+3.9", ch: "Ch 5", pos: 0.74, meter: 0.5 },
  { name: "White", color: "#bf4640", state: "on", send: "Stream", db: "-4.6", ch: "Ch 7", pos: 0.44, meter: 0.78 },
  { name: "KbrdLR", color: "#a24f96", state: "on", send: "Stream", db: "-0.9", ch: "Ch 9", pos: 0.58, meter: 0 },
  { name: "SynLR", color: "#a24f96", state: "on", send: "Stream", db: "-0.7", ch: "Ch 11", pos: 0.58, meter: 0 },
  { name: "GPiano", color: "#a24f96", state: "on", send: "Stream", db: "-7.0", ch: "Ch 33", pos: 0.36, meter: 0.4 },
  { name: "Drums", color: "#37a0ad", state: "none", send: "Stream", db: "0.0", ch: "DCA 5", pos: 0.3, meter: 0 },
  { name: "FxRet 1", color: "#3d8b6b", state: "on", send: "Stream", db: "-5.5", ch: "FxRet 1", pos: 0.46, meter: 0.28 },
  { name: "Green", color: "#e8ebec", state: "mute", send: "Main 1", db: "-∞", ch: "Ch 6", pos: 0.16, meter: 0 },
  { name: "CompLR", color: "#e8ebec", state: "on", send: "Stream", db: "+7.6", ch: "Ch 41", pos: 0.86, meter: 0 },
];

const MS_TABS = ["Streaming", "Main Page", "Vocals", "Instr", "FxSnd/Mtx", "Main", "DCA"];
const MS_MIXES: { label: string; color: string }[] = [
  { label: "Stream", color: "#e8ebec" },
  { label: "DrmMix", color: "#37a0ad" },
  { label: "Comms", color: "#e8ebec" },
  { label: "FX Rtn", color: "#3d8b6b" },
  { label: "Mix 5", color: "#3d8b6b" },
  { label: "Mix 6", color: "#3d8b6b" },
  { label: "GPstr", color: "#3d8b6b" },
  { label: "GVcl", color: "#bf4640" },
  { label: "GInstr", color: "#d8a23c" },
];

function MixingStationLayout() {
  const SW = 44; // strip width
  const GAP = 3;
  const X0 = 26; // leaves a gutter down the left for the callout badges
  const TOP = 30;
  const FAD_TOP = 150;
  const FAD_H = 200;
  const W = 760;
  const H = 470;
  const masterX = X0 + MS_STRIPS.length * (SW + GAP) + 18;

  const strip = (
    s: (typeof MS_STRIPS)[number],
    x: number,
  ) => {
    const muted = s.state === "mute";
    const light = s.color === "#e8ebec";
    const faderY = FAD_TOP + FAD_H - 22 - s.pos * (FAD_H - 44);
    return (
      <g key={s.name + s.ch}>
        {/* name button */}
        <rect x={x} y={TOP} width={SW} height={22} rx="3" fill={s.color} stroke={light ? "#9aa2a6" : s.color} />
        <text
          x={x + SW / 2}
          y={TOP + 14.5}
          textAnchor="middle"
          fontSize={s.name.length > 6 ? 7.5 : 8.5}
          fontWeight="700"
          fill={light || s.color === "#d8a23c" ? "#12171a" : "#ffffff"}
          fontFamily={FONT}
        >
          {s.name}
        </text>

        {/* pan */}
        <rect x={x} y={TOP + 25} width={SW} height={20} rx="3" fill="#222b31" />
        <circle cx={x + SW / 2} cy={TOP + 35} r="5" fill="#e9edee" />
        <line x1={x + SW / 2} y1={TOP + 27} x2={x + SW / 2} y2={TOP + 43} stroke="#5b6a72" strokeWidth="1" />

        {/* ON / MUTE */}
        {s.state === "none" ? (
          <rect x={x} y={TOP + 48} width={SW} height={26} rx="3" fill="#141a1e" />
        ) : (
          <>
            <rect
              x={x}
              y={TOP + 48}
              width={SW}
              height={26}
              rx="3"
              fill={muted ? "#d0453c" : "#232c31"}
              stroke={muted ? "#f0837a" : SUCCESS}
              strokeWidth="1.4"
            />
            <text
              x={x + SW / 2}
              y={TOP + 65}
              textAnchor="middle"
              fontSize="8.5"
              fontWeight="700"
              fill={muted ? "#ffffff" : SCREEN_TEXT}
              fontFamily={FONT}
            >
              {muted ? "MUTE" : "ON"}
            </text>
          </>
        )}

        {/* send destination */}
        <rect
          x={x}
          y={TOP + 77}
          width={SW}
          height={20}
          rx="3"
          fill={s.send === "Stream" ? "#f2f4f4" : "#e3b23c"}
        />
        <text x={x + SW / 2} y={TOP + 90.5} textAnchor="middle" fontSize="7" fill="#1a2226" fontFamily={FONT}>
          {`-> ${s.send}`}
        </text>

        {/* send level readout */}
        <text
          x={x + SW / 2}
          y={TOP + 112}
          textAnchor="middle"
          fontSize="8.5"
          fontWeight="700"
          fill={muted ? "#f0837a" : SCREEN_TEXT}
          fontFamily={FONT}
        >
          {s.db}
        </text>

        {/* fader track + cap */}
        <rect x={x + 9} y={FAD_TOP} width={4} height={FAD_H} rx="2" fill="#0c1013" />
        <rect x={x + 2} y={faderY} width={18} height={22} rx="3" fill="#9aa3a8" stroke="#5d666b" />
        <line x1={x + 2} y1={faderY + 11} x2={x + 20} y2={faderY + 11} stroke="#ffffff" strokeWidth="1.6" />

        {/* meter */}
        <rect x={x + 26} y={FAD_TOP} width={9} height={FAD_H} rx="2" fill="#0c1013" />
        {s.meter > 0 && (
          <rect
            x={x + 26}
            y={FAD_TOP + FAD_H - s.meter * FAD_H}
            width={9}
            height={s.meter * FAD_H}
            rx="2"
            fill={s.meter > 0.75 ? "#e3b23c" : "#5fd166"}
          />
        )}

        {/* channel label */}
        <text x={x + SW / 2} y={FAD_TOP + FAD_H + 13} textAnchor="middle" fontSize="7.5" fill="#9fb0b6" fontFamily={FONT}>
          {s.ch}
        </text>
      </g>
    );
  };

  return (
    <Board w={W} h={H} label="The Mixing Station Streaming custom layout on the booth tablet">
      <rect x={0} y={0} width={W} height={H} rx="10" fill="#0a0d10" />

      {/* header */}
      <Label x={16} y={16} size={9} color="#9fb0b6">
        ‹ Custom Layout
      </Label>
      <Label x={124} y={16} size={9} color={SCREEN_TEXT} weight={700}>
        Streaming
      </Label>
      <Badge x={112} y={12} n={1} />

      {MS_STRIPS.map((s, i) => strip(s, X0 + i * (SW + GAP)))}

      {/* master (Stream) strip, separated as it is on the tablet */}
      <line x1={masterX - 10} y1={TOP} x2={masterX - 10} y2={FAD_TOP + FAD_H + 6} stroke="#2a343a" strokeWidth="1.5" />
      {strip(
        { name: "Stream", color: "#e8ebec", state: "mute", send: "Main 1", db: "-1.8", ch: "Mix 1", pos: 0.56, meter: 0.36 },
        masterX,
      )}
      <Badge x={masterX + SW / 2} y={FAD_TOP + FAD_H + 26} n={6} />

      {/* callout badges, in the gutter to the left of the first strip */}
      <Badge x={X0 - 12} y={TOP + 11} n={2} />
      <Badge x={X0 - 12} y={TOP + 61} n={3} />
      <Badge x={X0 - 12} y={TOP + 87} n={4} />

      {/* the muted Green strip gets its own badge */}
      <Badge x={X0 + 12 * (SW + GAP) + SW / 2} y={FAD_TOP + FAD_H + 26} n={5} />

      {/* bottom bar — layout tabs */}
      {MS_TABS.map((t, i) => (
        <g key={t}>
          <rect
            x={14 + i * 60}
            y={H - 46}
            width={56}
            height={32}
            rx="4"
            fill="#1a2228"
            stroke={i === 0 ? SUCCESS : "#2c363c"}
            strokeWidth={i === 0 ? 1.8 : 1}
          />
          <text
            x={42 + i * 60}
            y={H - 26}
            textAnchor="middle"
            fontSize={t.length > 7 ? 7 : 8}
            fill={SCREEN_TEXT}
            fontFamily={FONT}
          >
            {t}
          </text>
        </g>
      ))}
      <Badge x={26} y={H - 58} n={7} />

      {/* bottom bar — fine / mute enable */}
      <rect x={452} y={H - 46} width={44} height={32} rx="4" fill="#1a2228" stroke={SUCCESS} strokeWidth="1.6" />
      <text x={474} y={H - 26} textAnchor="middle" fontSize="8" fill={SCREEN_TEXT} fontFamily={FONT}>
        Fine
      </text>
      <rect x={500} y={H - 46} width={62} height={32} rx="4" fill="#d0453c" />
      <text x={531} y={H - 26} textAnchor="middle" fontSize="7.5" fontWeight="700" fill="#ffffff" fontFamily={FONT}>
        Mute Enable
      </text>
      <Badge x={512} y={H - 58} n={8} />

      {/* bottom bar — mix selects */}
      {MS_MIXES.map((m, i) => (
        <g key={m.label}>
          <rect x={568 + i * 21} y={H - 46} width={18} height={32} rx="3" fill="#1a2228" stroke={m.color} strokeWidth="1.4" />
          <text
            x={577 + i * 21}
            y={H - 30}
            textAnchor="middle"
            dominantBaseline="central"
            fontSize="7"
            fill={SCREEN_TEXT}
            fontFamily={FONT}
            transform={`rotate(-90 ${577 + i * 21} ${H - 30})`}
          >
            {m.label}
          </text>
        </g>
      ))}
      <Badge x={580} y={H - 58} n={9} />
    </Board>
  );
}

/* ------------------------------------------------------------------ */
/* 12 · Monitoring the stream on headphones                            */
/* ------------------------------------------------------------------ */

function MonitorRouting() {
  return (
    <Board w={700} h={280} label="Switching the audio monitor to external headphones">
      <Label x={16} y={22} weight={700} size={11} color={TEAL}>
        MONITORING THE STREAM
      </Label>

      <Box x={20} y={44} w={150} h={54} title="Stream mix" sub="AUX 1 on the SQ-6" color={TEAL} />
      <Arrow x1={170} y1={71} x2={214} y2={71} color={TEAL2} />
      <Box x={214} y={44} w={150} h={54} title="Audio monitor" sub="output selector" color={GOLD} fill="#fdf7ec" />

      {/* the two destinations */}
      <Arrow x1={364} y1={60} x2={430} y2={44} color={SUCCESS} />
      <Arrow x1={364} y1={84} x2={430} y2={110} color={MUTED} dashed />

      <rect x={430} y={22} width={246} height={50} rx="8" fill="#eef7f2" stroke={SUCCESS} strokeWidth="2" />
      <Label x={444} y={42} size={11.5} weight={800} color={INK}>
        🎧 EXTERNAL HEADPHONES
      </Label>
      <Label x={444} y={58} size={9.5} color={MUTED}>
        select this whenever you listen on headphones
      </Label>

      <rect x={430} y={88} width={246} height={50} rx="8" fill="#f4f5f5" stroke={GRID} strokeWidth="1.5" strokeDasharray="4 4" />
      <Label x={444} y={108} size={11.5} weight={700} color={MUTED}>
        🔈 Built-in / booth output
      </Label>
      <Label x={444} y={124} size={9.5} color={MUTED}>
        the default — leave it here when you are not listening
      </Label>

      {/* the rule */}
      <rect x={20} y={166} width={656} height={96} rx="8" fill="#fdf7ec" stroke={GOLD} strokeWidth="1.5" />
      <Label x={36} y={188} size={11} weight={800} color={INK}>
        The rule
      </Label>
      <Label x={36} y={208} size={10.5} color={INK}>
        Plugging headphones in does not move the monitor by itself. Switch the audio monitor to
      </Label>
      <Label x={36} y={225} size={10.5} color={INK}>
        EXTERNAL HEADPHONES before you rely on what you hear — otherwise you are listening to the
      </Label>
      <Label x={36} y={242} size={10.5} color={INK}>
        room, not the stream, and a silent stream sounds perfectly fine. Switch it back when you unplug.
      </Label>
    </Board>
  );
}

/* ------------------------------------------------------------------ */
/* Registry                                                            */
/* ------------------------------------------------------------------ */

export function StreamingVisual({ name }: { name: string }) {
  switch (name) {
    case "stream-signal-map":
      return (
        <Frame
          title="How the rig is connected"
          caption="Two cameras and the slides computer come in as video; the SQ-6's stream mix comes in as audio. Ecamm arranges them into a scene and sends one look out to YouTube and Facebook while recording locally."
        >
          <SignalMap />
        </Frame>
      );
    case "stream-startup":
      return (
        <Frame
          title="Start-up order"
          caption="Sources first, then Ecamm, then check before you commit. Most 'No Signal' panics are really start-up-order mistakes."
        >
          <StartupOrder />
        </Frame>
      );
    case "stream-ecamm-window":
      return (
        <Frame
          title="The Ecamm Live window, as it sits on the booth Mac"
          legend={[
            { n: 1, label: "Scene selector", text: "always names the scene that is live right now — your source of truth." },
            { n: 2, label: "Stream & Record", text: "puts you on air. The Stream Deck's Go Live key does the same job." },
            { n: 3, label: "Tool rail", text: "layouts, overlays, audio, effects, music, comments, guests, settings." },
            { n: 4, label: "Preview Mode", text: "stage the next look and check it before it reaches the stream." },
            { n: 5, label: "Scenes (CrossBridge)", text: "the eleven saved looks. Select them; never rename or delete them." },
            { n: 6, label: "Overlays", text: "titles and picture-in-picture. 'Show in all scenes' follows you everywhere." },
            { n: 7, label: "Camera Effects", text: "settings for ONE source — per scene, until you press Apply To All Scenes." },
            { n: 8, label: "Camera Switcher", text: "your pre-service health check: three tiles, three live pictures." },
            { n: 9, label: "Sound Levels", text: "Scarlett 2i2 (the service), Movie (loops), Sound Effects. Echo cancellation off." },
            { n: 10, label: "Bandwidth Statistics", text: "throughput below required means viewers are seeing stutter." },
          ]}
          caption="A schematic of the booth layout rather than a pixel copy — panel positions on the machine may drift, but the panels and what they control are the same."
        >
          <EcammWindow />
        </Frame>
      );
    case "stream-scene-matrix":
      return (
        <Frame
          title="The eleven scenes — what each one puts on the stream"
          caption="Scene names are built from three words: MAIN (the close camera), WS (the wide shot), and SLIDES (the Proclaim screen)."
        >
          <SceneMatrix />
        </Frame>
      );
    case "stream-deck-grid":
      return (
        <Frame
          title="The Stream Deck service layout"
          caption="Scenes fill the left and middle; the action keys — Preview Mode, page arrow, Dashboard, Go Live — sit on the right. Go Live is bottom-right: press it once, then keep your hand away."
        >
          <DeckGrid />
        </Frame>
      );
    case "stream-camera-switcher":
      return (
        <Frame
          title="The Camera Switcher — our three sources"
          caption="Camera A and B reach the Mac through Elgato Cam Link 4K sticks, which is why Ecamm names them that way. The third source is the slides computer, not a camera."
        >
          <CameraSwitcher />
        </Frame>
      );
    case "stream-no-signal":
      return (
        <Frame
          title="Working the “No Signal” card"
          caption="Most to least likely, top to bottom. Whatever you are checking, keep the service on the working camera while you do it."
        >
          <NoSignalFlow />
        </Frame>
      );
    case "stream-audio-path":
      return (
        <Frame
          title="Where the stream's audio comes from — and where to check it"
          caption="You are confirming that a good mix arrives intact, not remixing it. Check outward from Ecamm: mute, meter, interface, then the console."
        >
          <AudioPath />
        </Frame>
      );
    case "stream-service-timeline":
      return (
        <Frame
          title="A typical Sunday, scene by scene"
          caption="A plan, not a script — the rule underneath it is that the stream should show what a person in the room would be looking at."
        >
          <ServiceTimeline />
        </Frame>
      );
    case "stream-tablet-home":
      return (
        <Frame
          title="The sound-control tablet, as it sits in the booth"
          legend={[
            { n: 1, label: "Status bar", text: "clock, Wi-Fi, battery. The tablet reaches the SQ-6 over the booth network — no Wi-Fi, no control." },
            { n: 2, label: "Mixing Station", text: "the app that drives the console. One tap and you are on the faders." },
            { n: 3, label: "Dock", text: "Mixing Station is pinned here too, so it is one tap from any home screen." },
          ]}
          caption="A schematic of the tablet home screen rather than a pixel copy. If the icon is not where this shows it, look in the dock or the app drawer — it is on the tablet."
        >
          <TabletHome />
        </Frame>
      );
    case "stream-mixing-station":
      return (
        <Frame
          title="Mixing Station — the “Streaming” custom layout"
          legend={[
            { n: 1, label: "Layout name", text: "“Custom Layout / Streaming”. If this does not say Streaming, you are on the wrong page." },
            { n: 2, label: "Channel button", text: "the name and its family colour — the same colour code as the board." },
            { n: 3, label: "ON / MUTE", text: "green outline ON = feeding the stream; red MUTE = silent on this mix." },
            { n: 4, label: "Send destination", text: "“-> Stream” means the fader below sets that channel's level INTO the stream mix." },
            { n: 5, label: "Green, muted", text: "Green sits muted and off the Stream send — see the green-mic rule in the Sound Tech track." },
            { n: 6, label: "Stream master", text: "Mix 1, the whole stream feed. This is the one fader that moves everything at once." },
            { n: 7, label: "Layout tabs", text: "Streaming, Main Page, Vocals, Instr, FxSnd/Mtx, Main, DCA. Stay on Streaming." },
            { n: 8, label: "Fine / Mute Enable", text: "Fine slows fader moves. Mute Enable arms the mute buttons so you cannot fat-finger one." },
            { n: 9, label: "Mix select", text: "which mix the faders are showing — Stream, DrmMix, Comms, FX Rtn, and the groups." },
          ]}
          caption="Levels and mutes in this drawing are the ones captured in the booth — treat them as an example of a working state, not a target to dial in."
        >
          <MixingStationLayout />
        </Frame>
      );
    case "stream-monitor-out":
      return (
        <Frame
          title="Monitoring the stream on headphones"
          caption="Switch the audio monitor to external headphones before you trust what you hear, and switch it back when you unplug."
        >
          <MonitorRouting />
        </Frame>
      );
    default:
      return null;
  }
}

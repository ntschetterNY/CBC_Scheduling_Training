/**
 * LessonVisual — SVG diagrams and charts for visual learners.
 *
 * A lesson section in curriculum.ts can set `visual: "<key>"`; ModuleRunner
 * renders the matching diagram under the lesson body. Everything is inline
 * SVG (no external assets) and uses the CrossBridge brand palette.
 *
 * Keys, grouped by what they teach:
 *   Signal flow  — "system-overview" | "physical-routing" | "slink"
 *                  | "digital-routing" | "outputs-map" | "signal-chain"
 *                  | "two-destinations" | "pre-post-fade" | "no-sound-flow"
 *                  | "patch-matrix"
 *   Surface      — "layers-stack" | "mute-groups" | "group-vs-dca" | "aux-map"
 *                  | "select-focus" | "softkey-map" | "assignments-map"
 *   Workflow     — "startup-sequence" | "service-timeline" | "shutdown-sequence"
 *                  | "scene-recall" | "recall-timing" | "db-targets"
 *                  | "learn-loop" | "recall-vs-store" | "mix-priorities"
 *                  | "stay-present" | "escalate-flow"
 *   Mics / color — "mic-colors" | "mic-tuning" | "color-families"
 *                  | "mic-assignments" | "battery-check" | "blue-mic-order"
 *   Processing   — "eq-vocal" | "eq-bass" | "comp-transfer" | "comp-controls"
 *                  | "comp-limiter" | "buzz-sources" | "feedback-loop"
 */

const GOLD = "#d8a23c";
const TEAL = "#1e5162";
const TEAL2 = "#2c6373";
const DANGER = "#bf4640";
const SUCCESS = "#3d8b6b";
const INK = "#232b2e";
const MUTED = "#5d6b70";
const GRID = "#e2e5e4";
const SURFACE = "#eef0ef";
// channel-family colors (match the input-patch module + BoardExplorer)
const BLUE = "#3f78c4";
const MAGENTA = "#a24f96";
const CYAN = "#37a0ad";
const GOLDF = "#c98a2f";

const FONT = "Helvetica Neue, system-ui, sans-serif";

function Frame({
  title,
  caption,
  children,
}: {
  title: string;
  caption?: string;
  children: React.ReactNode;
}) {
  return (
    <figure className="card overflow-hidden">
      <figcaption className="border-b border-brand-border px-5 py-3">
        <h4 className="text-sm font-semibold text-brand-text">{title}</h4>
      </figcaption>
      <div className="bg-brand-surface/40 p-4">{children}</div>
      {caption && (
        <p className="border-t border-brand-border px-5 py-3 text-xs text-brand-muted">
          {caption}
        </p>
      )}
    </figure>
  );
}

/* ------------------------------------------------------------------ */
/* Shared primitives                                                   */
/* ------------------------------------------------------------------ */

/** An arrow between two points, with a solid triangular head. */
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
  const angle = Math.atan2(y2 - y1, x2 - x1);
  const size = 8;
  const p1x = x2 - size * Math.cos(angle - Math.PI / 6);
  const p1y = y2 - size * Math.sin(angle - Math.PI / 6);
  const p2x = x2 - size * Math.cos(angle + Math.PI / 6);
  const p2y = y2 - size * Math.sin(angle + Math.PI / 6);
  const bx = x2 - size * 0.85 * Math.cos(angle);
  const by = y2 - size * 0.85 * Math.sin(angle);
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
        strokeDasharray={dashed ? "5 4" : undefined}
      />
      <polygon points={`${x2},${y2} ${p1x},${p1y} ${p2x},${p2y}`} fill={color} />
    </g>
  );
}

/** A labelled rounded box node. */
function Node({
  x,
  y,
  w,
  h,
  title,
  sub,
  emoji,
  color = TEAL,
  fill = "#ffffff",
  emphasis = false,
  titleColor = INK,
}: {
  x: number;
  y: number;
  w: number;
  h: number;
  title: string;
  sub?: string;
  emoji?: string;
  color?: string;
  fill?: string;
  emphasis?: boolean;
  titleColor?: string;
}) {
  const cx = x + w / 2;
  const hasEmoji = Boolean(emoji);
  // Vertically center the emoji/title/sub stack inside the box so text never
  // spills past the border regardless of the box height.
  const stackH = (hasEmoji ? 20 : 0) + 14 + (sub ? 13 : 0);
  let cursor = y + (h - stackH) / 2;
  const emojiY = cursor + 15;
  if (hasEmoji) cursor += 20;
  const titleY = cursor + 11;
  cursor += 14;
  const subY = cursor + 10;
  return (
    <g>
      <rect
        x={x}
        y={y}
        width={w}
        height={h}
        rx="11"
        fill={fill}
        stroke={color}
        strokeWidth={emphasis ? 2.5 : 1.5}
      />
      {hasEmoji && (
        <text x={cx} y={emojiY} textAnchor="middle" fontSize="19">
          {emoji}
        </text>
      )}
      <text
        x={cx}
        y={titleY}
        textAnchor="middle"
        fontSize="13"
        fontWeight="700"
        fill={titleColor}
        fontFamily={FONT}
      >
        {title}
      </text>
      {sub && (
        <text
          x={cx}
          y={subY}
          textAnchor="middle"
          fontSize="10.5"
          fill={MUTED}
          fontFamily={FONT}
        >
          {sub}
        </text>
      )}
    </g>
  );
}

/* ------------------------------------------------------------------ */
/* EQ frequency-response chart                                         */
/* ------------------------------------------------------------------ */

type Band = { f: number; gain: number; q?: number };

const F_MIN = 20;
const F_MAX = 20000;

function logPos(f: number) {
  return (
    (Math.log10(f) - Math.log10(F_MIN)) /
    (Math.log10(F_MAX) - Math.log10(F_MIN))
  );
}

/** dB contribution of a peaking band at frequency f (visual approximation). */
function bandDb(f: number, b: Band) {
  const width = 1 / (b.q ?? 1); // octaves-ish
  const octaves = Math.log2(f / b.f);
  return b.gain * Math.exp(-(octaves * octaves) / (2 * width * width));
}

function EqChart({
  bands,
  hpf,
  color,
  label,
  annotations,
}: {
  bands: Band[];
  hpf?: number; // high-pass corner frequency
  color: string;
  label: string;
  annotations: { f: number; db: number; text: string }[];
}) {
  const W = 680;
  const H = 300;
  const padL = 44;
  const padR = 20;
  const padT = 18;
  const padB = 40;
  const plotW = W - padL - padR;
  const plotH = H - padT - padB;

  const DB_MAX = 12;
  const DB_MIN = -18;

  const x = (f: number) => padL + logPos(f) * plotW;
  const y = (db: number) =>
    padT + ((DB_MAX - db) / (DB_MAX - DB_MIN)) * plotH;

  // sample the composite curve
  const N = 140;
  const pts: [number, number][] = [];
  for (let i = 0; i <= N; i++) {
    const f = Math.pow(10, Math.log10(F_MIN) + (i / N) * (Math.log10(F_MAX) - Math.log10(F_MIN)));
    let db = bands.reduce((acc, b) => acc + bandDb(f, b), 0);
    if (hpf && f < hpf) {
      db += -12 * Math.log2(hpf / f); // 12 dB/oct rolloff
    }
    db = Math.max(DB_MIN + 0.5, Math.min(DB_MAX - 0.5, db));
    pts.push([x(f), y(db)]);
  }
  const line = pts.map((p, i) => `${i === 0 ? "M" : "L"}${p[0].toFixed(1)} ${p[1].toFixed(1)}`).join(" ");
  const area = `${line} L${x(F_MAX).toFixed(1)} ${y(0).toFixed(1)} L${x(F_MIN).toFixed(1)} ${y(0).toFixed(1)} Z`;

  const gridFreqs = [
    { f: 50, label: "50" },
    { f: 100, label: "100" },
    { f: 500, label: "500" },
    { f: 1000, label: "1k" },
    { f: 5000, label: "5k" },
    { f: 10000, label: "10k" },
  ];
  const dbLines = [12, 6, 0, -6, -12];

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="h-auto w-full" role="img" aria-label={label}>
      {/* db gridlines */}
      {dbLines.map((db) => (
        <g key={db}>
          <line
            x1={padL}
            x2={W - padR}
            y1={y(db)}
            y2={y(db)}
            stroke={db === 0 ? MUTED : GRID}
            strokeWidth={db === 0 ? 1.5 : 1}
            strokeDasharray={db === 0 ? "none" : "3 4"}
          />
          <text x={padL - 8} y={y(db) + 4} textAnchor="end" fontSize="11" fill={MUTED} fontFamily={FONT}>
            {db > 0 ? `+${db}` : db}
          </text>
        </g>
      ))}
      {/* freq gridlines */}
      {gridFreqs.map((g) => (
        <g key={g.f}>
          <line x1={x(g.f)} x2={x(g.f)} y1={padT} y2={padT + plotH} stroke={GRID} strokeWidth="1" strokeDasharray="3 4" />
          <text x={x(g.f)} y={H - padB + 18} textAnchor="middle" fontSize="11" fill={MUTED} fontFamily={FONT}>
            {g.label}
          </text>
        </g>
      ))}
      <text x={W - padR} y={H - padB + 18} textAnchor="end" fontSize="10" fill={MUTED} fontFamily={FONT}>
        Hz
      </text>

      {/* filled curve */}
      <path d={area} fill={color} opacity="0.12" />
      <path d={line} fill="none" stroke={color} strokeWidth="3" strokeLinejoin="round" strokeLinecap="round" />

      {/* annotations */}
      {annotations.map((a, i) => {
        const ax = x(a.f);
        const ay = y(a.db);
        const up = a.db >= 0;
        return (
          <g key={i}>
            <circle cx={ax} cy={ay} r="4" fill={color} stroke="#fff" strokeWidth="1.5" />
            <text
              x={ax}
              y={up ? ay - 10 : ay + 18}
              textAnchor={ax > W - 120 ? "end" : ax < 120 ? "start" : "middle"}
              fontSize="11"
              fontWeight="600"
              fill={INK}
              fontFamily={FONT}
            >
              {a.text}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/* Signal chain (processing order on one channel)                      */
/* ------------------------------------------------------------------ */

function SignalChain() {
  const stages = [
    { icon: "🎤", label: "Mic", note: "check position", hot: true },
    { icon: "⤵︎", label: "HPF", note: "cut rumble" },
    { icon: "🎚️", label: "EQ", note: "shape tone" },
    { icon: "📉", label: "Comp", note: "even level" },
    { icon: "▮", label: "Fader", note: "set level" },
    { icon: "🔊", label: "House", note: "the room" },
  ];
  const W = 700;
  const H = 150;
  const n = stages.length;
  const gap = 8;
  const boxW = (W - gap * (n - 1)) / n;
  const boxH = 88;
  const top = 30;

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="h-auto w-full" role="img" aria-label="Signal chain: mic to house">
      {stages.map((s, i) => {
        const bx = i * (boxW + gap);
        return (
          <g key={i}>
            {i > 0 && (
              <Arrow x1={bx - gap - 2} y1={top + boxH / 2} x2={bx - 1} y2={top + boxH / 2} color={MUTED} />
            )}
            <rect
              x={bx}
              y={top}
              width={boxW}
              height={boxH}
              rx="12"
              fill={s.hot ? "rgba(216,162,60,0.14)" : "#fff"}
              stroke={s.hot ? GOLD : GRID}
              strokeWidth={s.hot ? 2.5 : 1.5}
            />
            <text x={bx + boxW / 2} y={top + 30} textAnchor="middle" fontSize="20">
              {s.icon}
            </text>
            <text x={bx + boxW / 2} y={top + 54} textAnchor="middle" fontSize="13" fontWeight="700" fill={INK} fontFamily={FONT}>
              {s.label}
            </text>
            <text x={bx + boxW / 2} y={top + 72} textAnchor="middle" fontSize="10" fill={MUTED} fontFamily={FONT}>
              {s.note}
            </text>
          </g>
        );
      })}
      <text x={W / 2} y={16} textAnchor="middle" fontSize="12" fontWeight="700" fill={GOLD} fontFamily={FONT}>
        Start here — a good, close capture fixes more than any knob downstream
      </text>
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/* System overview — the whole CBC audio system at a glance            */
/* ------------------------------------------------------------------ */

function SystemOverview() {
  const W = 720;
  const H = 300;
  const inputs = [
    { emoji: "🎤", t: "Wireless mics", s: "Local inputs" },
    { emoji: "🎸", t: "Stage box AR2412", s: "over 1 SLink cable" },
    { emoji: "💻", t: "Computer", s: "playback / audio" },
  ];
  const outputs = [
    { emoji: "🔊", t: "House L/R", s: "the congregation", color: SUCCESS },
    { emoji: "🏛️", t: "Hallway", s: "lobby feed", color: TEAL2 },
    { emoji: "📡", t: "Live stream", s: "YouTube / FB", color: BLUE },
    { emoji: "🎧", t: "ME-500 in-ears", s: "musicians", color: GOLDF },
  ];
  const cx = W / 2;
  const consoleBox = { x: cx - 70, y: 116, w: 140, h: 70 };
  const inY = (i: number) => 40 + i * 80;
  const outY = (i: number) => 20 + i * 68;

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="h-auto w-full" role="img" aria-label="CrossBridge audio system overview">
      {/* input nodes + arrows in */}
      {inputs.map((n, i) => (
        <g key={n.t}>
          <Node x={18} y={inY(i)} w={168} h={58} title={n.t} sub={n.s} emoji={n.emoji} color={TEAL2} />
          <Arrow x1={190} y1={inY(i) + 29} x2={consoleBox.x - 4} y2={consoleBox.y + 35} color={MUTED} />
        </g>
      ))}
      {/* console */}
      <rect x={consoleBox.x} y={consoleBox.y} width={consoleBox.w} height={consoleBox.h} rx="12" fill="rgba(216,162,60,0.14)" stroke={GOLD} strokeWidth="2.5" />
      <text x={cx} y={consoleBox.y + 30} textAnchor="middle" fontSize="15" fontWeight="800" fill={INK} fontFamily={FONT}>
        SQ-6 Console
      </text>
      <text x={cx} y={consoleBox.y + 50} textAnchor="middle" fontSize="10.5" fill={MUTED} fontFamily={FONT}>
        one source → many mixes
      </text>
      {/* output nodes + arrows out */}
      {outputs.map((n, i) => (
        <g key={n.t}>
          <Arrow x1={consoleBox.x + consoleBox.w + 4} y1={consoleBox.y + 35} x2={W - 190} y2={outY(i) + 28} color={n.color} />
          <Node x={W - 186} y={outY(i)} w={170} h={56} title={n.t} sub={n.s} emoji={n.emoji} color={n.color} />
        </g>
      ))}
      <text x={18} y={20} fontSize="11" fontWeight="700" fill={MUTED} fontFamily={FONT}>
        INPUTS
      </text>
      <text x={W - 18} y={20} textAnchor="end" fontSize="11" fontWeight="700" fill={MUTED} fontFamily={FONT}>
        OUTPUTS
      </text>
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/* Physical routing — stage to console                                 */
/* ------------------------------------------------------------------ */

function PhysicalRouting() {
  const W = 700;
  const H = 170;
  const y = 54;
  const h = 78;
  const boxes = [
    { emoji: "🎙️", t: "Source", s: "sing / play", w: 96 },
    { emoji: "🔌", t: "Mic / DI", s: "on stage", w: 96 },
    { emoji: "🎛️", t: "AR2412", s: "stage box", w: 110, hot: true },
    { emoji: "🧵", t: "SLink", s: "one cable", w: 96, hot: true },
    { emoji: "🖥️", t: "SQ-6", s: "console", w: 110 },
  ];
  let x = 8;
  const positions = boxes.map((b) => {
    const px = x;
    x += b.w + 30;
    return px;
  });
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="h-auto w-full" role="img" aria-label="Physical routing from stage to console">
      {boxes.map((b, i) => (
        <g key={b.t}>
          {i > 0 && (
            <Arrow x1={positions[i] - 28} y1={y + h / 2} x2={positions[i] - 4} y2={y + h / 2} color={MUTED} />
          )}
          <Node
            x={positions[i]}
            y={y}
            w={b.w}
            h={h}
            title={b.t}
            sub={b.s}
            emoji={b.emoji}
            color={b.hot ? GOLD : TEAL2}
            fill={b.hot ? "rgba(216,162,60,0.12)" : "#fff"}
            emphasis={b.hot}
          />
        </g>
      ))}
      <text x={W / 2} y={22} textAnchor="middle" fontSize="12" fontWeight="700" fill={INK} fontFamily={FONT}>
        Most stage inputs reach the board through the stage box over one SLink cable
      </text>
      <text x={positions[2] + 55} y={150} textAnchor="middle" fontSize="10.5" fill={DANGER} fontFamily={FONT}>
        whole stage box dead? suspect SLink before any one channel
      </text>
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/* SLink — one cable carries the whole stage box                       */
/* ------------------------------------------------------------------ */

function SLinkDetail() {
  const W = 700;
  const H = 236;
  const cy = 128;
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="h-auto w-full" role="img" aria-label="How SLink carries the whole stage box over one cable">
      <text x={W / 2} y={20} textAnchor="middle" fontSize="12" fontWeight="700" fill={INK} fontFamily={FONT}>
        One shielded cable does the work of dozens of mic lines
      </text>

      {/* many stage sources converge into the stage box */}
      {["Drums", "Gtrs", "Keys", "Vox"].map((t, i) => {
        const x = 526 + i * 38;
        return (
          <g key={t}>
            <rect x={x} y={48} width={34} height={20} rx="5" fill="#fff" stroke={GRID} strokeWidth="1" />
            <text x={x + 17} y={62} textAnchor="middle" fontSize="8.5" fontWeight="700" fill={MUTED} fontFamily={FONT}>{t}</text>
            <Arrow x1={x + 17} y1={68} x2={x + 17} y2={cy - 36} color={MUTED} width={1} />
          </g>
        );
      })}

      {/* console (booth) + stage box */}
      <Node x={30} y={cy - 34} w={150} h={68} title="SQ-6" sub="in the booth" emoji="🖥️" color={TEAL} emphasis />
      <Node x={520} y={cy - 34} w={150} h={68} title="AR2412" sub="24 in · 12 out · on stage" emoji="🎛️" color={GOLDF} emphasis />

      {/* the single cable */}
      <line x1={180} y1={cy} x2={520} y2={cy} stroke="#2f4a54" strokeWidth="9" strokeLinecap="round" />
      <rect x={306} y={cy - 12} width={88} height={24} rx="12" fill="#fff" stroke={MUTED} strokeWidth="1" />
      <text x={350} y={cy + 5} textAnchor="middle" fontSize="10.5" fontWeight="800" fill={INK} fontFamily={FONT}>1 SLink cable</text>

      {/* inputs up */}
      <Arrow x1={512} y1={cy - 22} x2={188} y2={cy - 22} color={TEAL} width={2} />
      <text x={350} y={cy - 30} textAnchor="middle" fontSize="10" fill={TEAL} fontFamily={FONT}>stage inputs travel up to the console</text>

      {/* mixes down */}
      <Arrow x1={188} y1={cy + 22} x2={512} y2={cy + 22} color={GOLDF} width={2} dashed />
      <text x={350} y={cy + 38} textAnchor="middle" fontSize="10" fill={GOLDF} fontFamily={FONT}>monitor mixes travel back down to the stage</text>

      <text x={W / 2} y={H - 8} textAnchor="middle" fontSize="10.5" fill={DANGER} fontFamily={FONT}>
        Lose that one cable and the whole stage box drops at once — the sign it&apos;s SLink, not one channel
      </text>
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/* Digital routing — inside the console                                */
/* ------------------------------------------------------------------ */

function DigitalRouting() {
  const W = 720;
  const H = 250;
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="h-auto w-full" role="img" aria-label="Digital routing inside the console">
      {/* main audio path */}
      <Node x={20} y={96} w={120} h={64} title="Input" sub="one channel" emoji="🎚️" color={TEAL} emphasis />
      <Node x={250} y={96} w={150} h={64} title="Group" sub="adds processing" color={TEAL2} />
      <Node x={510} y={96} w={150} h={64} title="Main L/R" sub="→ house" emoji="🔊" color={SUCCESS} emphasis />
      <Arrow x1={140} y1={128} x2={248} y2={128} color={INK} width={2.5} />
      <Arrow x1={400} y1={128} x2={508} y2={128} color={INK} width={2.5} />
      <text x={195} y={120} textAnchor="middle" fontSize="10" fill={MUTED} fontFamily={FONT}>audio</text>

      {/* AUX branch (up) */}
      <Arrow x1={80} y1={96} x2={80} y2={54} color={GOLDF} />
      <Node x={20} y={16} w={190} h={36} title="AUX sends → monitors / stream" color={GOLDF} />

      {/* DCA control (dashed, no audio) */}
      <Node x={250} y={196} w={150} h={40} title="DCA — level + mute" color={GOLD} />
      <Arrow x1={325} y1={196} x2={200} y2={162} color={GOLD} dashed />
      <Arrow x1={325} y1={196} x2={325} y2={162} color={GOLD} dashed />
      <text x={430} y={222} fontSize="10.5" fill={MUTED} fontFamily={FONT}>
        rides faders/mutes — no audio flows here
      </text>

      <text x={W / 2} y={H - 6} textAnchor="middle" fontSize="11" fontWeight="700" fill={INK} fontFamily={FONT}>
        Board → Input → Group → L/R · a DCA just remote-controls level &amp; mute
      </text>
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/* Outputs map — where every mix goes                                  */
/* ------------------------------------------------------------------ */

function OutputsMap() {
  const W = 720;
  const H = 300;
  const outs = [
    { t: "Main L/R", s: "AR2412 out 1 & 2", d: "House speakers", color: SUCCESS, emoji: "🔊" },
    { t: "Streaming", s: "Local out 11 & 12", d: "Live stream", color: BLUE, emoji: "📡" },
    { t: "Hallway", s: "Local out 13 & 14", d: "Lobby (copy of L/R)", color: TEAL2, emoji: "🏛️" },
    { t: "Monitors", s: "AUX sends", d: "ME-500 in-ears", color: GOLDF, emoji: "🎧" },
  ];
  const cx = 150;
  const yOf = (i: number) => 16 + i * 70;
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="h-auto w-full" role="img" aria-label="Outputs map">
      <rect x={40} y={116} width={120} height={70} rx="12" fill="rgba(216,162,60,0.14)" stroke={GOLD} strokeWidth="2.5" />
      <text x={cx - 50} y={146} textAnchor="middle" fontSize="14" fontWeight="800" fill={INK} fontFamily={FONT}>SQ-6</text>
      <text x={cx - 50} y={164} textAnchor="middle" fontSize="10" fill={MUTED} fontFamily={FONT}>mix bus</text>
      {outs.map((o, i) => (
        <g key={o.t}>
          <Arrow x1={162} y1={150} x2={300} y2={yOf(i) + 29} color={o.color} />
          <Node x={304} y={yOf(i)} w={200} h={58} title={o.t} sub={o.s} emoji={o.emoji} color={o.color} />
          <Arrow x1={508} y1={yOf(i) + 29} x2={556} y2={yOf(i) + 29} color={MUTED} />
          <text x={562} y={yOf(i) + 33} fontSize="11" fontWeight="600" fill={INK} fontFamily={FONT}>{o.d}</text>
        </g>
      ))}
      <text x={cx - 50} y={210} textAnchor="middle" fontSize="10.5" fill={MUTED} fontFamily={FONT}>
        many mixes,
      </text>
      <text x={cx - 50} y={224} textAnchor="middle" fontSize="10.5" fill={MUTED} fontFamily={FONT}>
        same sources
      </text>
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/* One channel, two destinations                                       */
/* ------------------------------------------------------------------ */

function TwoDestinations() {
  const W = 700;
  const H = 240;
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="h-auto w-full" role="img" aria-label="One vocal channel feeds two destinations">
      <Node x={40} y={92} w={150} h={60} title="Yellow mic" sub="one channel" emoji="🎤" color={DANGER} emphasis />
      {/* to house */}
      <Arrow x1={190} y1={110} x2={330} y2={56} color={SUCCESS} width={2.5} />
      <Node x={334} y={30} w={160} h={52} title="Vocal Group → L/R" sub="congregation" emoji="🔊" color={SUCCESS} />
      <Node x={520} y={30} w={150} h={52} title="You mix this" sub="house fader" color={SUCCESS} fill="rgba(61,139,107,0.08)" />
      <Arrow x1={494} y1={56} x2={518} y2={56} color={MUTED} />
      {/* to stage */}
      <Arrow x1={190} y1={134} x2={330} y2={186} color={GOLDF} width={2.5} />
      <Node x={334} y={160} w={160} h={52} title="ME-500 network" sub="in-ears on stage" emoji="🎧" color={GOLDF} />
      <Node x={520} y={160} w={150} h={52} title="Singer mixes this" sub="own level" color={GOLDF} fill="rgba(201,138,47,0.08)" />
      <Arrow x1={494} y1={186} x2={518} y2={186} color={MUTED} />
      <text x={W / 2} y={16} textAnchor="middle" fontSize="12" fontWeight="700" fill={INK} fontFamily={FONT}>
        The two levels are independent — house and in-ears never fight each other
      </text>
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/* Pre-fade vs post-fade sends                                         */
/* ------------------------------------------------------------------ */

function PrePostFade() {
  const W = 700;
  const H = 230;
  const pathY = 150;
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="h-auto w-full" role="img" aria-label="Pre-fade versus post-fade sends">
      {/* channel path */}
      <Node x={20} y={pathY - 26} w={110} h={52} title="Channel" emoji="🎚️" color={TEAL} />
      <Arrow x1={130} y1={pathY} x2={300} y2={pathY} color={INK} width={2.5} />
      {/* fader in the middle */}
      <rect x={300} y={pathY - 30} width={70} height={60} rx="8" fill="#fff" stroke={TEAL} strokeWidth="1.5" />
      <text x={335} y={pathY - 4} textAnchor="middle" fontSize="12" fontWeight="700" fill={INK} fontFamily={FONT}>Fader</text>
      <text x={335} y={pathY + 12} textAnchor="middle" fontSize="9" fill={MUTED} fontFamily={FONT}>house level</text>
      <Arrow x1={370} y1={pathY} x2={560} y2={pathY} color={INK} width={2.5} />
      <Node x={560} y={pathY - 26} w={120} h={52} title="Main L/R" emoji="🔊" color={SUCCESS} />

      {/* pre-fade tap (before fader) */}
      <Arrow x1={250} y1={pathY} x2={250} y2={66} color={GOLDF} width={2.5} />
      <Node x={168} y={26} w={170} h={40} title="Monitor send (PRE)" sub="stable — ignores the fader" color={GOLDF} />

      {/* post-fade tap (after fader) */}
      <Arrow x1={470} y1={pathY} x2={470} y2={66} color={TEAL2} width={2.5} dashed />
      <Node x={400} y={26} w={170} h={40} title="FX send (POST)" sub="follows the fader" color={TEAL2} />

      <text x={W / 2} y={H - 8} textAnchor="middle" fontSize="11.5" fontWeight="700" fill={INK} fontFamily={FONT}>
        Monitors = pre-fade (steady in-ears) · Effects = post-fade (wet follows the vocal)
      </text>
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/* Layers as stacked pages                                             */
/* ------------------------------------------------------------------ */

function LayersStack() {
  const W = 640;
  const H = 292;
  const layers = [
    { k: "D", t: "Vocal inputs", color: DANGER },
    { k: "C", t: "AUX (monitor) sends", color: GOLDF },
    { k: "B", t: "DCAs · Groups · FX", color: TEAL2 },
    { k: "A", t: "All inputs", color: TEAL },
  ];
  const cardH = 138;
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="h-auto w-full" role="img" aria-label="Fader layers as stacked pages">
      {layers.map((l, i) => {
        const x = 56 + i * 34;
        const y = 26 + i * 26;
        const top = i === layers.length - 1;
        return (
          <g key={l.k}>
            <rect x={x} y={y} width={360} height={cardH} rx="12" fill={top ? "#fff" : SURFACE} stroke={l.color} strokeWidth={top ? 2.5 : 1.5} />
            <rect x={x} y={y} width={40} height={cardH} rx="12" fill={l.color} opacity={top ? 1 : 0.55} />
            <text x={x + 20} y={y + 76} textAnchor="middle" fontSize="20" fontWeight="800" fill="#fff" fontFamily={FONT}>{l.k}</text>
            {/* back cards only expose a 26px top strip — keep their label on one line inside it */}
            {top ? (
              <>
                <text x={x + 58} y={y + 28} fontSize="12.5" fontWeight="700" fill={INK} fontFamily={FONT}>Layer {l.k}</text>
                <text x={x + 58} y={y + 46} fontSize="11" fill={MUTED} fontFamily={FONT}>{l.t}</text>
              </>
            ) : (
              <text x={x + 58} y={y + 18} fontSize="12" fontWeight="700" fill={INK} fontFamily={FONT}>
                Layer {l.k}
                <tspan fontWeight="400" fill={MUTED}> — {l.t}</tspan>
              </text>
            )}
            {top &&
              Array.from({ length: 8 }).map((_, k) => (
                <g key={k}>
                  <line x1={x + 62 + k * 36} y1={y + 70} x2={x + 62 + k * 36} y2={y + 120} stroke={GRID} strokeWidth="2" />
                  <rect x={x + 57 + k * 36} y={y + 84 + ((k * 13) % 30)} width="10" height="16" rx="2" fill={l.color} />
                </g>
              ))}
          </g>
        );
      })}
      <text x={W - 8} y={H - 8} textAnchor="end" fontSize="11" fontWeight="700" fill={INK} fontFamily={FONT}>
        Same faders — press a Layer key to change the page
      </text>
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/* Mute groups: live vs muted                                          */
/* ------------------------------------------------------------------ */

function MuteGroups() {
  const W = 700;
  const H = 200;
  const groups = [
    { t: "Vocals", live: true },
    { t: "Instruments", live: true },
    { t: "Drums", live: false },
    { t: "Keys", live: false },
  ];
  const bw = 150;
  const gap = 20;
  const startX = (W - (groups.length * bw + (groups.length - 1) * gap)) / 2;
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="h-auto w-full" role="img" aria-label="Mute groups live versus muted">
      {groups.map((g, i) => {
        const x = startX + i * (bw + gap);
        const color = g.live ? SUCCESS : DANGER;
        return (
          <g key={g.t}>
            {/* channels feeding the group */}
            {Array.from({ length: 4 }).map((_, k) => (
              <rect key={k} x={x + 18 + k * 30} y={40} width={18} height={22} rx="3" fill={color} opacity="0.35" />
            ))}
            <Arrow x1={x + bw / 2} y1={66} x2={x + bw / 2} y2={90} color={MUTED} />
            <rect x={x} y={92} width={bw} height={62} rx="12" fill={g.live ? "rgba(61,139,107,0.10)" : "rgba(191,70,64,0.12)"} stroke={color} strokeWidth="2.5" />
            <text x={x + bw / 2} y={120} textAnchor="middle" fontSize="14" fontWeight="800" fill={INK} fontFamily={FONT}>{g.t}</text>
            <text x={x + bw / 2} y={140} textAnchor="middle" fontSize="11" fontWeight="700" fill={color} fontFamily={FONT}>
              {g.live ? "LIVE" : "● MUTED"}
            </text>
          </g>
        );
      })}
      <text x={W / 2} y={20} textAnchor="middle" fontSize="12" fontWeight="700" fill={INK} fontFamily={FONT}>
        One key mutes a whole family — RED means muted
      </text>
      <text x={W / 2} y={H - 8} textAnchor="middle" fontSize="10.5" fill={MUTED} fontFamily={FONT}>
        Unmute groups as the band comes in; keep the rest muted to stay clean
      </text>
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/* Group vs DCA                                                        */
/* ------------------------------------------------------------------ */

function GroupVsDca() {
  const W = 720;
  const H = 280;
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="h-auto w-full" role="img" aria-label="Group versus DCA">
      {/* divider */}
      <line x1={W / 2} y1={20} x2={W / 2} y2={H - 20} stroke={GRID} strokeWidth="1.5" strokeDasharray="4 5" />

      {/* GROUP side */}
      <text x={175} y={26} textAnchor="middle" fontSize="13" fontWeight="800" fill={TEAL} fontFamily={FONT}>GROUP — audio bus</text>
      {[0, 1, 2].map((i) => (
        <g key={i}>
          <rect x={40 + i * 36} y={44} width={26} height={34} rx="4" fill={TEAL2} opacity="0.5" />
          <Arrow x1={53 + i * 36} y1={78} x2={175} y2={104} color={INK} />
        </g>
      ))}
      <Node x={110} y={104} w={130} h={40} title="Sum + process" sub="EQ / comp" color={TEAL} emphasis />
      <Arrow x1={175} y1={144} x2={175} y2={176} color={INK} width={2.5} />
      <Node x={110} y={176} w={130} h={40} title="Main L/R" emoji="🔊" color={SUCCESS} />
      <text x={175} y={244} textAnchor="middle" fontSize="10.5" fill={MUTED} fontFamily={FONT}>audio really flows through it →</text>
      <text x={175} y={260} textAnchor="middle" fontSize="10.5" fill={MUTED} fontFamily={FONT}>so it can add processing</text>

      {/* DCA side */}
      <text x={545} y={26} textAnchor="middle" fontSize="13" fontWeight="800" fill={GOLD} fontFamily={FONT}>DCA — remote master</text>
      <Node x={480} y={44} w={130} h={40} title="DCA fader" sub="level + mute" color={GOLD} emphasis />
      {[0, 1, 2].map((i) => (
        <g key={i}>
          <Arrow x1={545} y1={84} x2={462 + i * 60} y2={150} color={GOLD} dashed />
          <line x1={462 + i * 60} y1={150} x2={462 + i * 60} y2={210} stroke={GRID} strokeWidth="2" />
          <rect x={457 + i * 60} y={168} width={10} height={18} rx="2" fill={GOLDF} />
          <text x={462 + i * 60} y={226} textAnchor="middle" fontSize="9" fill={MUTED} fontFamily={FONT}>ch {i + 1}</text>
        </g>
      ))}
      <text x={545} y={252} textAnchor="middle" fontSize="10.5" fill={MUTED} fontFamily={FONT}>dashed = control only,</text>
      <text x={545} y={268} textAnchor="middle" fontSize="10.5" fill={MUTED} fontFamily={FONT}>no audio, no processing</text>
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/* AUX map                                                             */
/* ------------------------------------------------------------------ */

function AuxMap() {
  const W = 700;
  const H = 250;
  const aux = [
    { n: "AUX 1", t: "Stream", color: BLUE },
    { n: "AUX 2", t: "Drums", color: CYAN },
    { n: "AUX 3", t: "Comms", color: TEAL2 },
    { n: "AUX 4", t: "FX Return", color: MAGENTA },
    { n: "AUX 7", t: "Pastor", color: SUCCESS },
  ];
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="h-auto w-full" role="img" aria-label="AUX bus assignments">
      <text x={W / 2} y={20} textAnchor="middle" fontSize="12" fontWeight="700" fill={INK} fontFamily={FONT}>
        Not every AUX is a monitor — know what each bus feeds
      </text>
      {aux.map((a, i) => {
        const col = i % 3;
        const row = Math.floor(i / 3);
        const x = 40 + col * 210;
        const y = 40 + row * 66;
        return (
          <g key={a.n}>
            <rect x={x} y={y} width={190} height={50} rx="10" fill="#fff" stroke={a.color} strokeWidth="1.5" />
            <rect x={x} y={y} width={8} height={50} rx="4" fill={a.color} />
            <text x={x + 22} y={y + 22} fontSize="12.5" fontWeight="800" fill={INK} fontFamily={FONT}>{a.n}</text>
            <text x={x + 22} y={y + 39} fontSize="11" fill={MUTED} fontFamily={FONT}>{a.t}</text>
          </g>
        );
      })}
      {/* vocals callout */}
      <rect x={250} y={172} width={400} height={56} rx="10" fill="rgba(201,138,47,0.10)" stroke={GOLDF} strokeWidth="1.5" />
      <text x={270} y={196} fontSize="12" fontWeight="800" fill={INK} fontFamily={FONT}>🎧 Vocals → ME-500 directly</text>
      <text x={270} y={214} fontSize="10.5" fill={MUTED} fontFamily={FONT}>old AUX 5/6 removed — each singer sets their own in-ear level</text>
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/* Startup / shutdown sequence (vertical numbered flow)                */
/* ------------------------------------------------------------------ */

function StepFlow({
  steps,
  accent,
  label,
}: {
  steps: { t: string; s?: string }[];
  accent: string;
  label: string;
}) {
  const W = 700;
  const rowH = 40;
  const top = 16;
  const H = top * 2 + steps.length * rowH;
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="h-auto w-full" role="img" aria-label={label}>
      {/* connecting spine */}
      <line x1={38} y1={top + 18} x2={38} y2={top + (steps.length - 1) * rowH + 18} stroke={GRID} strokeWidth="2" />
      {steps.map((st, i) => {
        const y = top + i * rowH;
        return (
          <g key={i}>
            <circle cx={38} cy={y + 18} r="15" fill={accent} />
            <text x={38} y={y + 23} textAnchor="middle" fontSize="13" fontWeight="800" fill="#fff" fontFamily={FONT}>
              {i + 1}
            </text>
            <text x={66} y={y + 16} fontSize="13" fontWeight="700" fill={INK} fontFamily={FONT}>
              {st.t}
            </text>
            {st.s && (
              <text x={66} y={y + 31} fontSize="10.5" fill={MUTED} fontFamily={FONT}>
                {st.s}
              </text>
            )}
          </g>
        );
      })}
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/* Service-morning timeline                                            */
/* ------------------------------------------------------------------ */

function ServiceTimeline() {
  const W = 720;
  const H = 180;
  const y = 96;
  const stops = [
    { time: "8:20", t: "System up", s: "breakers · key · lights · scene" },
    { time: "8:25", t: "Mics out", s: "Scheduling App + batteries" },
    { time: "8:30", t: "Unmute", s: "groups as they plug in" },
    { time: "8:35", t: "Walk room", s: "listen — level everywhere" },
    { time: "8:40", t: "Line check", s: "final; leave the baseline" },
  ];
  const x0 = 96;
  const x1 = W - 96;
  const dx = (x1 - x0) / (stops.length - 1);
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="h-auto w-full" role="img" aria-label="Service-morning timeline">
      <line x1={x0} y1={y} x2={x1} y2={y} stroke={GOLD} strokeWidth="3" strokeLinecap="round" />
      <text x={W / 2} y={20} textAnchor="middle" fontSize="12" fontWeight="700" fill={INK} fontFamily={FONT}>
        Be set up and running by 8:20 — rehearsal starts at 8:30
      </text>
      {stops.map((s, i) => {
        const cx = x0 + i * dx;
        const above = i % 2 === 0;
        return (
          <g key={s.time}>
            <circle cx={cx} cy={y} r="7" fill="#fff" stroke={GOLD} strokeWidth="3" />
            <text x={cx} y={y + (above ? -44 : 42)} textAnchor="middle" fontSize="13" fontWeight="800" fill={GOLD} fontFamily={FONT}>
              {s.time}
            </text>
            <text x={cx} y={y + (above ? -28 : 58)} textAnchor="middle" fontSize="11" fontWeight="700" fill={INK} fontFamily={FONT}>
              {s.t}
            </text>
            <text x={cx} y={y + (above ? -14 : 72)} textAnchor="middle" fontSize="8.8" fill={MUTED} fontFamily={FONT}>
              {s.s}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/* Mic colors legend                                                   */
/* ------------------------------------------------------------------ */

function MicColors() {
  const W = 700;
  const H = 230;
  const mics = [
    { t: "Pastor 1", r: "preaching", color: SUCCESS },
    { t: "Pastor 2", r: "preaching", color: SUCCESS },
    { t: "Blue", r: "announcements", color: BLUE },
    { t: "Yellow", r: "vocal ♀ tuned", color: GOLD },
    { t: "Orange", r: "vocal ♀ tuned", color: GOLDF },
    { t: "Green", r: "vocal", color: "#5aa06a" },
    { t: "White", r: "vocal ♂ tuned", color: "#c9ced0" },
  ];
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="h-auto w-full" role="img" aria-label="Color-coded microphones">
      <text x={W / 2} y={20} textAnchor="middle" fontSize="12" fontWeight="700" fill={INK} fontFamily={FONT}>
        Each color is a fixed channel — reach for &lsquo;Orange&rsquo; faster than a number
      </text>
      {mics.map((m, i) => {
        const col = i % 4;
        const row = Math.floor(i / 4);
        const x = 30 + col * 168;
        const y = 44 + row * 82;
        const light = m.t === "White";
        return (
          <g key={m.t}>
            <rect x={x} y={y} width={150} height={62} rx="12" fill="#fff" stroke={GRID} strokeWidth="1.5" />
            {/* mic swatch */}
            <circle cx={x + 30} cy={y + 31} r="16" fill={m.color} stroke={light ? MUTED : m.color} strokeWidth={light ? 1 : 0} />
            <text x={x + 30} y={y + 36} textAnchor="middle" fontSize="15">🎤</text>
            <text x={x + 56} y={y + 27} fontSize="13" fontWeight="800" fill={INK} fontFamily={FONT}>{m.t}</text>
            <text x={x + 56} y={y + 44} fontSize="10.5" fill={MUTED} fontFamily={FONT}>{m.r}</text>
          </g>
        );
      })}
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/* Mic tuning — male vs female voiced mics                             */
/* ------------------------------------------------------------------ */

function MicTuning() {
  const W = 680;
  const H = 220;
  const bars = (baseX: number, weights: number[], color: string) =>
    weights.map((wv, i) => {
      const bx = baseX + i * 34;
      const bh = 12 + wv * 66;
      return <rect key={i} x={bx} y={150 - bh} width={22} height={bh} rx="3" fill={color} opacity={0.35 + wv * 0.6} />;
    });
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="h-auto w-full" role="img" aria-label="Microphones tuned by voice type">
      <text x={W / 2} y={20} textAnchor="middle" fontSize="12" fontWeight="700" fill={INK} fontFamily={FONT}>
        Each mic is EQ&apos;d for the voice that uses it — match voice to mic first
      </text>
      {/* male / White */}
      <text x={150} y={48} textAnchor="middle" fontSize="12.5" fontWeight="800" fill={INK} fontFamily={FONT}>♂ White mic</text>
      <text x={150} y={64} textAnchor="middle" fontSize="10.5" fill={MUTED} fontFamily={FONT}>tuned lower &amp; fuller</text>
      {bars(66, [0.9, 0.8, 0.55, 0.35, 0.2], "#8a9096")}
      <line x1={60} y1={150} x2={240} y2={150} stroke={MUTED} strokeWidth="1" />
      <text x={66} y={166} fontSize="9" fill={MUTED} fontFamily={FONT}>low</text>
      <text x={222} y={166} fontSize="9" fill={MUTED} fontFamily={FONT}>high</text>

      {/* female / Orange+Yellow */}
      <text x={510} y={48} textAnchor="middle" fontSize="12.5" fontWeight="800" fill={INK} fontFamily={FONT}>♀ Orange / Yellow</text>
      <text x={510} y={64} textAnchor="middle" fontSize="10.5" fill={MUTED} fontFamily={FONT}>tuned for a higher voice</text>
      {bars(426, [0.25, 0.45, 0.7, 0.85, 0.9], GOLDF)}
      <line x1={420} y1={150} x2={600} y2={150} stroke={MUTED} strokeWidth="1" />
      <text x={426} y={166} fontSize="9" fill={MUTED} fontFamily={FONT}>low</text>
      <text x={582} y={166} fontSize="9" fill={MUTED} fontFamily={FONT}>high</text>

      <line x1={W / 2} y1={40} x2={W / 2} y2={180} stroke={GRID} strokeWidth="1.5" strokeDasharray="4 5" />
      <text x={W / 2} y={202} textAnchor="middle" fontSize="10.5" fill={MUTED} fontFamily={FONT}>
        Hand a voice the mic tuned for it and you&apos;ll barely touch the channel EQ
      </text>
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/* Scene recall — mutes change, levels don't                           */
/* ------------------------------------------------------------------ */

function SceneRecall() {
  const W = 700;
  const H = 240;
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="h-auto w-full" role="img" aria-label="Scene recall affects mutes not levels">
      <Node x={30} y={94} w={150} h={64} title="Scene" sub="'Singing R1'" emoji="💾" color={TEAL} emphasis />
      <Arrow x1={180} y1={126} x2={250} y2={126} color={INK} width={2.5} />

      {/* mutes change */}
      <rect x={256} y={40} width={410} height={82} rx="12" fill="rgba(61,139,107,0.07)" stroke={SUCCESS} strokeWidth="1.5" />
      <text x={272} y={62} fontSize="12" fontWeight="800" fill={SUCCESS} fontFamily={FONT}>✓ MUTES — reset to baseline</text>
      {Array.from({ length: 8 }).map((_, i) => {
        const on = [0, 1, 4, 6].includes(i);
        return (
          <rect key={i} x={276 + i * 46} y={78} width={34} height={28} rx="5" fill={on ? DANGER : "#dfe6e4"} />
        );
      })}

      {/* faders unchanged */}
      <rect x={256} y={134} width={410} height={82} rx="12" fill={SURFACE} stroke={GRID} strokeWidth="1.5" />
      <text x={272} y={156} fontSize="12" fontWeight="800" fill={MUTED} fontFamily={FONT}>🔒 FADERS — untouched</text>
      {Array.from({ length: 8 }).map((_, i) => (
        <g key={i}>
          <line x1={293 + i * 46} y1={168} x2={293 + i * 46} y2={206} stroke={GRID} strokeWidth="2" />
          <rect x={288 + i * 46} y={180 + ((i * 11) % 22)} width={10} height={14} rx="2" fill="#9fb0b5" />
        </g>
      ))}
      <text x={W / 2} y={H - 6} textAnchor="middle" fontSize="11" fontWeight="700" fill={INK} fontFamily={FONT}>
        Recall buttons 1–6 move mutes only — safe to use mid-service
      </text>
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/* Recall timing                                                       */
/* ------------------------------------------------------------------ */

function RecallTiming() {
  const W = 720;
  const H = 180;
  const y = 92;
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="h-auto w-full" role="img" aria-label="When to recall the singing scene">
      <text x={W / 2} y={20} textAnchor="middle" fontSize="12" fontWeight="700" fill={INK} fontFamily={FONT}>
        Recalling &lsquo;Singing R1&rsquo; un-mutes the vocal mics — time it right
      </text>
      {/* before zone */}
      <rect x={30} y={y - 24} width={300} height={48} rx="10" fill="rgba(191,70,64,0.08)" stroke={DANGER} strokeWidth="1.5" />
      <text x={180} y={y - 4} textAnchor="middle" fontSize="11.5" fontWeight="700" fill={INK} fontFamily={FONT}>Prayer · Announcements</text>
      <text x={180} y={y + 13} textAnchor="middle" fontSize="10" fill={DANGER} fontFamily={FONT}>vocal mics should stay MUTED</text>

      {/* recall point */}
      <Arrow x1={335} y1={y} x2={388} y2={y} color={GOLD} width={3} />
      <circle cx={410} cy={y} r="24" fill={GOLD} />
      <text x={410} y={y - 2} textAnchor="middle" fontSize="9.5" fontWeight="800" fill="#1b2c32" fontFamily={FONT}>RECALL</text>
      <text x={410} y={y + 10} textAnchor="middle" fontSize="8" fontWeight="700" fill="#1b2c32" fontFamily={FONT}>just before</text>
      <Arrow x1={434} y1={y} x2={488} y2={y} color={GOLD} width={3} />

      {/* after zone */}
      <rect x={490} y={y - 24} width={210} height={48} rx="10" fill="rgba(61,139,107,0.10)" stroke={SUCCESS} strokeWidth="1.5" />
      <text x={595} y={y - 4} textAnchor="middle" fontSize="11.5" fontWeight="700" fill={INK} fontFamily={FONT}>Singing</text>
      <text x={595} y={y + 13} textAnchor="middle" fontSize="10" fill={SUCCESS} fontFamily={FONT}>mics live, on cue</text>

      <text x={W / 2} y={H - 8} textAnchor="middle" fontSize="10.5" fill={DANGER} fontFamily={FONT}>
        Recall too early and you leave hot mics open on stage during the count-in
      </text>
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/* dB targets                                                          */
/* ------------------------------------------------------------------ */

function DbTargets() {
  const W = 680;
  const H = 190;
  const scaleMin = 40;
  const scaleMax = 100;
  const x0 = 120;
  const x1 = W - 40;
  const pos = (db: number) => x0 + ((db - scaleMin) / (scaleMax - scaleMin)) * (x1 - x0);
  const rows = [
    { t: "Music", db: 80, color: GOLD, y: 52 },
    { t: "Sermon", db: 70, color: TEAL2, y: 104 },
  ];
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="h-auto w-full" role="img" aria-label="Loudness targets">
      <text x={W / 2} y={20} textAnchor="middle" fontSize="12" fontWeight="700" fill={INK} fontFamily={FONT}>
        Mix to consistent loudness targets (dBA)
      </text>
      {rows.map((r) => (
        <g key={r.t}>
          <text x={40} y={r.y + 24} fontSize="13" fontWeight="700" fill={INK} fontFamily={FONT}>{r.t}</text>
          <rect x={x0} y={r.y + 8} width={x1 - x0} height={26} rx="13" fill={SURFACE} />
          <rect x={x0} y={r.y + 8} width={pos(r.db) - x0} height={26} rx="13" fill={r.color} opacity="0.85" />
          <circle cx={pos(r.db)} cy={r.y + 21} r="15" fill={r.color} />
          <text x={pos(r.db)} y={r.y + 26} textAnchor="middle" fontSize="11" fontWeight="800" fill="#fff" fontFamily={FONT}>{r.db}</text>
        </g>
      ))}
      {/* scale ticks */}
      {[40, 60, 70, 80, 100].map((d) => (
        <text key={d} x={pos(d)} y={H - 12} textAnchor="middle" fontSize="9.5" fill={MUTED} fontFamily={FONT}>{d}</text>
      ))}
      <line x1={x0} y1={H - 30} x2={x1} y2={H - 30} stroke={GRID} strokeWidth="1" />
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/* No-sound diagnostic ladder                                          */
/* ------------------------------------------------------------------ */

function NoSoundFlow() {
  const steps = [
    { t: "Source live?", s: "mic on (red button), close, battery ok" },
    { t: "Channel muted?", s: "or its mute GROUP (red, top-right SoftKeys)" },
    { t: "Right layer + fader up?", s: "A = inputs, D = vocals" },
    { t: "DCA up & unmuted?", s: "a DCA can silence the family" },
    { t: "Patched correctly?", s: "right stage-box socket / SLink input" },
    { t: "Main L/R up, outputs live?", s: "house actually feeding" },
  ];
  const W = 700;
  const rowH = 46;
  const top = 40;
  const H = top + steps.length * rowH + 20;
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="h-auto w-full" role="img" aria-label="No-sound diagnostic checklist">
      <text x={W / 2} y={22} textAnchor="middle" fontSize="12" fontWeight="700" fill={INK} fontFamily={FONT}>
        Walk the signal path — the first place signal disappears is your fix
      </text>
      <line x1={40} y1={top + 16} x2={40} y2={top + (steps.length - 1) * rowH + 16} stroke={GRID} strokeWidth="2" />
      {steps.map((st, i) => {
        const y = top + i * rowH;
        return (
          <g key={i}>
            <circle cx={40} cy={y + 16} r="15" fill={i === 1 ? DANGER : TEAL} />
            <text x={40} y={y + 21} textAnchor="middle" fontSize="12" fontWeight="800" fill="#fff" fontFamily={FONT}>{i + 1}</text>
            <rect x={70} y={y} width={W - 90} height={34} rx="9" fill={i === 1 ? "rgba(191,70,64,0.07)" : "#fff"} stroke={i === 1 ? DANGER : GRID} strokeWidth="1.5" />
            <text x={84} y={y + 15} fontSize="12.5" fontWeight="700" fill={INK} fontFamily={FONT}>{st.t}</text>
            <text x={84} y={y + 28} fontSize="10" fill={MUTED} fontFamily={FONT}>{st.s}</text>
          </g>
        );
      })}
      <text x={W - 20} y={H - 6} textAnchor="end" fontSize="10" fill={DANGER} fontFamily={FONT}>
        9 times out of 10 it&apos;s a mute
      </text>
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/* Input patch matrix (FROM → TO)                                      */
/* ------------------------------------------------------------------ */

function PatchMatrix() {
  const W = 700;
  const H = 300;
  const local = [
    { from: "Local 03", to: "Blue", color: BLUE },
    { from: "Local 04", to: "Yellow", color: DANGER },
    { from: "Local 05", to: "Orange", color: DANGER },
  ];
  const slink = [
    { from: "SLink 07", to: "Bass", color: GOLDF },
    { from: "SLink 15", to: "Kick", color: CYAN },
    { from: "SLink 20", to: "GPianV", color: DANGER },
  ];
  const consoleX = 470;
  const row = (items: typeof local, y0: number, title: string, tint: string) => (
    <g>
      <text x={40} y={y0 - 12} fontSize="11.5" fontWeight="800" fill={tint} fontFamily={FONT}>{title}</text>
      {items.map((it, i) => {
        const y = y0 + i * 34;
        return (
          <g key={it.from}>
            <rect x={40} y={y} width={96} height={26} rx="6" fill="#fff" stroke={GRID} strokeWidth="1.5" />
            <text x={88} y={y + 17} textAnchor="middle" fontSize="10.5" fontWeight="700" fill={INK} fontFamily={FONT}>{it.from}</text>
            <Arrow x1={140} y1={y + 13} x2={consoleX - 6} y2={y + 13} color={it.color} />
            <rect x={consoleX} y={y} width={110} height={26} rx="6" fill="#fff" stroke={it.color} strokeWidth="1.5" />
            <rect x={consoleX} y={y} width={7} height={26} rx="3" fill={it.color} />
            <text x={consoleX + 62} y={y + 17} textAnchor="middle" fontSize="10.5" fontWeight="700" fill={INK} fontFamily={FONT}>{it.to}</text>
          </g>
        );
      })}
    </g>
  );
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="h-auto w-full" role="img" aria-label="Input patch matrix">
      <text x={88} y={20} textAnchor="middle" fontSize="10.5" fontWeight="800" fill={MUTED} fontFamily={FONT}>FROM (socket)</text>
      <text x={consoleX + 55} y={20} textAnchor="middle" fontSize="10.5" fontWeight="800" fill={MUTED} fontFamily={FONT}>TO (channel)</text>
      {row(local, 52, "LOCAL — at the console", TEAL)}
      {row(slink, 168, "SLINK — from the AR2412 stage box", GOLDF)}
      <text x={W / 2} y={H - 8} textAnchor="middle" fontSize="10.5" fill={MUTED} fontFamily={FONT}>
        The Routing screen maps each physical input to its named channel
      </text>
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/* Channel color families legend                                       */
/* ------------------------------------------------------------------ */

function ColorFamilies() {
  const W = 700;
  const H = 200;
  const fams = [
    { c: SUCCESS, t: "Green", r: "Pastors" },
    { c: BLUE, t: "Blue", r: "Announcements" },
    { c: DANGER, t: "Red", r: "Vocals" },
    { c: MAGENTA, t: "Magenta", r: "Keys · Synth · Piano" },
    { c: GOLDF, t: "Gold", r: "Guitars · Bass · Strings" },
    { c: CYAN, t: "Cyan", r: "Drums" },
    { c: "#c9ced0", t: "White", r: "Utility · returns" },
  ];
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="h-auto w-full" role="img" aria-label="Channel color families">
      <text x={W / 2} y={20} textAnchor="middle" fontSize="12" fontWeight="700" fill={INK} fontFamily={FONT}>
        Scan by color first — every channel button is coded by family
      </text>
      {fams.map((f, i) => {
        const col = i % 2;
        const rowN = Math.floor(i / 2);
        const x = 40 + col * 330;
        const y = 40 + rowN * 38;
        const light = f.t === "White";
        return (
          <g key={f.t}>
            <rect x={x} y={y} width={300} height={30} rx="8" fill="#fff" stroke={GRID} strokeWidth="1.25" />
            <rect x={x + 6} y={y + 6} width={18} height={18} rx="4" fill={f.c} stroke={light ? MUTED : f.c} strokeWidth={light ? 1 : 0} />
            <text x={x + 34} y={y + 20} fontSize="12" fontWeight="800" fill={INK} fontFamily={FONT}>{f.t}</text>
            <text x={x + 110} y={y + 20} fontSize="11" fill={MUTED} fontFamily={FONT}>{f.r}</text>
          </g>
        );
      })}
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/* Compression transfer curve                                         */
/* ------------------------------------------------------------------ */

function CompTransfer() {
  const W = 420;
  const H = 340;
  const pad = 44;
  const plot = Math.min(W, H) - pad - 20;
  const x0 = pad;
  const y0 = H - pad;
  const thresh = 0.55; // normalized
  const ratio = 3;

  const X = (t: number) => x0 + t * plot;
  const Y = (t: number) => y0 - t * plot;

  // compressed output for input t
  const out = (t: number) => (t <= thresh ? t : thresh + (t - thresh) / ratio);

  const N = 60;
  const curve: string[] = [];
  for (let i = 0; i <= N; i++) {
    const t = i / N;
    curve.push(`${i === 0 ? "M" : "L"}${X(t).toFixed(1)} ${Y(out(t)).toFixed(1)}`);
  }

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto h-auto w-full max-w-[420px]" role="img" aria-label="Compressor transfer curve">
      {/* axes */}
      <line x1={x0} y1={y0} x2={x0 + plot} y2={y0} stroke={MUTED} strokeWidth="1.5" />
      <line x1={x0} y1={y0} x2={x0} y2={y0 - plot} stroke={MUTED} strokeWidth="1.5" />
      <text x={x0 + plot / 2} y={H - 10} textAnchor="middle" fontSize="12" fill={MUTED} fontFamily={FONT}>
        Input level →
      </text>
      <text x={14} y={y0 - plot / 2} textAnchor="middle" fontSize="12" fill={MUTED} transform={`rotate(-90 14 ${y0 - plot / 2})`} fontFamily={FONT}>
        Output level →
      </text>

      {/* unity 1:1 reference */}
      <line x1={X(0)} y1={Y(0)} x2={X(1)} y2={Y(1)} stroke={GRID} strokeWidth="2" strokeDasharray="4 4" />
      <text x={X(0.9)} y={Y(0.9) - 8} fontSize="10" fill={MUTED} fontFamily={FONT}>
        1:1 (no comp)
      </text>

      {/* threshold guides */}
      <line x1={X(thresh)} y1={y0} x2={X(thresh)} y2={Y(out(thresh))} stroke={GOLD} strokeWidth="1.2" strokeDasharray="3 3" />
      <line x1={x0} y1={Y(out(thresh))} x2={X(thresh)} y2={Y(out(thresh))} stroke={GOLD} strokeWidth="1.2" strokeDasharray="3 3" />
      <circle cx={X(thresh)} cy={Y(out(thresh))} r="4.5" fill={GOLD} stroke="#fff" strokeWidth="1.5" />
      <text x={X(thresh) + 6} y={y0 - 6} fontSize="11" fontWeight="700" fill={GOLD} fontFamily={FONT}>
        Threshold
      </text>

      {/* transfer curve */}
      <path d={curve.join(" ")} fill="none" stroke={TEAL} strokeWidth="3" strokeLinejoin="round" strokeLinecap="round" />
      <text x={X(0.98)} y={Y(out(0.98)) - 8} textAnchor="end" fontSize="11" fontWeight="700" fill={TEAL} fontFamily={FONT}>
        above threshold: turned down (≈3:1)
      </text>
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/* Compression controls + before/after                                */
/* ------------------------------------------------------------------ */

function CompControls() {
  const controls = [
    { name: "Threshold", value: "≈ −18 dB", note: "where it engages", color: GOLD },
    { name: "Ratio", value: "2:1", note: "gentle for speech", color: TEAL },
    { name: "Output gain", value: "≈ 0 dB", note: "make-up level", color: TEAL2 },
  ];

  // before / after waveform
  const W = 680;
  const H = 120;
  const baseY = 60;
  const peaks = [0.2, 0.9, 0.35, 0.75, 0.25, 0.95, 0.4, 0.6, 0.3, 0.85, 0.5];
  const cap = 0.55;
  const step = (W - 40) / (peaks.length - 1);
  const before = peaks
    .map((p, i) => {
      const px = 20 + i * step;
      return `${i === 0 ? "M" : "L"}${px} ${baseY - p * 45} L${px} ${baseY + p * 45}`;
    })
    .join(" ");

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-3 gap-3">
        {controls.map((c) => (
          <div key={c.name} className="rounded-xl border border-brand-border bg-white p-3 text-center">
            <div className="mx-auto mb-2 grid h-12 w-12 place-items-center rounded-full" style={{ backgroundColor: `${c.color}22` }}>
              <span className="text-lg font-bold" style={{ color: c.color }}>
                {c.name === "Ratio" ? "÷" : c.name === "Threshold" ? "▼" : "＋"}
              </span>
            </div>
            <p className="font-sans text-xs font-bold text-brand-text">{c.name}</p>
            <p className="font-sans text-sm font-semibold" style={{ color: c.color }}>
              {c.value}
            </p>
            <p className="mt-0.5 text-[10px] text-brand-muted">{c.note}</p>
          </div>
        ))}
      </div>

      <svg viewBox={`0 0 ${W} ${H}`} className="h-auto w-full" role="img" aria-label="Before and after compression waveform">
        {/* threshold cap line */}
        <line x1={20} x2={W - 20} y1={baseY - cap * 45} y2={baseY - cap * 45} stroke={GOLD} strokeWidth="1.2" strokeDasharray="4 4" />
        <line x1={20} x2={W - 20} y1={baseY + cap * 45} y2={baseY + cap * 45} stroke={GOLD} strokeWidth="1.2" strokeDasharray="4 4" />
        {/* before (raw, spiky) */}
        <path d={before} stroke={MUTED} strokeWidth="2" fill="none" opacity="0.55" />
        {/* after (tamed peaks) */}
        {peaks.map((p, i) => {
          const px = 20 + i * step;
          const amp = Math.min(p, cap + (p - cap) / 3) * 45;
          return <line key={i} x1={px} y1={baseY - amp} x2={px} y2={baseY + amp} stroke={SUCCESS} strokeWidth="3" strokeLinecap="round" />;
        })}
        <text x={24} y={16} fontSize="11" fill={MUTED} fontFamily={FONT}>
          grey = raw peaks
        </text>
        <text x={W - 24} y={16} textAnchor="end" fontSize="11" fill={SUCCESS} fontFamily={FONT}>
          green = evened out (a few dB tamed)
        </text>
      </svg>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Limiter ceiling                                                     */
/* ------------------------------------------------------------------ */

function CompLimiter() {
  const W = 680;
  const H = 170;
  const baseY = 90;
  const ceiling = 55; // px amplitude
  const N = 120;
  const raw: string[] = [];
  const lim: string[] = [];
  for (let i = 0; i <= N; i++) {
    const t = i / N;
    const px = 20 + t * (W - 40);
    // a signal with a couple of big spikes
    const env =
      0.35 +
      0.55 * Math.exp(-Math.pow((t - 0.35) * 9, 2)) +
      0.6 * Math.exp(-Math.pow((t - 0.72) * 11, 2));
    const wave = Math.sin(t * 60) * env * 78;
    raw.push(`${i === 0 ? "M" : "L"}${px.toFixed(1)} ${(baseY - wave).toFixed(1)}`);
    const clamped = Math.max(-ceiling, Math.min(ceiling, wave));
    lim.push(`${i === 0 ? "M" : "L"}${px.toFixed(1)} ${(baseY - clamped).toFixed(1)}`);
  }
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="h-auto w-full" role="img" aria-label="Limiter ceiling clamping peaks">
      {/* ceiling lines */}
      <line x1={20} x2={W - 20} y1={baseY - ceiling} y2={baseY - ceiling} stroke={DANGER} strokeWidth="1.5" strokeDasharray="5 4" />
      <line x1={20} x2={W - 20} y1={baseY + ceiling} y2={baseY + ceiling} stroke={DANGER} strokeWidth="1.5" strokeDasharray="5 4" />
      <text x={W - 22} y={baseY - ceiling - 6} textAnchor="end" fontSize="11" fontWeight="700" fill={DANGER} fontFamily={FONT}>
        Limiter ceiling — nothing gets past
      </text>
      {/* raw peaks (clipped area shown faint) */}
      <path d={raw.join(" ")} fill="none" stroke={MUTED} strokeWidth="1.5" opacity="0.4" />
      {/* limited signal */}
      <path d={lim.join(" ")} fill="none" stroke={TEAL} strokeWidth="2.5" />
      <text x={24} y={16} fontSize="11" fill={MUTED} fontFamily={FONT}>
        faint = signal trying to spike · solid = held at the ceiling
      </text>
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/* How this guide works (lesson → board → quiz loop)                   */
/* ------------------------------------------------------------------ */

function LearnLoop() {
  const W = 728;
  const H = 208;
  const y = 46;
  const h = 84;
  const steps = [
    { emoji: "📖", t: "Read a lesson", s: "here, at your pace", w: 150 },
    { emoji: "🎛️", t: "Try it on the board", s: "at rehearsal, hands-on", w: 170 },
    { emoji: "📝", t: "Pass the quiz", s: "70% to complete", w: 150 },
    { emoji: "✅", t: "Progress saved", s: "dashboard shows what's next", w: 170 },
  ];
  let x = 8;
  const positions = steps.map((s) => {
    const px = x;
    x += s.w + 24;
    return px;
  });
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="h-auto w-full" role="img" aria-label="How to use this guide: read, try, quiz, progress">
      <text x={W / 2} y={22} textAnchor="middle" fontSize="12" fontWeight="700" fill={INK} fontFamily={FONT}>
        Each module is the same loop — reading plus real board time is what makes it stick
      </text>
      {steps.map((s, i) => (
        <g key={s.t}>
          {i > 0 && (
            <Arrow x1={positions[i] - 22} y1={y + h / 2} x2={positions[i] - 4} y2={y + h / 2} color={MUTED} />
          )}
          <Node x={positions[i]} y={y} w={s.w} h={h} title={s.t} sub={s.s} emoji={s.emoji} color={i === 1 ? GOLD : TEAL2} fill={i === 1 ? "rgba(216,162,60,0.10)" : "#fff"} emphasis={i === 1} />
        </g>
      ))}
      {/* loop back arrow */}
      <path
        d={`M ${positions[3] + 85} ${y + h + 8} C ${positions[3] + 85} ${y + h + 32}, ${positions[0] + 75} ${y + h + 32}, ${positions[0] + 75} ${y + h + 10}`}
        fill="none"
        stroke={MUTED}
        strokeWidth="1.5"
        strokeDasharray="5 4"
      />
      <text x={W / 2} y={y + h + 52} textAnchor="middle" fontSize="10.5" fill={MUTED} fontFamily={FONT}>
        then on to the next module — each one builds on the last
      </text>
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/* Select key focuses a channel (edit focus, not sound)                */
/* ------------------------------------------------------------------ */

function SelectFocus() {
  const W = 700;
  const H = 300;
  const sel = 2; // selected strip
  const stripY = 44;
  const stripX = (i: number) => 200 + i * 62;
  const screen = { x: 225, y: 186, w: 250, h: 84 };
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="h-auto w-full" role="img" aria-label="Pressing Select focuses a channel for editing without changing the sound">
      <text x={W / 2} y={20} textAnchor="middle" fontSize="12" fontWeight="700" fill={INK} fontFamily={FONT}>
        SELECT chooses what you&apos;re EDITING — it changes nothing about what&apos;s heard
      </text>

      {/* fader strips with select keys */}
      {[0, 1, 2, 3, 4].map((i) => {
        const x = stripX(i);
        const isSel = i === sel;
        return (
          <g key={i}>
            <rect x={x - 16} y={stripY} width={32} height={17} rx="3" fill={isSel ? GOLD : "#dfe6e4"} stroke={isSel ? "#a87b22" : GRID} />
            <text x={x} y={stripY + 12.5} textAnchor="middle" fontSize="8.5" fontWeight="700" fill={isSel ? "#1b2c32" : MUTED} fontFamily={FONT}>SEL</text>
            <line x1={x} y1={stripY + 26} x2={x} y2={stripY + 66} stroke={GRID} strokeWidth="2" />
            <rect x={x - 6} y={stripY + 32 + ((i * 9) % 20)} width={12} height={16} rx="2" fill={isSel ? GOLD : "#9fb0b5"} />
            <text x={x} y={stripY + 82} textAnchor="middle" fontSize="8.5" fill={isSel ? GOLD : MUTED} fontWeight={isSel ? 700 : 400} fontFamily={FONT}>ch {i + 1}</text>
          </g>
        );
      })}

      {/* arrow from selected strip down to the screen */}
      <Arrow x1={stripX(sel)} y1={stripY + 92} x2={screen.x + screen.w / 2} y2={screen.y - 6} color={GOLD} width={2.5} />
      <text x={stripX(sel) + 34} y={stripY + 118} fontSize="10.5" fontWeight="700" fill={GOLD} fontFamily={FONT}>
        press SELECT on ch 3…
      </text>

      {/* the shared screen */}
      <rect x={screen.x} y={screen.y} width={screen.w} height={screen.h} rx="10" fill="#0f2b30" stroke={TEAL} strokeWidth="2" />
      <text x={screen.x + screen.w / 2} y={screen.y + 28} textAnchor="middle" fontSize="12.5" fontWeight="800" fill="#d8a23c" fontFamily={FONT}>CH 3 · ORANGE</text>
      <text x={screen.x + screen.w / 2} y={screen.y + 50} textAnchor="middle" fontSize="10" fill="#8fc0c8" fontFamily={FONT}>gain · HPF · EQ · compressor</text>
      <text x={screen.x + screen.w / 2} y={screen.y + 68} textAnchor="middle" fontSize="9.5" fill="#6fa5ad" fontFamily={FONT}>…and the screen shows that channel</text>

      {/* knobs beside screen */}
      {[0, 1, 2].map((i) => (
        <g key={i}>
          <circle cx={520 + i * 46} cy={screen.y + 30} r="15" fill="#fff" stroke={TEAL} strokeWidth="2" />
          <line x1={520 + i * 46} y1={screen.y + 30} x2={520 + i * 46} y2={screen.y + 18} stroke={TEAL} strokeWidth="2" strokeLinecap="round" />
        </g>
      ))}
      <text x={566} y={screen.y + 66} textAnchor="middle" fontSize="9.5" fill={MUTED} fontFamily={FONT}>same knobs, every channel</text>

      {/* what's heard is untouched */}
      <text x={110} y={screen.y + 44} textAnchor="middle" fontSize="20">🔊</text>
      <text x={110} y={screen.y + 64} textAnchor="middle" fontSize="9.5" fill={MUTED} fontFamily={FONT}>the sound? unchanged</text>

      <text x={W / 2} y={H - 8} textAnchor="middle" fontSize="10.5" fill={MUTED} fontFamily={FONT}>
        Faders and mutes decide what&apos;s HEARD — Select only decides which channel you&apos;re editing
      </text>
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/* SoftKey map — scene recall keys vs mute-group keys                  */
/* ------------------------------------------------------------------ */

function SoftkeyMap() {
  const W = 700;
  const H = 260;
  const groups = [
    { t: "Vocals", muted: false },
    { t: "Instr", muted: false },
    { t: "Drums", muted: true },
    { t: "Keys", muted: true },
  ];
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="h-auto w-full" role="img" aria-label="Scene-recall SoftKeys versus mute-group SoftKeys">
      {/* left block: scene keys */}
      <rect x={30} y={40} width={300} height={190} rx="12" fill="#fff" stroke={TEAL} strokeWidth="1.5" />
      <text x={180} y={64} textAnchor="middle" fontSize="12.5" fontWeight="800" fill={TEAL} fontFamily={FONT}>SCENE KEYS (left of screen)</text>
      {[0, 1, 2, 3, 4, 5].map((i) => {
        const bx = 52 + (i % 3) * 88;
        const by = 78 + Math.floor(i / 3) * 34;
        return (
          <g key={i}>
            <rect x={bx} y={by} width={72} height={24} rx="5" fill="rgba(30,81,98,0.10)" stroke={TEAL2} strokeWidth="1.25" />
            <text x={bx + 36} y={by + 16} textAnchor="middle" fontSize="10.5" fontWeight="700" fill={TEAL} fontFamily={FONT}>{i + 1} recall</text>
          </g>
        );
      })}
      <text x={180} y={158} textAnchor="middle" fontSize="10" fill={MUTED} fontFamily={FONT}>1–6 RECALL scenes — they move MUTES only, never levels</text>
      <rect x={52} y={170} width={72} height={24} rx="5" fill="rgba(191,70,64,0.10)" stroke={DANGER} strokeWidth="1.25" />
      <text x={88} y={186} textAnchor="middle" fontSize="10.5" fontWeight="700" fill={DANGER} fontFamily={FONT}>7 store</text>
      <text x={136} y={186} fontSize="10" fill={DANGER} fontFamily={FONT}>rare — only with a lead&apos;s approval</text>

      {/* right block: mute-group keys */}
      <rect x={370} y={40} width={300} height={190} rx="12" fill="#fff" stroke={GOLDF} strokeWidth="1.5" />
      <text x={520} y={64} textAnchor="middle" fontSize="12.5" fontWeight="800" fill={GOLDF} fontFamily={FONT}>MUTE-GROUP KEYS (top-right)</text>
      {groups.map((g, i) => {
        const by = 80 + i * 34;
        return (
          <g key={g.t}>
            <rect x={396} y={by} width={110} height={24} rx="5" fill={g.muted ? DANGER : "#dfe6e4"} stroke={g.muted ? "#8f2f2a" : GRID} />
            <text x={451} y={by + 16} textAnchor="middle" fontSize="10.5" fontWeight="700" fill={g.muted ? "#fff" : MUTED} fontFamily={FONT}>{g.t}</text>
            <text x={522} y={by + 16} fontSize="10" fill={g.muted ? DANGER : SUCCESS} fontWeight="700" fontFamily={FONT}>
              {g.muted ? "● muted" : "live"}
            </text>
          </g>
        );
      })}
      <text x={W / 2} y={H - 10} textAnchor="middle" fontSize="10.5" fill={MUTED} fontFamily={FONT}>
        Two different jobs: left keys jump between saved mute states; right keys silence whole families — RED = muted
      </text>
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/* Scheduling App → person → color mic → channel                       */
/* ------------------------------------------------------------------ */

function MicAssignments() {
  const W = 700;
  const H = 250;
  const rows = [
    { who: "Erin", mic: "Yellow", c: GOLD },
    { who: "Val", mic: "Orange", c: GOLDF },
    { who: "William", mic: "White", c: "#c9ced0" },
  ];
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="h-auto w-full" role="img" aria-label="Scheduling App assigns each singer a color mic, which is a fixed channel">
      <text x={W / 2} y={20} textAnchor="middle" fontSize="12" fontWeight="700" fill={INK} fontFamily={FONT}>
        The app tells you WHO gets WHICH color — the color is always the same channel on the board
      </text>
      {/* app card */}
      <rect x={30} y={62} width={150} height={130} rx="14" fill="#fff" stroke={TEAL} strokeWidth="2" />
      <rect x={30} y={62} width={150} height={30} rx="14" fill={TEAL} />
      <rect x={30} y={78} width={150} height={14} fill={TEAL} />
      <text x={105} y={82} textAnchor="middle" fontSize="11" fontWeight="800" fill="#fff" fontFamily={FONT}>📱 Scheduling App</text>
      {rows.map((r, i) => (
        <text key={r.who} x={46} y={116 + i * 24} fontSize="11" fill={INK} fontFamily={FONT}>
          {r.who} — <tspan fontWeight="700">{r.mic}</tspan>
        </text>
      ))}

      {rows.map((r, i) => {
        const y = 74 + i * 44;
        const light = r.mic === "White";
        return (
          <g key={r.who}>
            <Arrow x1={186} y1={104 + i * 24} x2={252} y2={y + 20} color={MUTED} width={1.5} />
            {/* person + mic */}
            <rect x={256} y={y} width={190} height={38} rx="10" fill="#fff" stroke={GRID} strokeWidth="1.5" />
            <circle cx={280} cy={y + 19} r="12" fill={r.c} stroke={light ? MUTED : r.c} strokeWidth={light ? 1 : 0} />
            <text x={280} y={y + 24} textAnchor="middle" fontSize="12">🎤</text>
            <text x={300} y={y + 24} fontSize="11.5" fontWeight="700" fill={INK} fontFamily={FONT}>{r.who} gets {r.mic}</text>
            <Arrow x1={450} y1={y + 19} x2={508} y2={y + 19} color={r.c === "#c9ced0" ? MUTED : r.c} width={2} />
            {/* fixed channel */}
            <rect x={512} y={y} width={158} height={38} rx="10" fill="#fff" stroke={light ? MUTED : r.c} strokeWidth="1.5" />
            <text x={591} y={y + 17} textAnchor="middle" fontSize="11" fontWeight="700" fill={INK} fontFamily={FONT}>&lsquo;{r.mic}&rsquo; channel</text>
            <text x={591} y={y + 30} textAnchor="middle" fontSize="9.5" fill={MUTED} fontFamily={FONT}>same fader every week</text>
          </g>
        );
      })}
      <text x={W / 2} y={H - 10} textAnchor="middle" fontSize="10.5" fill={MUTED} fontFamily={FONT}>
        Singers change week to week — the channels never do. Match app → mic → person before rehearsal.
      </text>
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/* Battery check                                                       */
/* ------------------------------------------------------------------ */

function BatteryCheck() {
  const W = 700;
  const H = 210;
  const cells = [
    { bars: 3, label: "3 bars — good", note: "use it", color: SUCCESS },
    { bars: 2, label: "2 bars — fine", note: "keep an eye on it", color: GOLDF },
    { bars: 1, label: "1 bar — change now", note: "swap in 2 fresh AA", color: DANGER },
  ];
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="h-auto w-full" role="img" aria-label="Mic battery levels: three bars good, one bar means change the batteries">
      <text x={W / 2} y={22} textAnchor="middle" fontSize="12" fontWeight="700" fill={INK} fontFamily={FONT}>
        Check every mic&apos;s battery display during setup — never let one die mid-song
      </text>
      {cells.map((c, i) => {
        const x = 52 + i * 212;
        return (
          <g key={c.label}>
            <rect x={x} y={52} width={180} height={110} rx="12" fill="#fff" stroke={c.color} strokeWidth={i === 2 ? 2.5 : 1.5} />
            {/* battery body */}
            <rect x={x + 40} y={70} width={86} height={34} rx="6" fill="none" stroke={INK} strokeWidth="2" />
            <rect x={x + 126} y={80} width={8} height={14} rx="2" fill={INK} />
            {[0, 1, 2].map((b) => (
              <rect
                key={b}
                x={x + 46 + b * 27}
                y={76}
                width={21}
                height={22}
                rx="3"
                fill={b < c.bars ? c.color : "#e8ecea"}
              />
            ))}
            <text x={x + 90} y={128} textAnchor="middle" fontSize="12" fontWeight="800" fill={c.color} fontFamily={FONT}>{c.label}</text>
            <text x={x + 90} y={146} textAnchor="middle" fontSize="10.5" fill={MUTED} fontFamily={FONT}>{c.note}</text>
          </g>
        );
      })}
      <text x={W / 2} y={H - 12} textAnchor="middle" fontSize="10.5" fill={MUTED} fontFamily={FONT}>
        Power on with the red button on the bottom of the handheld, then verify signal at the board
      </text>
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/* Buzz sources — open unused inputs hum                               */
/* ------------------------------------------------------------------ */

function BuzzSources() {
  const W = 700;
  const H = 230;
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="h-auto w-full" role="img" aria-label="Unused open channels buzz; muted channels stay silent">
      <text x={W / 2} y={20} textAnchor="middle" fontSize="12" fontWeight="700" fill={INK} fontFamily={FONT}>
        Plugged in but not being played = noise waiting to happen
      </text>

      {/* left: open unused channel buzzing */}
      <rect x={36} y={44} width={300} height={150} rx="12" fill="rgba(191,70,64,0.06)" stroke={DANGER} strokeWidth="1.5" />
      <text x={186} y={68} textAnchor="middle" fontSize="12" fontWeight="800" fill={DANGER} fontFamily={FONT}>OPEN + idle → buzz in the mix</text>
      <text x={96} y={106} textAnchor="middle" fontSize="26">🎸</text>
      <text x={96} y={126} textAnchor="middle" fontSize="9.5" fill={MUTED} fontFamily={FONT}>electric guitar</text>
      <text x={186} y={106} textAnchor="middle" fontSize="26">🎹</text>
      <text x={186} y={126} textAnchor="middle" fontSize="9.5" fill={MUTED} fontFamily={FONT}>piano mic</text>
      {/* buzz waves */}
      <path d="M 240 96 q 8 -10 16 0 t 16 0 t 16 0" fill="none" stroke={DANGER} strokeWidth="2" strokeLinecap="round" />
      <path d="M 244 112 q 8 -10 16 0 t 16 0" fill="none" stroke={DANGER} strokeWidth="2" strokeLinecap="round" opacity="0.7" />
      <text x={276} y={136} textAnchor="middle" fontSize="10.5" fontWeight="700" fill={DANGER} fontFamily={FONT}>bzzz…</text>
      <text x={186} y={172} textAnchor="middle" fontSize="10" fill={MUTED} fontFamily={FONT}>channel unmuted, nobody playing</text>

      {/* right: muted = clean */}
      <rect x={364} y={44} width={300} height={150} rx="12" fill="rgba(61,139,107,0.06)" stroke={SUCCESS} strokeWidth="1.5" />
      <text x={514} y={68} textAnchor="middle" fontSize="12" fontWeight="800" fill={SUCCESS} fontFamily={FONT}>MUTED until it&apos;s played → silence</text>
      <rect x={444} y={86} width={140} height={34} rx="8" fill={DANGER} />
      <text x={514} y={108} textAnchor="middle" fontSize="12" fontWeight="800" fill="#fff" fontFamily={FONT}>MUTE ON</text>
      <text x={514} y={144} textAnchor="middle" fontSize="10.5" fill={SUCCESS} fontFamily={FONT}>…nothing reaches the mix</text>
      <text x={514} y={172} textAnchor="middle" fontSize="10" fill={MUTED} fontFamily={FONT}>unmute a beat before it&apos;s needed</text>

      <text x={W / 2} y={H - 10} textAnchor="middle" fontSize="10.5" fill={MUTED} fontFamily={FONT}>
        Open, unused mics and DIs are the #1 source of noise and feedback — keep them muted
      </text>
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/* Blue mic order of operations                                        */
/* ------------------------------------------------------------------ */

function BlueMicOrder() {
  const W = 700;
  const H = 240;
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="h-auto w-full" role="img" aria-label="Turn the Blue mic on before unmuting it; unmuting it while off creates static">
      <text x={W / 2} y={20} textAnchor="middle" fontSize="12" fontWeight="700" fill={INK} fontFamily={FONT}>
        Blue mic rule: power it ON first, THEN unmute — in that order
      </text>

      {/* right way */}
      <rect x={36} y={40} width={628} height={80} rx="12" fill="rgba(61,139,107,0.06)" stroke={SUCCESS} strokeWidth="1.5" />
      <text x={62} y={66} fontSize="12" fontWeight="800" fill={SUCCESS} fontFamily={FONT}>✓ RIGHT</text>
      <Node x={150} y={56} w={150} h={48} title="1 · Turn mic ON" sub="red button, bottom" color={SUCCESS} />
      <Arrow x1={300} y1={80} x2={352} y2={80} color={SUCCESS} width={2.5} />
      <Node x={356} y={56} w={150} h={48} title="2 · Unmute" sub="at the board" color={SUCCESS} />
      <Arrow x1={506} y1={80} x2={558} y2={80} color={SUCCESS} width={2.5} />
      <text x={598} y={78} textAnchor="middle" fontSize="11.5" fontWeight="700" fill={SUCCESS} fontFamily={FONT}>clean</text>
      <text x={598} y={92} textAnchor="middle" fontSize="10" fill={MUTED} fontFamily={FONT}>announcements</text>

      {/* wrong way */}
      <rect x={36} y={136} width={628} height={80} rx="12" fill="rgba(191,70,64,0.06)" stroke={DANGER} strokeWidth="1.5" />
      <text x={62} y={162} fontSize="12" fontWeight="800" fill={DANGER} fontFamily={FONT}>✗ WRONG</text>
      <Node x={150} y={152} w={150} h={48} title="1 · Unmute first" sub="mic still OFF" color={DANGER} />
      <Arrow x1={300} y1={176} x2={352} y2={176} color={DANGER} width={2.5} />
      <rect x={356} y={152} width={150} height={48} rx="11" fill="#fff" stroke={DANGER} strokeWidth="1.5" />
      <text x={431} y={172} textAnchor="middle" fontSize="13" fontWeight="700" fill={DANGER} fontFamily={FONT}>⚡ STATIC</text>
      <text x={431} y={188} textAnchor="middle" fontSize="10.5" fill={MUTED} fontFamily={FONT}>over the house</text>
      <Arrow x1={506} y1={176} x2={558} y2={176} color={DANGER} width={2.5} />
      <text x={598} y={174} textAnchor="middle" fontSize="11.5" fontWeight="700" fill={DANGER} fontFamily={FONT}>everyone</text>
      <text x={598} y={188} textAnchor="middle" fontSize="10" fill={MUTED} fontFamily={FONT}>hears it</text>

      <text x={W / 2} y={H - 8} textAnchor="middle" fontSize="10.5" fill={MUTED} fontFamily={FONT}>
        Same rule in reverse at the end: mute it at the board, then power the mic off
      </text>
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/* Group & DCA assignments map                                         */
/* ------------------------------------------------------------------ */

function AssignmentsMap() {
  const W = 700;
  const H = 300;
  const groupRows = [
    { n: "1", t: "Pastor" },
    { n: "2", t: "Vocals" },
    { n: "3", t: "Instruments" },
    { n: "4", t: "Piano / Keys" },
    { n: "•", t: "Drums" },
  ];
  const dcaRows = [
    { n: "1", t: "Pastor" },
    { n: "2", t: "Vocals Main" },
    { n: "3", t: "Vocals Second" },
    { n: "4", t: "Electric Guitar" },
    { n: "5", t: "Analog Guitar" },
    { n: "6", t: "Synth L/R" },
    { n: "7", t: "Piano L/R" },
    { n: "8", t: "Drums" },
  ];
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="h-auto w-full" role="img" aria-label="Our Group and DCA assignments">
      <text x={W / 2} y={20} textAnchor="middle" fontSize="12" fontWeight="700" fill={INK} fontFamily={FONT}>
        One move controls a whole family — confirm exact numbers on the board
      </text>

      <text x={190} y={48} textAnchor="middle" fontSize="12.5" fontWeight="800" fill={TEAL} fontFamily={FONT}>GROUPS — add processing</text>
      {groupRows.map((r, i) => {
        const y = 60 + i * 40;
        return (
          <g key={r.t}>
            <rect x={60} y={y} width={260} height={32} rx="8" fill="#fff" stroke={TEAL2} strokeWidth="1.25" />
            <rect x={60} y={y} width={32} height={32} rx="8" fill={TEAL2} />
            <text x={76} y={y + 21} textAnchor="middle" fontSize="12" fontWeight="800" fill="#fff" fontFamily={FONT}>{r.n}</text>
            <text x={104} y={y + 21} fontSize="12" fontWeight="600" fill={INK} fontFamily={FONT}>{r.t}</text>
          </g>
        );
      })}

      <text x={510} y={48} textAnchor="middle" fontSize="12.5" fontWeight="800" fill={GOLD} fontFamily={FONT}>DCAs — ride level &amp; mute</text>
      {dcaRows.map((r, i) => {
        const col = i % 2;
        const row = Math.floor(i / 2);
        const x = 380 + col * 140;
        const y = 60 + row * 40;
        return (
          <g key={r.t}>
            <rect x={x} y={y} width={130} height={32} rx="8" fill="#fff" stroke={GOLDF} strokeWidth="1.25" />
            <rect x={x} y={y} width={26} height={32} rx="8" fill={GOLDF} />
            <text x={x + 13} y={y + 21} textAnchor="middle" fontSize="11.5" fontWeight="800" fill="#fff" fontFamily={FONT}>{r.n}</text>
            <text x={x + 34} y={y + 21} fontSize="10" fontWeight="600" fill={INK} fontFamily={FONT}>{r.t}</text>
          </g>
        );
      })}
      <line x1={350} y1={40} x2={350} y2={265} stroke={GRID} strokeWidth="1.5" strokeDasharray="4 5" />
      <text x={W / 2} y={H - 12} textAnchor="middle" fontSize="10.5" fill={MUTED} fontFamily={FONT}>
        &lsquo;Bring up the vocals&rsquo; = one Group/DCA move, not four individual faders
      </text>
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/* Recall (everyday) vs Store (rare)                                   */
/* ------------------------------------------------------------------ */

function RecallVsStore() {
  const W = 700;
  const H = 230;
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="h-auto w-full" role="img" aria-label="Recall is the everyday move; storing with Button 7 is rare and lead-approved">
      {/* recall side */}
      <rect x={36} y={30} width={390} height={160} rx="12" fill="rgba(61,139,107,0.06)" stroke={SUCCESS} strokeWidth="1.5" />
      <text x={231} y={56} textAnchor="middle" fontSize="12.5" fontWeight="800" fill={SUCCESS} fontFamily={FONT}>EVERYDAY — RECALL (buttons 1–6)</text>
      <Node x={60} y={72} w={150} h={62} title="'Singing R1'" sub="protected baseline" emoji="💾" color={SUCCESS} />
      <Arrow x1={210} y1={103} x2={268} y2={103} color={SUCCESS} width={2.5} />
      <text x={239} y={94} textAnchor="middle" fontSize="9.5" fill={SUCCESS} fontFamily={FONT}>recall</text>
      <Node x={272} y={76} w={130} h={54} title="The board" sub="mutes reset" color={SUCCESS} />
      <text x={231} y={162} textAnchor="middle" fontSize="10.5" fill={MUTED} fontFamily={FONT}>
        Read-only: the scene loads INTO the board.
      </text>
      <text x={231} y={177} textAnchor="middle" fontSize="10.5" fill={MUTED} fontFamily={FONT}>
        The saved baseline itself never changes.
      </text>

      {/* store side */}
      <rect x={446} y={30} width={218} height={160} rx="12" fill="rgba(191,70,64,0.06)" stroke={DANGER} strokeWidth="1.5" />
      <text x={555} y={56} textAnchor="middle" fontSize="12.5" fontWeight="800" fill={DANGER} fontFamily={FONT}>RARE — STORE (button 7)</text>
      <Node x={490} y={76} w={130} h={54} title="The board" sub="today's setup" color={DANGER} />
      <Arrow x1={555} y1={130} x2={555} y2={152} color={DANGER} width={2.5} />
      <text x={555} y={168} textAnchor="middle" fontSize="10.5" fontWeight="700" fill={DANGER} fontFamily={FONT}>overwrites the scene</text>
      <text x={555} y={182} textAnchor="middle" fontSize="10" fill={MUTED} fontFamily={FONT}>only with a lead&apos;s approval</text>

      <text x={W / 2} y={H - 12} textAnchor="middle" fontSize="11" fontWeight="700" fill={INK} fontFamily={FONT}>
        Recall &lsquo;Singing R1&rsquo;, never overwrite it — Button 7 is not part of a normal Sunday
      </text>
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/* Mix priorities during the service                                   */
/* ------------------------------------------------------------------ */

function MixPriorities() {
  const W = 700;
  const H = 240;
  const rows = [
    { n: 1, t: "Spoken word — Pastor & Blue", s: "a missed unmute here is the most noticeable mistake", color: DANGER, w: 620 },
    { n: 2, t: "Lead vocal clear over the band", s: "the congregation follows the words", color: GOLD, w: 520 },
    { n: 3, t: "Band balance & dynamics", s: "smooth, small moves with groups and DCAs", color: TEAL2, w: 420 },
  ];
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="h-auto w-full" role="img" aria-label="Mixing priorities: spoken word first, then lead vocal, then band balance">
      <text x={W / 2} y={22} textAnchor="middle" fontSize="12" fontWeight="700" fill={INK} fontFamily={FONT}>
        When attention is limited, this is the order it goes in
      </text>
      {rows.map((r, i) => {
        const y = 44 + i * 58;
        return (
          <g key={r.n}>
            <circle cx={62} cy={y + 24} r="16" fill={r.color} />
            <text x={62} y={y + 29} textAnchor="middle" fontSize="14" fontWeight="800" fill="#fff" fontFamily={FONT}>{r.n}</text>
            <rect x={92} y={y} width={r.w - 92} height={48} rx="10" fill="#fff" stroke={r.color} strokeWidth="1.5" />
            <text x={108} y={y + 21} fontSize="12.5" fontWeight="700" fill={INK} fontFamily={FONT}>{r.t}</text>
            <text x={108} y={y + 38} fontSize="10.5" fill={MUTED} fontFamily={FONT}>{r.s}</text>
          </g>
        );
      })}
      <text x={W / 2} y={H - 12} textAnchor="middle" fontSize="10.5" fill={MUTED} fontFamily={FONT}>
        Unmute the essentials first, then fine-tune — never the other way around
      </text>
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/* Stay present — where attention goes during the service              */
/* ------------------------------------------------------------------ */

function StayPresent() {
  const W = 700;
  const H = 290;
  const cy = 120; // vertical center of the loop nodes
  const items = [
    { emoji: "🎤", t: "Platform", s: "who's up next", x: 60 },
    { emoji: "📋", t: "Run sheet", s: "what's next", x: 230 },
    { emoji: "📊", t: "Meters & mutes", s: "anything drifting?", x: 400 },
    { emoji: "👂", t: "The room", s: "how it really sounds", x: 570 },
  ];
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="h-auto w-full" role="img" aria-label="Keep your attention cycling between the platform, run sheet, meters, and the room — not your phone">
      <text x={W / 2} y={20} textAnchor="middle" fontSize="12" fontWeight="700" fill={INK} fontFamily={FONT}>
        Mixing is active work — your eyes and ears keep cycling through this loop
      </text>
      {items.map((it, i) => (
        <g key={it.t}>
          {i > 0 && <Arrow x1={it.x - 32} y1={cy - 26} x2={it.x - 6} y2={cy - 26} color={MUTED} width={1.5} />}
          <Node x={it.x} y={cy - 56} w={130} h={60} title={it.t} sub={it.s} emoji={it.emoji} color={TEAL2} />
        </g>
      ))}
      {/* loop back */}
      <path
        d={`M ${635} ${cy + 12} C ${635} ${cy + 32}, ${125} ${cy + 32}, ${125} ${cy + 14}`}
        fill="none"
        stroke={MUTED}
        strokeWidth="1.5"
        strokeDasharray="5 4"
      />
      <text x={W / 2} y={cy + 46} textAnchor="middle" fontSize="9.5" fill={MUTED} fontFamily={FONT}>…and around again, all service long</text>

      {/* phone, out of the loop */}
      <rect x={262} y={cy + 62} width={176} height={50} rx="10" fill="rgba(191,70,64,0.07)" stroke={DANGER} strokeWidth="1.5" />
      <text x={294} y={cy + 94} textAnchor="middle" fontSize="18">📱</text>
      <line x1={282} y1={cy + 100} x2={306} y2={cy + 74} stroke={DANGER} strokeWidth="2.5" strokeLinecap="round" />
      <text x={372} y={cy + 84} textAnchor="middle" fontSize="12" fontWeight="700" fill={DANGER} fontFamily={FONT}>phone — not in the loop</text>
      <text x={372} y={cy + 100} textAnchor="middle" fontSize="9.5" fill={DANGER} fontFamily={FONT}>put it away until after</text>

      <text x={W / 2} y={H - 10} textAnchor="middle" fontSize="10.5" fill={MUTED} fontFamily={FONT}>
        One glance down at the wrong moment is a missed unmute or a level that drifted
      </text>
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/* Feedback loop — how the squeal happens and the fix                  */
/* ------------------------------------------------------------------ */

function FeedbackLoop() {
  const W = 700;
  const H = 250;
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="h-auto w-full" role="img" aria-label="Feedback: the mic hears the speaker, which replays the mic, louder each time">
      <text x={W / 2} y={20} textAnchor="middle" fontSize="12" fontWeight="700" fill={INK} fontFamily={FONT}>
        Feedback is a loop: the mic hears the speaker, the speaker replays the mic — louder every lap
      </text>

      <Node x={80} y={60} w={140} h={62} title="Open mic" sub="picks up sound" emoji="🎤" color={DANGER} emphasis />
      <Node x={480} y={60} w={140} h={62} title="Speaker" sub="plays it back out" emoji="🔊" color={DANGER} emphasis />
      {/* circular arrows */}
      <path d="M 224 78 C 300 48, 400 48, 476 78" fill="none" stroke={DANGER} strokeWidth="2.5" />
      <polygon points="476,78 462,70 466,82" fill={DANGER} />
      <text x={350} y={52} textAnchor="middle" fontSize="10" fill={DANGER} fontFamily={FONT}>mic&apos;s sound goes to the speaker…</text>
      <path d="M 476 108 C 400 138, 300 138, 224 108" fill="none" stroke={DANGER} strokeWidth="2.5" />
      <polygon points="224,108 238,116 234,104" fill={DANGER} />
      <text x={350} y={146} textAnchor="middle" fontSize="10" fill={DANGER} fontFamily={FONT}>…and the mic hears it again — SQUEAL</text>

      {/* the fix */}
      <rect x={70} y={172} width={560} height={52} rx="12" fill="rgba(61,139,107,0.07)" stroke={SUCCESS} strokeWidth="1.5" />
      <text x={350} y={193} textAnchor="middle" fontSize="11.5" fontWeight="800" fill={SUCCESS} fontFamily={FONT}>
        THE FIX: calmly pull that channel down (PAFL helps find it), then remove the cause
      </text>
      <text x={350} y={211} textAnchor="middle" fontSize="10" fill={MUTED} fontFamily={FONT}>
        an open mic too close to a speaker, or a channel pushed too hot — prevention is muting unused mics
      </text>
      <text x={W / 2} y={H - 8} textAnchor="middle" fontSize="10.5" fill={MUTED} fontFamily={FONT}>
        Break any link in the loop and the squeal stops instantly
      </text>
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/* When to escalate — decision flow                                    */
/* ------------------------------------------------------------------ */

function EscalateFlow() {
  const W = 700;
  const H = 250;
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="h-auto w-full" role="img" aria-label="Escalation decision: quick fix yourself, or get a lead if the service is disrupted">
      <Node x={40} y={30} w={180} h={56} title="Something's wrong" sub="stay calm, walk the path" emoji="⚠️" color={GOLD} emphasis />

      {/* branch: quick fix */}
      <Arrow x1={220} y1={50} x2={330} y2={50} color={SUCCESS} width={2.5} />
      <text x={275} y={42} textAnchor="middle" fontSize="9.5" fontWeight="700" fill={SUCCESS} fontFamily={FONT}>quick fix?</text>
      <Node x={334} y={26} w={160} h={50} title="Fix it yourself" sub="mute, fader, patch…" color={SUCCESS} />
      <Arrow x1={494} y1={51} x2={546} y2={51} color={SUCCESS} width={2} />
      <Node x={550} y={26} w={120} h={50} title="Note it" sub="tell the team after" color={SUCCESS} />

      {/* branch: escalate */}
      <Arrow x1={130} y1={86} x2={130} y2={140} color={DANGER} width={2.5} />
      <text x={210} y={122} textAnchor="middle" fontSize="9.5" fontWeight="700" fill={DANGER} fontFamily={FONT}>disrupting the service?</text>
      <Node x={40} y={144} w={180} h={56} title="Get a lead tech" sub="stream down, stage box dead…" emoji="🙋" color={DANGER} emphasis />
      <Arrow x1={220} y1={172} x2={330} y2={172} color={DANGER} width={2} />
      <Node x={334} y={148} w={160} h={50} title="Cover the room" sub="the service comes first" color={DANGER} />
      <Arrow x1={494} y1={173} x2={546} y2={173} color={DANGER} width={2} />
      <Node x={550} y={148} w={120} h={50} title="Document" sub="what you saw, when" color={DANGER} />

      <text x={W / 2} y={H - 14} textAnchor="middle" fontSize="11" fontWeight="700" fill={INK} fontFamily={FONT}>
        Protecting the service matters more than solving it solo — escalate early, without embarrassment
      </text>
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/* Public component                                                    */
/* ------------------------------------------------------------------ */

export function LessonVisual({ name }: { name: string }) {
  switch (name) {
    /* ---- signal flow ---- */
    case "system-overview":
      return (
        <Frame
          title="Our system at a glance"
          caption="Every input feeds the SQ-6, which builds many independent mixes from the same sources — house, hallway, stream, and each musician's in-ears."
        >
          <SystemOverview />
        </Frame>
      );
    case "physical-routing":
      return (
        <Frame
          title="Physical routing: stage → console"
          caption="Picture the path. Most stage inputs travel through the AR2412 stage box to the console over a single SLink cable — so a dead stage box points at SLink, not one channel."
        >
          <PhysicalRouting />
        </Frame>
      );
    case "slink":
      return (
        <Frame
          title="SLink: one cable, many channels"
          caption="SLink is the digital link between the SQ-6 and the AR2412 stage box. One shielded cable carries every stage channel to the booth and monitor mixes back — so if it fails, the whole stage box drops at once."
        >
          <SLinkDetail />
        </Frame>
      );
    case "digital-routing":
      return (
        <Frame
          title="Digital routing: inside the console"
          caption="Audio flows Input → Group → Main L/R, with AUX sends branching off for monitors and the stream. A DCA only remote-controls level and mute — no audio passes through it."
        >
          <DigitalRouting />
        </Frame>
      );
    case "outputs-map":
      return (
        <Frame
          title="Where every mix goes out"
          caption="House, hallway, and stream are separate outputs on different sockets. If the room is fine but the stream isn't, the problem is downstream of L/R."
        >
          <OutputsMap />
        </Frame>
      );
    case "signal-chain":
      return (
        <Frame
          title="Signal path: mic → house"
          caption="Every fix is easier when you can picture the path. Position the mic well first — the knobs downstream only shape what the mic already captured."
        >
          <SignalChain />
        </Frame>
      );
    case "two-destinations":
      return (
        <Frame
          title="One channel, two destinations"
          caption="A single vocal channel feeds the house (you mix it) and the ME-500 network (the singer mixes it). The two levels stay independent."
        >
          <TwoDestinations />
        </Frame>
      );
    case "pre-post-fade":
      return (
        <Frame
          title="Pre-fade vs. post-fade sends"
          caption="Monitor sends tap the signal BEFORE the fader, so house moves don't disturb the stage. Effects tap AFTER, so the wet effect follows the vocal."
        >
          <PrePostFade />
        </Frame>
      );
    case "no-sound-flow":
      return (
        <Frame
          title="'No sound' — walk the path"
          caption="Check each stage in order. The first point where the signal disappears is your problem — fix it there. Most often it's simply a mute."
        >
          <NoSoundFlow />
        </Frame>
      );
    case "patch-matrix":
      return (
        <Frame
          title="Reading the patch: FROM → TO"
          caption="Each physical input (a Local socket or an SLink input from the stage box) maps to one named channel. This is your map from a dead socket to the channel to check."
        >
          <PatchMatrix />
        </Frame>
      );

    /* ---- surface ---- */
    case "layers-stack":
      return (
        <Frame
          title="Four layers, one set of faders"
          caption="Layers are pages of faders. Press A/B/C/D and the same strips instantly become inputs, DCAs/Groups/FX, AUX sends, or vocals."
        >
          <LayersStack />
        </Frame>
      );
    case "mute-groups":
      return (
        <Frame
          title="Mute groups as the band comes in"
          caption="One SoftKey mutes or unmutes a whole family at once. RED = muted. Unmute what's in use, keep the rest muted to keep the stage clean."
        >
          <MuteGroups />
        </Frame>
      );
    case "group-vs-dca":
      return (
        <Frame
          title="Group vs. DCA"
          caption="A Group is a real audio bus — channels sum into it and it can add processing. A DCA is only a remote master for level and mute; no audio flows through it."
        >
          <GroupVsDca />
        </Frame>
      );
    case "aux-map":
      return (
        <Frame
          title="Our AUX bus map"
          caption="Not every AUX is a monitor — AUX 1 is the stream, AUX 3 is comms. Vocal monitors are no longer AUX sends: each singer mixes themselves on their ME-500."
        >
          <AuxMap />
        </Frame>
      );

    /* ---- workflow ---- */
    case "startup-sequence":
      return (
        <Frame
          title="The startup sequence, in order"
          caption="Follow this order every service. Powering up in sequence protects the gear and loads our known-good 'Singing R1' baseline."
        >
          <StepFlow
            accent={SUCCESS}
            label="Startup sequence"
            steps={[
              { t: "Breakers on", s: "left two panels — also powers lighting" },
              { t: "Key switch on", s: "wall, right of the sound board" },
              { t: "Lighting up", s: "scene 19, then raise the master" },
              { t: "Check mic batteries", s: "1 bar of 3 → change (2 AA)" },
              { t: "Recall 'Singing R1'", s: "select YES on power-up" },
              { t: "Unmute groups", s: "as rehearsal starts" },
              { t: "Unmute channels in use", s: "mute the rest" },
              { t: "Walk the auditorium", s: "listen for balanced levels" },
              { t: "Prep Pastor 2", s: "if Peter, Rob, or Jonathan preach" },
            ]}
          />
        </Frame>
      );
    case "service-timeline":
      return (
        <Frame
          title="The service-morning timeline"
          caption="Timing keeps the morning calm. Solve problems before the first song, not during it."
        >
          <ServiceTimeline />
        </Frame>
      );
    case "shutdown-sequence":
      return (
        <Frame
          title="The shutdown sequence, in order"
          caption="Shutdown reverses startup. Mics off and groups muted first prevents pops. Never overwrite the 'Singing R1' baseline."
        >
          <StepFlow
            accent={TEAL}
            label="Shutdown sequence"
            steps={[
              { t: "All mics off", s: "including the Blue announcement mic" },
              { t: "Mute all groups", s: "before switching anything off" },
              { t: "Computer audio off" },
              { t: "Lights off" },
              { t: "Breakers off" },
              { t: "System off", s: "console and stage boxes" },
              { t: "Cover on the board" },
              { t: "Key switch off" },
            ]}
          />
        </Frame>
      );
    case "scene-recall":
      return (
        <Frame
          title="Recall changes mutes, not levels"
          caption="Recalling a scene rearranges what's muted back to the baseline without yanking your carefully set fader levels around — safe to use mid-service."
        >
          <SceneRecall />
        </Frame>
      );
    case "recall-timing":
      return (
        <Frame
          title="Time the singing recall"
          caption="Recalling 'Singing R1' un-mutes the vocal mics. Call it just before the singing starts — too early leaves hot mics open on stage."
        >
          <RecallTiming />
        </Frame>
      );
    case "db-targets":
      return (
        <Frame
          title="Our loudness targets"
          caption="Music around 80 dBA, sermon around 70 dBA — comfortable and clear. Walk the room to check; the booth can sound different from the seats."
        >
          <DbTargets />
        </Frame>
      );

    /* ---- mics / color ---- */
    case "mic-colors":
      return (
        <Frame
          title="The color-coded mics"
          caption="Each color maps to a fixed channel, group, and DCA. The singer changes week to week, but 'Yellow' is always the same on the board."
        >
          <MicColors />
        </Frame>
      );
    case "mic-tuning":
      return (
        <Frame
          title="Mics are tuned by voice"
          caption="White is voiced for a male vocalist; Orange and Yellow for female voices. Match the voice to the mic tuned for it and you'll barely touch the EQ."
        >
          <MicTuning />
        </Frame>
      );
    case "color-families":
      return (
        <Frame
          title="Channel colors = families"
          caption="Every channel button is color-coded by family, so under pressure you can spot 'all the red channels' faster than reading each label."
        >
          <ColorFamilies />
        </Frame>
      );

    /* ---- processing ---- */
    case "eq-vocal":
      return (
        <Frame
          title="Typical vocal EQ curve"
          caption="HPF rolls off the lows, a gentle mid boost adds body, a small high-mid dip removes harshness, and a top-end lift adds air."
        >
          <EqChart
            color={TEAL}
            label="Vocal EQ curve"
            hpf={110}
            bands={[
              { f: 300, gain: 3, q: 0.9 },
              { f: 3000, gain: -3, q: 1.4 },
              { f: 11000, gain: 4, q: 0.8 },
            ]}
            annotations={[
              { f: 110, db: -6, text: "HPF" },
              { f: 300, db: 3, text: "body +" },
              { f: 3000, db: -3, text: "harsh −" },
              { f: 11000, db: 4, text: "air +" },
            ]}
          />
        </Frame>
      );
    case "eq-bass":
      return (
        <Frame
          title="Typical bass EQ curve"
          caption="Almost the opposite of a vocal: boost the lows for weight, cut the mids for clarity, lift the highs for definition — and no HPF."
        >
          <EqChart
            color={GOLD}
            label="Bass EQ curve"
            bands={[
              { f: 80, gain: 5, q: 0.8 },
              { f: 600, gain: -4, q: 1.1 },
              { f: 3500, gain: 3, q: 0.9 },
            ]}
            annotations={[
              { f: 80, db: 5, text: "weight +" },
              { f: 600, db: -4, text: "mud −" },
              { f: 3500, db: 3, text: "definition +" },
            ]}
          />
        </Frame>
      );
    case "comp-transfer":
      return (
        <Frame
          title="What a compressor does"
          caption="Below the threshold the signal passes untouched (1:1). Above it, every extra dB in is turned down by the ratio — evening out loud and soft."
        >
          <CompTransfer />
        </Frame>
      );
    case "comp-controls":
      return (
        <Frame
          title="Starting settings for speech"
          caption="A modest 2:1 ratio with the threshold set so it only catches louder phrases keeps a voice even without sounding processed."
        >
          <CompControls />
        </Frame>
      );
    case "comp-limiter":
      return (
        <Frame
          title="The limiter — a hard ceiling"
          caption="A limiter is a very high-ratio compressor acting as a ceiling: it stops sudden peaks from ever exceeding a set level, protecting the system."
        >
          <CompLimiter />
        </Frame>
      );
    /* ---- beginner visuals ---- */
    case "learn-loop":
      return (
        <Frame
          title="How each module works"
          caption="Read a lesson here, try the control on the real board at rehearsal, then pass the quiz (70%) to complete the module. Your dashboard tracks it all."
        >
          <LearnLoop />
        </Frame>
      );
    case "select-focus":
      return (
        <Frame
          title="SELECT = edit focus, not sound"
          caption="Pressing a channel's Select key points the touchscreen and rotaries at that channel so you can edit it. Nothing about what's heard changes — that's the faders' and mutes' job."
        >
          <SelectFocus />
        </Frame>
      );
    case "softkey-map":
      return (
        <Frame
          title="The two SoftKey blocks"
          caption="Scene keys 1–6 recall saved mute states (levels untouched); key 7 stores — rare and lead-approved. The top-right keys mute whole families at once; red = muted."
        >
          <SoftkeyMap />
        </Frame>
      );
    case "mic-assignments":
      return (
        <Frame
          title="App → mic → person → channel"
          caption="The Scheduling App says who sings and which color they get. Hand each person their color, and the board side never changes — 'Yellow' is always the same fader."
        >
          <MicAssignments />
        </Frame>
      );
    case "battery-check":
      return (
        <Frame
          title="Reading the battery bars"
          caption="Full is 3 bars. At 1 bar, change the batteries (2 AA) during setup — a mic that dies mid-song is a fully preventable problem."
        >
          <BatteryCheck />
        </Frame>
      );
    case "buzz-sources":
      return (
        <Frame
          title="Why unused channels get muted"
          caption="Some inputs — notably the electric guitar and the piano mic — hum when they're plugged in but idle. Muted, they can't reach the mix at all."
        >
          <BuzzSources />
        </Frame>
      );
    case "blue-mic-order":
      return (
        <Frame
          title="Blue mic: on first, then unmute"
          caption="Unmuting the Blue announcement mic while the mic itself is still off sends static through the house. Power it on with the red button first, then unmute at the board."
        >
          <BlueMicOrder />
        </Frame>
      );
    case "assignments-map":
      return (
        <Frame
          title="Our Group & DCA families"
          caption="Roughly how our channels are grouped — confirm exact numbers on the board. Groups add shared processing; DCAs ride level and mute for a family."
        >
          <AssignmentsMap />
        </Frame>
      );
    case "recall-vs-store":
      return (
        <Frame
          title="Recall vs. Store"
          caption="Recalling loads the scene into the board and leaves the saved baseline untouched — do it every service. Storing overwrites the scene — only ever with a lead's approval."
        >
          <RecallVsStore />
        </Frame>
      );
    case "mix-priorities":
      return (
        <Frame
          title="Moment-to-moment priorities"
          caption="Spoken word first — a silent pastor is the most noticeable mistake we can make. Then keep the lead vocal clear, then shape the band."
        >
          <MixPriorities />
        </Frame>
      );
    case "stay-present":
      return (
        <Frame
          title="Where your attention lives"
          caption="During the service your attention cycles between the platform, the run sheet, the meters, and the room. The phone isn't in the loop — personal use waits until after."
        >
          <StayPresent />
        </Frame>
      );
    case "feedback-loop":
      return (
        <Frame
          title="What feedback actually is"
          caption="A mic hearing its own speaker creates a loop that gets louder each pass — the squeal. Pull the offending channel down calmly, then fix the cause."
        >
          <FeedbackLoop />
        </Frame>
      );
    case "escalate-flow":
      return (
        <Frame
          title="Fix it or escalate it"
          caption="Quick fixes are yours. If the problem is disrupting the service — stream down, stage box dead, console misbehaving — get a lead and keep the room covered."
        >
          <EscalateFlow />
        </Frame>
      );
    default:
      return null;
  }
}

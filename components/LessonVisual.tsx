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
 *   Workflow     — "startup-sequence" | "service-timeline" | "shutdown-sequence"
 *                  | "scene-recall" | "recall-timing" | "db-targets"
 *   Mics / color — "mic-colors" | "mic-tuning" | "color-families"
 *   Processing   — "eq-vocal" | "eq-bass" | "comp-transfer" | "comp-controls"
 *                  | "comp-limiter"
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
        <text x={cx} y={y + 26} textAnchor="middle" fontSize="19">
          {emoji}
        </text>
      )}
      <text
        x={cx}
        y={hasEmoji ? y + 46 : sub ? y + h / 2 - 3 : y + h / 2 + 4}
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
          y={hasEmoji ? y + 62 : y + h / 2 + 14}
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
  const inY = (i: number) => 44 + i * 78;
  const outY = (i: number) => 28 + i * 62;

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="h-auto w-full" role="img" aria-label="CrossBridge audio system overview">
      {/* input nodes + arrows in */}
      {inputs.map((n, i) => (
        <g key={n.t}>
          <Node x={18} y={inY(i)} w={168} h={54} title={n.t} sub={n.s} emoji={n.emoji} color={TEAL2} />
          <Arrow x1={190} y1={inY(i) + 27} x2={consoleBox.x - 4} y2={consoleBox.y + 35} color={MUTED} />
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
          <Arrow x1={consoleBox.x + consoleBox.w + 4} y1={consoleBox.y + 35} x2={W - 190} y2={outY(i) + 25} color={n.color} />
          <Node x={W - 186} y={outY(i)} w={170} h={50} title={n.t} sub={n.s} emoji={n.emoji} color={n.color} />
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
  const yOf = (i: number) => 24 + i * 66;
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="h-auto w-full" role="img" aria-label="Outputs map">
      <rect x={40} y={116} width={120} height={70} rx="12" fill="rgba(216,162,60,0.14)" stroke={GOLD} strokeWidth="2.5" />
      <text x={cx - 50} y={146} textAnchor="middle" fontSize="14" fontWeight="800" fill={INK} fontFamily={FONT}>SQ-6</text>
      <text x={cx - 50} y={164} textAnchor="middle" fontSize="10" fill={MUTED} fontFamily={FONT}>mix bus</text>
      {outs.map((o, i) => (
        <g key={o.t}>
          <Arrow x1={162} y1={150} x2={300} y2={yOf(i) + 26} color={o.color} />
          <Node x={304} y={yOf(i)} w={200} h={52} title={o.t} sub={o.s} emoji={o.emoji} color={o.color} />
          <Arrow x1={508} y1={yOf(i) + 26} x2={556} y2={yOf(i) + 26} color={MUTED} />
          <text x={562} y={yOf(i) + 30} fontSize="11" fontWeight="600" fill={INK} fontFamily={FONT}>{o.d}</text>
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
            <text x={x + 58} y={y + 28} fontSize="12.5" fontWeight="700" fill={INK} fontFamily={FONT}>Layer {l.k}</text>
            <text x={x + 58} y={y + 46} fontSize="11" fill={MUTED} fontFamily={FONT}>{l.t}</text>
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
                {c.name === "Ratio" ? "2:1" : c.name === "Threshold" ? "▼" : "＋"}
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
    default:
      return null;
  }
}

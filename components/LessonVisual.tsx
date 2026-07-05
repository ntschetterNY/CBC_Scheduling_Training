/**
 * LessonVisual — SVG diagrams and charts for visual learners.
 *
 * A lesson section in curriculum.ts can set `visual: "<key>"`; ModuleRunner
 * renders the matching diagram under the lesson body. Everything is inline
 * SVG (no external assets) and uses the CrossBridge brand palette.
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
          <text x={padL - 8} y={y(db) + 4} textAnchor="end" fontSize="11" fill={MUTED} fontFamily="Helvetica Neue, system-ui, sans-serif">
            {db > 0 ? `+${db}` : db}
          </text>
        </g>
      ))}
      {/* freq gridlines */}
      {gridFreqs.map((g) => (
        <g key={g.f}>
          <line x1={x(g.f)} x2={x(g.f)} y1={padT} y2={padT + plotH} stroke={GRID} strokeWidth="1" strokeDasharray="3 4" />
          <text x={x(g.f)} y={H - padB + 18} textAnchor="middle" fontSize="11" fill={MUTED} fontFamily="Helvetica Neue, system-ui, sans-serif">
            {g.label}
          </text>
        </g>
      ))}
      <text x={W - padR} y={H - padB + 18} textAnchor="end" fontSize="10" fill={MUTED} fontFamily="Helvetica Neue, system-ui, sans-serif">
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
              fontFamily="Helvetica Neue, system-ui, sans-serif"
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
/* Signal chain                                                        */
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
              <path
                d={`M${bx - gap - 2} ${top + boxH / 2} l${gap + 2} 0`}
                stroke={MUTED}
                strokeWidth="2"
                markerEnd="url(#arrow)"
              />
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
            <text x={bx + boxW / 2} y={top + 54} textAnchor="middle" fontSize="13" fontWeight="700" fill={INK} fontFamily="Helvetica Neue, system-ui, sans-serif">
              {s.label}
            </text>
            <text x={bx + boxW / 2} y={top + 72} textAnchor="middle" fontSize="10" fill={MUTED} fontFamily="Helvetica Neue, system-ui, sans-serif">
              {s.note}
            </text>
          </g>
        );
      })}
      <defs>
        <marker id="arrow" markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto">
          <path d="M0 0 L8 4 L0 8 z" fill={MUTED} />
        </marker>
      </defs>
      <text x={W / 2} y={16} textAnchor="middle" fontSize="12" fontWeight="700" fill={GOLD} fontFamily="Helvetica Neue, system-ui, sans-serif">
        Start here — a good, close capture fixes more than any knob downstream
      </text>
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
      <text x={x0 + plot / 2} y={H - 10} textAnchor="middle" fontSize="12" fill={MUTED} fontFamily="Helvetica Neue, system-ui, sans-serif">
        Input level →
      </text>
      <text x={14} y={y0 - plot / 2} textAnchor="middle" fontSize="12" fill={MUTED} transform={`rotate(-90 14 ${y0 - plot / 2})`} fontFamily="Helvetica Neue, system-ui, sans-serif">
        Output level →
      </text>

      {/* unity 1:1 reference */}
      <line x1={X(0)} y1={Y(0)} x2={X(1)} y2={Y(1)} stroke={GRID} strokeWidth="2" strokeDasharray="4 4" />
      <text x={X(0.9)} y={Y(0.9) - 8} fontSize="10" fill={MUTED} fontFamily="Helvetica Neue, system-ui, sans-serif">
        1:1 (no comp)
      </text>

      {/* threshold guides */}
      <line x1={X(thresh)} y1={y0} x2={X(thresh)} y2={Y(out(thresh))} stroke={GOLD} strokeWidth="1.2" strokeDasharray="3 3" />
      <line x1={x0} y1={Y(out(thresh))} x2={X(thresh)} y2={Y(out(thresh))} stroke={GOLD} strokeWidth="1.2" strokeDasharray="3 3" />
      <circle cx={X(thresh)} cy={Y(out(thresh))} r="4.5" fill={GOLD} stroke="#fff" strokeWidth="1.5" />
      <text x={X(thresh) + 6} y={y0 - 6} fontSize="11" fontWeight="700" fill={GOLD} fontFamily="Helvetica Neue, system-ui, sans-serif">
        Threshold
      </text>

      {/* transfer curve */}
      <path d={curve.join(" ")} fill="none" stroke={TEAL} strokeWidth="3" strokeLinejoin="round" strokeLinecap="round" />
      <text x={X(0.98)} y={Y(out(0.98)) - 8} textAnchor="end" fontSize="11" fontWeight="700" fill={TEAL} fontFamily="Helvetica Neue, system-ui, sans-serif">
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
        <text x={24} y={16} fontSize="11" fill={MUTED} fontFamily="Helvetica Neue, system-ui, sans-serif">
          grey = raw peaks
        </text>
        <text x={W - 24} y={16} textAnchor="end" fontSize="11" fill={SUCCESS} fontFamily="Helvetica Neue, system-ui, sans-serif">
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
      <text x={W - 22} y={baseY - ceiling - 6} textAnchor="end" fontSize="11" fontWeight="700" fill={DANGER} fontFamily="Helvetica Neue, system-ui, sans-serif">
        Limiter ceiling — nothing gets past
      </text>
      {/* raw peaks (clipped area shown faint) */}
      <path d={raw.join(" ")} fill="none" stroke={MUTED} strokeWidth="1.5" opacity="0.4" />
      {/* limited signal */}
      <path d={lim.join(" ")} fill="none" stroke={TEAL} strokeWidth="2.5" />
      <text x={24} y={16} fontSize="11" fill={MUTED} fontFamily="Helvetica Neue, system-ui, sans-serif">
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
    case "signal-chain":
      return (
        <Frame
          title="Signal path: mic → house"
          caption="Every fix is easier when you can picture the path. Position the mic well first — the knobs downstream only shape what the mic already captured."
        >
          <SignalChain />
        </Frame>
      );
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

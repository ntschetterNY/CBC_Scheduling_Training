/**
 * FinanceVisual — diagrams for the Personal Finance track.
 *
 * A section in lib/finance-curriculum.ts sets `visual: "money-…"` and
 * LessonVisual delegates those keys here (ModuleRunner renders it). Everything
 * is inline SVG — no external assets — so the diagrams stay crisp at any size,
 * and each one paints its own light panel so the ink reads in dark mode too.
 *
 * Any dollar figure drawn here is ILLUSTRATIVE — a worked example with its
 * assumptions printed in the caption, not a projection or a promise. The tax
 * figures (RMD divisors) come from the IRS Uniform Lifetime Table and change;
 * verify at irs.gov before treating one as current.
 *
 * Keys:
 *   "money-seven-steps" | "money-net-worth" | "money-zero-budget"
 *   "money-snowball" | "money-credit-rules" | "money-funding-order"
 *   "money-compounding" | "money-tax-buckets" | "money-rmd-curve"
 *   "money-mortgage-payoff" | "money-insurance-map" | "money-first-90-days"
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

const FONT = "Helvetica Neue, system-ui, sans-serif";

/* ------------------------------------------------------------------ */
/* Chrome                                                              */
/* ------------------------------------------------------------------ */

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
}: {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  color?: string;
  width?: number;
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

function T({
  x,
  y,
  children,
  size = 12,
  weight = 400,
  fill = INK,
  anchor = "start",
}: {
  x: number;
  y: number;
  children: React.ReactNode;
  size?: number;
  weight?: number;
  fill?: string;
  anchor?: "start" | "middle" | "end";
}) {
  return (
    <text
      x={x}
      y={y}
      fontFamily={FONT}
      fontSize={size}
      fontWeight={weight}
      fill={fill}
      textAnchor={anchor}
    >
      {children}
    </text>
  );
}

function Panel({
  x,
  y,
  w,
  h,
  color = TEAL,
  fill = "#ffffff",
  dashed = false,
}: {
  x: number;
  y: number;
  w: number;
  h: number;
  color?: string;
  fill?: string;
  dashed?: boolean;
}) {
  return (
    <rect
      x={x}
      y={y}
      width={w}
      height={h}
      rx="8"
      fill={fill}
      stroke={color}
      strokeWidth="1.6"
      strokeDasharray={dashed ? "5 4" : undefined}
    />
  );
}

/* ------------------------------------------------------------------ */
/* 1 · The seven steps                                                 */
/* ------------------------------------------------------------------ */

const STEPS: { n: number; l1: string; l2: string }[] = [
  { n: 1, l1: "Starter fund", l2: "$1,000" },
  { n: 2, l1: "Debt snowball", l2: "not the house" },
  { n: 3, l1: "Emergency fund", l2: "3–6 months" },
  { n: 4, l1: "Invest 15%", l2: "of gross" },
  { n: 5, l1: "Kids' school", l2: "if you have kids" },
  { n: 6, l1: "Pay off house", l2: "step 6" },
  { n: 7, l1: "Wealth & give", l2: "the point" },
];

function SevenSteps() {
  const base = 300;
  const w = 96;
  const gap = 4;
  const x0 = 22;
  return (
    <Board w={740} h={370} label="The seven steps, as a staircase">
      {STEPS.map((s, i) => {
        const x = x0 + i * (w + gap);
        const top = base - 78 - i * 30;
        const defense = i < 3;
        return (
          <g key={s.n}>
            <rect
              x={x}
              y={top}
              width={w}
              height={base - top}
              rx="6"
              fill={defense ? "#ffffff" : "#fdf6e8"}
              stroke={defense ? TEAL : GOLD}
              strokeWidth="1.6"
            />
            <circle
              cx={x + w / 2}
              cy={top + 18}
              r="12"
              fill={defense ? TEAL : GOLD}
            />
            <T
              x={x + w / 2}
              y={top + 22}
              size={12}
              weight={700}
              fill="#ffffff"
              anchor="middle"
            >
              {s.n}
            </T>
            <T x={x + w / 2} y={top + 44} size={10} weight={700} anchor="middle">
              {s.l1}
            </T>
            <T
              x={x + w / 2}
              y={top + 58}
              size={9.5}
              fill={MUTED}
              anchor="middle"
            >
              {s.l2}
            </T>
          </g>
        );
      })}

      {/* baseline */}
      <line x1={x0} y1={base} x2={718} y2={base} stroke={GRID} strokeWidth="2" />

      {/* braces */}
      <line
        x1={x0}
        y1={base + 16}
        x2={x0 + 3 * w + 2 * gap}
        y2={base + 16}
        stroke={TEAL}
        strokeWidth="2.5"
      />
      <T
        x={x0 + (3 * w + 2 * gap) / 2}
        y={base + 34}
        size={12}
        weight={700}
        fill={TEAL}
        anchor="middle"
      >
        DEFENSE — get safe
      </T>
      <line
        x1={x0 + 3 * (w + gap)}
        y1={base + 16}
        x2={x0 + 7 * w + 6 * gap}
        y2={base + 16}
        stroke={GOLD}
        strokeWidth="2.5"
      />
      <T
        x={x0 + 3 * (w + gap) + (4 * w + 3 * gap) / 2}
        y={base + 34}
        size={12}
        weight={700}
        fill="#a97a22"
        anchor="middle"
      >
        OFFENSE — build & give
      </T>

      <T x={x0} y={base + 58} size={11} fill={MUTED}>
        One step at a time, in order, with intensity. The budget runs underneath all
        seven, forever.
      </T>
    </Board>
  );
}

/* ------------------------------------------------------------------ */
/* 2 · Net worth                                                       */
/* ------------------------------------------------------------------ */

const OWN = [
  "Cash in checking & savings",
  "Retirement accounts",
  "Other investments",
  "House — honest resale value",
  "Cars — what they'd sell for",
];
const OWE = [
  "Mortgage & home equity line",
  "Car loans and leases",
  "Student loans",
  "Credit cards, medical, BNPL",
  "Personal & family loans, back taxes",
];

function NetWorth() {
  return (
    <Board w={740} h={330} label="Net worth: what you own minus what you owe">
      <Panel x={22} y={20} w={310} h={200} color={SUCCESS} />
      <T x={38} y={44} size={12} weight={700} fill={SUCCESS}>
        WHAT YOU OWN — assets
      </T>
      {OWN.map((t, i) => (
        <g key={t}>
          <circle cx={42} cy={68 + i * 26} r="3.5" fill={SUCCESS} />
          <T x={54} y={72 + i * 26} size={11.5}>
            {t}
          </T>
        </g>
      ))}

      <T x={370} y={130} size={34} weight={700} fill={MUTED} anchor="middle">
        −
      </T>

      <Panel x={408} y={20} w={310} h={200} color={DANGER} />
      <T x={424} y={44} size={12} weight={700} fill={DANGER}>
        WHAT YOU OWE — liabilities
      </T>
      {OWE.map((t, i) => (
        <g key={t}>
          <circle cx={428} cy={68 + i * 26} r="3.5" fill={DANGER} />
          <T x={440} y={72 + i * 26} size={11.5}>
            {t}
          </T>
        </g>
      ))}

      <Arrow x1={177} y1={224} x2={330} y2={258} color={GRID} width={2} />
      <Arrow x1={563} y1={224} x2={410} y2={258} color={GRID} width={2} />

      <Panel x={190} y={258} w={360} h={52} color={TEAL} fill="#ffffff" />
      <T x={370} y={282} size={14} weight={700} fill={TEAL} anchor="middle">
        = NET WORTH
      </T>
      <T x={370} y={299} size={10.5} fill={MUTED} anchor="middle">
        Write down the date. Redo it the same day every month.
      </T>
    </Board>
  );
}

/* ------------------------------------------------------------------ */
/* 3 · Zero-based budget                                               */
/* ------------------------------------------------------------------ */

const BUDGET_ROWS: { n: number; label: string; note: string; c: string }[] = [
  { n: 1, label: "Giving", note: "first, off the top", c: GOLD },
  { n: 2, label: "Saving", note: "whatever this step calls for", c: SUCCESS },
  {
    n: 3,
    label: "The Four Walls",
    note: "food · utilities · shelter · transportation",
    c: TEAL,
  },
  { n: 4, label: "Insurance & necessities", note: "premiums, meds, childcare", c: TEAL2 },
  { n: 5, label: "Debt minimums", note: "every minimum on the list", c: DANGER },
  { n: 6, label: "Everything else", note: "restaurants, subs, fun, gifts", c: MUTED },
  { n: 7, label: "The extra", note: "→ straight at your current step", c: BLUE },
];

function ZeroBudget() {
  return (
    <Board w={740} h={410} label="Zero-based budget: the order categories get funded">
      <Panel x={22} y={18} w={200} h={64} color={TEAL} fill="#ffffff" />
      <T x={122} y={44} size={12.5} weight={700} anchor="middle">
        MONTH&rsquo;S INCOME
      </T>
      <T x={122} y={62} size={10.5} fill={MUTED} anchor="middle">
        every dollar you expect
      </T>
      <Arrow x1={222} y1={50} x2={268} y2={50} color={TEAL} />

      {BUDGET_ROWS.map((r, i) => {
        const y = 18 + i * 47;
        return (
          <g key={r.n}>
            <rect
              x={286}
              y={y}
              width={430}
              height={38}
              rx="7"
              fill="#ffffff"
              stroke={r.c}
              strokeWidth="1.6"
            />
            <circle cx={308} cy={y + 19} r="11" fill={r.c} />
            <T
              x={308}
              y={y + 23}
              size={11}
              weight={700}
              fill="#ffffff"
              anchor="middle"
            >
              {r.n}
            </T>
            <T x={328} y={y + 17} size={12} weight={700}>
              {r.label}
            </T>
            <T x={328} y={y + 31} size={10.5} fill={MUTED}>
              {r.note}
            </T>
          </g>
        );
      })}

      <line
        x1={272}
        y1={30}
        x2={272}
        y2={330}
        stroke={GRID}
        strokeWidth="2"
        strokeDasharray="5 4"
      />

      <Panel x={22} y={264} w={200} h={84} color={SUCCESS} fill="#ffffff" dashed />
      <T x={122} y={292} size={13} weight={700} fill={SUCCESS} anchor="middle">
        LEFT OVER: $0
      </T>
      <T x={122} y={310} size={10} fill={MUTED} anchor="middle">
        Not &ldquo;spent it all&rdquo; —
      </T>
      <T x={122} y={325} size={10} fill={MUTED} anchor="middle">
        every dollar has a job.
      </T>

      <T x={22} y={382} size={11} fill={MUTED}>
        Written together, before the first of the month. A budget written on the 14th is
        a report card, not a plan.
      </T>
    </Board>
  );
}

/* ------------------------------------------------------------------ */
/* 4 · The debt snowball                                               */
/* ------------------------------------------------------------------ */

const SNOW = [
  { name: "Store card", bal: "$500", min: 25, pay: 325 },
  { name: "Medical bill", bal: "$1,800", min: 45, pay: 370 },
  { name: "Car loan", bal: "$6,400", min: 120, pay: 490 },
  { name: "Student loan", bal: "$14,000", min: 220, pay: 710 },
];

function Snowball() {
  const scale = 0.62; // px per dollar of payment
  return (
    <Board w={740} h={370} label="The debt snowball: payments roll forward as debts die">
      <T x={22} y={28} size={12} weight={700}>
        SORTED SMALLEST BALANCE → LARGEST
      </T>
      <T x={480} y={28} size={11} fill={MUTED}>
        monthly attack payment
      </T>

      {SNOW.map((d, i) => {
        const y = 46 + i * 68;
        const barW = d.pay * scale;
        return (
          <g key={d.name}>
            <Panel x={22} y={y} w={190} h={50} color={i === 0 ? DANGER : GRID} />
            <T x={36} y={y + 21} size={12} weight={700}>
              {d.name}
            </T>
            <T x={36} y={y + 38} size={11} fill={MUTED}>
              {d.bal} · min ${d.min}
            </T>

            <Arrow x1={218} y1={y + 25} x2={246} y2={y + 25} color={GRID} />

            <rect
              x={252}
              y={y + 10}
              width={barW}
              height={30}
              rx="6"
              fill={i === 0 ? "#fdf6e8" : "#ffffff"}
              stroke={GOLD}
              strokeWidth="1.8"
            />
            <T x={264} y={y + 30} size={12} weight={700} fill="#8f6714">
              ${d.pay}/mo
            </T>
            {i > 0 && (
              <T x={264} y={y + 54} size={10} fill={MUTED}>
                ${d.min} minimum + ${SNOW[i - 1].pay} rolled forward from the debt
                above
              </T>
            )}
            {i < SNOW.length - 1 && (
              <Arrow
                x1={252 + barW}
                y1={y + 40}
                x2={252 + SNOW[i + 1].pay * scale - 10}
                y2={y + 78}
                color={GOLD}
                width={1.8}
              />
            )}
          </g>
        );
      })}

      <T x={22} y={330} size={11} fill={MUTED}>
        Minimums on everything, every extra dollar at the smallest — then its whole
      </T>
      <T x={22} y={346} size={11} fill={MUTED}>
        payment rolls onto the next. The last debt gets hit hardest.
      </T>
    </Board>
  );
}

/* ------------------------------------------------------------------ */
/* 5 · Credit, treated as cash                                         */
/* ------------------------------------------------------------------ */

const CREDIT_RULES = [
  ["The money is already there", "in checking, and already budgeted"],
  ["Paid in full, every month", "statement balance, on autopay"],
  ["One card", "not five, not a store card at every till"],
  ["Reconciled inside the budget", "every charge categorized that week"],
  ["One miss and it is over", "agreed while things are calm"],
];

function CreditRules() {
  return (
    <Board w={740} h={340} label="The five house rules for using a credit card">
      {/* the card */}
      <rect x={26} y={30} width={210} height={132} rx="12" fill={TEAL} />
      <rect x={26} y={62} width={210} height={22} fill={TEAL2} />
      <rect x={44} y={100} width={40} height={28} rx="4" fill={GOLD} />
      <T x={44} y={150} size={11} fill="#dfe8ea">
        TREAT IT AS CASH
      </T>
      <T x={44} y={50} size={11} weight={700} fill="#ffffff">
        A PAYMENT METHOD
      </T>

      <Panel x={26} y={176} w={210} h={62} color={DANGER} fill="#fdeeed" />
      <T x={131} y={198} size={11.5} weight={700} fill={DANGER} anchor="middle">
        NOT A SOURCE OF FUNDS
      </T>
      <T x={131} y={216} size={10} fill={MUTED} anchor="middle">
        If the dollars aren&rsquo;t in the bank,
      </T>
      <T x={131} y={230} size={10} fill={MUTED} anchor="middle">
        the purchase doesn&rsquo;t happen.
      </T>

      {CREDIT_RULES.map(([title, sub], i) => {
        const y = 26 + i * 48;
        return (
          <g key={title}>
            <circle cx={278} cy={y + 18} r="13" fill={TEAL} />
            <T
              x={278}
              y={y + 22}
              size={12}
              weight={700}
              fill="#ffffff"
              anchor="middle"
            >
              {i + 1}
            </T>
            <T x={302} y={y + 15} size={12.5} weight={700}>
              {title}
            </T>
            <T x={302} y={y + 31} size={11} fill={MUTED}>
              {sub}
            </T>
            {i < CREDIT_RULES.length - 1 && (
              <line
                x1={302}
                y1={y + 40}
                x2={714}
                y2={y + 40}
                stroke={GRID}
                strokeWidth="1"
              />
            )}
          </g>
        );
      })}

      <Panel x={278} y={276} w={436} h={44} color={DANGER} fill="#fdeeed" />
      <T x={296} y={295} size={11.5} weight={700} fill={DANGER}>
        Carry a balance one single month →
      </T>
      <T x={296} y={311} size={11} fill={INK}>
        the card is closed and cut up. No exceptions but a fraud dispute.
      </T>
    </Board>
  );
}

/* ------------------------------------------------------------------ */
/* 6 · Funding order                                                   */
/* ------------------------------------------------------------------ */

const FUNDING = [
  { n: 1, t: "Employer match", s: "the full match — instant, guaranteed" },
  { n: 2, t: "HSA", s: "if eligible — triple tax advantage" },
  { n: 3, t: "IRA — Roth &/or traditional", s: "you pick the funds, keep costs low" },
  { n: 4, t: "Back to the workplace plan", s: "until you hit 15% of gross" },
  { n: 5, t: "Taxable brokerage", s: "anything beyond that" },
];

function FundingOrder() {
  return (
    <Board w={740} h={330} label="The order retirement accounts get funded">
      {FUNDING.map((f, i) => {
        const y = 22 + i * 54;
        const gold = i < 2;
        return (
          <g key={f.n}>
            <rect
              x={22}
              y={y}
              width={694}
              height={44}
              rx="8"
              fill={gold ? "#fdf6e8" : "#ffffff"}
              stroke={gold ? GOLD : TEAL}
              strokeWidth="1.6"
            />
            <circle cx={48} cy={y + 22} r="14" fill={gold ? GOLD : TEAL} />
            <T
              x={48}
              y={y + 27}
              size={13}
              weight={700}
              fill="#ffffff"
              anchor="middle"
            >
              {f.n}
            </T>
            <T x={76} y={y + 20} size={13} weight={700}>
              {f.t}
            </T>
            <T x={76} y={y + 36} size={11} fill={MUTED}>
              {f.s}
            </T>
            {i < FUNDING.length - 1 && (
              <Arrow x1={370} y1={y + 44} x2={370} y2={y + 54} color={GRID} width={2} />
            )}
          </g>
        );
      })}
      <T x={22} y={310} size={11} fill={MUTED}>
        Stop when your own contributions reach 15% of gross. The match is a bonus on
        top — it does not count toward your 15%.
      </T>
    </Board>
  );
}

/* ------------------------------------------------------------------ */
/* 7 · Compounding                                                     */
/* ------------------------------------------------------------------ */

/** Future value of $`monthly` invested each month for `years` at `rate`/yr. */
function fv(monthly: number, years: number, rate = 0.08) {
  const r = rate / 12;
  const n = years * 12;
  return monthly * ((Math.pow(1 + r, n) - 1) / r);
}

function Compounding() {
  const x0 = 62;
  const x1 = 700;
  const yTop = 34;
  const yBase = 268;
  const maxV = fv(500, 40);
  const px = (age: number) => x0 + ((age - 25) / 40) * (x1 - x0);
  const py = (v: number) => yBase - (v / maxV) * (yBase - yTop);
  const line = (startAge: number) => {
    const pts: string[] = [];
    for (let age = startAge; age <= 65; age += 1) {
      pts.push(`${px(age).toFixed(1)},${py(fv(500, age - startAge)).toFixed(1)}`);
    }
    return pts.join(" ");
  };

  return (
    <Board w={740} h={330} label="Two investors, same monthly amount, ten years apart">
      {/* axes */}
      <line x1={x0} y1={yBase} x2={x1} y2={yBase} stroke={MUTED} strokeWidth="1.6" />
      <line x1={x0} y1={yTop} x2={x0} y2={yBase} stroke={MUTED} strokeWidth="1.6" />
      {[25, 35, 45, 55, 65].map((a) => (
        <g key={a}>
          <line
            x1={px(a)}
            y1={yTop}
            x2={px(a)}
            y2={yBase}
            stroke={GRID}
            strokeWidth="1"
          />
          <T x={px(a)} y={yBase + 18} size={11} fill={MUTED} anchor="middle">
            age {a}
          </T>
        </g>
      ))}
      {[500000, 1000000, 1500000].map((v) => (
        <g key={v}>
          <line x1={x0} y1={py(v)} x2={x1} y2={py(v)} stroke={GRID} strokeWidth="1" />
          <T x={x0 - 8} y={py(v) + 4} size={10} fill={MUTED} anchor="end">
            ${v / 1000}k
          </T>
        </g>
      ))}

      <polyline points={line(25)} fill="none" stroke={GOLD} strokeWidth="3" />
      <polyline points={line(35)} fill="none" stroke={BLUE} strokeWidth="3" />

      <circle cx={px(65)} cy={py(fv(500, 40))} r="5" fill={GOLD} />
      <circle cx={px(65)} cy={py(fv(500, 30))} r="5" fill={BLUE} />

      <T x={px(65) - 8} y={py(fv(500, 40)) - 12} size={12} weight={700} fill="#8f6714" anchor="end">
        started at 25 · ≈ $1.75M
      </T>
      <T x={px(65) - 8} y={py(fv(500, 30)) - 12} size={12} weight={700} fill={BLUE} anchor="end">
        started at 35 · ≈ $745k
      </T>

      <T x={22} y={22} size={11.5} weight={700}>
        $500 a month, 8% average annual return, both stop at 65
      </T>
      <T x={22} y={306} size={11} fill={MUTED}>
        The late starter contributes $60,000 less and finishes with about $1 million
        less. The variable that did the work was time, not skill.
      </T>
    </Board>
  );
}

/* ------------------------------------------------------------------ */
/* 8 · The three tax buckets                                           */
/* ------------------------------------------------------------------ */

const BUCKETS = [
  {
    name: "TAX-DEFERRED",
    sub: "traditional 401(k) / IRA",
    color: BLUE,
    rows: ["In: deducted now", "Growth: untaxed", "Out: ordinary income", "RMDs: YES, at 73"],
  },
  {
    name: "TAX-FREE",
    sub: "Roth 401(k) / Roth IRA",
    color: SUCCESS,
    rows: ["In: taxed now", "Growth: untaxed", "Out: untaxed", "RMDs: none for you"],
  },
  {
    name: "TAXABLE",
    sub: "brokerage account",
    color: GOLD,
    rows: [
      "In: after tax",
      "Growth: dividends taxed",
      "Out: capital gains rates",
      "RMDs: none",
    ],
  },
];

function TaxBuckets() {
  return (
    <Board w={740} h={350} label="The three tax buckets and how each is taxed">
      {BUCKETS.map((b, i) => {
        const x = 22 + i * 236;
        return (
          <g key={b.name}>
            <rect
              x={x}
              y={26}
              width={220}
              height={210}
              rx="9"
              fill="#ffffff"
              stroke={b.color}
              strokeWidth="1.8"
            />
            <rect x={x} y={26} width={220} height={40} rx="9" fill={b.color} />
            <rect x={x} y={54} width={220} height={12} fill={b.color} />
            <T x={x + 110} y={45} size={12.5} weight={700} fill="#ffffff" anchor="middle">
              {b.name}
            </T>
            <T x={x + 110} y={61} size={10} fill="#eef4f5" anchor="middle">
              {b.sub}
            </T>
            {b.rows.map((r, j) => (
              <g key={r}>
                <T x={x + 16} y={94 + j * 34} size={11.5}>
                  {r}
                </T>
                {j < b.rows.length - 1 && (
                  <line
                    x1={x + 16}
                    y1={104 + j * 34}
                    x2={x + 204}
                    y2={104 + j * 34}
                    stroke={GRID}
                    strokeWidth="1"
                  />
                )}
              </g>
            ))}
          </g>
        );
      })}

      <Panel x={22} y={252} w={694} h={76} color={TEAL} fill={SURFACE} />
      <T x={40} y={274} size={12} weight={700} fill={TEAL}>
        Own some of each — that is the dial.
      </T>
      <T x={40} y={294} size={11} fill={INK}>
        In retirement, take traditional dollars up to the top of a low bracket, then
      </T>
      <T x={40} y={312} size={11} fill={INK}>
        Roth for anything more. One bucket gives you no choices; two give you a lever.
      </T>
    </Board>
  );
}

/* ------------------------------------------------------------------ */
/* 9 · RMDs rise with age                                              */
/* ------------------------------------------------------------------ */

const RMD = [
  { age: 73, div: 26.5 },
  { age: 80, div: 20.2 },
  { age: 85, div: 16.0 },
  { age: 90, div: 12.2 },
  { age: 95, div: 8.9 },
];

function RmdCurve() {
  const yBase = 250;
  const maxPct = 12;
  const barW = 74;
  return (
    <Board w={740} h={344} label="Required minimum distributions rise with age">
      <T x={22} y={26} size={11.5} weight={700}>
        Forced, taxable withdrawal each year — on a $1,000,000 traditional balance
      </T>

      <line x1={60} y1={yBase} x2={716} y2={yBase} stroke={MUTED} strokeWidth="1.6" />
      {RMD.map((r, i) => {
        const pct = (100 / r.div);
        const h = (pct / maxPct) * (yBase - 70);
        const x = 96 + i * 122;
        return (
          <g key={r.age}>
            <rect
              x={x}
              y={yBase - h}
              width={barW}
              height={h}
              rx="6"
              fill={i > 2 ? "#f6e2e0" : "#e8eef0"}
              stroke={i > 2 ? DANGER : TEAL}
              strokeWidth="1.6"
            />
            <T
              x={x + barW / 2}
              y={yBase - h - 22}
              size={12}
              weight={700}
              fill={i > 2 ? DANGER : TEAL}
              anchor="middle"
            >
              {pct.toFixed(1)}%
            </T>
            <T
              x={x + barW / 2}
              y={yBase - h - 8}
              size={10.5}
              fill={MUTED}
              anchor="middle"
            >
              ≈ ${Math.round(pct * 10).toLocaleString()}k
            </T>
            <T x={x + barW / 2} y={yBase + 18} size={11.5} weight={700} anchor="middle">
              age {r.age}
            </T>
          </g>
        );
      })}

      <T x={22} y={286} size={11} fill={MUTED}>
        Whether you need the money or not — and it lands on top of Social Security,
      </T>
      <T x={22} y={302} size={11} fill={MUTED}>
        pushing brackets, Medicare (IRMAA) premiums, and the taxable share of the benefit.
      </T>
      <T x={22} y={324} size={11} fill={MUTED}>
        Roth balances have no RMD for the owner. That is what the second bucket buys you.
      </T>
    </Board>
  );
}

/* ------------------------------------------------------------------ */
/* 10 · Mortgage payoff                                                */
/* ------------------------------------------------------------------ */

const MORT = [
  { label: "30-year", sub: "$1,896/mo · 30 yrs", interest: 383, color: DANGER },
  { label: "30-year + $300", sub: "$2,196/mo · ~20.8 yrs", interest: 248, color: GOLD },
  { label: "15-year", sub: "$2,613/mo · 15 yrs", interest: 170, color: SUCCESS },
];

function MortgagePayoff() {
  const x0 = 210;
  const maxW = 470;
  return (
    <Board w={740} h={312} label="Interest paid on a $300,000 mortgage at 6.5%">
      <T x={22} y={28} size={12} weight={700}>
        TOTAL INTEREST PAID — $300,000 borrowed at 6.5%
      </T>

      {MORT.map((m, i) => {
        const y = 56 + i * 66;
        const w = (m.interest / 383) * maxW;
        return (
          <g key={m.label}>
            <T x={22} y={y + 22} size={12.5} weight={700}>
              {m.label}
            </T>
            <T x={22} y={y + 38} size={10.5} fill={MUTED}>
              {m.sub}
            </T>
            <rect
              x={x0}
              y={y + 6}
              width={w}
              height={36}
              rx="6"
              fill="#ffffff"
              stroke={m.color}
              strokeWidth="1.8"
            />
            <rect x={x0} y={y + 6} width={w} height={36} rx="6" fill={m.color} opacity="0.13" />
            <T x={x0 + 14} y={y + 30} size={13} weight={700} fill={m.color}>
              ${m.interest},000
            </T>
            {i > 0 && (
              <T x={x0 + w + 12} y={y + 30} size={11} fill={SUCCESS}>
                saves ${383 - m.interest},000
              </T>
            )}
          </g>
        );
      })}

      <T x={22} y={272} size={11} fill={MUTED}>
        Mortgages front-load interest, so early principal counts most — and extra money
      </T>
      <T x={22} y={288} size={11} fill={MUTED}>
        has to be designated principal-only, then verified on the next statement.
      </T>
    </Board>
  );
}

/* ------------------------------------------------------------------ */
/* 11 · Insurance map                                                  */
/* ------------------------------------------------------------------ */

const CARRY = [
  "Health",
  "Auto — liability well above state minimums",
  "Home or renter's",
  "Term life — 10–12× income",
  "Long-term disability — 60–70%",
  "Umbrella liability — $1–2M",
  "Long-term care — from about 60",
];
const SKIP = [
  "Whole / universal life as an investment",
  "Credit life & mortgage life",
  "Extended warranties, appliance plans",
  "Cancer & other disease-specific policies",
  "Child life insurance as a college fund",
  "Rental-car counter coverage (usually)",
  "Commission annuities with surrender charges",
];

function InsuranceMap() {
  return (
    <Board w={740} h={380} label="Insurance to carry versus insurance to skip">
      <Panel x={22} y={54} w={340} h={296} color={SUCCESS} />
      <rect x={22} y={54} width={340} height={34} rx="8" fill={SUCCESS} />
      <T x={192} y={76} size={12.5} weight={700} fill="#ffffff" anchor="middle">
        CARRY — it would ruin you
      </T>
      {CARRY.map((t, i) => (
        <g key={t}>
          <T x={42} y={116 + i * 32} size={13} weight={700} fill={SUCCESS}>
            ✓
          </T>
          <T x={62} y={116 + i * 32} size={11.5}>
            {t}
          </T>
        </g>
      ))}

      <Panel x={378} y={54} w={340} h={296} color={DANGER} />
      <rect x={378} y={54} width={340} height={34} rx="8" fill={DANGER} />
      <T x={548} y={76} size={12.5} weight={700} fill="#ffffff" anchor="middle">
        SKIP — you can absorb it
      </T>
      {SKIP.map((t, i) => (
        <g key={t}>
          <T x={398} y={116 + i * 32} size={13} weight={700} fill={DANGER}>
            ✕
          </T>
          <T x={418} y={116 + i * 32} size={11.5}>
            {t}
          </T>
        </g>
      ))}

      <T x={370} y={30} size={12} weight={700} fill={TEAL} anchor="middle">
        THE TEST: could this loss ruin us, or only annoy us?
      </T>
    </Board>
  );
}

/* ------------------------------------------------------------------ */
/* 12 · The first ninety days                                          */
/* ------------------------------------------------------------------ */

const NINETY = [
  { t: "Week 1", s: "Net worth, debt list, 90 days of spending. Freeze credit." },
  { t: "Week 2", s: "Write next month's budget together. Set up sinking funds." },
  { t: "Week 3", s: "Sprint at the starter fund — list five things to sell." },
  { t: "Week 4", s: "Check beneficiaries. Re-quote insurance. Book the meeting." },
  { t: "Month 2", s: "Work the step hard. Second budget. Tell a friend." },
  { t: "Month 3", s: "Third budget. Compare to month one. Set the next 90 days." },
];

function FirstNinety() {
  const y = 108;
  const x0 = 82;
  const gap = 115;
  return (
    <Board w={740} h={266} label="The first ninety days, week by week">
      <line x1={x0} y1={y} x2={x0 + 5 * gap} y2={y} stroke={GRID} strokeWidth="3" />
      {NINETY.map((n, i) => {
        const cx = x0 + i * gap;
        const up = i % 2 === 0;
        return (
          <g key={n.t}>
            <circle cx={cx} cy={y} r="10" fill={i < 4 ? TEAL : GOLD} />
            <T x={cx} y={y + 4} size={10} weight={700} fill="#ffffff" anchor="middle">
              {i + 1}
            </T>
            <T
              x={cx}
              y={up ? y - 62 : y + 44}
              size={12}
              weight={700}
              anchor="middle"
              fill={i < 4 ? TEAL : "#8f6714"}
            >
              {n.t}
            </T>
            <foreignObject
              x={cx - 56}
              y={up ? y - 56 : y + 50}
              width={112}
              height={50}
            >
              <div
                style={{
                  fontFamily: FONT,
                  fontSize: "9.5px",
                  lineHeight: 1.25,
                  color: MUTED,
                  textAlign: "center",
                }}
              >
                {n.s}
              </div>
            </foreignObject>
          </g>
        );
      })}
      <T x={22} y={246} size={11} fill={MUTED}>
        Then set the next ninety-day target and repeat. This is not a course you finish —
        it is how the household runs.
      </T>
    </Board>
  );
}

/* ------------------------------------------------------------------ */
/* Dispatch                                                            */
/* ------------------------------------------------------------------ */

export function FinanceVisual({ name }: { name: string }) {
  switch (name) {
    case "money-seven-steps":
      return (
        <Frame
          title="The seven steps"
          caption="Steps 1–3 make you safe; steps 4–7 build something. Work them one at a time, in order — and run the budget underneath all of them, always."
        >
          <SevenSteps />
        </Frame>
      );
    case "money-net-worth":
      return (
        <Frame
          title="Net worth — one subtraction"
          caption="Use honest resale values, not what you paid. A negative number that is getting less negative every month is a household that is winning."
        >
          <NetWorth />
        </Frame>
      );
    case "money-zero-budget":
      return (
        <Frame
          title="The zero-based budget, in funding order"
          caption="The order does real work: when the month comes up short, the cuts land at the bottom of the list instead of the top."
        >
          <ZeroBudget />
        </Frame>
      );
    case "money-snowball":
      return (
        <Frame
          title="The debt snowball"
          caption="Illustrative debts. Each payoff frees its whole payment onto the next debt, so the payment grows from $325 to $710 without your income changing at all."
        >
          <Snowball />
        </Frame>
      );
    case "money-credit-rules":
      return (
        <Frame
          title="If you use credit, treat it as cash"
          caption="This is where we depart from the plan we are modeled on — a narrow exception with teeth. If you cannot honestly sign all five rules, use a debit card instead."
        >
          <CreditRules />
        </Frame>
      );
    case "money-funding-order":
      return (
        <Frame
          title="The funding order for step 4"
          caption="If your workplace plan has excellent low-cost funds, 4 can come before 3. Everything else about the order holds."
        >
          <FundingOrder />
        </Frame>
      );
    case "money-compounding":
      return (
        <Frame
          title="Time is the ingredient you cannot buy later"
          caption="Illustrative: $500/month at a steady 8% annual return, compounded monthly. Real markets do not return a smooth 8% — this shows the shape of compounding, not a forecast."
        >
          <Compounding />
        </Frame>
      );
    case "money-tax-buckets":
      return (
        <Frame
          title="The three tax buckets"
          caption="Current rules for the 2026 tax year — RMD age and account rules change. Verify at irs.gov, and take conversions to a CPA."
        >
          <TaxBuckets />
        </Frame>
      );
    case "money-rmd-curve":
      return (
        <Frame
          title="Why a large traditional balance becomes a problem"
          caption="Percentages derived from the IRS Uniform Lifetime Table divisors (26.5 at 73, 20.2 at 80, 16.0 at 85, 12.2 at 90, 8.9 at 95). RMDs begin at 73, rising to 75 in 2033 — verify the current table at irs.gov."
        >
          <RmdCurve />
        </Frame>
      );
    case "money-mortgage-payoff":
      return (
        <Frame
          title="What the term and a little extra are worth"
          caption="Illustrative only: $300,000 at 6.5% fixed, same rate across all three for comparison. In practice a 15-year loan usually carries a lower rate, which widens the gap further."
        >
          <MortgagePayoff />
        </Frame>
      );
    case "money-insurance-map":
      return (
        <Frame
          title="Carry it or skip it"
          caption="A funded emergency fund moves items from the left column to the right — which is why step 3 lowers your premiums permanently."
        >
          <InsuranceMap />
        </Frame>
      );
    case "money-first-90-days":
      return (
        <Frame
          title="The first ninety days"
          caption="Week six is where most plans die — which is exactly why the smallest debt goes first and the scoreboard goes on the fridge."
        >
          <FirstNinety />
        </Frame>
      );
    default:
      return null;
  }
}

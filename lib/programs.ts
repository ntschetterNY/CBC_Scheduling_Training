/**
 * CrossBridge Training Center — the list of volunteer training programs shown
 * on the public home page (app/page.tsx).
 *
 * Only "Sound Tech Training" is live today; it links into the existing SQ-6
 * curriculum under /learn. The rest are placeholders that render as
 * "Coming soon" / "In progress" cards until their curriculum is built. To add
 * a real program later: build its lessons, then flip `status` to "available"
 * and point `href` at its entry route.
 */

export type ProgramStatus = "available" | "in_progress" | "coming_soon";

export type Program = {
  slug: string;
  name: string;
  /** Small category label shown above the name (the eyebrow). */
  category: string;
  /** Emoji glyph for the card tile. */
  icon: string;
  description: string;
  status: ProgramStatus;
  /**
   * Where the card links when the program is available. For "sound-tech" this
   * is resolved at render time to the dashboard (signed in) or login, so it is
   * intentionally left undefined here.
   */
  href?: string;
};

export const programs: Program[] = [
  {
    slug: "sound-tech",
    name: "Sound Tech Training",
    category: "Tech · Booth",
    icon: "🎚️",
    description:
      "Go from your first look at the Allen & Heath SQ-6 to confidently mixing a Sunday service — interactive lessons, a clickable board explorer, and quizzes.",
    status: "available",
  },
  {
    slug: "physical-security",
    name: "Physical Security",
    category: "Safety Team",
    icon: "🛡️",
    description:
      "Situational awareness, access control, de-escalation, and emergency response for the CrossBridge safety team — so every gathering stays safe and welcoming.",
    status: "coming_soon",
  },
  {
    slug: "bible-teaching",
    name: "Bible Teaching",
    category: "Teaching Team",
    icon: "📖",
    description:
      "Sound handling of Scripture, lesson prep, and delivery for those who teach — small groups, kids, and the main platform.",
    status: "coming_soon",
  },
  {
    slug: "sound-tech-it",
    name: "Sound-Tech IT",
    category: "Tech · Systems",
    icon: "🖥️",
    description:
      "The systems behind the booth — networking, ProPresenter, streaming, Dante/AVB routing, and troubleshooting when something goes quiet mid-service.",
    status: "in_progress",
  },
  {
    slug: "hospitality",
    name: "Hospitality & Greeters",
    category: "First Impressions",
    icon: "🤝",
    description:
      "The welcome that sets the tone — greeting, wayfinding, and caring for guests from the parking lot to their seat.",
    status: "coming_soon",
  },
  {
    slug: "kids-ministry",
    name: "Kids Ministry",
    category: "CrossBridge Kids",
    icon: "🧒",
    description:
      "Check-in and safety policy, classroom leadership, and age-appropriate teaching for the volunteers who serve our youngest.",
    status: "coming_soon",
  },
];

export const STATUS_LABEL: Record<ProgramStatus, string> = {
  available: "Available",
  in_progress: "In progress",
  coming_soon: "Coming soon",
};

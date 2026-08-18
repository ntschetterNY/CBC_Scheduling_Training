import type { Config } from "tailwindcss";

/** Brand tokens resolve through CSS variables (see globals.css) so the whole
 *  palette can flip for dark mode while keeping alpha modifiers working. */
const v = (name: string) => `rgb(var(--brand-${name}) / <alpha-value>)`;

const config: Config = {
  darkMode: "class",
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // CrossBridge Church brand — light, elegant, teal + gold
        brand: {
          bg: v("bg"), // page background
          surface: v("surface"), // light gray section band
          card: v("card"), // cards sit on the page with a soft border
          border: v("border"), // hairline borders
          muted: v("muted"), // secondary text
          text: v("text"), // primary ink
          accent: v("accent"), // goldenrod accent
          accentDark: v("accent-dark"), // deeper gold for links/hover
          accent2: v("accent2"), // supporting teal
          teal: v("teal"), // primary deep teal (footer / hero)
          tealDark: v("teal-dark"), // deepest teal
          tealLight: v("teal-light"), // lighter teal band
          success: v("success"),
          danger: v("danger"),
        },
      },
      fontFamily: {
        // Light humanist sans for headings/display
        sans: ["var(--font-display)", "Helvetica Neue", "Segoe UI", "system-ui", "sans-serif"],
        // Readable serif for body copy — the CrossBridge pairing
        serif: ["var(--font-body)", "Georgia", "Times New Roman", "serif"],
      },
      boxShadow: {
        card: "0 1px 2px rgba(22, 62, 74, 0.04), 0 8px 24px rgba(22, 62, 74, 0.06)",
      },
    },
  },
  plugins: [],
};

export default config;

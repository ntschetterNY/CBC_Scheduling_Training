import type { Config } from "tailwindcss";

const config: Config = {
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
          bg: "#ffffff", // page background
          surface: "#eef0ef", // light gray section band
          card: "#ffffff", // cards sit on white with a soft border
          border: "#e2e5e4", // hairline borders
          muted: "#5d6b70", // secondary text
          text: "#232b2e", // primary ink
          accent: "#d8a23c", // goldenrod accent
          accentDark: "#b98a2c", // deeper gold for links/hover
          accent2: "#2c6373", // supporting teal
          teal: "#1e5162", // primary deep teal (footer / hero)
          tealDark: "#163e4a", // deepest teal
          tealLight: "#2f6a7b", // lighter teal band
          success: "#3d8b6b",
          danger: "#bf4640",
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

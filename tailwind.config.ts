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
        // CrossBridge palette — deep slate with an amber "signal" accent
        brand: {
          bg: "#0b1120",
          surface: "#111a2e",
          card: "#16223c",
          border: "#243350",
          muted: "#8ea0c0",
          text: "#e6edf7",
          accent: "#f5a623",
          accent2: "#37c8c3",
          success: "#3ecf8e",
          danger: "#ef5b5b",
        },
      },
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;

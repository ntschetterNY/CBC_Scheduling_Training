"use client";

import { useEffect, useState } from "react";

type Theme = "system" | "light" | "dark";

const STORAGE_KEY = "theme";
const LABEL: Record<Theme, string> = {
  system: "System theme",
  light: "Light theme",
  dark: "Dark theme",
};
const ICON: Record<Theme, string> = {
  system: "◐",
  light: "☀️",
  dark: "🌙",
};

function apply(theme: Theme) {
  const dark =
    theme === "dark" ||
    (theme === "system" &&
      window.matchMedia("(prefers-color-scheme: dark)").matches);
  document.documentElement.classList.toggle("dark", dark);
}

/**
 * Cycles system → light → dark. "System" follows the OS preference (and
 * tracks live changes); an explicit choice is persisted in localStorage and
 * applied before first paint by the inline script in the root layout.
 */
export function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>("system");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === "light" || stored === "dark") setTheme(stored);
    setMounted(true);
  }, []);

  // While following the system, react to OS theme changes without a reload.
  useEffect(() => {
    if (theme !== "system") return;
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const onChange = () => apply("system");
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, [theme]);

  const cycle = () => {
    const next: Theme =
      theme === "system" ? "light" : theme === "light" ? "dark" : "system";
    if (next === "system") localStorage.removeItem(STORAGE_KEY);
    else localStorage.setItem(STORAGE_KEY, next);
    apply(next);
    setTheme(next);
  };

  return (
    <button
      type="button"
      onClick={cycle}
      title={mounted ? LABEL[theme] : "Theme"}
      aria-label={mounted ? `${LABEL[theme]} — click to change` : "Theme"}
      className="grid h-10 w-10 place-items-center rounded-full border
        border-brand-border bg-brand-card text-base transition-colors
        hover:border-brand-accent/60 focus:outline-none focus-visible:ring-2
        focus-visible:ring-brand-accent/50"
    >
      <span aria-hidden>{mounted ? ICON[theme] : "◐"}</span>
    </button>
  );
}

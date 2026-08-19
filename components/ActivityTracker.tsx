"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";

type AuditEvent = {
  event: "page_view" | "click";
  path: string;
  target?: string;
  duration_ms?: number;
};

const FLUSH_INTERVAL_MS = 10_000;
const MAX_QUEUE = 50;

/**
 * Site-wide activity tracker. Records page views (with load time on the
 * initial navigation) and clicks on interactive elements, then ships them in
 * batches to /api/audit where they're attributed to the signed-in user.
 * Signed-out visitors' events are silently dropped by the server.
 */
export function ActivityTracker() {
  const pathname = usePathname();
  const queue = useRef<AuditEvent[]>([]);
  const firstView = useRef(true);

  const push = (e: AuditEvent) => {
    if (queue.current.length < MAX_QUEUE) queue.current.push(e);
  };

  // Page views — the first one carries the real navigation load time.
  useEffect(() => {
    let duration: number | undefined;
    if (firstView.current) {
      firstView.current = false;
      const nav = performance.getEntriesByType(
        "navigation"
      )[0] as PerformanceNavigationTiming | undefined;
      if (nav && nav.duration > 0) duration = Math.round(nav.duration);
    }
    push({ event: "page_view", path: pathname, duration_ms: duration });
  }, [pathname]);

  // Clicks on links, buttons, and button-like elements.
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const el = (e.target as Element | null)?.closest?.(
        "a, button, [role='button'], summary, input[type='submit']"
      );
      if (!el) return;
      const label =
        el.getAttribute("aria-label") ||
        (el as HTMLElement).innerText?.trim().replace(/\s+/g, " ") ||
        el.getAttribute("title") ||
        el.tagName.toLowerCase();
      const href = el.getAttribute("href");
      const target = (href ? `${label} → ${href}` : label).slice(0, 120);
      push({ event: "click", path: window.location.pathname, target });
    };
    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, []);

  // Flush on an interval and when the tab is hidden/closed.
  useEffect(() => {
    const flush = (useBeacon: boolean) => {
      if (queue.current.length === 0) return;
      const body = JSON.stringify({ events: queue.current });
      queue.current = [];
      if (useBeacon && navigator.sendBeacon) {
        navigator.sendBeacon("/api/audit", new Blob([body], { type: "application/json" }));
      } else {
        fetch("/api/audit", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body,
          keepalive: true,
        }).catch(() => {});
      }
    };

    const interval = setInterval(() => flush(false), FLUSH_INTERVAL_MS);
    const onHide = () => {
      if (document.visibilityState === "hidden") flush(true);
    };
    document.addEventListener("visibilitychange", onHide);
    window.addEventListener("pagehide", onHide);
    return () => {
      clearInterval(interval);
      document.removeEventListener("visibilitychange", onHide);
      window.removeEventListener("pagehide", onHide);
      flush(true);
    };
  }, []);

  return null;
}

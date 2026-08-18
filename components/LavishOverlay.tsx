"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import {
  buildRequestFromNotes,
  describeElement,
  type MarkupNote,
} from "@/lib/markup";
import {
  FR_PRIORITIES,
  PRIORITY_META,
  type FrPriority,
} from "@/lib/feature-requests";

/**
 * "Lavish" in-app markup tool. A site admin toggles markup mode from the
 * top-right of any page, clicks elements to say what should change, and submits
 * the batch as one feature request through the existing /api/feature-requests
 * pipeline. No agent/API credits are used here - a backend processing pass
 * turns the resulting ticket into code later.
 *
 * The component self-gates: it fetches the current user client-side and renders
 * nothing unless they're an admin (profiles.role === "admin") or a super admin
 * (by email). It's mounted once, globally, from app/layout.tsx.
 */

type Pending = {
  selector: string;
  tag: string;
  text: string;
  x: number;
  y: number;
};

type SubmitState = "idle" | "submitting" | "done" | "error";

export function LavishOverlay() {
  const pathname = usePathname();
  const [eligible, setEligible] = useState<boolean | null>(null);

  const [active, setActive] = useState(false);
  const [notes, setNotes] = useState<MarkupNote[]>([]);
  const [hoverRect, setHoverRect] = useState<DOMRect | null>(null);
  const [pending, setPending] = useState<Pending | null>(null);
  const [changeText, setChangeText] = useState("");

  const [showSubmit, setShowSubmit] = useState(false);
  const [summary, setSummary] = useState("");
  const [priority, setPriority] = useState<FrPriority>("Medium");
  const [submitState, setSubmitState] = useState<SubmitState>("idle");
  const [message, setMessage] = useState("");
  const [resultHref, setResultHref] = useState("");

  const noteInputRef = useRef<HTMLTextAreaElement>(null);

  /* --------------------------------------------------------------- *
   * Gate: only admins / super admins ever see the tool.
   * --------------------------------------------------------------- */
  useEffect(() => {
    let mounted = true;
    // Server decides eligibility from the session cookie (same reliable path
    // the rest of the app uses for roles), rather than checking auth in the
    // browser. See app/api/lavish-access/route.ts.
    fetch("/api/lavish-access", { cache: "no-store" })
      .then((r) => (r.ok ? r.json() : { canMarkup: false }))
      .then((d) => {
        if (mounted) setEligible(Boolean(d.canMarkup));
      })
      .catch(() => {
        if (mounted) setEligible(false);
      });
    return () => {
      mounted = false;
    };
  }, []);

  /* --------------------------------------------------------------- *
   * Body affordances while markup mode is on.
   * --------------------------------------------------------------- */
  useEffect(() => {
    if (!active) return;
    const prevCursor = document.body.style.cursor;
    const prevSelect = document.body.style.userSelect;
    document.body.style.cursor = "crosshair";
    document.body.style.userSelect = "none";
    return () => {
      document.body.style.cursor = prevCursor;
      document.body.style.userSelect = prevSelect;
      setHoverRect(null);
    };
  }, [active]);

  /* --------------------------------------------------------------- *
   * Hover highlight + click-to-capture on the live page.
   * --------------------------------------------------------------- */
  useEffect(() => {
    if (!active) return;

    function onMove(e: MouseEvent) {
      if (pending) return;
      const target = e.target as Element | null;
      if (!target || target.closest("[data-lavish]")) {
        setHoverRect(null);
        return;
      }
      setHoverRect(target.getBoundingClientRect());
    }

    function onClick(e: MouseEvent) {
      const target = e.target as Element | null;
      if (!target || target.closest("[data-lavish]")) return; // our own UI
      e.preventDefault();
      e.stopPropagation();
      if (pending) return; // finish the open note first
      const facts = describeElement(target);
      setHoverRect(null);
      setChangeText("");
      setPending({ ...facts, x: e.clientX, y: e.clientY });
    }

    document.addEventListener("mousemove", onMove, true);
    document.addEventListener("click", onClick, true);
    return () => {
      document.removeEventListener("mousemove", onMove, true);
      document.removeEventListener("click", onClick, true);
    };
  }, [active, pending]);

  // Focus the note textarea when the popover opens.
  useEffect(() => {
    if (pending) noteInputRef.current?.focus();
  }, [pending]);

  /* --------------------------------------------------------------- *
   * Escape backs out one layer at a time.
   * --------------------------------------------------------------- */
  useEffect(() => {
    if (!eligible) return;
    function onKey(e: KeyboardEvent) {
      if (e.key !== "Escape") return;
      if (pending) setPending(null);
      else if (showSubmit) setShowSubmit(false);
      else if (active) setActive(false);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [eligible, active, pending, showSubmit]);

  const addNote = useCallback(() => {
    if (!pending || !changeText.trim()) return;
    setNotes((q) => [
      ...q,
      {
        route: pathname || "/",
        selector: pending.selector,
        tag: pending.tag,
        text: pending.text,
        change: changeText.trim(),
      },
    ]);
    setPending(null);
    setChangeText("");
  }, [pending, changeText, pathname]);

  const openSubmit = useCallback(() => {
    const built = buildRequestFromNotes(notes);
    setSummary((s) => s || built.title);
    setSubmitState("idle");
    setMessage("");
    setShowSubmit(true);
  }, [notes]);

  async function submit() {
    if (!notes.length) return;
    setSubmitState("submitting");
    setMessage("");
    const built = buildRequestFromNotes(notes, { title: summary });
    try {
      const res = await fetch("/api/feature-requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: built.title,
          details: built.details,
          affected: built.affected,
          type: "adjustment",
          priority,
          photoUrls: [],
          markup: notes,
        }),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(json.error || "Could not file the request.");
      }
      setSubmitState("done");
      setResultHref(json.number ? `/feature-requests?fr=${json.number}` : "");
      setNotes([]);
      setSummary("");
      setShowSubmit(false);
      setActive(false);
    } catch (err) {
      setSubmitState("error");
      setMessage(err instanceof Error ? err.message : "Something went wrong.");
    }
  }

  if (!eligible) return null;

  const popLeft =
    pending != null
      ? Math.min(pending.x, (typeof window !== "undefined" ? window.innerWidth : 1200) - 340)
      : 0;
  const popTop =
    pending != null
      ? Math.min(pending.y + 12, (typeof window !== "undefined" ? window.innerHeight : 800) - 240)
      : 0;

  return (
    <>
      {/* Hover highlight (never intercepts pointer events). */}
      {active && hoverRect && (
        <div
          data-lavish
          aria-hidden
          className="pointer-events-none fixed z-[55] rounded-sm ring-2 ring-brand-accent"
          style={{
            top: hoverRect.top,
            left: hoverRect.left,
            width: hoverRect.width,
            height: hoverRect.height,
            boxShadow: "0 0 0 9999px rgba(20,40,48,0.06)",
          }}
        />
      )}

      {/* Mode banner */}
      {active && (
        <div
          data-lavish
          className="pointer-events-none fixed left-1/2 top-3 z-[60] -translate-x-1/2 rounded-full bg-brand-teal px-4 py-1.5 text-xs font-semibold text-white shadow-lg"
        >
          Lavish mode - click any element to mark it up · Esc to exit
        </div>
      )}

      {/* Top-right toggle */}
      <button
        data-lavish
        type="button"
        onClick={() => setActive((a) => !a)}
        className={`fixed right-3 top-20 z-[60] inline-flex items-center gap-1.5 rounded-full px-3.5 py-2 text-sm font-semibold shadow-lg transition-colors ${
          active
            ? "bg-brand-teal text-white hover:bg-brand-teal/90"
            : "bg-brand-accent text-white hover:bg-brand-accentDark"
        }`}
        aria-pressed={active}
      >
        <span aria-hidden>✦</span>
        {active ? "Exit Lavish" : "Lavish"}
        {notes.length > 0 && (
          <span className="ml-0.5 grid h-5 min-w-5 place-items-center rounded-full bg-white/25 px-1 text-[11px]">
            {notes.length}
          </span>
        )}
      </button>

      {/* Note popover for the just-clicked element */}
      {pending && (
        <div
          data-lavish
          className="fixed z-[62] w-[320px] rounded-xl border border-brand-border bg-brand-card p-3 shadow-2xl"
          style={{ top: popTop, left: popLeft }}
        >
          <p className="text-xs font-semibold text-brand-text">
            <span className="rounded bg-brand-surface px-1.5 py-0.5 font-mono text-[11px]">
              &lt;{pending.tag}&gt;
            </span>{" "}
            {pending.text ? (
              <span className="text-brand-muted">"{pending.text}"</span>
            ) : (
              <span className="text-brand-muted">(no text)</span>
            )}
          </p>
          <textarea
            ref={noteInputRef}
            value={changeText}
            onChange={(e) => setChangeText(e.target.value)}
            onKeyDown={(e) => {
              if ((e.metaKey || e.ctrlKey) && e.key === "Enter") addNote();
            }}
            placeholder="What should change here?"
            className="mt-2 min-h-[72px] w-full resize-y rounded-lg border border-brand-border p-2 text-sm outline-none focus:border-brand-accent"
          />
          <div className="mt-2 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={() => setPending(null)}
              className="rounded-lg px-2.5 py-1.5 text-xs font-medium text-brand-muted hover:bg-brand-surface"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={addNote}
              disabled={!changeText.trim()}
              className="rounded-lg bg-brand-accent px-3 py-1.5 text-xs font-semibold text-white hover:bg-brand-accentDark disabled:opacity-50"
            >
              Add note
            </button>
          </div>
        </div>
      )}

      {/* Queue drawer */}
      {(notes.length > 0 || submitState === "done") && (
        <div
          data-lavish
          className="fixed bottom-3 right-3 z-[61] w-[320px] rounded-xl border border-brand-border bg-brand-card shadow-2xl"
        >
          <div className="flex items-center justify-between border-b border-brand-border px-3.5 py-2.5">
            <p className="text-sm font-semibold text-brand-text">
              Markup queue{" "}
              <span className="text-brand-muted">({notes.length})</span>
            </p>
            {notes.length > 0 && (
              <button
                type="button"
                onClick={() => setNotes([])}
                className="text-xs font-medium text-brand-muted hover:text-brand-danger"
              >
                Clear
              </button>
            )}
          </div>

          {submitState === "done" && (
            <div className="px-3.5 py-3 text-sm text-brand-success">
              Filed as a feature request.{" "}
              {resultHref && (
                <a
                  href={resultHref}
                  className="font-semibold underline hover:no-underline"
                >
                  View it
                </a>
              )}
            </div>
          )}

          {notes.length > 0 && (
            <>
              <ul className="max-h-[42vh] divide-y divide-brand-border overflow-y-auto">
                {notes.map((n, i) => (
                  <li key={i} className="flex gap-2 px-3.5 py-2.5 text-xs">
                    <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-brand-surface font-semibold text-brand-muted">
                      {i + 1}
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-medium text-brand-text">
                        <span className="font-mono text-[11px] text-brand-muted">
                          &lt;{n.tag}&gt;
                        </span>{" "}
                        {n.text || n.selector}
                      </p>
                      <p className="mt-0.5 text-brand-muted">{n.change}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() =>
                        setNotes((q) => q.filter((_, j) => j !== i))
                      }
                      className="shrink-0 self-start text-brand-muted hover:text-brand-danger"
                      aria-label={`Remove note ${i + 1}`}
                    >
                      ✕
                    </button>
                  </li>
                ))}
              </ul>

              {!showSubmit ? (
                <div className="border-t border-brand-border p-3">
                  <button
                    type="button"
                    onClick={openSubmit}
                    className="btn-primary w-full justify-center"
                  >
                    Submit as feature request
                  </button>
                </div>
              ) : (
                <div className="space-y-2.5 border-t border-brand-border p-3">
                  <div>
                    <label className="mb-1 block text-xs font-medium text-brand-text">
                      Summary
                    </label>
                    <input
                      className="w-full rounded-lg border border-brand-border p-2 text-sm outline-none focus:border-brand-accent"
                      value={summary}
                      maxLength={200}
                      onChange={(e) => setSummary(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-xs font-medium text-brand-text">
                      Priority
                    </label>
                    <div className="flex flex-wrap gap-1.5">
                      {FR_PRIORITIES.map((p) => (
                        <button
                          key={p}
                          type="button"
                          onClick={() => setPriority(p)}
                          className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-xs transition-colors ${
                            priority === p
                              ? "border-brand-accent bg-brand-accent/10 font-semibold text-brand-text"
                              : "border-brand-border text-brand-muted hover:border-brand-accent/40"
                          }`}
                        >
                          <span
                            className={`h-1.5 w-1.5 rounded-full ${PRIORITY_META[p].dot}`}
                            aria-hidden
                          />
                          {PRIORITY_META[p].label}
                        </button>
                      ))}
                    </div>
                  </div>
                  {message && (
                    <p className="rounded-lg bg-brand-danger/10 px-2.5 py-1.5 text-xs text-brand-danger">
                      {message}
                    </p>
                  )}
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={submit}
                      disabled={submitState === "submitting" || !summary.trim()}
                      className="btn-primary flex-1 justify-center disabled:opacity-50"
                    >
                      {submitState === "submitting" ? "Filing…" : "File request"}
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowSubmit(false)}
                      className="rounded-lg px-2.5 py-2 text-xs font-medium text-brand-muted hover:bg-brand-surface"
                    >
                      Back
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      )}
    </>
  );
}

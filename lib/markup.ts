/**
 * Helpers for the in-app "Lavish" markup tool (components/LavishOverlay.tsx).
 *
 * A site admin toggles markup mode, clicks elements on the live page, and types
 * what should change. Each click is captured as a MarkupNote (route + a stable
 * CSS path + the element's current text + the requested change). On submit the
 * whole queue is turned into one feature request via buildRequestFromNotes.
 *
 * This module is pure and client-safe: no React, no secrets, no DOM mutation.
 * cssPath/describeElement read the DOM but only run in the browser overlay.
 */

export type MarkupNote = {
  /** Pathname the note was taken on (e.g. "/", "/learn"). */
  route: string;
  /** A reasonably stable CSS path to the clicked element. */
  selector: string;
  /** Lowercased tag name of the clicked element (e.g. "h1"). */
  tag: string;
  /** The element's current, collapsed text (truncated). */
  text: string;
  /** What the admin wants changed. */
  change: string;
};

/** A safe, document-unique `#id` selector for the element, or null. */
function uniqueId(el: Element): string | null {
  const id = el.id;
  if (!id || !/^[A-Za-z][\w-]*$/.test(id)) return null;
  try {
    if (el.ownerDocument.querySelectorAll(`#${CSS.escape(id)}`).length === 1) {
      return `#${id}`;
    }
  } catch {
    return null;
  }
  return null;
}

/** 1-based index of `el` among its same-tag siblings. */
function nthOfType(el: Element): number {
  let n = 1;
  let sib = el.previousElementSibling;
  while (sib) {
    if (sib.tagName === el.tagName) n += 1;
    sib = sib.previousElementSibling;
  }
  return n;
}

/**
 * A reasonably stable CSS path from an ancestor anchor down to `el`. Prefers a
 * unique `#id` (which stops the walk, since it's an absolute anchor); otherwise
 * builds `tag[.class]:nth-of-type(n)` segments up to <body>. Tailwind utility
 * classes with `:` or `/` are skipped as they aren't valid bare selectors.
 */
export function cssPath(el: Element | null): string {
  if (!el || el.nodeType !== 1) return "";
  const parts: string[] = [];
  let cur: Element | null = el;

  while (cur && cur.nodeType === 1) {
    const tag = cur.tagName.toLowerCase();
    if (tag === "html") break;

    const id = uniqueId(cur);
    if (id) {
      parts.unshift(id);
      break;
    }
    if (tag === "body") {
      parts.unshift("body");
      break;
    }

    let seg = tag;
    const cls = (cur.getAttribute("class") || "")
      .split(/\s+/)
      .filter((c) => /^[A-Za-z][\w-]*$/.test(c))
      .slice(0, 2);
    if (cls.length) seg += "." + cls.join(".");

    const parent: Element | null = cur.parentElement;
    if (parent) {
      const sameTag = Array.from(parent.children).filter(
        (c) => c.tagName === cur!.tagName
      );
      if (sameTag.length > 1) seg += `:nth-of-type(${nthOfType(cur)})`;
    }
    parts.unshift(seg);
    cur = cur.parentElement;
  }

  return parts.join(" > ");
}

/** Capture the identifying facts about a clicked element. */
export function describeElement(el: Element): {
  selector: string;
  tag: string;
  text: string;
} {
  const raw =
    (el instanceof HTMLElement ? el.innerText : el.textContent) || "";
  const text = raw.replace(/\s+/g, " ").trim().slice(0, 120);
  return { selector: cssPath(el), tag: el.tagName.toLowerCase(), text };
}

/**
 * Turn a queue of notes into the fields the feature-request API expects. The
 * details/affected prose is the primary, human-readable carrier (rendered in
 * the tracker and readable by a backend processing pass); the raw notes are
 * also sent as a hidden `fr-markup` marker for precise machine consumption.
 */
export function buildRequestFromNotes(
  notes: MarkupNote[],
  opts?: { title?: string }
): { title: string; details: string; affected: string } {
  const routes = Array.from(new Set(notes.map((n) => n.route)));
  const routeLabel = routes.length === 1 ? routes[0] : `${routes.length} pages`;
  const plural = notes.length === 1 ? "" : "s";

  const title =
    opts?.title?.trim() ||
    `Lavish markup: ${routeLabel} (${notes.length} change${plural})`;

  const details = [
    `Markup review captured in the app - ${notes.length} requested change${plural}:`,
    ...notes.map((n, i) => {
      const label = n.text ? `\`<${n.tag}>\` "${n.text}"` : `\`<${n.tag}>\``;
      return [
        `${i + 1}. **${label}** on \`${n.route}\``,
        `   - Requested change: ${n.change}`,
        `   - Element: \`${n.selector}\``,
      ].join("\n");
    }),
  ].join("\n\n");

  const affected = routes
    .map((r) => {
      const sels = notes.filter((n) => n.route === r).map((n) => n.selector);
      return `${r}: ${sels.join(", ")}`;
    })
    .join("\n");

  return { title, details, affected };
}

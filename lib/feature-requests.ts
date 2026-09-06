/**
 * Shared, non-secret constants for the Feature Request tracker. Safe to import
 * from both Client and Server Components (no token or server-only code here).
 *
 * Tickets are stored as GitHub issues; the lifecycle, priority and type below
 * are encoded as GitHub labels (see lib/github.ts). This module is the single
 * source of truth for the vocabulary and how each value is presented in the UI.
 */

/** Supabase Storage bucket that holds files attached to requests. (The id
 *  predates FR-017 widening attachments beyond screenshots.) */
export const FEATURE_PHOTO_BUCKET = "feature-request-photos";

/** How many attachments a single request (or comment) may include. */
export const MAX_ATTACHMENTS = 6;

/** Per-file size cap (10 MB). */
export const MAX_ATTACHMENT_BYTES = 10 * 1024 * 1024;

/** Extensions rendered inline as images (everything else shows as a file link). */
const IMAGE_EXTENSIONS = ["png", "jpg", "jpeg", "gif", "webp", "svg", "avif"];

/** True when an attachment URL points at an image we can render inline. */
export function isImageAttachmentUrl(url: string): boolean {
  const ext = url.split("?")[0].split(".").pop()?.toLowerCase() ?? "";
  return IMAGE_EXTENSIONS.includes(ext);
}

/**
 * Human-readable file name for an attachment URL. Upload paths are
 * `<uuid>-<original name>`, so strip the uuid prefix; fall back to the last
 * path segment for legacy `<uuid>.<ext>` screenshot uploads.
 */
export function attachmentNameFromUrl(url: string): string {
  const last = decodeURIComponent(url.split("?")[0].split("/").pop() ?? "");
  const dashed = last.replace(
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}-/i,
    ""
  );
  return dashed || last || "attachment";
}

/**
 * Human-facing request id, derived from the GitHub issue number so it's stable
 * and unique (e.g. issue #7 -> "FR-007").
 */
export function formatFrNumber(issueNumber: number): string {
  return `FR-${String(issueNumber).padStart(3, "0")}`;
}

/* ------------------------------------------------------------------ *
 * Status lifecycle
 * ------------------------------------------------------------------ */

/**
 * A ticket moves pending -> implementation -> testing -> closed. The first
 * three are open GitHub issues carrying a `status:*` label; "closed" is the
 * issue's closed state. Mirrors VOREA's lifecycle.
 */
export type FrStatus = "pending" | "implementation" | "testing" | "closed";

export const FR_STATUSES: FrStatus[] = [
  "pending",
  "implementation",
  "testing",
  "closed",
];

export const STATUS_META: Record<
  FrStatus,
  { label: string; short: string; badge: string; dot: string }
> = {
  pending: {
    label: "Pending",
    short: "Pending",
    badge: "bg-brand-surface text-brand-muted",
    dot: "bg-brand-muted",
  },
  implementation: {
    label: "Marked for Implementation",
    short: "Marked",
    badge: "bg-brand-accent/15 text-brand-accentDark",
    dot: "bg-brand-accent",
  },
  testing: {
    label: "Implemented · In Testing",
    short: "Testing",
    badge: "bg-brand-accent2/15 text-brand-accent2",
    dot: "bg-brand-accent2",
  },
  closed: {
    label: "Closed",
    short: "Closed",
    badge: "bg-brand-success/15 text-brand-success",
    dot: "bg-brand-success",
  },
};

/* ------------------------------------------------------------------ *
 * Priority
 * ------------------------------------------------------------------ */

export type FrPriority = "Critical" | "High" | "Medium" | "Low";

export const FR_PRIORITIES: FrPriority[] = [
  "Critical",
  "High",
  "Medium",
  "Low",
];

export const PRIORITY_META: Record<
  FrPriority,
  { label: string; dot: string; text: string; rank: number }
> = {
  Critical: { label: "Critical", dot: "bg-brand-danger", text: "text-brand-danger", rank: 0 },
  High: { label: "High", dot: "bg-brand-accent", text: "text-brand-accentDark", rank: 1 },
  Medium: { label: "Medium", dot: "bg-brand-accent2", text: "text-brand-accent2", rank: 2 },
  Low: { label: "Low", dot: "bg-brand-muted", text: "text-brand-muted", rank: 3 },
};

/* ------------------------------------------------------------------ *
 * Type
 * ------------------------------------------------------------------ */

export type FrType = "new-feature" | "adjustment";

export const FR_TYPES: FrType[] = ["new-feature", "adjustment"];

export const TYPE_META: Record<FrType, { label: string; glyph: string }> = {
  "new-feature": { label: "New Feature", glyph: "✦" },
  adjustment: { label: "Adjustment", glyph: "⚙" },
};

/* ------------------------------------------------------------------ *
 * Dashboard filter tabs & sort options
 * ------------------------------------------------------------------ */

export type FrTab = "open" | FrStatus | "all";

export const FR_TABS: { id: FrTab; label: string }[] = [
  { id: "open", label: "Open" },
  { id: "pending", label: "Pending" },
  { id: "implementation", label: "Marked" },
  { id: "testing", label: "Testing" },
  { id: "closed", label: "Closed" },
  { id: "all", label: "All" },
];

export type FrSort = "priority" | "newest" | "oldest" | "upvotes" | "status";

export const FR_SORTS: { id: FrSort; label: string }[] = [
  { id: "priority", label: "Priority" },
  { id: "newest", label: "Newest" },
  { id: "oldest", label: "Oldest" },
  { id: "upvotes", label: "Most upvoted" },
  { id: "status", label: "Status" },
];

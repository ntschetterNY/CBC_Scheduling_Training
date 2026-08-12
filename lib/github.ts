/**
 * Server-only GitHub helper for the Feature Request tracker.
 *
 * Tickets are GitHub issues in `GITHUB_REPO`, all carrying the
 * `feature-request` label. On top of that we encode the ticket's lifecycle,
 * priority and type as additional labels, and store the structured fields
 * (details, affected area, who filed it) in the issue body behind hidden
 * markers so we can read them back reliably. This mirrors the VOREA intranet
 * ticketing system, adapted to this project's GitHub-issue backend.
 *
 * When the token/repo aren't set, `isGitHubConfigured` is false and the
 * tracker shows a "not connected yet" notice instead of failing.
 *
 * IMPORTANT: only import this from Server Components and Route Handlers. The
 * token is read from a non-`NEXT_PUBLIC_` env var, so it never ships to the
 * browser — keep it that way by never importing this into a Client Component.
 */

import {
  FR_PRIORITIES,
  FR_STATUSES,
  FR_TYPES,
  type FrPriority,
  type FrStatus,
  type FrType,
} from "./feature-requests";
import type { MarkupNote } from "./markup";

const GITHUB_API = "https://api.github.com";

export const GITHUB_TOKEN = process.env.GITHUB_TOKEN || "";
/** owner/repo the requests are filed against. Defaults to this project. */
export const GITHUB_REPO =
  process.env.GITHUB_REPO || "ntschetterNY/CBC_Scheduling_Training";
export const FEATURE_REQUEST_LABEL = "feature-request";

export const isGitHubConfigured = Boolean(
  GITHUB_TOKEN && GITHUB_REPO.includes("/")
);

function githubHeaders() {
  return {
    Authorization: `Bearer ${GITHUB_TOKEN}`,
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
    "Content-Type": "application/json",
  };
}

/* ------------------------------------------------------------------ *
 * Labels
 * ------------------------------------------------------------------ */

const statusLabel = (s: FrStatus) => `status:${s}`;
const priorityLabel = (p: FrPriority) => `priority:${p}`;
const typeLabel = (t: FrType) => `type:${t}`;

/** All labels a brand-new pending ticket of the given priority/type carries. */
function initialLabels(priority: FrPriority, type: FrType): string[] {
  return [
    FEATURE_REQUEST_LABEL,
    priorityLabel(priority),
    statusLabel("pending"),
    typeLabel(type),
  ];
}

function readStatus(labels: string[], state: "open" | "closed"): FrStatus {
  if (state === "closed") return "closed";
  const l = labels.find((n) => n.startsWith("status:"))?.slice("status:".length);
  return (FR_STATUSES as string[]).includes(l ?? "")
    ? (l as FrStatus)
    : "pending";
}

function readPriority(labels: string[]): FrPriority {
  const l = labels
    .find((n) => n.startsWith("priority:"))
    ?.slice("priority:".length);
  return (FR_PRIORITIES as string[]).includes(l ?? "")
    ? (l as FrPriority)
    : "Medium";
}

function readType(labels: string[]): FrType {
  const l = labels.find((n) => n.startsWith("type:"))?.slice("type:".length);
  return (FR_TYPES as string[]).includes(l ?? "") ? (l as FrType) : "adjustment";
}

/* ------------------------------------------------------------------ *
 * Body markers & serialization
 * ------------------------------------------------------------------ */

// Machine-readable markers embedded in each issue/comment body. The GitHub
// `author` is always the token account, so we record the real app user here.
const REQUESTER_MARKER = /<!--\s*fr-requester:\s*(.*?)\s*-->/i;
const EMAIL_MARKER = /<!--\s*fr-email:\s*(.*?)\s*-->/i;
const COMPANY_MARKER = /<!--\s*fr-company:\s*(.*?)\s*-->/i;
// Note: a fresh RegExp is created per use for the global image matcher, since
// a shared /g regex carries mutable lastIndex state between calls.
const imgMatcher = () => /!\[[^\]]*\]\(([^)\s]+)\)/g;

/** Strip angle brackets so a value can't terminate the HTML comment early. */
function safe(v: string): string {
  return v.replace(/[<>]/g, "").trim();
}

export function requesterMarker(name: string): string {
  return `<!-- fr-requester: ${safe(name)} -->`;
}

// Structured markup notes from the in-app Lavish tool. Base64-encoded so
// arbitrary user text (which may contain `<`/`>`) can never terminate the HTML
// comment. The human-readable version lives in the Details/Affected sections;
// this marker is for precise machine consumption by a backend processing pass.
const MARKUP_MARKER = /<!--\s*fr-markup:\s*([A-Za-z0-9+/=]+)\s*-->/i;

export function markupMarker(notes: MarkupNote[]): string {
  const b64 = Buffer.from(JSON.stringify(notes), "utf8").toString("base64");
  return `<!-- fr-markup: ${b64} -->`;
}

export function parseMarkup(
  body: string | null | undefined
): MarkupNote[] | null {
  const m = body?.match(MARKUP_MARKER);
  if (!m) return null;
  try {
    const json = Buffer.from(m[1], "base64").toString("utf8");
    const parsed = JSON.parse(json);
    return Array.isArray(parsed) ? (parsed as MarkupNote[]) : null;
  } catch {
    return null;
  }
}

export function parseRequester(body: string | null | undefined): string | null {
  const m = body?.match(REQUESTER_MARKER);
  return m ? m[1].trim() : null;
}

function parseMarker(body: string | null | undefined, re: RegExp): string | null {
  const m = body?.match(re);
  return m ? m[1].trim() : null;
}

/** Pull every embedded image URL out of a markdown body. */
function parsePhotoUrls(body: string | null | undefined): string[] {
  if (!body) return [];
  const urls: string[] = [];
  for (const m of body.matchAll(imgMatcher())) urls.push(m[1]);
  return urls;
}

/** Extract a labelled section like `**Details:**\n...` up to the next section. */
function parseSection(body: string | null | undefined, header: string): string {
  if (!body) return "";
  const re = new RegExp(
    `\\*\\*${header}:\\*\\*\\s*([\\s\\S]*?)(?=\\n\\*\\*[^*\\n]+:\\*\\*|\\n#{2,3}\\s|\\n---|$)`,
    "i"
  );
  const m = body.match(re);
  return m ? m[1].trim() : "";
}

/** Build the markdown body for a new feature-request issue. */
export function buildIssueBody(input: {
  details: string;
  affected: string;
  priority: FrPriority;
  type: FrType;
  requester: string;
  email?: string | null;
  company?: string | null;
  photoUrls: string[];
  markup?: MarkupNote[];
}): string {
  const parts: string[] = [
    // Hidden markers the tracker reads back.
    requesterMarker(input.requester),
    `<!-- fr-email: ${safe(input.email ?? "")} -->`,
    `<!-- fr-company: ${safe(input.company ?? "")} -->`,
    `**Requested by:** ${input.requester}` +
      (input.company ? ` (${input.company})` : ""),
    `**Priority:** ${input.priority}`,
    `**Details:**\n${input.details.trim()}`,
  ];

  if (input.markup?.length) {
    parts.push(markupMarker(input.markup));
  }

  if (input.affected.trim()) {
    parts.push(`**Affected area:**\n${input.affected.trim()}`);
  }

  if (input.photoUrls.length > 0) {
    parts.push(
      "### Screenshots\n" +
        input.photoUrls.map((u, i) => `![screenshot ${i + 1}](${u})`).join("\n")
    );
  }

  parts.push(
    "---\n" +
      `_Filed from the training app by ${input.requester}${
        input.email ? ` (${input.email})` : ""
      }. A maintainer can move it through testing and close it._`
  );

  return parts.join("\n\n");
}

/** Build a comment body carrying the commenter's name + optional screenshots. */
export function buildCommentBody(input: {
  author: string;
  body: string;
  photoUrls: string[];
}): string {
  const parts = [requesterMarker(input.author), input.body.trim()];
  if (input.photoUrls.length > 0) {
    parts.push(
      input.photoUrls.map((u, i) => `![attachment ${i + 1}](${u})`).join("\n")
    );
  }
  return parts.join("\n\n");
}

/* ------------------------------------------------------------------ *
 * Types
 * ------------------------------------------------------------------ */

export type FeatureRequest = {
  number: number;
  /** The issue title, i.e. the request's short summary. */
  title: string;
  state: "open" | "closed";
  status: FrStatus;
  priority: FrPriority;
  type: FrType;
  url: string;
  /** GitHub account that opened the issue (the token owner). */
  author: string;
  /** The app user who filed it, parsed from the issue body. */
  requester: string | null;
  requesterEmail: string | null;
  requesterCompany: string | null;
  details: string;
  affected: string;
  photoUrls: string[];
  createdAt: string;
  updatedAt: string;
  comments: number;
};

export type FrComment = {
  id: number;
  githubAuthor: string;
  /** The app user who wrote it, parsed from the comment body. */
  author: string | null;
  body: string;
  photoUrls: string[];
  createdAt: string;
};

type RawIssue = {
  number: number;
  title: string;
  state: "open" | "closed";
  html_url: string;
  body: string | null;
  labels: Array<{ name?: string } | string>;
  user?: { login?: string };
  created_at: string;
  updated_at: string;
  comments: number;
  pull_request?: unknown;
};

function labelNames(labels: RawIssue["labels"]): string[] {
  return (labels ?? []).map((l) => (typeof l === "string" ? l : l.name ?? ""));
}

function toFeatureRequest(i: RawIssue): FeatureRequest {
  const labels = labelNames(i.labels);
  const body = i.body ?? "";
  return {
    number: i.number,
    title: i.title,
    state: i.state,
    status: readStatus(labels, i.state),
    priority: readPriority(labels),
    type: readType(labels),
    url: i.html_url,
    author: i.user?.login ?? "unknown",
    requester: parseRequester(body),
    requesterEmail: parseMarker(body, EMAIL_MARKER) || null,
    requesterCompany: parseMarker(body, COMPANY_MARKER) || null,
    details: parseSection(body, "Details"),
    affected: parseSection(body, "Affected area"),
    photoUrls: parsePhotoUrls(body),
    createdAt: i.created_at,
    updatedAt: i.updated_at,
    comments: i.comments ?? 0,
  };
}

/* ------------------------------------------------------------------ *
 * Reads
 * ------------------------------------------------------------------ */

/** List feature-request issues (all states), newest first. */
export async function listFeatureRequests(): Promise<FeatureRequest[]> {
  const res = await fetch(
    `${GITHUB_API}/repos/${GITHUB_REPO}/issues` +
      `?labels=${FEATURE_REQUEST_LABEL}&state=all&sort=created&direction=desc&per_page=100`,
    { headers: githubHeaders(), cache: "no-store" }
  );
  if (!res.ok) throw new Error(`GitHub issue list failed (${res.status})`);
  const data = (await res.json()) as RawIssue[];
  // The issues endpoint also returns pull requests — drop those.
  return data.filter((i) => !i.pull_request).map(toFeatureRequest);
}

/** Fetch a single feature request by issue number, or null if not one. */
export async function getFeatureRequest(
  number: number
): Promise<FeatureRequest | null> {
  const res = await fetch(`${GITHUB_API}/repos/${GITHUB_REPO}/issues/${number}`, {
    headers: githubHeaders(),
    cache: "no-store",
  });
  if (res.status === 404) return null;
  if (!res.ok) throw new Error(`GitHub issue fetch failed (${res.status})`);
  const i = (await res.json()) as RawIssue;
  if (i.pull_request) return null;
  if (!labelNames(i.labels).includes(FEATURE_REQUEST_LABEL)) return null;
  return toFeatureRequest(i);
}

/** List the comments on a feature request. Guarded by the FR label. */
export async function listComments(number: number): Promise<FrComment[]> {
  // Guard: confirm this issue is actually one of ours before reading its
  // comments, so the shared token can't be used to read arbitrary issues.
  const fr = await getFeatureRequest(number);
  if (!fr) throw new Error("Not a feature request");

  const res = await fetch(
    `${GITHUB_API}/repos/${GITHUB_REPO}/issues/${number}/comments?per_page=100`,
    { headers: githubHeaders(), cache: "no-store" }
  );
  if (!res.ok) throw new Error(`GitHub comment list failed (${res.status})`);
  const data = (await res.json()) as Array<{
    id: number;
    body: string | null;
    user?: { login?: string };
    created_at: string;
  }>;
  return data.map((c) => {
    const body = c.body ?? "";
    // Drop the marker line + image markdown from what we display as text.
    const display = body
      .replace(REQUESTER_MARKER, "")
      .replace(imgMatcher(), "")
      .trim();
    return {
      id: c.id,
      githubAuthor: c.user?.login ?? "unknown",
      author: parseRequester(body),
      body: display,
      photoUrls: parsePhotoUrls(body),
      createdAt: c.created_at,
    };
  });
}

/* ------------------------------------------------------------------ *
 * Writes
 * ------------------------------------------------------------------ */

/** Create a GitHub issue for a feature request and return its number + URL. */
export async function createFeatureRequestIssue(input: {
  title: string;
  details: string;
  affected: string;
  priority: FrPriority;
  type: FrType;
  requester: string;
  email?: string | null;
  company?: string | null;
  photoUrls: string[];
  markup?: MarkupNote[];
}): Promise<{ number: number; url: string }> {
  const body = buildIssueBody(input);
  const res = await fetch(`${GITHUB_API}/repos/${GITHUB_REPO}/issues`, {
    method: "POST",
    headers: githubHeaders(),
    body: JSON.stringify({
      title: input.title,
      body,
      labels: initialLabels(input.priority, input.type),
    }),
    cache: "no-store",
  });
  if (!res.ok) {
    const detail = await res.text().catch(() => "");
    throw new Error(`GitHub issue creation failed (${res.status}): ${detail}`);
  }
  const data = await res.json();
  return { number: data.number, url: data.html_url };
}

/** Post a comment (optionally with screenshots) to a feature request. */
export async function addComment(input: {
  number: number;
  author: string;
  body: string;
  photoUrls: string[];
}): Promise<void> {
  const fr = await getFeatureRequest(input.number);
  if (!fr) throw new Error("Not a feature request");
  const res = await fetch(
    `${GITHUB_API}/repos/${GITHUB_REPO}/issues/${input.number}/comments`,
    {
      method: "POST",
      headers: githubHeaders(),
      body: JSON.stringify({
        body: buildCommentBody({
          author: input.author,
          body: input.body,
          photoUrls: input.photoUrls,
        }),
      }),
      cache: "no-store",
    }
  );
  if (!res.ok) throw new Error(`GitHub comment failed (${res.status})`);
}

/** The stable (non-status) labels a FeatureRequest should always carry. */
function baseLabels(fr: FeatureRequest): string[] {
  return [FEATURE_REQUEST_LABEL, priorityLabel(fr.priority), typeLabel(fr.type)];
}

/** Set the full label array on an issue. */
async function putLabels(number: number, labels: string[]): Promise<void> {
  const res = await fetch(`${GITHUB_API}/repos/${GITHUB_REPO}/issues/${number}`, {
    method: "PATCH",
    headers: githubHeaders(),
    body: JSON.stringify({ labels }),
    cache: "no-store",
  });
  if (!res.ok) throw new Error(`GitHub label update failed (${res.status})`);
}

async function setIssueState(
  number: number,
  state: "open" | "closed",
  reason?: "completed" | "reopened"
): Promise<void> {
  const res = await fetch(`${GITHUB_API}/repos/${GITHUB_REPO}/issues/${number}`, {
    method: "PATCH",
    headers: githubHeaders(),
    body: JSON.stringify(reason ? { state, state_reason: reason } : { state }),
    cache: "no-store",
  });
  if (!res.ok) throw new Error(`GitHub state update failed (${res.status})`);
}

/**
 * Move an OPEN ticket between pending / implementation / testing. To close a
 * ticket use `closeRequest`; to reopen a closed one use `reopenPending`.
 */
export async function setStatus(
  number: number,
  next: Exclude<FrStatus, "closed">,
  note?: { author: string; text?: string }
): Promise<void> {
  const fr = await getFeatureRequest(number);
  if (!fr) throw new Error("Not a feature request");
  if (fr.state === "closed") await setIssueState(number, "open", "reopened");
  await putLabels(number, [...baseLabels(fr), statusLabel(next)]);
  if (note) {
    await addComment({
      number,
      author: note.author,
      body: note.text?.trim() || `Moved to **${next}**.`,
      photoUrls: [],
    });
  }
}

/**
 * Change a ticket's priority and/or type labels in place, preserving its
 * current status and open/closed state. Used by the in-app tag editor.
 */
export async function setMeta(
  number: number,
  next: { priority?: FrPriority; type?: FrType }
): Promise<void> {
  const fr = await getFeatureRequest(number);
  if (!fr) throw new Error("Not a feature request");
  const priority = next.priority ?? fr.priority;
  const type = next.type ?? fr.type;
  // Rebuild the full label set from the (possibly updated) priority/type plus
  // the untouched status. A PATCH of labels only never changes open/closed.
  await putLabels(number, [
    FEATURE_REQUEST_LABEL,
    priorityLabel(priority),
    typeLabel(type),
    statusLabel(fr.status),
  ]);
}

/** Close a ticket (mark done). Optionally leaves a closing note. */
export async function closeRequest(
  number: number,
  note: { author: string; text?: string }
): Promise<void> {
  const fr = await getFeatureRequest(number);
  if (!fr) throw new Error("Not a feature request");
  if (note.text?.trim()) {
    await addComment({
      number,
      author: note.author,
      body: note.text,
      photoUrls: [],
    });
  }
  await putLabels(number, [...baseLabels(fr), statusLabel("closed")]);
  await setIssueState(number, "closed", "completed");
}

/** Reopen a ticket and send it back to `pending`. */
export async function reopenPending(
  number: number,
  note: { author: string; text?: string }
): Promise<void> {
  const fr = await getFeatureRequest(number);
  if (!fr) throw new Error("Not a feature request");
  await setIssueState(number, "open", "reopened");
  await putLabels(number, [...baseLabels(fr), statusLabel("pending")]);
  await addComment({
    number,
    author: note.author,
    body: note.text?.trim() || "Sent back to **pending**.",
    photoUrls: [],
  });
}

"use client";

import { useCallback, useEffect, useState } from "react";
import { AttachmentZone } from "@/components/AttachmentZone";
import { uploadPhotos } from "@/lib/fr-upload";
import {
  formatFrNumber,
  FR_PRIORITIES,
  FR_TYPES,
  PRIORITY_META,
  STATUS_META,
  TYPE_META,
  type FrPriority,
  type FrStatus,
  type FrType,
} from "@/lib/feature-requests";
import type { FeatureRequest, FrComment } from "@/lib/github";

function fmtDateTime(iso: string): string {
  return new Date(iso).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

/** The lifecycle actions an admin can take, given the current status. */
function nextActions(status: FrStatus): { label: string; target: FrStatus }[] {
  switch (status) {
    case "pending":
      return [
        { label: "Mark for implementation", target: "implementation" },
        { label: "Move to testing", target: "testing" },
        { label: "Close", target: "closed" },
      ];
    case "implementation":
      return [
        { label: "Move to testing", target: "testing" },
        { label: "Send back to pending", target: "pending" },
        { label: "Close", target: "closed" },
      ];
    case "testing":
      return [
        { label: "✓ Confirm & close", target: "closed" },
        { label: "↩ Send back to pending", target: "pending" },
      ];
    case "closed":
      return [{ label: "Reopen (to pending)", target: "pending" }];
  }
}

// The comment shape returned by the API (mirror of lib/github FrComment).
type CommentDto = FrComment;

export function FeatureRequestDetail({
  request,
  isAdmin,
  onClose,
  onChanged,
}: {
  request: FeatureRequest;
  isAdmin: boolean;
  onClose: () => void;
  onChanged: () => void;
}) {
  const [comments, setComments] = useState<CommentDto[] | null>(null);
  const [loadErr, setLoadErr] = useState(false);

  const [body, setBody] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [posting, setPosting] = useState(false);

  const [note, setNote] = useState("");
  const [working, setWorking] = useState<FrStatus | null>(null);
  const [savingTag, setSavingTag] = useState(false);
  const [actionErr, setActionErr] = useState("");

  const status = request.status;
  const meta = STATUS_META[status];

  const loadComments = useCallback(async () => {
    try {
      const res = await fetch(
        `/api/feature-requests/${request.number}/comments`,
        { cache: "no-store" }
      );
      const json = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(json.error || "load failed");
      setComments(json.comments ?? []);
    } catch {
      setLoadErr(true);
    }
  }, [request.number]);

  useEffect(() => {
    loadComments();
  }, [loadComments]);

  // Close on Escape.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  async function postComment() {
    if (!body.trim() && files.length === 0) return;
    setPosting(true);
    setActionErr("");
    try {
      const photoUrls = await uploadPhotos(files);
      const res = await fetch(
        `/api/feature-requests/${request.number}/comments`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ body: body.trim(), photoUrls }),
        }
      );
      const json = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(json.error || "Could not post comment.");
      setBody("");
      setFiles([]);
      await loadComments();
      onChanged();
    } catch (err) {
      setActionErr(err instanceof Error ? err.message : "Could not post.");
    } finally {
      setPosting(false);
    }
  }

  async function changeTags(next: { priority?: FrPriority; type?: FrType }) {
    setSavingTag(true);
    setActionErr("");
    try {
      const res = await fetch(`/api/feature-requests/${request.number}/tags`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(next),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(json.error || "Could not update the tag.");
      // Refresh so the modal reflects the new tag without closing it.
      onChanged();
    } catch (err) {
      setActionErr(err instanceof Error ? err.message : "Could not update.");
    } finally {
      setSavingTag(false);
    }
  }

  async function changeStatus(target: FrStatus) {
    setWorking(target);
    setActionErr("");
    try {
      const res = await fetch(`/api/feature-requests/${request.number}/status`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: target, note: note.trim() }),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(json.error || "Could not update ticket.");
      setNote("");
      onChanged();
      onClose();
    } catch (err) {
      setActionErr(err instanceof Error ? err.message : "Could not update.");
      setWorking(null);
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/40 p-4 sm:p-8"
      onClick={onClose}
    >
      <div
        className="card my-auto w-full max-w-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between gap-3 border-b border-brand-border bg-brand-surface/60 px-5 py-4">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-mono text-xs font-bold text-brand-accentDark">
                {formatFrNumber(request.number)}
              </span>
              <StatusBadge status={status} />
              <span className="inline-flex items-center gap-1 text-xs text-brand-muted">
                <span className={`h-2 w-2 rounded-full ${PRIORITY_META[request.priority].dot}`} />
                {request.priority}
              </span>
              <span className="text-xs text-brand-muted">
                {TYPE_META[request.type].glyph} {TYPE_META[request.type].label}
              </span>
            </div>
            <h2 className="mt-1.5 font-sans text-lg font-semibold leading-tight text-brand-text">
              {request.title}
            </h2>
            <p className="mt-0.5 text-xs text-brand-muted">
              {request.requester ?? request.author} · {fmtDateTime(request.createdAt)}
            </p>
          </div>
          <div className="flex shrink-0 items-center gap-2">
            <button
              onClick={onClose}
              aria-label="Close"
              className="grid h-8 w-8 place-items-center rounded-full text-brand-muted hover:bg-brand-border/50"
            >
              ×
            </button>
          </div>
        </div>

        <div className="max-h-[70vh] overflow-y-auto px-5 py-4">
          {/* Details */}
          {request.details && (
            <Section title="Details">
              <p className="whitespace-pre-wrap font-serif text-sm leading-relaxed text-brand-text/85">
                {request.details}
              </p>
            </Section>
          )}
          {request.affected && (
            <Section title="Affected area">
              <p className="font-serif text-sm text-brand-text/85">
                {request.affected}
              </p>
            </Section>
          )}
          {request.photoUrls.length > 0 && (
            <Section title="Screenshots">
              <div className="flex flex-wrap gap-2">
                {request.photoUrls.map((u) => (
                  <a key={u} href={u} target="_blank" rel="noopener noreferrer">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={u}
                      alt="screenshot"
                      className="h-24 w-24 rounded-lg border border-brand-border object-cover"
                    />
                  </a>
                ))}
              </div>
            </Section>
          )}

          {/* History */}
          <Section title="Discussion">
            {loadErr ? (
              <p className="text-sm text-brand-danger">
                Couldn&apos;t load the discussion.
              </p>
            ) : comments === null ? (
              <p className="text-sm text-brand-muted">Loading…</p>
            ) : comments.length === 0 ? (
              <p className="text-sm text-brand-muted">No comments yet.</p>
            ) : (
              <ul className="space-y-3">
                {comments.map((c) => (
                  <li
                    key={c.id}
                    className="rounded-xl border border-brand-border bg-white p-3"
                  >
                    <p className="text-xs font-semibold text-brand-text">
                      {c.author ?? "Team"}{" "}
                      <span className="font-normal text-brand-muted">
                        · {fmtDateTime(c.createdAt)}
                      </span>
                    </p>
                    {c.body && (
                      <p className="mt-1 whitespace-pre-wrap font-serif text-sm text-brand-text/85">
                        {c.body}
                      </p>
                    )}
                    {c.photoUrls.length > 0 && (
                      <div className="mt-2 flex flex-wrap gap-2">
                        {c.photoUrls.map((u) => (
                          <a key={u} href={u} target="_blank" rel="noopener noreferrer">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={u}
                              alt="attachment"
                              className="h-16 w-16 rounded-md border border-brand-border object-cover"
                            />
                          </a>
                        ))}
                      </div>
                    )}
                  </li>
                ))}
              </ul>
            )}

            {/* Composer */}
            <div className="mt-3 space-y-2">
              <textarea
                className="input min-h-[72px] resize-y"
                placeholder="Add a comment…"
                value={body}
                disabled={posting}
                onChange={(e) => setBody(e.target.value)}
              />
              <AttachmentZone
                files={files}
                onChange={setFiles}
                disabled={posting}
                compact
              />
              <div className="flex justify-end">
                <button
                  onClick={postComment}
                  disabled={posting || (!body.trim() && files.length === 0)}
                  className="btn-primary"
                >
                  {posting ? "Posting…" : "Post comment"}
                </button>
              </div>
            </div>
          </Section>

          {/* Admin lifecycle controls */}
          {isAdmin && (
            <Section title="Maintainer actions">
              {/* Tags — change priority / type in place, without leaving the app. */}
              <p className="mb-1.5 text-xs font-medium text-brand-text">Priority</p>
              <div className="flex flex-wrap gap-2">
                {FR_PRIORITIES.map((p) => (
                  <button
                    key={p}
                    type="button"
                    disabled={savingTag}
                    onClick={() => changeTags({ priority: p })}
                    className={tagPill(request.priority === p)}
                  >
                    <span
                      className={`h-2 w-2 rounded-full ${PRIORITY_META[p].dot}`}
                      aria-hidden
                    />
                    {PRIORITY_META[p].label}
                  </button>
                ))}
              </div>
              <p className="mb-1.5 mt-3 text-xs font-medium text-brand-text">Type</p>
              <div className="flex flex-wrap gap-2">
                {FR_TYPES.map((t) => (
                  <button
                    key={t}
                    type="button"
                    disabled={savingTag}
                    onClick={() => changeTags({ type: t })}
                    className={tagPill(request.type === t)}
                  >
                    <span aria-hidden>{TYPE_META[t].glyph}</span>
                    {TYPE_META[t].label}
                  </button>
                ))}
              </div>

              <p className="mb-1.5 mt-4 text-xs font-medium text-brand-text">
                Status
              </p>
              <textarea
                className="input min-h-[56px] resize-y"
                placeholder="Optional note (posted as a comment with the status change)…"
                value={note}
                onChange={(e) => setNote(e.target.value)}
              />
              <div className="mt-2 flex flex-wrap gap-2">
                {nextActions(status).map((a) => (
                  <button
                    key={a.target + a.label}
                    onClick={() => changeStatus(a.target)}
                    disabled={working !== null}
                    className={
                      a.target === "closed"
                        ? "btn-teal"
                        : "btn-secondary"
                    }
                  >
                    {working === a.target ? "Working…" : a.label}
                  </button>
                ))}
              </div>
            </Section>
          )}

          {actionErr && (
            <p className="mt-2 text-sm text-brand-danger">{actionErr}</p>
          )}
        </div>
      </div>
    </div>
  );
}

/** Pill styling for the priority/type selectors; highlighted when active. */
function tagPill(active: boolean): string {
  return `inline-flex items-center gap-1.5 rounded-full border px-3 py-1 font-sans text-sm transition-colors disabled:opacity-50 ${
    active
      ? "border-brand-accent bg-brand-accent/10 font-semibold text-brand-text"
      : "border-brand-border text-brand-muted hover:border-brand-accent/40"
  }`;
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="border-t border-brand-border py-4 first:border-t-0 first:pt-0">
      <h3 className="mb-2 font-sans text-xs font-semibold uppercase tracking-wider text-brand-muted">
        {title}
      </h3>
      {children}
    </section>
  );
}

function StatusBadge({ status }: { status: FrStatus }) {
  const m = STATUS_META[status];
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 font-sans text-[10px] font-bold uppercase tracking-wide ${m.badge}`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${m.dot}`} />
      {m.short}
    </span>
  );
}

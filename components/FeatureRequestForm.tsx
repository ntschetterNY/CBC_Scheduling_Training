"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AttachmentZone } from "@/components/AttachmentZone";
import { uploadPhotos } from "@/lib/fr-upload";
import {
  FR_PRIORITIES,
  FR_TYPES,
  PRIORITY_META,
  TYPE_META,
  type FrPriority,
  type FrType,
} from "@/lib/feature-requests";

type Status = "idle" | "submitting" | "done" | "error";

/**
 * Form for filing a feature request / bug report. Screenshots upload to
 * Supabase Storage first; the resulting URLs are sent to
 * /api/feature-requests, which files the ticket and embeds them.
 */
export function FeatureRequestForm({
  disabled = false,
  onFiled,
}: {
  disabled?: boolean;
  /** Called after a request is successfully filed (e.g. to refresh a list). */
  onFiled?: () => void;
}) {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [details, setDetails] = useState("");
  const [affected, setAffected] = useState("");
  const [type, setType] = useState<FrType>("adjustment");
  const [priority, setPriority] = useState<FrPriority>("Medium");
  const [files, setFiles] = useState<File[]>([]);
  const [status, setStatus] = useState<Status>("idle");
  const [message, setMessage] = useState("");

  const busy = status === "submitting";

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (disabled) return;
    if (!title.trim() || !details.trim()) {
      setStatus("error");
      setMessage("Please add a summary and some details.");
      return;
    }

    setStatus("submitting");
    setMessage("");

    try {
      const photoUrls = await uploadPhotos(files);

      const res = await fetch("/api/feature-requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: title.trim(),
          details: details.trim(),
          affected: affected.trim(),
          type,
          priority,
          photoUrls,
        }),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(json.error || "Something went wrong. Please try again.");
      }

      setStatus("done");
      setMessage("Thanks! Your request was filed.");
      setTitle("");
      setDetails("");
      setAffected("");
      setType("adjustment");
      setPriority("Medium");
      setFiles([]);
      onFiled?.();
      router.refresh();
    } catch (err) {
      setStatus("error");
      setMessage(err instanceof Error ? err.message : "Something went wrong.");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="card p-5">
      <h3 className="font-sans text-sm font-semibold text-brand-text">
        File a new request
      </h3>
      <p className="mt-0.5 text-xs text-brand-muted">
        Describe the idea or bug. Screenshots help a lot.
      </p>

      <div className="mt-4 space-y-4">
        {/* Type */}
        <div>
          <span className="mb-1.5 block text-sm font-medium text-brand-text">
            Type
          </span>
          <div className="flex flex-wrap gap-2">
            {FR_TYPES.map((t) => (
              <button
                type="button"
                key={t}
                disabled={disabled || busy}
                onClick={() => setType(t)}
                className={`inline-flex items-center gap-1.5 rounded-full border px-3.5 py-1.5 font-sans text-sm transition-colors ${
                  type === t
                    ? "border-brand-accent bg-brand-accent/10 font-semibold text-brand-accentDark"
                    : "border-brand-border text-brand-muted hover:border-brand-accent/40"
                }`}
              >
                <span aria-hidden>{TYPE_META[t].glyph}</span>
                {TYPE_META[t].label}
              </button>
            ))}
          </div>
        </div>

        {/* Summary */}
        <div>
          <label
            htmlFor="fr-title"
            className="mb-1.5 block text-sm font-medium text-brand-text"
          >
            Summary
          </label>
          <input
            id="fr-title"
            className="input"
            placeholder="e.g. Add a dark mode for the booth at night"
            value={title}
            maxLength={200}
            disabled={disabled || busy}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>

        {/* Priority */}
        <div>
          <span className="mb-1.5 block text-sm font-medium text-brand-text">
            Priority
          </span>
          <div className="flex flex-wrap gap-2">
            {FR_PRIORITIES.map((p) => (
              <button
                type="button"
                key={p}
                disabled={disabled || busy}
                onClick={() => setPriority(p)}
                className={`inline-flex items-center gap-1.5 rounded-full border px-3.5 py-1.5 font-sans text-sm transition-colors ${
                  priority === p
                    ? "border-brand-accent bg-brand-accent/10 font-semibold text-brand-text"
                    : "border-brand-border text-brand-muted hover:border-brand-accent/40"
                }`}
              >
                <span
                  className={`h-2 w-2 rounded-full ${PRIORITY_META[p].dot}`}
                  aria-hidden
                />
                {PRIORITY_META[p].label}
              </button>
            ))}
          </div>
        </div>

        {/* Details */}
        <div>
          <label
            htmlFor="fr-details"
            className="mb-1.5 block text-sm font-medium text-brand-text"
          >
            Details
          </label>
          <textarea
            id="fr-details"
            className="input min-h-[120px] resize-y"
            placeholder="What would you like to see, or what went wrong? Steps to reproduce a bug are gold."
            value={details}
            disabled={disabled || busy}
            onChange={(e) => setDetails(e.target.value)}
          />
        </div>

        {/* Affected area */}
        <div>
          <label
            htmlFor="fr-affected"
            className="mb-1.5 block text-sm font-medium text-brand-text"
          >
            Affected area{" "}
            <span className="text-brand-muted">(optional)</span>
          </label>
          <input
            id="fr-affected"
            className="input"
            placeholder="e.g. Sound Tech · Module 4, or the dashboard"
            value={affected}
            maxLength={200}
            disabled={disabled || busy}
            onChange={(e) => setAffected(e.target.value)}
          />
        </div>

        {/* Screenshots */}
        <div>
          <span className="mb-1.5 block text-sm font-medium text-brand-text">
            Screenshots <span className="text-brand-muted">(optional)</span>
          </span>
          <AttachmentZone
            files={files}
            onChange={setFiles}
            disabled={disabled || busy}
          />
        </div>
      </div>

      {message && (
        <div
          className={`mt-4 rounded-lg px-3 py-2 text-sm ${
            status === "error"
              ? "bg-brand-danger/10 text-brand-danger"
              : "bg-brand-success/10 text-brand-success"
          }`}
          role="status"
        >
          {message}
        </div>
      )}

      <div className="mt-4 flex items-center gap-3">
        <button type="submit" className="btn-primary" disabled={disabled || busy}>
          {busy ? "Filing…" : "Submit request"}
        </button>
        {disabled && (
          <span className="text-xs text-brand-muted">
            The tracker isn&apos;t connected yet, so submissions are paused.
          </span>
        )}
      </div>
    </form>
  );
}

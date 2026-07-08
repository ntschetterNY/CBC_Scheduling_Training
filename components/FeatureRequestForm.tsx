"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import {
  FEATURE_PHOTO_BUCKET,
  MAX_PHOTOS,
  MAX_PHOTO_BYTES,
} from "@/lib/feature-requests";

type Status = "idle" | "submitting" | "done" | "error";

/**
 * Form for filing a feature request / bug report. Photos are uploaded straight
 * to Supabase Storage from the browser; the resulting public URLs are sent to
 * /api/feature-requests, which opens the GitHub issue and embeds them.
 */
export function FeatureRequestForm({ disabled = false }: { disabled?: boolean }) {
  const router = useRouter();
  const fileInput = useRef<HTMLInputElement>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [status, setStatus] = useState<Status>("idle");
  const [message, setMessage] = useState("");
  const [createdUrl, setCreatedUrl] = useState<string | null>(null);

  function onPickFiles(e: React.ChangeEvent<HTMLInputElement>) {
    const picked = Array.from(e.target.files ?? []);
    const images = picked.filter((f) => f.type.startsWith("image/"));
    const tooBig = images.find((f) => f.size > MAX_PHOTO_BYTES);
    if (tooBig) {
      setStatus("error");
      setMessage(`"${tooBig.name}" is larger than 10 MB.`);
      return;
    }
    if (images.length > MAX_PHOTOS) {
      setStatus("error");
      setMessage(`Please attach at most ${MAX_PHOTOS} photos.`);
      return;
    }
    setStatus("idle");
    setMessage("");
    setFiles(images);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (disabled) return;
    if (!title.trim() || !description.trim()) {
      setStatus("error");
      setMessage("Please add a title and a description.");
      return;
    }

    setStatus("submitting");
    setMessage("");
    setCreatedUrl(null);

    try {
      // 1. Upload any screenshots to Supabase Storage, collect public URLs.
      const photoUrls: string[] = [];
      if (files.length > 0) {
        const supabase = createClient();
        for (const file of files) {
          const ext = (file.name.split(".").pop() || "png").toLowerCase();
          const path = `${crypto.randomUUID()}.${ext}`;
          const { error } = await supabase.storage
            .from(FEATURE_PHOTO_BUCKET)
            .upload(path, file, { contentType: file.type, upsert: false });
          if (error) {
            throw new Error(`Photo upload failed: ${error.message}`);
          }
          const { data } = supabase.storage
            .from(FEATURE_PHOTO_BUCKET)
            .getPublicUrl(path);
          photoUrls.push(data.publicUrl);
        }
      }

      // 2. Ask the server to open the GitHub issue.
      const res = await fetch("/api/feature-requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: title.trim(),
          description: description.trim(),
          photoUrls,
        }),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(json.error || "Something went wrong. Please try again.");
      }

      setStatus("done");
      setCreatedUrl(json.url ?? null);
      setMessage("Thanks! Your request was filed.");
      setTitle("");
      setDescription("");
      setFiles([]);
      if (fileInput.current) fileInput.current.value = "";
      router.refresh(); // pull the new item into the list below
    } catch (err) {
      setStatus("error");
      setMessage(err instanceof Error ? err.message : "Something went wrong.");
    }
  }

  const busy = status === "submitting";

  return (
    <form onSubmit={handleSubmit} className="card p-5">
      <h3 className="text-sm font-semibold text-brand-text">
        File a new request
      </h3>
      <p className="mt-0.5 text-xs text-brand-muted">
        Describe the idea or bug. Screenshots help a lot — drag them in below.
      </p>

      <div className="mt-4 space-y-4">
        <div>
          <label htmlFor="fr-title" className="mb-1.5 block text-sm font-medium text-brand-text">
            Title
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

        <div>
          <label htmlFor="fr-desc" className="mb-1.5 block text-sm font-medium text-brand-text">
            Description
          </label>
          <textarea
            id="fr-desc"
            className="input min-h-[120px] resize-y"
            placeholder="What would you like to see, or what went wrong? Steps to reproduce a bug are gold."
            value={description}
            disabled={disabled || busy}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        <div>
          <label htmlFor="fr-photos" className="mb-1.5 block text-sm font-medium text-brand-text">
            Screenshots <span className="text-brand-muted">(optional)</span>
          </label>
          <input
            id="fr-photos"
            ref={fileInput}
            type="file"
            accept="image/*"
            multiple
            disabled={disabled || busy}
            onChange={onPickFiles}
            className="block w-full text-sm text-brand-muted file:mr-3 file:rounded-lg file:border-0 file:bg-brand-surface file:px-3 file:py-2 file:text-sm file:font-semibold file:text-brand-text hover:file:bg-brand-border/60"
          />
          {files.length > 0 && (
            <p className="mt-1 text-xs text-brand-muted">
              {files.length} photo{files.length > 1 ? "s" : ""} attached:{" "}
              {files.map((f) => f.name).join(", ")}
            </p>
          )}
          <p className="mt-1 text-[11px] text-brand-muted">
            Up to {MAX_PHOTOS} images, 10 MB each.
          </p>
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
          {message}{" "}
          {createdUrl && (
            <a
              href={createdUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold underline"
            >
              View it on GitHub →
            </a>
          )}
        </div>
      )}

      <div className="mt-4 flex items-center gap-3">
        <button
          type="submit"
          className="btn-primary"
          disabled={disabled || busy}
        >
          {busy ? "Filing…" : "Submit request"}
        </button>
        {disabled && (
          <span className="text-xs text-brand-muted">
            Connect GitHub to enable submissions.
          </span>
        )}
      </div>
    </form>
  );
}

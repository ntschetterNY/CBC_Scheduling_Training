"use client";

import { useRef, useState, type ClipboardEvent, type DragEvent } from "react";
import { MAX_PHOTOS } from "@/lib/feature-requests";
import { isAcceptableImage } from "@/lib/fr-upload";

/**
 * A reusable attachment picker: paste a screenshot, drag-and-drop, or browse.
 * It's a controlled component — the parent owns the `files` array and uploads
 * them on submit. Used by both the request form and the comment composer.
 */
export function AttachmentZone({
  files,
  onChange,
  disabled = false,
  max = MAX_PHOTOS,
  hint = `Paste, drop, or browse — up to ${MAX_PHOTOS} images, 10 MB each.`,
  compact = false,
}: {
  files: File[];
  onChange: (files: File[]) => void;
  disabled?: boolean;
  max?: number;
  hint?: string;
  compact?: boolean;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);
  const [error, setError] = useState("");

  function addFiles(incoming: File[]) {
    setError("");
    const images = incoming.filter((f) => f.type.startsWith("image/"));
    if (images.length === 0) return;
    const bad = images.find((f) => !isAcceptableImage(f));
    if (bad) {
      setError(`"${bad.name}" must be a PNG/JPG/GIF/WebP under 10 MB.`);
      return;
    }
    const combined = [...files, ...images].slice(0, max);
    if (files.length + images.length > max) {
      setError(`At most ${max} images.`);
    }
    onChange(combined);
  }

  function onDrop(e: DragEvent) {
    e.preventDefault();
    setDragging(false);
    if (disabled) return;
    addFiles(Array.from(e.dataTransfer.files));
  }

  function onPaste(e: ClipboardEvent) {
    if (disabled) return;
    const pasted = Array.from(e.clipboardData.files);
    if (pasted.length > 0) {
      e.preventDefault();
      addFiles(pasted);
    }
  }

  function removeAt(i: number) {
    onChange(files.filter((_, idx) => idx !== i));
  }

  return (
    <div>
      <div
        role="button"
        tabIndex={disabled ? -1 : 0}
        onPaste={onPaste}
        onDragOver={(e) => {
          e.preventDefault();
          if (!disabled) setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={onDrop}
        onClick={() => !disabled && inputRef.current?.click()}
        onKeyDown={(e) => {
          if ((e.key === "Enter" || e.key === " ") && !disabled) {
            e.preventDefault();
            inputRef.current?.click();
          }
        }}
        className={`flex cursor-pointer flex-col items-center justify-center rounded-xl border border-dashed text-center transition-colors ${
          compact ? "px-3 py-3" : "px-4 py-6"
        } ${
          dragging
            ? "border-brand-accent bg-brand-accent/5"
            : "border-brand-border bg-brand-surface/40 hover:border-brand-accent/50"
        } ${disabled ? "cursor-not-allowed opacity-60" : ""}`}
      >
        <p className="font-sans text-sm font-medium text-brand-text">
          {compact ? "Attach a screenshot" : "Drop or paste a screenshot"}
        </p>
        {!compact && <p className="mt-0.5 text-[11px] text-brand-muted">{hint}</p>}
        <input
          ref={inputRef}
          type="file"
          accept="image/png,image/jpeg,image/gif,image/webp"
          multiple
          disabled={disabled}
          className="hidden"
          onChange={(e) => {
            addFiles(Array.from(e.target.files ?? []));
            if (inputRef.current) inputRef.current.value = "";
          }}
        />
      </div>

      {error && <p className="mt-1.5 text-xs text-brand-danger">{error}</p>}

      {files.length > 0 && (
        <ul className="mt-2 flex flex-wrap gap-2">
          {files.map((f, i) => (
            <li
              key={`${f.name}-${i}`}
              className="group relative h-16 w-16 overflow-hidden rounded-lg border border-brand-border bg-brand-card"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={URL.createObjectURL(f)}
                alt={f.name}
                className="h-full w-full object-cover"
              />
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  removeAt(i);
                }}
                aria-label={`Remove ${f.name}`}
                className="absolute right-0.5 top-0.5 grid h-5 w-5 place-items-center rounded-full bg-black/60 text-xs text-white opacity-0 transition-opacity group-hover:opacity-100"
              >
                ×
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

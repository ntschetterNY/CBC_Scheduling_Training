"use client";

import { createClient } from "@/lib/supabase/client";
import {
  FEATURE_PHOTO_BUCKET,
  MAX_ATTACHMENT_BYTES,
} from "@/lib/feature-requests";

/** Client-side check mirroring what the browser attachment zone enforces.
 *  Any file type is accepted (FR-017); only the size is capped. */
export function isAcceptableAttachment(file: File): boolean {
  return file.size > 0 && file.size <= MAX_ATTACHMENT_BYTES;
}

/** Storage-safe version of the original file name, kept in the object path so
 *  the GitHub issue can link attachments by their real names. */
function safeFileName(name: string): string {
  const cleaned = name.replace(/[^A-Za-z0-9._-]+/g, "_").slice(-80);
  return cleaned || "file";
}

/**
 * Upload attachments straight to Supabase Storage from the browser and return
 * their public URLs (which get embedded into the GitHub issue/comment as
 * inline images or file links). Throws on the first failed upload.
 */
export async function uploadAttachments(files: File[]): Promise<string[]> {
  if (files.length === 0) return [];
  const supabase = createClient();
  const urls: string[] = [];
  for (const file of files) {
    const path = `${crypto.randomUUID()}-${safeFileName(file.name)}`;
    const { error } = await supabase.storage
      .from(FEATURE_PHOTO_BUCKET)
      .upload(path, file, {
        contentType: file.type || "application/octet-stream",
        upsert: false,
      });
    if (error) throw new Error(`Attachment upload failed: ${error.message}`);
    const { data } = supabase.storage
      .from(FEATURE_PHOTO_BUCKET)
      .getPublicUrl(path);
    urls.push(data.publicUrl);
  }
  return urls;
}

"use client";

import { createClient } from "@/lib/supabase/client";
import {
  ACCEPTED_IMAGE_TYPES,
  FEATURE_PHOTO_BUCKET,
  MAX_PHOTO_BYTES,
} from "@/lib/feature-requests";

/** Client-side check mirroring what the browser attachment zone enforces. */
export function isAcceptableImage(file: File): boolean {
  return (
    ACCEPTED_IMAGE_TYPES.includes(file.type) && file.size <= MAX_PHOTO_BYTES
  );
}

/**
 * Upload image files straight to Supabase Storage from the browser and return
 * their public URLs (which get embedded into the GitHub issue/comment). Throws
 * on the first failed upload.
 */
export async function uploadPhotos(files: File[]): Promise<string[]> {
  if (files.length === 0) return [];
  const supabase = createClient();
  const urls: string[] = [];
  for (const file of files) {
    const ext = (file.name.split(".").pop() || "png").toLowerCase();
    const path = `${crypto.randomUUID()}.${ext}`;
    const { error } = await supabase.storage
      .from(FEATURE_PHOTO_BUCKET)
      .upload(path, file, { contentType: file.type, upsert: false });
    if (error) throw new Error(`Photo upload failed: ${error.message}`);
    const { data } = supabase.storage
      .from(FEATURE_PHOTO_BUCKET)
      .getPublicUrl(path);
    urls.push(data.publicUrl);
  }
  return urls;
}

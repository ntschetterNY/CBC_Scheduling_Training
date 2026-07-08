/**
 * Shared, non-secret constants for the Feature Request tracker. Safe to import
 * from both Client and Server Components (no token or server-only code here).
 */

/** Supabase Storage bucket that holds screenshots attached to requests. */
export const FEATURE_PHOTO_BUCKET = "feature-request-photos";

/** How many screenshots a single request may include. */
export const MAX_PHOTOS = 5;

/** Per-file size cap (10 MB). */
export const MAX_PHOTO_BYTES = 10 * 1024 * 1024;

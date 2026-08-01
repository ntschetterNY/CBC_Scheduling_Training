/**
 * Server-only helpers shared by the Feature Request page and its API routes:
 * resolving the current actor (name + admin flag), validating uploaded photo
 * URLs, and loading the dashboard payload (tickets + upvote tallies).
 *
 * Import only from Server Components / Route Handlers.
 */

import { createClient } from "@/lib/supabase/server";
import { SUPABASE_URL } from "@/lib/supabase/config";
import { listFeatureRequests, type FeatureRequest } from "@/lib/github";
import { FEATURE_PHOTO_BUCKET, MAX_PHOTOS } from "@/lib/feature-requests";

/** Only accept photo URLs that point at our own public storage bucket. */
export const ALLOWED_PHOTO_PREFIX = `${SUPABASE_URL}/storage/v1/object/public/${FEATURE_PHOTO_BUCKET}/`;

/** Keep only well-formed URLs from our bucket, capped at MAX_PHOTOS. */
export function sanitizePhotoUrls(input: unknown): string[] {
  return Array.isArray(input)
    ? input
        .filter((u): u is string => typeof u === "string")
        .filter((u) => u.startsWith(ALLOWED_PHOTO_PREFIX))
        .slice(0, MAX_PHOTOS)
    : [];
}

export type FrActor = {
  id: string;
  email: string | null;
  /** Display name: profile full name, else the email local part. */
  name: string;
  isAdmin: boolean;
};

/**
 * Resolve the signed-in user into a ticket "actor". Returns null when there is
 * no session. Uses the request's Supabase client so RLS/cookies apply.
 */
export async function getActor(): Promise<FrActor | null> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name, role")
    .eq("id", user.id)
    .maybeSingle();

  const name =
    profile?.full_name?.trim() ||
    (user.email ? user.email.split("@")[0] : "") ||
    "Unknown";

  return {
    id: user.id,
    email: user.email ?? null,
    name,
    isAdmin: profile?.role === "admin",
  };
}

export type DashboardData = {
  requests: FeatureRequest[];
  /** issue number -> upvote count */
  upvotes: Record<number, number>;
  /** issue numbers the current user has upvoted */
  myUpvotes: number[];
};

/**
 * Load everything the dashboard needs in one shot: the tickets from GitHub and
 * the upvote tallies from Supabase (total per ticket + which ones `userId`
 * voted for). Reused by the page's initial server render and the GET route.
 */
export async function loadDashboardData(userId: string): Promise<DashboardData> {
  const supabase = await createClient();
  const [requests, votesRes] = await Promise.all([
    listFeatureRequests(),
    supabase.from("feature_request_upvotes").select("issue_number, user_id"),
  ]);

  const upvotes: Record<number, number> = {};
  const myUpvotes: number[] = [];
  for (const row of votesRes.data ?? []) {
    const n = row.issue_number as number;
    upvotes[n] = (upvotes[n] ?? 0) + 1;
    if (row.user_id === userId) myUpvotes.push(n);
  }

  return { requests, upvotes, myUpvotes };
}

/**
 * Access helpers.
 *
 * The "super admin" is the person who can see time-on-task analytics and seed
 * other admins from the app UI. They're identified by email so the first one
 * is bootstrapped without any Supabase table edits — keep this list in sync
 * with `is_super_admin()` in supabase/migrations/0002_admin_analytics.sql.
 */
export const SUPER_ADMIN_EMAILS = ["natecards@gmail.com"];

export function isSuperAdmin(email?: string | null): boolean {
  if (!email) return false;
  return SUPER_ADMIN_EMAILS.includes(email.trim().toLowerCase());
}

/** Format a duration in seconds as a compact human string (e.g. "1h 4m", "3m 20s"). */
export function formatDuration(totalSeconds: number | null | undefined): string {
  const s = Math.max(0, Math.round(totalSeconds ?? 0));
  if (s === 0) return "—";
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = s % 60;
  if (h > 0) return `${h}h ${m}m`;
  if (m > 0) return `${m}m ${sec}s`;
  return `${sec}s`;
}

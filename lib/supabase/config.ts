/**
 * Central place for Supabase connection values.
 *
 * When the env vars aren't set (e.g. the very first deploy before you've
 * added them, or a quick local preview), we fall back to harmless placeholder
 * values so the app still renders. In that state there is no session, so
 * `auth.getUser()` simply returns no user and public pages work fine — the
 * sign-in form shows a "not configured yet" notice.
 */
export const SUPABASE_URL =
  process.env.NEXT_PUBLIC_SUPABASE_URL || "https://placeholder.supabase.co";

export const SUPABASE_ANON_KEY =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "placeholder-anon-key";

export const isSupabaseConfigured = Boolean(
  process.env.NEXT_PUBLIC_SUPABASE_URL &&
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

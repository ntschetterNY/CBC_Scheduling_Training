import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

/**
 * OAuth callback. After a provider (e.g. Microsoft) authenticates the user,
 * they're redirected here with a one-time `code`. We exchange it for a
 * Supabase session (stored in cookies) and send them on to `next`.
 *
 * No email is ever sent by Supabase in this flow — identity and MFA are
 * handled entirely by the provider.
 */
export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const nextParam = searchParams.get("next") || "/dashboard";
  // Only allow same-app relative redirects.
  const next = nextParam.startsWith("/") ? nextParam : "/dashboard";

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  // Something went wrong (denied consent, expired code, etc.) — back to login.
  return NextResponse.redirect(`${origin}/login?authError=1`);
}

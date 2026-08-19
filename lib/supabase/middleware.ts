import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { isSuperAdmin } from "@/lib/access";
import { SUPABASE_ANON_KEY, SUPABASE_URL } from "./config";

/**
 * Refreshes the Supabase auth session on every request and guards
 * authenticated routes. Public routes are allowed through unauthenticated.
 *
 * Signed-in users whose account hasn't been approved by the super admin yet
 * are held at /pending — they can't reach any app page or API until approved
 * (RLS enforces the same at the data layer).
 */
export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(
    SUPABASE_URL,
    SUPABASE_ANON_KEY,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(
          cookiesToSet: {
            name: string;
            value: string;
            options?: Record<string, unknown>;
          }[]
        ) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const protectedPaths = ["/dashboard", "/learn", "/safety", "/admin", "/feature-requests", "/schedule"];
  const isProtected = protectedPaths.some((p) =>
    request.nextUrl.pathname.startsWith(p)
  );

  // The availability-poll response page is token-authenticated by design —
  // it must work straight from an email link without signing in.
  if (request.nextUrl.pathname.startsWith("/schedule/confirm")) {
    return supabaseResponse;
  }

  if (isProtected && !user) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    url.searchParams.set("redirectedFrom", request.nextUrl.pathname);
    return NextResponse.redirect(url);
  }

  // Approval gate. APIs are covered too, except /api/audit so pending users'
  // page views still land in the audit log.
  const pathname = request.nextUrl.pathname;
  const isApi = pathname.startsWith("/api") && !pathname.startsWith("/api/audit");
  if (user && (isProtected || isApi) && !isSuperAdmin(user.email)) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("approved")
      .eq("id", user.id)
      .maybeSingle();
    if (!profile?.approved) {
      if (isApi) {
        return NextResponse.json(
          { error: "Account pending approval" },
          { status: 403 }
        );
      }
      const url = request.nextUrl.clone();
      url.pathname = "/pending";
      url.search = "";
      return NextResponse.redirect(url);
    }
  }

  return supabaseResponse;
}

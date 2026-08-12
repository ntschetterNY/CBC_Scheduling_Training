import { NextResponse } from "next/server";
import { getActor } from "@/lib/fr-server";
import { isSuperAdmin } from "@/lib/access";

/**
 * GET /api/lavish-access — server-authoritative gate for the Lavish markup tool.
 *
 * The overlay (components/LavishOverlay.tsx) calls this on mount instead of
 * checking auth in the browser, so eligibility is decided the same reliable way
 * the rest of the app decides roles: server-side, from the session cookie.
 *
 * The `email`/`isAdmin`/`isSuper` fields are returned only to the signed-in
 * caller about themselves, so this endpoint doubles as a diagnostic you can open
 * directly in the browser to see exactly what the server thinks your account is.
 */
export async function GET() {
  const actor = await getActor();
  if (!actor) {
    return NextResponse.json({ canMarkup: false, signedIn: false });
  }
  const isSuper = isSuperAdmin(actor.email);
  return NextResponse.json({
    canMarkup: actor.isAdmin || isSuper,
    signedIn: true,
    email: actor.email,
    isAdmin: actor.isAdmin,
    isSuper,
  });
}

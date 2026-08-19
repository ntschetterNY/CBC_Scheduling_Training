import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

/**
 * Ingest endpoint for the client-side ActivityTracker. Accepts a batch of
 * page-view/click events, attributes them to the signed-in user, and inserts
 * them into audit_log (whose RLS only allows inserting your own rows).
 * Anonymous requests are dropped with a 204 so the client never retries.
 */

const ALLOWED_EVENTS = new Set(["page_view", "click"]);
const MAX_EVENTS = 50;

type IncomingEvent = {
  event?: unknown;
  path?: unknown;
  target?: unknown;
  duration_ms?: unknown;
};

function clampText(value: unknown, max: number): string | null {
  return typeof value === "string" && value.length > 0
    ? value.slice(0, max)
    : null;
}

export async function POST(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return new NextResponse(null, { status: 204 });

  let events: IncomingEvent[];
  try {
    const body = await request.json();
    events = Array.isArray(body?.events) ? body.events : [];
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const rows = events
    .slice(0, MAX_EVENTS)
    .filter((e) => typeof e?.event === "string" && ALLOWED_EVENTS.has(e.event))
    .map((e) => {
      const duration =
        typeof e.duration_ms === "number" &&
        Number.isFinite(e.duration_ms) &&
        e.duration_ms >= 0
          ? Math.min(Math.round(e.duration_ms), 300_000)
          : null;
      return {
        user_id: user.id,
        email: user.email ?? null,
        event: e.event as string,
        path: clampText(e.path, 300),
        target: clampText(e.target, 120),
        duration_ms: duration,
      };
    });

  if (rows.length === 0) return new NextResponse(null, { status: 204 });

  const { error } = await supabase.from("audit_log").insert(rows);
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return new NextResponse(null, { status: 204 });
}

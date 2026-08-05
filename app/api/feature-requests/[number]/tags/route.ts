import { NextResponse } from "next/server";
import { isGitHubConfigured, setMeta } from "@/lib/github";
import {
  FR_PRIORITIES,
  FR_TYPES,
  type FrPriority,
  type FrType,
} from "@/lib/feature-requests";
import { getActor } from "@/lib/fr-server";

function parseNumber(raw: string): number | null {
  const n = Number.parseInt(raw, 10);
  return Number.isInteger(n) && n > 0 ? n : null;
}

/**
 * POST — change a ticket's priority and/or type tag. Admin-only. Body:
 * { priority?: "Critical"|"High"|"Medium"|"Low", type?: "new-feature"|"adjustment" }
 *
 * Leaves the ticket's status and open/closed state untouched, so a maintainer
 * can retag and (separately) close a request entirely from the app.
 */
export async function POST(
  request: Request,
  { params }: { params: Promise<{ number: string }> }
) {
  const actor = await getActor();
  if (!actor) {
    return NextResponse.json({ error: "Not signed in." }, { status: 401 });
  }
  if (!actor.isAdmin) {
    return NextResponse.json(
      { error: "Only maintainers can change a ticket's tags." },
      { status: 403 }
    );
  }
  const number = parseNumber((await params).number);
  if (!number) {
    return NextResponse.json({ error: "Bad ticket number." }, { status: 400 });
  }
  if (!isGitHubConfigured) {
    return NextResponse.json(
      { error: "The tracker isn't connected yet." },
      { status: 503 }
    );
  }

  let payload: Record<string, unknown>;
  try {
    payload = (await request.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const next: { priority?: FrPriority; type?: FrType } = {};
  if (payload.priority !== undefined) {
    if (!(FR_PRIORITIES as string[]).includes(payload.priority as string)) {
      return NextResponse.json({ error: "Unknown priority." }, { status: 400 });
    }
    next.priority = payload.priority as FrPriority;
  }
  if (payload.type !== undefined) {
    if (!(FR_TYPES as string[]).includes(payload.type as string)) {
      return NextResponse.json({ error: "Unknown type." }, { status: 400 });
    }
    next.type = payload.type as FrType;
  }
  if (next.priority === undefined && next.type === undefined) {
    return NextResponse.json(
      { error: "Nothing to change." },
      { status: 400 }
    );
  }

  try {
    await setMeta(number, next);
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Tag change failed:", err);
    return NextResponse.json(
      { error: "Could not update the ticket. Please try again." },
      { status: 502 }
    );
  }
}

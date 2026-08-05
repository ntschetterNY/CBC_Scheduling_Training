import { NextResponse } from "next/server";
import {
  closeRequest,
  isGitHubConfigured,
  reopenPending,
  setStatus,
} from "@/lib/github";
import { FR_STATUSES, type FrStatus } from "@/lib/feature-requests";
import { getActor } from "@/lib/fr-server";

function parseNumber(raw: string): number | null {
  const n = Number.parseInt(raw, 10);
  return Number.isInteger(n) && n > 0 ? n : null;
}

/**
 * POST — move a ticket to a new lifecycle status. Admin-only.
 * Body: { status: "pending"|"implementation"|"testing"|"closed", note?: string }
 *
 * "closed" closes the issue; sending an already-closed ticket to "pending"
 * reopens it (this is the "send back to pending" action).
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
      { error: "Only maintainers can change a ticket's status." },
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

  const status = payload.status as string;
  if (!(FR_STATUSES as string[]).includes(status)) {
    return NextResponse.json({ error: "Unknown status." }, { status: 400 });
  }
  const note = typeof payload.note === "string" ? payload.note.trim() : "";

  try {
    if (status === "closed") {
      await closeRequest(number, { author: actor.name, text: note });
    } else if (status === "pending") {
      // Reopen-and-reset when it was closed; otherwise a plain move.
      await reopenPending(number, { author: actor.name, text: note });
    } else {
      await setStatus(number, status as Exclude<FrStatus, "closed">, {
        author: actor.name,
        text: note,
      });
    }
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Status change failed:", err);
    return NextResponse.json(
      { error: "Could not update the ticket. Please try again." },
      { status: 502 }
    );
  }
}

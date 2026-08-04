import { NextResponse } from "next/server";
import { addComment, isGitHubConfigured, listComments } from "@/lib/github";
import { getActor, sanitizePhotoUrls } from "@/lib/fr-server";

function parseNumber(raw: string): number | null {
  const n = Number.parseInt(raw, 10);
  return Number.isInteger(n) && n > 0 ? n : null;
}

/** GET — the comment thread for one ticket. */
export async function GET(
  _req: Request,
  { params }: { params: Promise<{ number: string }> }
) {
  const actor = await getActor();
  if (!actor) {
    return NextResponse.json({ error: "Not signed in." }, { status: 401 });
  }
  const number = parseNumber((await params).number);
  if (!number) {
    return NextResponse.json({ error: "Bad ticket number." }, { status: 400 });
  }
  if (!isGitHubConfigured) {
    return NextResponse.json({ comments: [] });
  }
  try {
    const comments = await listComments(number);
    return NextResponse.json({ comments });
  } catch (err) {
    console.error("Comment load failed:", err);
    return NextResponse.json(
      { error: "Could not load the discussion right now." },
      { status: 502 }
    );
  }
}

/** POST — add a comment (with optional screenshots) to a ticket. */
export async function POST(
  request: Request,
  { params }: { params: Promise<{ number: string }> }
) {
  const actor = await getActor();
  if (!actor) {
    return NextResponse.json(
      { error: "You must be signed in to comment." },
      { status: 401 }
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

  const body = typeof payload.body === "string" ? payload.body.trim() : "";
  const photoUrls = sanitizePhotoUrls(payload.photoUrls);
  if (!body && photoUrls.length === 0) {
    return NextResponse.json(
      { error: "Add a comment or an attachment." },
      { status: 400 }
    );
  }

  try {
    await addComment({ number, author: actor.name, body, photoUrls });
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Comment post failed:", err);
    return NextResponse.json(
      { error: "Could not post your comment. Please try again." },
      { status: 502 }
    );
  }
}

import { NextResponse } from "next/server";
import {
  createFeatureRequestIssue,
  isGitHubConfigured,
} from "@/lib/github";
import {
  FR_PRIORITIES,
  FR_TYPES,
  type FrPriority,
  type FrType,
} from "@/lib/feature-requests";
import {
  getActor,
  loadDashboardData,
  sanitizePhotoUrls,
} from "@/lib/fr-server";
import type { MarkupNote } from "@/lib/markup";

/** Coerce an untrusted `markup` payload into safe MarkupNotes (or []). */
function sanitizeMarkup(v: unknown): MarkupNote[] {
  if (!Array.isArray(v)) return [];
  const str = (x: unknown) => (typeof x === "string" ? x.slice(0, 1000) : "");
  return v
    .slice(0, 50)
    .map((n) => {
      const o = (n ?? {}) as Record<string, unknown>;
      return {
        route: str(o.route),
        selector: str(o.selector),
        tag: str(o.tag),
        text: str(o.text),
        change: str(o.change),
      };
    })
    .filter((n) => n.change || n.selector);
}

/** GET /api/feature-requests — dashboard payload (tickets + upvotes). */
export async function GET() {
  const actor = await getActor();
  if (!actor) {
    return NextResponse.json({ error: "Not signed in." }, { status: 401 });
  }
  if (!isGitHubConfigured) {
    return NextResponse.json(
      { requests: [], upvotes: {}, myUpvotes: [] },
      { status: 200 }
    );
  }
  try {
    const data = await loadDashboardData(actor.id);
    return NextResponse.json(data);
  } catch (err) {
    console.error("Feature request list failed:", err);
    return NextResponse.json(
      { error: "Could not load requests right now." },
      { status: 502 }
    );
  }
}

/** POST /api/feature-requests — file a new request as a tracked ticket. */
export async function POST(request: Request) {
  const actor = await getActor();
  if (!actor) {
    return NextResponse.json(
      { error: "You must be signed in to file a request." },
      { status: 401 }
    );
  }

  if (!isGitHubConfigured) {
    return NextResponse.json(
      {
        error:
          "The tracker isn't connected yet. An admin needs to finish setting it up.",
      },
      { status: 503 }
    );
  }

  let payload: Record<string, unknown>;
  try {
    payload = (await request.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const title = typeof payload.title === "string" ? payload.title.trim() : "";
  const details =
    typeof payload.details === "string" ? payload.details.trim() : "";
  const affected =
    typeof payload.affected === "string" ? payload.affected.trim() : "";
  const priority: FrPriority = (FR_PRIORITIES as string[]).includes(
    payload.priority as string
  )
    ? (payload.priority as FrPriority)
    : "Medium";
  const type: FrType = (FR_TYPES as string[]).includes(payload.type as string)
    ? (payload.type as FrType)
    : "adjustment";
  const photoUrls = sanitizePhotoUrls(payload.photoUrls);
  const markup = sanitizeMarkup(payload.markup);

  if (!title || !details) {
    return NextResponse.json(
      { error: "Please include a summary and details." },
      { status: 400 }
    );
  }
  if (title.length > 200) {
    return NextResponse.json(
      { error: "Summary must be 200 characters or fewer." },
      { status: 400 }
    );
  }

  try {
    const issue = await createFeatureRequestIssue({
      title,
      details,
      affected,
      priority,
      type,
      requester: actor.name,
      email: actor.email,
      photoUrls,
      markup,
    });
    return NextResponse.json({ number: issue.number, url: issue.url });
  } catch (err) {
    console.error("Feature request issue creation failed:", err);
    return NextResponse.json(
      { error: "Could not file your request. Please try again later." },
      { status: 502 }
    );
  }
}

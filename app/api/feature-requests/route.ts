import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { SUPABASE_URL } from "@/lib/supabase/config";
import { createFeatureRequestIssue, isGitHubConfigured } from "@/lib/github";
import { FEATURE_PHOTO_BUCKET, MAX_PHOTOS } from "@/lib/feature-requests";

/** Only accept photo URLs that point at our own public storage bucket. */
const ALLOWED_PHOTO_PREFIX = `${SUPABASE_URL}/storage/v1/object/public/${FEATURE_PHOTO_BUCKET}/`;

function buildIssueBody(input: {
  description: string;
  photoUrls: string[];
  email?: string | null;
}): string {
  const parts = [input.description.trim()];

  if (input.photoUrls.length > 0) {
    parts.push(
      "### Screenshots\n" +
        input.photoUrls
          .map((u, i) => `![screenshot ${i + 1}](${u})`)
          .join("\n")
    );
  }

  parts.push(
    "---\n" +
      `_Filed from the training app${
        input.email ? ` by ${input.email}` : ""
      }. A maintainer or the author can comment \`/close\` to close this request._`
  );

  return parts.join("\n\n");
}

export async function POST(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json(
      { error: "You must be signed in to file a request." },
      { status: 401 }
    );
  }

  if (!isGitHubConfigured) {
    return NextResponse.json(
      {
        error:
          "The tracker isn't connected to GitHub yet. An admin needs to set GITHUB_TOKEN and GITHUB_REPO.",
      },
      { status: 503 }
    );
  }

  let payload: {
    title?: unknown;
    description?: unknown;
    photoUrls?: unknown;
  };
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const title = typeof payload.title === "string" ? payload.title.trim() : "";
  const description =
    typeof payload.description === "string" ? payload.description.trim() : "";
  const photoUrls = Array.isArray(payload.photoUrls)
    ? payload.photoUrls
        .filter((u): u is string => typeof u === "string")
        .filter((u) => u.startsWith(ALLOWED_PHOTO_PREFIX))
        .slice(0, MAX_PHOTOS)
    : [];

  if (!title || !description) {
    return NextResponse.json(
      { error: "Please include a title and a description." },
      { status: 400 }
    );
  }
  if (title.length > 200) {
    return NextResponse.json(
      { error: "Title must be 200 characters or fewer." },
      { status: 400 }
    );
  }

  const body = buildIssueBody({ description, photoUrls, email: user.email });

  try {
    const issue = await createFeatureRequestIssue({ title, body });
    return NextResponse.json({ number: issue.number, url: issue.url });
  } catch (err) {
    console.error("Feature request issue creation failed:", err);
    return NextResponse.json(
      { error: "Could not create the GitHub issue. Please try again later." },
      { status: 502 }
    );
  }
}

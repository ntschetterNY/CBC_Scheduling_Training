/**
 * Server-only GitHub helper for the Feature Request tracker.
 *
 * Reads a personal access token (with `issues` / `repo` scope) and the target
 * repo from the environment. When they're unset, `isGitHubConfigured` is false
 * and the tracker shows a "not connected yet" notice instead of failing —
 * mirroring how the rest of the app degrades gracefully without Supabase.
 *
 * IMPORTANT: only import this from Server Components and Route Handlers. The
 * token is read from a non-`NEXT_PUBLIC_` env var, so it never ships to the
 * browser — keep it that way by never importing this into a Client Component.
 */

const GITHUB_API = "https://api.github.com";

export const GITHUB_TOKEN = process.env.GITHUB_TOKEN || "";
/** owner/repo the requests are filed against. Defaults to this project. */
export const GITHUB_REPO =
  process.env.GITHUB_REPO || "ntschetterNY/CBC_Scheduling_Training";
export const FEATURE_REQUEST_LABEL = "feature-request";

export const isGitHubConfigured = Boolean(
  GITHUB_TOKEN && GITHUB_REPO.includes("/")
);

function githubHeaders() {
  return {
    Authorization: `Bearer ${GITHUB_TOKEN}`,
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
    "Content-Type": "application/json",
  };
}

export type FeatureRequest = {
  number: number;
  title: string;
  state: "open" | "closed";
  url: string;
  /** GitHub account that opened the issue (the token owner). */
  author: string;
  /** The app user who filed it, parsed from the issue body (may be null on
   *  older issues filed before we recorded it). */
  requester: string | null;
  createdAt: string;
  comments: number;
};

// Machine-readable marker we embed in each issue body so we can read back who
// filed the request (the GitHub `author` is always the token account).
const REQUESTER_MARKER = /<!--\s*fr-requester:\s*(.*?)\s*-->/i;

/** Build the hidden requester marker for an issue body. */
export function requesterMarker(name: string): string {
  // Strip angle brackets so a name can never terminate the HTML comment early.
  const safe = name.replace(/[<>]/g, "").trim();
  return `<!-- fr-requester: ${safe} -->`;
}

/** Read the app user's name back out of an issue body, if present. */
export function parseRequester(body: string | null | undefined): string | null {
  if (!body) return null;
  const m = body.match(REQUESTER_MARKER);
  return m ? m[1].trim() : null;
}

/** Create a GitHub issue for a feature request and return its number + URL. */
export async function createFeatureRequestIssue(input: {
  title: string;
  body: string;
}): Promise<{ number: number; url: string }> {
  const res = await fetch(`${GITHUB_API}/repos/${GITHUB_REPO}/issues`, {
    method: "POST",
    headers: githubHeaders(),
    body: JSON.stringify({
      title: input.title,
      body: input.body,
      labels: [FEATURE_REQUEST_LABEL],
    }),
    cache: "no-store",
  });
  if (!res.ok) {
    const detail = await res.text().catch(() => "");
    throw new Error(`GitHub issue creation failed (${res.status}): ${detail}`);
  }
  const data = await res.json();
  return { number: data.number, url: data.html_url };
}

/** List feature-request issues (open and closed), newest first. */
export async function listFeatureRequests(): Promise<FeatureRequest[]> {
  const res = await fetch(
    `${GITHUB_API}/repos/${GITHUB_REPO}/issues` +
      `?labels=${FEATURE_REQUEST_LABEL}&state=all&sort=created&direction=desc&per_page=100`,
    { headers: githubHeaders(), cache: "no-store" }
  );
  if (!res.ok) {
    throw new Error(`GitHub issue list failed (${res.status})`);
  }
  const data = (await res.json()) as Array<Record<string, unknown>>;
  return data
    // The issues endpoint also returns pull requests — drop those.
    .filter((i) => !i.pull_request)
    .map((i) => ({
      number: i.number as number,
      title: i.title as string,
      state: i.state as "open" | "closed",
      url: i.html_url as string,
      author: (i.user as { login?: string })?.login ?? "unknown",
      requester: parseRequester(i.body as string | null),
      createdAt: i.created_at as string,
      comments: (i.comments as number) ?? 0,
    }));
}

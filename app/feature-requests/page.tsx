import { redirect } from "next/navigation";
import { AppHeader } from "@/components/AppHeader";
import { FeatureRequestForm } from "@/components/FeatureRequestForm";
import { createClient } from "@/lib/supabase/server";
import {
  GITHUB_REPO,
  isGitHubConfigured,
  listFeatureRequests,
  type FeatureRequest,
} from "@/lib/github";

export const metadata = { title: "Feature Requests" };

// Always read fresh issue state from GitHub.
export const dynamic = "force-dynamic";

function timeAgo(iso: string): string {
  const then = new Date(iso).getTime();
  const now = Date.now();
  const days = Math.floor((now - then) / 86_400_000);
  if (days <= 0) return "today";
  if (days === 1) return "yesterday";
  if (days < 30) return `${days}d ago`;
  if (days < 365) return `${Math.floor(days / 30)}mo ago`;
  return `${Math.floor(days / 365)}y ago`;
}

function RequestRow({ r }: { r: FeatureRequest }) {
  const open = r.state === "open";
  return (
    <a
      href={r.url}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex items-start gap-3 rounded-xl border border-brand-border bg-white p-4 transition-colors hover:border-brand-accent/50"
    >
      <span
        className={`mt-0.5 shrink-0 rounded-full px-2.5 py-0.5 text-[10px] font-bold ${
          open
            ? "bg-brand-success/15 text-brand-success"
            : "bg-brand-surface text-brand-muted"
        }`}
      >
        {open ? "Open" : "Closed"}
      </span>
      <div className="min-w-0 flex-1">
        <p className="truncate font-semibold text-brand-text">
          {r.title}{" "}
          <span className="font-normal text-brand-muted">#{r.number}</span>
        </p>
        <p className="mt-0.5 text-xs text-brand-muted">
          by {r.author} · {timeAgo(r.createdAt)} ·{" "}
          {r.comments} comment{r.comments === 1 ? "" : "s"}
        </p>
      </div>
      <span className="mt-1 text-brand-muted transition-transform group-hover:translate-x-0.5 group-hover:text-brand-accent">
        →
      </span>
    </a>
  );
}

export default async function FeatureRequestsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login?redirectedFrom=/feature-requests");

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .maybeSingle();

  let requests: FeatureRequest[] = [];
  let loadError = false;
  if (isGitHubConfigured) {
    try {
      requests = await listFeatureRequests();
    } catch {
      loadError = true;
    }
  }

  const open = requests.filter((r) => r.state === "open");
  const closed = requests.filter((r) => r.state === "closed");

  return (
    <div className="min-h-screen">
      <AppHeader email={user.email} isAdmin={profile?.role === "admin"} />
      <main className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
          Feature Requests &amp; Bugs
        </h1>
        <p className="prose-body mt-1">
          Have an idea to make the training better, or hit something that&apos;s
          broken? File it here. Each request opens a ticket the team tracks on
          GitHub — attach screenshots to show exactly what you mean, and a
          maintainer or the author can comment <code>/close</code> to close it
          when it&apos;s handled.
        </p>

        <div className="mt-6">
          <FeatureRequestForm disabled={!isGitHubConfigured} />
        </div>

        {!isGitHubConfigured && (
          <div className="mt-6 rounded-xl border border-brand-border bg-brand-surface/60 p-4 text-sm text-brand-muted">
            <p className="font-semibold text-brand-text">
              Not connected to GitHub yet
            </p>
            <p className="mt-1">
              To turn on the tracker, an admin needs to set{" "}
              <code>GITHUB_TOKEN</code> (a token with <code>issues</code> scope)
              and <code>GITHUB_REPO</code> in the deployment&apos;s environment
              variables. Until then, requests can&apos;t be filed from here.
            </p>
          </div>
        )}

        {loadError && (
          <p className="mt-6 text-sm text-brand-danger">
            Couldn&apos;t load existing requests from GitHub right now. The form
            above still works.
          </p>
        )}

        {isGitHubConfigured && !loadError && (
          <div className="mt-8 space-y-6">
            <section>
              <h2 className="mb-3 text-lg font-bold">
                Open requests{" "}
                <span className="text-sm font-normal text-brand-muted">
                  ({open.length})
                </span>
              </h2>
              {open.length === 0 ? (
                <p className="text-sm text-brand-muted">
                  No open requests yet — be the first to file one above.
                </p>
              ) : (
                <div className="space-y-2">
                  {open.map((r) => (
                    <RequestRow key={r.number} r={r} />
                  ))}
                </div>
              )}
            </section>

            {closed.length > 0 && (
              <section>
                <h2 className="mb-3 text-lg font-bold">
                  Closed{" "}
                  <span className="text-sm font-normal text-brand-muted">
                    ({closed.length})
                  </span>
                </h2>
                <div className="space-y-2">
                  {closed.map((r) => (
                    <RequestRow key={r.number} r={r} />
                  ))}
                </div>
              </section>
            )}

            <p className="pt-2 text-xs text-brand-muted">
              Tracking on{" "}
              <a
                href={`https://github.com/${GITHUB_REPO}/issues?q=label:feature-request`}
                target="_blank"
                rel="noopener noreferrer"
                className="underline hover:text-brand-text"
              >
                github.com/{GITHUB_REPO}
              </a>
              .
            </p>
          </div>
        )}
      </main>
    </div>
  );
}

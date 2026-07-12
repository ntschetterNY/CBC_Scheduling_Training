import Link from "next/link";
import { redirect } from "next/navigation";
import { AppHeader } from "@/components/AppHeader";
import { PageHero } from "@/components/PageHero";
import { createClient } from "@/lib/supabase/server";
import { formatFrNumber } from "@/lib/feature-requests";
import {
  GITHUB_REPO,
  isGitHubConfigured,
  listFeatureRequests,
  type FeatureRequest,
} from "@/lib/github";

export const metadata = { title: "Pending Feature Requests" };

// Always read fresh issue state from GitHub.
export const dynamic = "force-dynamic";

function fmtDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function PendingRow({ r }: { r: FeatureRequest }) {
  return (
    <a
      href={r.url}
      target="_blank"
      rel="noopener noreferrer"
      className="group grid grid-cols-[auto,1fr,auto] items-center gap-4 border-b border-brand-border px-4 py-3 last:border-b-0 hover:bg-brand-surface/50"
    >
      <span className="font-mono text-xs font-bold text-brand-accentDark">
        {formatFrNumber(r.number)}
      </span>
      <span className="min-w-0">
        <span className="block truncate font-medium text-brand-text">
          {r.title}
        </span>
        <span className="text-xs text-brand-muted">
          {r.requester ?? r.author} · {fmtDate(r.createdAt)} · {r.comments}{" "}
          comment{r.comments === 1 ? "" : "s"}
        </span>
      </span>
      <span className="text-brand-muted transition-transform group-hover:translate-x-0.5 group-hover:text-brand-accent">
        →
      </span>
    </a>
  );
}

export default async function PendingFeatureRequestsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login?redirectedFrom=/feature-requests/pending");

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .maybeSingle();

  let pending: FeatureRequest[] = [];
  let loadError = false;
  if (isGitHubConfigured) {
    try {
      const all = await listFeatureRequests();
      pending = all.filter((r) => r.state === "open");
    } catch {
      loadError = true;
    }
  }

  return (
    <div className="min-h-screen">
      <AppHeader email={user.email} isAdmin={profile?.role === "admin"} />
      <PageHero
        width="3xl"
        backHref="/feature-requests"
        backLabel="Feature Requests"
        eyebrow="Feedback"
        title="Pending Feature Requests"
        description={
          <>
            Every open request, oldest work still to do. Each one has an
            <span className="font-mono"> FR-###</span> number you can refer to.
          </>
        }
        actions={
          <Link href="/feature-requests" className="btn-primary shrink-0">
            + File a request
          </Link>
        }
      />
      <main className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
        {!isGitHubConfigured && (
          <div className="rounded-xl border border-brand-border bg-brand-surface/60 p-4 text-sm text-brand-muted">
            <p className="font-semibold text-brand-text">
              Not connected to GitHub yet
            </p>
            <p className="mt-1">
              An admin needs to set <code>GITHUB_TOKEN</code> and{" "}
              <code>GITHUB_REPO</code> before requests appear here.
            </p>
          </div>
        )}

        {loadError && (
          <p className="text-sm text-brand-danger">
            Couldn&apos;t load requests from GitHub right now — try again in a
            moment.
          </p>
        )}

        {isGitHubConfigured && !loadError && (
          <div>
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-sm font-semibold uppercase tracking-wider text-brand-muted">
                {pending.length} open
              </h2>
            </div>

            {pending.length === 0 ? (
              <div className="card p-8 text-center">
                <p className="text-4xl" aria-hidden>
                  🎉
                </p>
                <p className="mt-2 font-semibold text-brand-text">
                  Nothing pending
                </p>
                <p className="mt-1 text-sm text-brand-muted">
                  There are no open feature requests right now.
                </p>
              </div>
            ) : (
              <div className="card overflow-hidden">
                {pending.map((r) => (
                  <PendingRow key={r.number} r={r} />
                ))}
              </div>
            )}

            <p className="pt-4 text-xs text-brand-muted">
              Tracked on{" "}
              <a
                href={`https://github.com/${GITHUB_REPO}/issues?q=is:open label:feature-request`}
                target="_blank"
                rel="noopener noreferrer"
                className="underline hover:text-brand-text"
              >
                github.com/{GITHUB_REPO}
              </a>
              . A maintainer or the person who filed it can comment{" "}
              <code>/close</code> to close a request.
            </p>
          </div>
        )}
      </main>
    </div>
  );
}

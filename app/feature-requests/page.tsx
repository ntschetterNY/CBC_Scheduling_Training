import { redirect } from "next/navigation";
import { AppHeader } from "@/components/AppHeader";
import { FeatureRequestDashboard } from "@/components/FeatureRequestDashboard";
import { PageHero } from "@/components/PageHero";
import { createClient } from "@/lib/supabase/server";
import { isGitHubConfigured } from "@/lib/github";
import { getActor, loadDashboardData, type DashboardData } from "@/lib/fr-server";

export const metadata = { title: "Feature Requests" };

// Always read fresh ticket state.
export const dynamic = "force-dynamic";

export default async function FeatureRequestsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login?redirectedFrom=/feature-requests");

  const actor = await getActor();
  const isAdmin = actor?.isAdmin ?? false;

  let data: DashboardData = { requests: [], upvotes: {}, myUpvotes: [] };
  let loadError = false;
  if (isGitHubConfigured && actor) {
    try {
      data = await loadDashboardData(actor.id);
    } catch {
      loadError = true;
    }
  }

  return (
    <div className="min-h-screen">
      <AppHeader email={user.email} isAdmin={isAdmin} />
      <PageHero
        width="3xl"
        eyebrow="Feedback"
        title={<>Feature Requests &amp; Bugs</>}
        description={
          <>
            Have an idea to make the training better, or hit something that&apos;s
            broken? File it here. Each request becomes a tracked ticket you can
            follow from <em>pending</em> through <em>testing</em> to <em>done</em>{" "}
            — attach screenshots, discuss it in the thread, and upvote what
            matters most.
          </>
        }
      />
      <main className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
        {!isGitHubConfigured && (
          <div className="mb-6 rounded-xl border border-brand-border bg-brand-surface/60 p-4 text-sm text-brand-muted">
            <p className="font-semibold text-brand-text">
              The tracker isn&apos;t connected yet
            </p>
            <p className="mt-1">
              An admin needs to finish setting up the tracker before requests
              appear here.
            </p>
          </div>
        )}

        {loadError && (
          <p className="mb-6 text-sm text-brand-danger">
            Couldn&apos;t load existing requests right now. Filing a new one
            still works.
          </p>
        )}

        <FeatureRequestDashboard
          initial={data}
          isAdmin={isAdmin}
          trackerConnected={isGitHubConfigured}
        />
      </main>
    </div>
  );
}

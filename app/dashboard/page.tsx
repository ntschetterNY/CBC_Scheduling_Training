import Link from "next/link";
import { redirect } from "next/navigation";
import { AppHeader } from "@/components/AppHeader";
import { PageHero } from "@/components/PageHero";
import { curriculum, moduleOrder } from "@/lib/curriculum";
import { getMyProgress } from "@/lib/progress";
import { createClient } from "@/lib/supabase/server";

export const metadata = { title: "Dashboard" };

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login?redirectedFrom=/dashboard");

  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name, role")
    .eq("id", user.id)
    .maybeSingle();

  const progress = await getMyProgress();

  const completedCount = Object.values(progress).filter(
    (p) => p.status === "completed"
  ).length;
  const pct = Math.round((completedCount / curriculum.length) * 100);

  // find the next incomplete module in order
  const nextSlug =
    moduleOrder.find((slug) => progress[slug]?.status !== "completed") ?? null;
  const nextModule = curriculum.find((m) => m.slug === nextSlug);

  const firstName =
    (profile?.full_name || user?.email || "there").split(" ")[0].split("@")[0];

  return (
    <div className="min-h-screen">
      <AppHeader email={user?.email} isAdmin={profile?.role === "admin"} />

      <PageHero
        eyebrow="Your training"
        title={<>Welcome back, {firstName} 👋</>}
        description={
          completedCount === curriculum.length
            ? "You’ve completed every module. Nice work — keep practicing on the real board!"
            : "Pick up where you left off and keep building your SQ-6 skills."
        }
      />

      <main className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
        {/* Progress summary */}
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="card p-5 sm:col-span-2">
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold text-brand-text">
                Overall progress
              </p>
              <span className="text-sm font-bold text-brand-accent">{pct}%</span>
            </div>
            <div className="mt-3 h-3 w-full overflow-hidden rounded-full bg-brand-surface">
              <div
                className="h-full rounded-full bg-gradient-to-r from-brand-accent to-amber-400 transition-all"
                style={{ width: `${pct}%` }}
              />
            </div>
            <p className="mt-2 text-xs text-brand-muted">
              {completedCount} of {curriculum.length} modules complete
            </p>
          </div>

          <div className="card flex flex-col justify-between p-5">
            <p className="text-sm font-semibold text-brand-text">
              {nextModule ? "Up next" : "All done!"}
            </p>
            {nextModule ? (
              <>
                <p className="prose-body mt-1 text-sm">
                  {nextModule.icon} {nextModule.title}
                </p>
                <Link
                  href={`/learn/${nextModule.slug}`}
                  className="btn-primary mt-3"
                >
                  {progress[nextModule.slug] ? "Resume" : "Start"} →
                </Link>
              </>
            ) : (
              <Link href="/learn" className="btn-secondary mt-3">
                Review modules
              </Link>
            )}
          </div>
        </div>

        {/* Module list */}
        <h2 className="section-title mb-3 mt-10">Your modules</h2>
        <div className="space-y-3">
          {curriculum.map((m) => {
            const p = progress[m.slug];
            const done = p?.status === "completed";
            const started = !!p;
            return (
              <Link
                key={m.slug}
                href={`/learn/${m.slug}`}
                className="card group flex items-center gap-4 p-4 transition-colors hover:border-brand-accent/40"
              >
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-brand-surface text-xl">
                  {m.icon}
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <p className="text-[11px] font-semibold uppercase tracking-wider text-brand-muted">
                      Module {m.order}
                    </p>
                    {done && (
                      <span className="rounded-full bg-brand-success/15 px-2 py-0.5 text-[10px] font-bold text-brand-success">
                        ✓ {p?.quiz_score != null ? `${p.quiz_score}%` : "Done"}
                      </span>
                    )}
                    {started && !done && (
                      <span className="rounded-full bg-brand-accent/15 px-2 py-0.5 text-[10px] font-bold text-brand-accent">
                        In progress
                      </span>
                    )}
                  </div>
                  <p className="truncate font-semibold text-brand-text">
                    {m.title}
                  </p>
                  <p className="truncate text-xs text-brand-muted">
                    {m.subtitle}
                  </p>
                </div>
                <span className="hidden text-xs text-brand-muted sm:block">
                  ~{m.estMinutes} min
                </span>
                <span className="text-brand-muted transition-transform group-hover:translate-x-0.5 group-hover:text-brand-accent">
                  →
                </span>
              </Link>
            );
          })}
        </div>
      </main>
    </div>
  );
}

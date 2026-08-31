import Link from "next/link";
import { redirect } from "next/navigation";
import { AppHeader } from "@/components/AppHeader";
import { PageHero } from "@/components/PageHero";
import { getFinancePhases } from "@/lib/finance-curriculum";
import { getMyProgress } from "@/lib/progress";
import { createClient } from "@/lib/supabase/server";

export const metadata = { title: "Personal Finance Modules" };

export default async function FinanceIndexPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login?redirectedFrom=/finance");
  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .maybeSingle();

  const progress = await getMyProgress();
  const phases = getFinancePhases();

  return (
    <div className="min-h-screen">
      <AppHeader email={user?.email} isAdmin={profile?.role === "admin"} />
      <PageHero
        eyebrow="Life & Stewardship · The curriculum"
        title="Personal Finance"
        description="Seven steps out of debt and into generosity — the budget, the snowball, the emergency fund, investing, and what money is finally for."
      />
      <main className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
        {/* Draft banner + the disclaimer this track has to carry */}
        <div className="space-y-3">
          <div className="rounded-xl border border-brand-accent/30 bg-brand-accent/10 p-4">
            <p className="text-sm text-brand-text/90">
              <span className="font-semibold">Draft curriculum.</span> A first
              pass, modeled on the baby-steps approach Dave Ramsey teaches, with
              two deliberate CrossBridge changes: we teach{" "}
              <span className="font-semibold">
                &ldquo;if you use credit, treat it as cash&rdquo;
              </span>{" "}
              rather than cutting up every card, and we teach building a{" "}
              <span className="font-semibold">
                mix of Roth and traditional accounts
              </span>{" "}
              because of what required minimum distributions do later. Both are
              flagged where they appear. Review with the teaching team before
              this is treated as final.
            </p>
          </div>
          <div className="rounded-xl border border-brand-border bg-brand-surface/60 p-4">
            <p className="text-sm text-brand-text/90">
              <span className="font-semibold">
                Education, not financial advice.
              </span>{" "}
              This track is taught by volunteers. Nobody at CrossBridge sells
              investments or earns a commission on anything you decide. Take
              hard-to-reverse moves — conversions, rollovers, refinances, estate
              documents — to a CPA, a fee-only fiduciary advisor, or an estate
              attorney. Dollar limits and age thresholds are current for the
              2026 tax year and change; verify at{" "}
              <span className="font-semibold">irs.gov</span> before you act.
            </p>
          </div>
        </div>

        <div className="mt-10 flex items-end justify-between gap-4">
          <h2 className="section-title">All modules</h2>
          <p className="hidden font-sans text-xs text-brand-muted sm:block">
            {phases.length} chapters · work them top to bottom, in order
          </p>
        </div>

        <div className="mt-4 space-y-10">
          {phases.map((phase, i) => {
            const total = phase.modules.length;
            const doneInPhase = phase.modules.filter(
              (m) => progress[m.slug]?.status === "completed"
            ).length;
            const totalMin = phase.modules.reduce(
              (sum, m) => sum + m.estMinutes,
              0
            );
            const phaseComplete = doneInPhase === total && total > 0;
            return (
              <section key={phase.id} className="scroll-mt-24">
                {/* Chapter header */}
                <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                  <span
                    className={`rounded-lg px-3 py-1.5 font-sans text-xs font-bold text-white ${
                      phaseComplete ? "bg-brand-success" : "bg-brand-teal"
                    }`}
                  >
                    Chapter {i + 1}
                  </span>
                  <h3 className="section-title text-lg">{phase.name}</h3>
                  <span className="ml-auto font-sans text-xs font-semibold text-brand-muted">
                    {doneInPhase}/{total} done · ~{totalMin} min
                  </span>
                  <p className="prose-body w-full text-sm">{phase.tagline}</p>
                </div>

                {/* Module cards */}
                <div className="mt-4 grid gap-4 sm:grid-cols-2">
                  {phase.modules.map((m) => {
                    const p = progress[m.slug];
                    const done = p?.status === "completed";
                    return (
                      <Link
                        key={m.slug}
                        href={`/finance/${m.slug}`}
                        className="card group flex flex-col p-5 transition-all hover:-translate-y-0.5 hover:border-brand-accent/40 hover:shadow-lg"
                      >
                        <div className="flex items-start justify-between">
                          <span className="grid h-11 w-11 place-items-center rounded-xl bg-brand-surface text-xl">
                            {m.icon}
                          </span>
                          {done ? (
                            <span className="rounded-full bg-brand-success/15 px-2.5 py-1 text-[10px] font-bold text-brand-success">
                              ✓ Complete
                            </span>
                          ) : p ? (
                            <span className="rounded-full bg-brand-accent/15 px-2.5 py-1 text-[10px] font-bold text-brand-accent">
                              In progress
                            </span>
                          ) : (
                            <span className="rounded-full bg-brand-surface px-2.5 py-1 text-[10px] font-bold text-brand-muted">
                              Not started
                            </span>
                          )}
                        </div>
                        <p className="mt-3 text-[11px] font-semibold uppercase tracking-wider text-brand-muted">
                          Module {m.order}
                        </p>
                        <h4 className="font-sans font-bold text-brand-text">
                          {m.title}
                        </h4>
                        <p className="prose-body mt-1 text-sm">{m.subtitle}</p>
                        {m.objectives.length > 0 && (
                          <ul className="mt-3 space-y-1.5 border-t border-dashed border-brand-border pt-3">
                            {m.objectives.map((obj) => (
                              <li
                                key={obj}
                                className="flex gap-2 text-[13px] text-brand-text/80"
                              >
                                <span
                                  aria-hidden
                                  className="mt-1.5 h-2.5 w-2.5 shrink-0 rounded-[3px] border-[1.5px] border-brand-accent"
                                />
                                <span>{obj}</span>
                              </li>
                            ))}
                          </ul>
                        )}
                        <p className="mt-auto pt-3 text-xs text-brand-muted">
                          ~{m.estMinutes} min · {m.quiz.length} question quiz
                        </p>
                      </Link>
                    );
                  })}
                </div>
              </section>
            );
          })}
        </div>
      </main>
    </div>
  );
}

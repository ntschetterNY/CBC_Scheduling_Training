import Link from "next/link";
import { redirect } from "next/navigation";
import { AppHeader } from "@/components/AppHeader";
import { PageHero } from "@/components/PageHero";
import { curriculum } from "@/lib/curriculum";
import { isSuperAdmin } from "@/lib/access";
import { createClient } from "@/lib/supabase/server";

export const metadata = { title: "Team Progress" };

type ProfileRow = { id: string; full_name: string | null; role: string };
type ProgRow = {
  user_id: string;
  module_slug: string;
  status: string;
  quiz_score: number | null;
};

export default async function AdminPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login?redirectedFrom=/admin");

  const { data: me } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .maybeSingle();

  const superAdmin = isSuperAdmin(user.email);
  if (me?.role !== "admin" && !superAdmin) redirect("/dashboard");

  const [{ data: profiles }, { data: progress }] = await Promise.all([
    supabase.from("profiles").select("id, full_name, role"),
    supabase.from("module_progress").select("user_id, module_slug, status, quiz_score"),
  ]);

  const people = (profiles ?? []) as ProfileRow[];
  const rows = (progress ?? []) as ProgRow[];

  // index progress by user -> slug
  const byUser: Record<string, Record<string, ProgRow>> = {};
  for (const r of rows) {
    (byUser[r.user_id] ??= {})[r.module_slug] = r;
  }

  const trainees = people
    .filter((p) => p.role !== "admin" || true) // show everyone including admins
    .sort((a, b) =>
      (a.full_name || "").localeCompare(b.full_name || "")
    );

  return (
    <div className="min-h-screen">
      <AppHeader email={user?.email} isAdmin />
      <PageHero
        width="6xl"
        eyebrow="Admin"
        title="Team Progress"
        description={`Completion across all ${curriculum.length} modules. A checkmark shows a completed module and its quiz score.`}
      />
      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        {superAdmin && (
          <div className="grid gap-3 sm:grid-cols-2">
            <Link
              href="/admin/analytics"
              className="card group flex items-center gap-3 p-4 transition-colors hover:border-brand-accent/40"
            >
              <span className="grid h-11 w-11 place-items-center rounded-xl bg-brand-surface text-xl">
                ⏱️
              </span>
              <div>
                <p className="font-semibold text-brand-text">Time Analytics</p>
                <p className="text-xs text-brand-muted">
                  See time spent per person on each module and each test.
                </p>
              </div>
              <span className="ml-auto text-brand-muted group-hover:text-brand-accent">
                →
              </span>
            </Link>
            <Link
              href="/admin/users"
              className="card group flex items-center gap-3 p-4 transition-colors hover:border-brand-accent/40"
            >
              <span className="grid h-11 w-11 place-items-center rounded-xl bg-brand-surface text-xl">
                👥
              </span>
              <div>
                <p className="font-semibold text-brand-text">Users &amp; Admins</p>
                <p className="text-xs text-brand-muted">
                  Manage the team and grant admin access from here.
                </p>
              </div>
              <span className="ml-auto text-brand-muted group-hover:text-brand-accent">
                →
              </span>
            </Link>
          </div>
        )}

        <div className="mt-6 overflow-x-auto">
          <div className="card min-w-[720px] overflow-hidden">
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="border-b border-brand-border bg-brand-surface/60 text-left">
                  <th className="sticky left-0 z-10 bg-brand-surface/60 px-4 py-3 font-semibold">
                    Tech
                  </th>
                  {curriculum.map((m) => (
                    <th
                      key={m.slug}
                      className="px-2 py-3 text-center font-semibold"
                      title={m.title}
                    >
                      <span className="block text-lg leading-none">{m.icon}</span>
                      <span className="text-[10px] text-brand-muted">
                        M{m.order}
                      </span>
                    </th>
                  ))}
                  <th className="px-4 py-3 text-center font-semibold">Done</th>
                </tr>
              </thead>
              <tbody>
                {trainees.length === 0 && (
                  <tr>
                    <td
                      colSpan={curriculum.length + 2}
                      className="px-4 py-8 text-center text-brand-muted"
                    >
                      No trainees yet. Once techs sign up, they’ll appear here.
                    </td>
                  </tr>
                )}
                {trainees.map((p) => {
                  const prog = byUser[p.id] ?? {};
                  const completed = curriculum.filter(
                    (m) => prog[m.slug]?.status === "completed"
                  ).length;
                  return (
                    <tr
                      key={p.id}
                      className="border-b border-brand-border/60 last:border-0"
                    >
                      <td className="sticky left-0 z-10 bg-brand-card px-4 py-3">
                        <span className="font-medium text-brand-text">
                          {p.full_name || "Unnamed tech"}
                        </span>
                        {p.role === "admin" && (
                          <span className="ml-2 rounded bg-brand-accent/15 px-1.5 py-0.5 text-[10px] font-bold text-brand-accent">
                            admin
                          </span>
                        )}
                      </td>
                      {curriculum.map((m) => {
                        const c = prog[m.slug];
                        const done = c?.status === "completed";
                        const started = !!c;
                        return (
                          <td key={m.slug} className="px-2 py-3 text-center">
                            {done ? (
                              <span
                                className="inline-flex flex-col items-center text-brand-success"
                                title={`Completed — ${c?.quiz_score ?? "?"}%`}
                              >
                                <span className="text-base leading-none">✓</span>
                                {c?.quiz_score != null && (
                                  <span className="text-[10px]">
                                    {c.quiz_score}%
                                  </span>
                                )}
                              </span>
                            ) : started ? (
                              <span className="text-brand-accent" title="In progress">
                                ◐
                              </span>
                            ) : (
                              <span className="text-brand-border">·</span>
                            )}
                          </td>
                        );
                      })}
                      <td className="px-4 py-3 text-center font-semibold">
                        <span
                          className={
                            completed === curriculum.length
                              ? "text-brand-success"
                              : "text-brand-text"
                          }
                        >
                          {completed}/{curriculum.length}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        <p className="mt-4 text-xs text-brand-muted">
          Tip: promote a tech to <code>admin</code> by setting their{" "}
          <code>role</code> to <code>admin</code> in the Supabase{" "}
          <code>profiles</code> table.
        </p>
      </main>
    </div>
  );
}

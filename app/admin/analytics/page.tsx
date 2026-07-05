import Link from "next/link";
import { redirect } from "next/navigation";
import { AppHeader } from "@/components/AppHeader";
import { curriculum } from "@/lib/curriculum";
import { formatDuration, isSuperAdmin } from "@/lib/access";
import { createClient } from "@/lib/supabase/server";

export const metadata = { title: "Time Analytics" };

type ProfileRow = { id: string; full_name: string | null; role: string };
type ProgRow = {
  user_id: string;
  module_slug: string;
  status: string;
  quiz_score: number | null;
  time_spent_seconds: number | null;
  quiz_time_seconds: number | null;
};

export default async function AnalyticsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login?redirectedFrom=/admin/analytics");

  // Time analytics is super-admin only.
  if (!isSuperAdmin(user.email)) redirect("/admin");

  const [{ data: profiles }, { data: progress }] = await Promise.all([
    supabase.from("profiles").select("id, full_name, role"),
    supabase
      .from("module_progress")
      .select(
        "user_id, module_slug, status, quiz_score, time_spent_seconds, quiz_time_seconds"
      ),
  ]);

  const people = (profiles ?? []) as ProfileRow[];
  const rows = (progress ?? []) as ProgRow[];

  const byUser: Record<string, Record<string, ProgRow>> = {};
  for (const r of rows) {
    (byUser[r.user_id] ??= {})[r.module_slug] = r;
  }

  const trainees = people
    .slice()
    .sort((a, b) => (a.full_name || "").localeCompare(b.full_name || ""));

  const totalFor = (uid: string, field: "time_spent_seconds" | "quiz_time_seconds") =>
    curriculum.reduce(
      (acc, m) => acc + (byUser[uid]?.[m.slug]?.[field] ?? 0),
      0
    );

  return (
    <div className="min-h-screen">
      <AppHeader email={user?.email} isAdmin />
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
        <Link
          href="/admin"
          className="text-xs font-medium text-brand-muted hover:text-brand-text"
        >
          ← Team Progress
        </Link>
        <h1 className="mt-3 text-2xl font-bold tracking-tight sm:text-3xl">
          Time Analytics
        </h1>
        <p className="prose-body mt-1">
          Time each person has spent on each module&apos;s lessons and its test.
          Each cell shows{" "}
          <span className="font-semibold text-brand-text">lesson time</span> on
          top and{" "}
          <span className="font-semibold text-brand-text">📝 test time</span>{" "}
          below. Times accrue while a page is open and active.
        </p>

        <div className="mt-6 overflow-x-auto">
          <div className="card min-w-[900px] overflow-hidden">
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
                  <th className="px-4 py-3 text-center font-semibold">Total</th>
                </tr>
              </thead>
              <tbody>
                {trainees.length === 0 && (
                  <tr>
                    <td
                      colSpan={curriculum.length + 2}
                      className="px-4 py-8 text-center text-brand-muted"
                    >
                      No trainees yet.
                    </td>
                  </tr>
                )}
                {trainees.map((p) => {
                  const lessonTotal = totalFor(p.id, "time_spent_seconds");
                  const quizTotal = totalFor(p.id, "quiz_time_seconds");
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
                        const c = byUser[p.id]?.[m.slug];
                        const lesson = c?.time_spent_seconds ?? 0;
                        const quiz = c?.quiz_time_seconds ?? 0;
                        const none = lesson === 0 && quiz === 0;
                        return (
                          <td
                            key={m.slug}
                            className="px-2 py-3 text-center align-middle"
                          >
                            {none ? (
                              <span className="text-brand-border">·</span>
                            ) : (
                              <div className="leading-tight">
                                <div className="text-xs font-medium text-brand-text">
                                  {formatDuration(lesson)}
                                </div>
                                <div className="text-[11px] text-brand-muted">
                                  📝 {formatDuration(quiz)}
                                </div>
                              </div>
                            )}
                          </td>
                        );
                      })}
                      <td className="px-4 py-3 text-center align-middle">
                        <div className="text-xs font-semibold text-brand-text">
                          {formatDuration(lessonTotal)}
                        </div>
                        <div className="text-[11px] text-brand-muted">
                          📝 {formatDuration(quizTotal)}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        <p className="mt-4 text-xs text-brand-muted">
          Only you (the super admin) can see this page. Grant admin access to
          others on the{" "}
          <Link href="/admin/users" className="text-brand-accentDark underline">
            Users
          </Link>{" "}
          page.
        </p>
      </main>
    </div>
  );
}

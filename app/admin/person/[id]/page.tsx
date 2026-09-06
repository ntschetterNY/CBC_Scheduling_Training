import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { AppHeader } from "@/components/AppHeader";
import { PageHero } from "@/components/PageHero";
import { isSuperAdmin } from "@/lib/access";
import { ADMIN_PROGRAMS } from "@/lib/admin-programs";
import { createClient } from "@/lib/supabase/server";

export const metadata = { title: "Trainee Detail" };

type ProgRow = {
  module_slug: string;
  status: string;
  quiz_score: number | null;
  quiz_total: number | null;
  completed_at: string | null;
};

function fmtDate(iso: string | null): string {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export default async function AdminPersonPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect(`/login?redirectedFrom=/admin/person/${id}`);

  const { data: me } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .maybeSingle();
  if (me?.role !== "admin" && !isSuperAdmin(user.email)) redirect("/dashboard");

  const [{ data: person }, { data: progress }] = await Promise.all([
    supabase
      .from("profiles")
      .select("id, full_name, role")
      .eq("id", id)
      .maybeSingle(),
    supabase
      .from("module_progress")
      .select("module_slug, status, quiz_score, quiz_total, completed_at")
      .eq("user_id", id),
  ]);
  if (!person) notFound();

  const bySlug: Record<string, ProgRow> = {};
  for (const r of (progress ?? []) as ProgRow[]) bySlug[r.module_slug] = r;

  return (
    <div className="min-h-screen">
      <AppHeader email={user?.email} isAdmin />
      <PageHero
        width="6xl"
        eyebrow="Admin · Trainee detail"
        title={person.full_name || "Unnamed trainee"}
        description="Every module across every training program — status, quiz score, and completion date."
      />
      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        <Link href="/admin" className="btn-ghost">
          ← Back to Team Progress
        </Link>

        <div className="mt-4 grid gap-6 lg:grid-cols-2">
          {ADMIN_PROGRAMS.map((prog) => {
            const done = prog.modules.filter(
              (m) => bySlug[m.slug]?.status === "completed"
            ).length;
            return (
              <section key={prog.key} className="card overflow-hidden">
                <div className="flex items-center gap-2 border-b border-brand-border bg-brand-surface/60 px-4 py-3">
                  <span aria-hidden>{prog.icon}</span>
                  <h2 className="font-sans text-sm font-semibold text-brand-text">
                    {prog.label}
                  </h2>
                  <span
                    className={`ml-auto font-sans text-xs font-semibold ${
                      done === prog.modules.length
                        ? "text-brand-success"
                        : "text-brand-muted"
                    }`}
                  >
                    {done}/{prog.modules.length} complete
                  </span>
                </div>
                <ul>
                  {prog.modules.map((m) => {
                    const row = bySlug[m.slug];
                    const completed = row?.status === "completed";
                    return (
                      <li
                        key={m.slug}
                        className="flex items-center gap-3 border-b border-brand-border/60 px-4 py-2.5 last:border-0"
                      >
                        <span aria-hidden className="text-base">
                          {m.icon}
                        </span>
                        <div className="min-w-0 flex-1">
                          <Link
                            href={`${prog.basePath}/${m.slug}`}
                            className="block truncate font-sans text-sm font-medium text-brand-text hover:text-brand-accentDark"
                            title={m.title}
                          >
                            {m.order}. {m.title}
                          </Link>
                          {completed && (
                            <p className="text-[11px] text-brand-muted">
                              Completed {fmtDate(row.completed_at)}
                            </p>
                          )}
                        </div>
                        {completed ? (
                          <span className="font-sans text-xs font-bold text-brand-success">
                            ✓{" "}
                            {row.quiz_score != null ? `${row.quiz_score}%` : ""}
                          </span>
                        ) : row ? (
                          <span
                            className="font-sans text-xs font-semibold text-brand-accent"
                            title="In progress"
                          >
                            ◐ in progress
                          </span>
                        ) : (
                          <span className="font-sans text-xs text-brand-muted">
                            not started
                          </span>
                        )}
                      </li>
                    );
                  })}
                </ul>
              </section>
            );
          })}
        </div>
      </main>
    </div>
  );
}

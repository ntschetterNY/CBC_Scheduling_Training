import Link from "next/link";
import { redirect } from "next/navigation";
import { AppHeader } from "@/components/AppHeader";
import { DaySheetControls } from "@/components/DaySheetControls";
import { isSuperAdmin } from "@/lib/access";
import { createClient } from "@/lib/supabase/server";

export const metadata = { title: "Day Sheet" };

type TeamRow = { id: string; name: string; sort_order: number };
type RoleRow = { id: string; team_id: string; name: string; sort_order: number };
type AssignmentRow = {
  id: string;
  team_id: string;
  role_id: string;
  service_date: string;
  status: string;
  people: { id: string; full_name: string; email: string | null } | null;
};

const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;

const fullDate = (iso: string) =>
  new Date(iso + "T00:00:00").toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });

export default async function DaySheetPage({
  params,
}: {
  params: Promise<{ date: string }>;
}) {
  const { date } = await params;
  if (!ISO_DATE.test(date)) redirect("/schedule/day");

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect(`/login?redirectedFrom=/schedule/day/${date}`);

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .maybeSingle();
  const isAdmin = profile?.role === "admin" || isSuperAdmin(user.email);

  const [{ data: teams }, { data: roles }, { data: assignments }, { data: dateRows }] =
    await Promise.all([
      supabase
        .from("teams")
        .select("id, name, sort_order")
        .eq("active", true)
        .order("sort_order"),
      supabase
        .from("schedule_roles")
        .select("id, team_id, name, sort_order")
        .eq("active", true)
        .order("sort_order"),
      supabase
        .from("assignments")
        .select(
          "id, team_id, role_id, service_date, status, people(id, full_name, email)"
        )
        .eq("service_date", date),
      // Every date that has a schedule, for previous / next navigation.
      supabase
        .from("assignments")
        .select("service_date")
        .order("service_date"),
    ]);

  const teamList = (teams ?? []) as TeamRow[];
  const roleList = (roles ?? []) as RoleRow[];
  const dayAssignments = (assignments ?? []) as unknown as AssignmentRow[];

  const allDates = [...new Set((dateRows ?? []).map((r) => r.service_date as string))].sort();
  const prevDate = allDates.filter((d) => d < date).at(-1) ?? null;
  const nextDate = allDates.find((d) => d > date) ?? null;

  // Only teams with at least one assignment appear on the sheet; every role
  // of a scheduled team is listed so open slots are visible at a glance.
  const scheduledTeams = teamList.filter((t) =>
    dayAssignments.some((a) => a.team_id === t.id)
  );
  const servingCount = new Set(
    dayAssignments.filter((a) => a.people).map((a) => a.people!.id)
  ).size;

  return (
    <div className="min-h-screen">
      <div className="print:hidden">
        <AppHeader email={user.email} isAdmin={profile?.role === "admin"} />
      </div>

      <main className="mx-auto max-w-5xl px-4 py-8 sm:px-6 print:max-w-none print:p-0">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3 print:hidden">
          <div>
            <p className="eyebrow">Serve teams</p>
            <h1 className="font-sans text-2xl font-light tracking-tight text-brand-text">
              Day Sheet
            </h1>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Link href="/schedule" className="btn-ghost">
              Full schedule
            </Link>
            {isAdmin && (
              <Link href="/admin/schedule" className="btn-ghost">
                Manage
              </Link>
            )}
          </div>
        </div>

        <div className="mb-6 print:hidden">
          <DaySheetControls date={date} prevDate={prevDate} nextDate={nextDate} />
        </div>

        {/* The printable sheet */}
        <div className="print-sheet">
          <div className="mb-6 border-b-2 border-brand-teal pb-4">
            <p className="eyebrow">CrossBridge Church · Serve Teams</p>
            <h2 className="font-sans text-3xl font-light tracking-tight text-brand-text">
              {fullDate(date)}
            </h2>
            {servingCount > 0 && (
              <p className="mt-1 font-sans text-sm text-brand-muted">
                {servingCount} {servingCount === 1 ? "person" : "people"} serving
              </p>
            )}
          </div>

          {scheduledTeams.length === 0 ? (
            <p className="prose-body">
              No assignments for this date
              {isAdmin ? " — generate a schedule from the Manage page." : "."}
            </p>
          ) : (
            <div className="grid items-start gap-4 sm:grid-cols-2 print:grid-cols-2">
              {scheduledTeams.map((team) => {
                const teamRoles = roleList.filter((r) => r.team_id === team.id);
                return (
                  <section
                    key={team.id}
                    className="card overflow-hidden break-inside-avoid print:rounded-lg print:border-brand-border print:shadow-none"
                  >
                    <h3 className="border-b border-brand-border bg-brand-teal px-4 py-2.5 font-sans text-sm font-semibold text-white">
                      {team.name}
                    </h3>
                    <ul className="divide-y divide-brand-border/60 px-4">
                      {teamRoles.map((role) => {
                        const a = dayAssignments.find(
                          (x) => x.team_id === team.id && x.role_id === role.id
                        );
                        return (
                          <li
                            key={role.id}
                            className="flex items-baseline justify-between gap-3 py-2.5"
                          >
                            <span className="font-sans text-[11px] font-semibold uppercase tracking-wider text-brand-muted">
                              {role.name}
                            </span>
                            {a?.people ? (
                              <span className="text-right font-sans text-sm font-medium text-brand-text">
                                {a.people.full_name}
                                {a.status === "confirmed" && (
                                  <span className="ml-1 text-brand-success">✓</span>
                                )}
                                {a.status === "declined" && (
                                  <span className="ml-1 text-brand-danger">✗</span>
                                )}
                              </span>
                            ) : (
                              <span className="font-sans text-sm text-brand-muted/70">
                                Unassigned
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
          )}
        </div>
      </main>
    </div>
  );
}

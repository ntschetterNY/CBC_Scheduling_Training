import Link from "next/link";
import { redirect } from "next/navigation";
import { AppHeader } from "@/components/AppHeader";
import { PageHero } from "@/components/PageHero";
import { ScheduleBrowser } from "@/components/ScheduleBrowser";
import { isSuperAdmin } from "@/lib/access";
import { createClient } from "@/lib/supabase/server";

export const metadata = { title: "Serve Schedule" };

type TeamRow = { id: string; name: string; slug: string; sort_order: number };
type RoleRow = { id: string; team_id: string; name: string; sort_order: number };
type AssignmentRow = {
  id: string;
  team_id: string;
  role_id: string;
  service_date: string;
  status: string;
  people: { id: string; full_name: string; email: string | null } | null;
};

const prettyDate = (iso: string) =>
  new Date(iso + "T00:00:00").toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });

export default async function SchedulePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login?redirectedFrom=/schedule");

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .maybeSingle();
  const isAdmin = profile?.role === "admin" || isSuperAdmin(user.email);

  const today = new Date().toISOString().slice(0, 10);
  const horizon = new Date();
  horizon.setDate(horizon.getDate() + 12 * 7);

  const [{ data: teams }, { data: roles }, { data: assignments }] = await Promise.all([
    supabase
      .from("teams")
      .select("id, name, slug, sort_order")
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
      .gte("service_date", today)
      .lte("service_date", horizon.toISOString().slice(0, 10))
      .order("service_date"),
  ]);

  const allAssignments = (assignments ?? []) as unknown as AssignmentRow[];
  const myEmail = (user.email ?? "").toLowerCase();
  const mine = allAssignments.filter(
    (a) => a.people?.email && a.people.email.toLowerCase() === myEmail
  );

  const teamList = (teams ?? []) as TeamRow[];
  const roleList = (roles ?? []) as RoleRow[];

  return (
    <div className="min-h-screen">
      <AppHeader email={user.email} isAdmin={profile?.role === "admin"} />

      <PageHero
        width="7xl"
        eyebrow="Serve teams"
        title="Serve Schedule"
        description="Upcoming Sunday assignments for every serve team. Need time off? Add blackout dates and the next schedule will work around them."
        actions={
          <div className="flex flex-wrap gap-2">
            <Link href="/schedule/availability" className="btn-primary">
              My availability
            </Link>
            <Link href="/schedule/day" className="btn-secondary">
              Day sheet
            </Link>
            {isAdmin && (
              <Link href="/admin/schedule" className="btn-secondary">
                Manage
              </Link>
            )}
          </div>
        }
      />

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
        {/* My upcoming assignments */}
        <section className="mb-10">
          <h2 className="section-title mb-3">My upcoming assignments</h2>
          {mine.length === 0 ? (
            <p className="prose-body text-sm">
              Nothing on the books for you in the next 12 weeks.
              {!allAssignments.some((a) => a.people?.email) &&
                " (If you expected assignments, an admin may still need to link your email to your roster entry.)"}
            </p>
          ) : (
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {mine.map((a) => {
                const role = roleList.find((r) => r.id === a.role_id);
                const team = teamList.find((t) => t.id === a.team_id);
                return (
                  <div key={a.id} className="card flex items-center gap-4 p-4">
                    <span className="date-badge h-12 w-12 text-xs font-bold leading-tight">
                      {prettyDate(a.service_date)}
                    </span>
                    <div className="min-w-0">
                      <p className="truncate font-semibold text-brand-text">
                        {role?.name ?? "Role"}
                      </p>
                      <p className="text-xs text-brand-muted">
                        {team?.name}
                        {a.status !== "scheduled" && (
                          <span
                            className={
                              a.status === "confirmed"
                                ? " text-brand-success"
                                : " text-brand-danger"
                            }
                          >
                            {" "}
                            · {a.status}
                          </span>
                        )}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>

        {/* Team-tabbed schedule, mirroring the admin scheduling page */}
        <section className="mb-10">
          <h2 className="section-title mb-3">Upcoming schedule</h2>
          <ScheduleBrowser
            teams={teamList}
            roles={roleList}
            assignments={allAssignments}
            myEmail={myEmail}
            isAdmin={isAdmin}
          />
        </section>
      </main>
    </div>
  );
}

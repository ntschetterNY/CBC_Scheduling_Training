import { NextResponse } from "next/server";
import {
  generateSchedule,
  listSundays,
  type EngineHistoryEntry,
  type RoleCategory,
} from "@/lib/scheduling/engine";
import { getScheduleActor } from "@/lib/scheduling/server";

/**
 * POST /api/schedule/generate — build a fair rotation for a team.
 *
 * Body: { teamId: string, startDate?: "YYYY-MM-DD", weeks?: number }
 *
 * Replaces any existing assignments for the team on the generated Sundays
 * (so re-running after a blackout change or roster edit is safe), and feeds
 * the previous six months of assignments into the engine so fairness carries
 * across generation runs.
 */
export async function POST(req: Request) {
  const actor = await getScheduleActor();
  if (!actor) return NextResponse.json({ error: "Not signed in." }, { status: 401 });
  if (!actor.isAdmin) return NextResponse.json({ error: "Admins only." }, { status: 403 });
  const { supabase } = actor;

  let body: { teamId?: string; startDate?: string; weeks?: number };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }
  const teamId = body.teamId;
  if (!teamId) return NextResponse.json({ error: "teamId is required." }, { status: 400 });
  const weeks = Math.min(Math.max(Math.trunc(body.weeks ?? 12), 1), 52);
  const start = body.startDate ? new Date(body.startDate + "T00:00:00Z") : new Date();
  if (isNaN(start.getTime())) {
    return NextResponse.json({ error: "Invalid startDate." }, { status: 400 });
  }

  const sundays = listSundays(start, weeks);
  const historyStart = new Date(sundays[0] + "T00:00:00Z");
  historyStart.setUTCDate(historyStart.getUTCDate() - 26 * 7);

  const [rolesRes, membersRes] = await Promise.all([
    supabase
      .from("schedule_roles")
      .select("id, name, category, sort_order")
      .eq("team_id", teamId)
      .eq("active", true),
    supabase
      .from("team_members")
      .select("person_id, people!inner(id, full_name, active)")
      .eq("team_id", teamId),
  ]);
  if (rolesRes.error || membersRes.error) {
    return NextResponse.json(
      { error: (rolesRes.error ?? membersRes.error)!.message },
      { status: 500 }
    );
  }

  const roles = (rolesRes.data ?? []).map((r) => ({
    id: r.id as string,
    name: r.name as string,
    category: r.category as RoleCategory,
    sortOrder: r.sort_order as number,
  }));
  const members = (membersRes.data ?? [])
    .map((m) => m.people as unknown as { id: string; full_name: string; active: boolean })
    .filter((p) => p.active)
    .map((p) => ({ id: p.id, name: p.full_name }));

  if (roles.length === 0 || members.length === 0) {
    return NextResponse.json(
      { error: "This team needs at least one active role and one active member." },
      { status: 400 }
    );
  }

  const memberIds = members.map((m) => m.id);
  const [blackoutsRes, historyRes] = await Promise.all([
    supabase
      .from("blackout_dates")
      .select("person_id, starts_on, ends_on")
      .in("person_id", memberIds)
      .gte("ends_on", sundays[0]),
    supabase
      .from("assignments")
      .select("person_id, service_date, schedule_roles!inner(category)")
      .eq("team_id", teamId)
      .gte("service_date", historyStart.toISOString().slice(0, 10))
      .lt("service_date", sundays[0])
      .not("person_id", "is", null),
  ]);
  if (blackoutsRes.error || historyRes.error) {
    return NextResponse.json(
      { error: (blackoutsRes.error ?? historyRes.error)!.message },
      { status: 500 }
    );
  }

  const blackouts = (blackoutsRes.data ?? []).map((b) => ({
    personId: b.person_id as string,
    startsOn: b.starts_on as string,
    endsOn: b.ends_on as string,
  }));
  const history: EngineHistoryEntry[] = (historyRes.data ?? []).map((h) => ({
    personId: h.person_id as string,
    serviceDate: h.service_date as string,
    category: (h.schedule_roles as unknown as { category: RoleCategory }).category,
  }));

  const generated = generateSchedule({ sundays, roles, members, blackouts, history });

  // Replace the window being regenerated.
  const del = await supabase
    .from("assignments")
    .delete()
    .eq("team_id", teamId)
    .in("service_date", sundays);
  if (del.error) return NextResponse.json({ error: del.error.message }, { status: 500 });

  const ins = await supabase.from("assignments").insert(
    generated.map((g) => ({
      team_id: teamId,
      role_id: g.roleId,
      person_id: g.personId,
      service_date: g.serviceDate,
    }))
  );
  if (ins.error) return NextResponse.json({ error: ins.error.message }, { status: 500 });

  const unfilled = generated.filter((g) => !g.personId).length;
  return NextResponse.json({
    weeks,
    sundays,
    created: generated.length,
    unfilled,
  });
}

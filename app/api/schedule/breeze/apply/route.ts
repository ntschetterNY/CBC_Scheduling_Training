import { NextResponse } from "next/server";
import { getScheduleActor } from "@/lib/scheduling/server";
import { isBreezeConfigured, planDirectoryImport, type AppPersonRow } from "@/lib/breeze";

/**
 * POST /api/schedule/breeze/apply — write a full Breeze directory import.
 *
 * This is the "push" the admin confirms after reviewing the preview. It
 * recomputes the plan against fresh Breeze data (so it acts on the current
 * directory, not a stale client payload), then:
 *   - imports new Breeze people into `people`
 *   - links matched-by-email rows and refreshes their name/email
 *   - refreshes name/email on already-linked rows that drifted
 *   - flags inactive any linked row Breeze no longer lists (never deleted)
 * Conflicts and hand-added rows are left untouched. Nothing is written back to
 * Breeze — the sync is one-way, read-only from Breeze's side.
 */
export async function POST() {
  const actor = await getScheduleActor();
  if (!actor) return NextResponse.json({ error: "Not signed in." }, { status: 401 });
  if (!actor.isAdmin) return NextResponse.json({ error: "Admins only." }, { status: 403 });
  if (!isBreezeConfigured) {
    return NextResponse.json(
      { error: "Breeze isn't configured. Set BREEZE_SUBDOMAIN and BREEZE_API_KEY." },
      { status: 400 }
    );
  }

  const { supabase } = actor;
  const { data, error } = await supabase
    .from("people")
    .select("id, full_name, email, breeze_person_id, active, deactivated_by_sync");
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  let plan;
  try {
    plan = await planDirectoryImport((data ?? []) as AppPersonRow[]);
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : String(err) },
      { status: 502 }
    );
  }

  const fail = (message: string) =>
    NextResponse.json({ error: `Import partially applied — ${message}` }, { status: 500 });

  // Imports: one insert for all new people.
  if (plan.toImport.length > 0) {
    const { error: e } = await supabase.from("people").insert(
      plan.toImport.map((i) => ({
        full_name: i.fullName,
        email: i.email,
        breeze_person_id: i.breezePersonId,
      }))
    );
    if (e) return fail(`insert failed: ${e.message}`);
  }

  // Links: set breeze_person_id and refresh name/email on matched rows.
  for (const l of plan.toLink) {
    const { error: e } = await supabase
      .from("people")
      .update({ breeze_person_id: l.breezePersonId, full_name: l.fullName, email: l.email })
      .eq("id", l.personId);
    if (e) return fail(`link failed for ${l.fullName}: ${e.message}`);
  }

  // Updates: refresh only the fields that actually drifted. A null Breeze email
  // is never in `changes`, so it can't overwrite an existing app email.
  for (const u of plan.toUpdate) {
    const payload: { full_name?: string; email?: string | null } = {};
    if (u.changes.includes("name")) payload.full_name = u.fullName;
    if (u.changes.includes("email")) payload.email = u.email;
    if (Object.keys(payload).length === 0) continue;
    const { error: e } = await supabase
      .from("people")
      .update(payload)
      .eq("id", u.personId);
    if (e) return fail(`update failed for ${u.fullName}: ${e.message}`);
  }

  // Reactivations: rows sync had deactivated that Breeze lists again. Clear the
  // sync flag so a later manual pause can be told apart from a sync deactivation.
  if (plan.toReactivate.length > 0) {
    const { error: e } = await supabase
      .from("people")
      .update({ active: true, deactivated_by_sync: false })
      .in(
        "id",
        plan.toReactivate.map((r) => r.personId)
      );
    if (e) return fail(`reactivate failed: ${e.message}`);
  }

  // Deactivations: one update for everyone Breeze dropped. Flag it as a sync
  // deactivation so it can be reactivated later without clobbering manual pauses.
  if (plan.toDeactivate.length > 0) {
    const { error: e } = await supabase
      .from("people")
      .update({ active: false, deactivated_by_sync: true })
      .in(
        "id",
        plan.toDeactivate.map((d) => d.personId)
      );
    if (e) return fail(`deactivate failed: ${e.message}`);
  }

  return NextResponse.json({
    applied: {
      imported: plan.toImport.length,
      linked: plan.toLink.length,
      updated: plan.toUpdate.length,
      deactivated: plan.toDeactivate.length,
      reactivated: plan.toReactivate.length,
    },
    skipped: {
      conflicts: plan.conflicts.length,
      unlinked: plan.unlinked.length,
    },
  });
}

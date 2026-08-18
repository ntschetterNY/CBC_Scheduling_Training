import { NextResponse } from "next/server";
import { getScheduleActor } from "@/lib/scheduling/server";
import {
  isBreezeConfigured,
  planDirectoryImport,
  summarizeDirectoryPlan,
  type AppPersonRow,
} from "@/lib/breeze";

/**
 * POST /api/schedule/breeze/preview — read-only dry run of a full Breeze
 * directory import.
 *
 * This is the "pull" the admin confirms: it makes one read call to Breeze and
 * returns what an import *would* change (import / link / update / deactivate),
 * plus conflicts and untouched hand-added rows. It writes nothing. The matching
 * /apply route recomputes against fresh Breeze data before writing, so the
 * preview never has to be trusted or replayed.
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

  try {
    const plan = await planDirectoryImport((data ?? []) as AppPersonRow[]);
    return NextResponse.json({ summary: summarizeDirectoryPlan(plan), plan });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : String(err) },
      { status: 502 }
    );
  }
}

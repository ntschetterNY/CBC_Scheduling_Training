import { NextResponse } from "next/server";
import { getScheduleActor } from "@/lib/scheduling/server";
import { isBreezeConfigured, listPeople } from "@/lib/breeze";

/**
 * GET /api/schedule/breeze/people/search?q=… — admin-only typeahead over the
 * Breeze directory, for linking a roster add to an existing Breeze person.
 *
 * Each match is joined against the app `people` table so the client knows
 * whether picking it means "reuse this app person" (appPersonId set) and
 * whether that row still needs its breeze_person_id written (needsLink).
 * Matching prefers the Breeze link, then falls back to email.
 */
export async function GET(req: Request) {
  const actor = await getScheduleActor();
  if (!actor) return NextResponse.json({ error: "Not signed in." }, { status: 401 });
  if (!actor.isAdmin) return NextResponse.json({ error: "Admins only." }, { status: 403 });
  if (!isBreezeConfigured) {
    return NextResponse.json({ matches: [], breezeConfigured: false });
  }

  const q = (new URL(req.url).searchParams.get("q") ?? "").trim().toLowerCase();
  if (q.length < 2) return NextResponse.json({ matches: [], breezeConfigured: true });

  try {
    // Cached directory read — the same 5-minute cache the schedule view uses,
    // so typing in the roster form doesn't hammer Breeze.
    const breezePeople = await listPeople({ revalidate: 300 });
    const matched = breezePeople
      .filter((p) => {
        const name = `${p.first_name ?? ""} ${p.last_name ?? ""}`.toLowerCase();
        return name.includes(q) || (p.email ?? "").toLowerCase().includes(q);
      })
      .slice(0, 12);

    const breezeIds = matched.map((p) => p.id);
    const emails = matched.flatMap((p) => (p.email ? [p.email.toLowerCase()] : []));
    const { supabase } = actor;
    const [byBreezeId, byEmail] = await Promise.all([
      breezeIds.length
        ? supabase
            .from("people")
            .select("id, breeze_person_id")
            .in("breeze_person_id", breezeIds)
        : Promise.resolve({ data: [] }),
      emails.length
        ? supabase.from("people").select("id, email, breeze_person_id").in("email", emails)
        : Promise.resolve({ data: [] }),
    ]);
    const appByBreezeId = new Map(
      (byBreezeId.data ?? []).map((r) => [r.breeze_person_id as string, r.id as string])
    );
    const appByEmail = new Map(
      (byEmail.data ?? []).map((r) => [
        (r.email as string).toLowerCase(),
        { id: r.id as string, linked: r.breeze_person_id != null },
      ])
    );

    const matches = matched.map((p) => {
      const name = `${p.first_name ?? ""} ${p.last_name ?? ""}`.trim();
      const linkedId = appByBreezeId.get(p.id);
      if (linkedId) {
        return { breezeId: p.id, name, email: p.email, appPersonId: linkedId, needsLink: false };
      }
      const emailHit = p.email ? appByEmail.get(p.email.toLowerCase()) : undefined;
      // An email hit already linked to a *different* Breeze person is a
      // conflict the directory sync reports; don't silently relink it here.
      if (emailHit && !emailHit.linked) {
        return { breezeId: p.id, name, email: p.email, appPersonId: emailHit.id, needsLink: true };
      }
      return { breezeId: p.id, name, email: p.email, appPersonId: null, needsLink: true };
    });

    return NextResponse.json({ matches, breezeConfigured: true });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : String(err) },
      { status: 502 }
    );
  }
}

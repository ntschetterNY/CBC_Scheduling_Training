import { NextResponse } from "next/server";
import { getScheduleActor } from "@/lib/scheduling/server";
import { isBreezeConfigured } from "@/lib/breeze";
import { assertBreezeAllowed } from "@/lib/breeze-gateway";

/**
 * GET /api/schedule/breeze/diagnose — raw health check of the Breeze calls the
 * volunteer schedule depends on. Reports HTTP status and a truncated sample of
 * each response (events, volunteers, roles) so an empty schedule section can
 * be traced to "no events", "no volunteer sign-ups", or an API/shape problem.
 *
 * Auth: a signed-in admin, or `Authorization: Bearer $BREEZE_DIAG_TOKEN` so
 * the check can run from a terminal without a browser session. Read-only;
 * never returns credentials.
 */

async function rawBreeze(
  endpointKey: string,
  path: string,
  params: Record<string, string>
) {
  // Same app-side gate as every other Breeze call (managed at /admin/api-keys);
  // a blocked endpoint shows up in the diagnostic output as the denial itself.
  try {
    await assertBreezeAllowed(endpointKey);
  } catch (err) {
    return {
      path,
      status: 0,
      error: err instanceof Error ? err.message : String(err),
    };
  }
  const url = new URL(`https://${process.env.BREEZE_SUBDOMAIN}.breezechms.com/api${path}`);
  for (const [k, v] of Object.entries(params)) url.searchParams.set(k, v);
  try {
    const res = await fetch(url, {
      headers: { "Api-Key": process.env.BREEZE_API_KEY! },
      cache: "no-store",
    });
    const text = await res.text();
    let json: unknown = null;
    try {
      json = JSON.parse(text);
    } catch {
      /* keep text sample */
    }
    const isArr = Array.isArray(json);
    const isObj = json !== null && typeof json === "object" && !isArr;
    return {
      path,
      status: res.status,
      isArray: isArr,
      count: isArr ? (json as unknown[]).length : null,
      // For object responses (e.g. an event detail), surface the top-level
      // field names so we can tell at a glance whether a roster is nested in.
      keys: isObj ? Object.keys(json as object) : undefined,
      sample: isArr
        ? (json as unknown[]).slice(0, 2)
        : json ?? text.slice(0, 400),
    };
  } catch (err) {
    return { path, status: 0, error: err instanceof Error ? err.message : String(err) };
  }
}

/**
 * Probe every identifier a Breeze event carries against the volunteer
 * endpoints. Breeze's `/events` list hands back three ids per occurrence
 * (`id`, `event_id`, `oid`), and for recurring/unmodified instances the one
 * the roster is actually keyed under is not obvious - so try each, plus the
 * event-detail endpoint (in case the roster is returned inline). Sequential to
 * stay under Breeze's ~20 req/min limit.
 */
async function probeEventInstance(ev: Record<string, unknown>) {
  const variants: Record<string, unknown> = {};
  for (const field of ["id", "event_id", "oid"] as const) {
    const val = ev[field];
    if (val == null) continue;
    variants[`volunteers.list · instance_id=${field}(${val})`] = await rawBreeze(
      "volunteers.list",
      "/volunteers/list",
      { instance_id: String(val) }
    );
    variants[`volunteers.list_roles · instance_id=${field}(${val})`] = await rawBreeze(
      "volunteers.list_roles",
      "/volunteers/list_roles",
      { instance_id: String(val), show_quantity: "1" }
    );
  }
  variants[`events.list_event · instance_id=id(${ev.id})`] = await rawBreeze(
    "events.show",
    "/events/list_event",
    { instance_id: String(ev.id), details: "1" }
  );
  return { ids: { id: ev.id, event_id: ev.event_id, oid: ev.oid }, variants };
}

export async function GET(req: Request) {
  const token = process.env.BREEZE_DIAG_TOKEN;
  const bearer = req.headers.get("authorization")?.replace(/^Bearer\s+/i, "");
  if (!(token && bearer === token)) {
    const actor = await getScheduleActor();
    if (!actor?.isAdmin) {
      return NextResponse.json({ error: "Admins only." }, { status: 403 });
    }
  }
  if (!isBreezeConfigured) {
    return NextResponse.json({ configured: false });
  }

  const start = new Date().toISOString().slice(0, 10);
  const horizon = new Date();
  horizon.setDate(horizon.getDate() + 42);
  const end = horizon.toISOString().slice(0, 10);

  const events = await rawBreeze("events.list", "/events", { start, end });

  // Decisive test: `?instance_id=<id>` probes exactly the instance the admin
  // pastes (e.g. the id from a staffed event's Breeze URL), so we can tell a
  // wrong-identifier bug from a genuinely empty roster.
  const override = new URL(req.url).searchParams.get("instance_id");
  let probes: unknown[];
  if (override) {
    probes = [
      {
        ids: { id: override, source: "query override" },
        variants: {
          [`volunteers.list · instance_id=${override}`]: await rawBreeze(
            "volunteers.list",
            "/volunteers/list",
            { instance_id: override }
          ),
          [`volunteers.list_roles · instance_id=${override}`]: await rawBreeze(
            "volunteers.list_roles",
            "/volunteers/list_roles",
            { instance_id: override, show_quantity: "1" }
          ),
          [`events.list_event · instance_id=${override}`]: await rawBreeze(
            "events.show",
            "/events/list_event",
            { instance_id: override, details: "1" }
          ),
        },
      },
    ];
  } else {
    const sampleEvents = (Array.isArray(events.sample) ? events.sample : []).slice(
      0,
      2
    ) as Record<string, unknown>[];
    probes = [];
    for (const ev of sampleEvents) probes.push(await probeEventInstance(ev));
  }

  return NextResponse.json({
    configured: true,
    subdomain: process.env.BREEZE_SUBDOMAIN,
    range: { start, end },
    events,
    probes,
  });
}

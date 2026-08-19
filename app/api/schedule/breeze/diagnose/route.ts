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
    return {
      path,
      status: res.status,
      isArray: Array.isArray(json),
      count: Array.isArray(json) ? json.length : null,
      sample: Array.isArray(json)
        ? json.slice(0, 2)
        : json ?? text.slice(0, 400),
    };
  } catch (err) {
    return { path, status: 0, error: err instanceof Error ? err.message : String(err) };
  }
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
  const firstInstances = (Array.isArray(events.sample) ? events.sample : [])
    .concat()
    .slice(0, 2) as { id?: string | number }[];

  const perInstance = await Promise.all(
    firstInstances
      .filter((e) => e?.id != null)
      .map(async (e) => ({
        instanceId: String(e.id),
        volunteers: await rawBreeze("volunteers.list", "/volunteers/list", {
          instance_id: String(e.id),
        }),
        roles: await rawBreeze("volunteers.list_roles", "/volunteers/list_roles", {
          instance_id: String(e.id),
          show_quantity: "1",
        }),
      }))
  );

  return NextResponse.json({
    configured: true,
    subdomain: process.env.BREEZE_SUBDOMAIN,
    range: { start, end },
    events,
    perInstance,
  });
}

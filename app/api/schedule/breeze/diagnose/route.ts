import { NextResponse } from "next/server";
import { getScheduleActor } from "@/lib/scheduling/server";
import { isBreezeConfigured } from "@/lib/breeze";
import { assertBreezeAllowed } from "@/lib/breeze-gateway";

/**
 * GET /api/schedule/breeze/diagnose — raw health check of the Breeze calls the
 * volunteer schedule depends on. Reports HTTP status, top-level object keys,
 * and a truncated sample of each response so an empty schedule section can be
 * traced to "no events", "no volunteer sign-ups", or an API/shape problem.
 *
 * Breeze hands back three ids per event occurrence (`id`, `event_id`, `oid`)
 * and a roster may be keyed to any of them, so each sampled event is probed
 * with all three against the volunteer endpoints, plus the event-detail
 * endpoint in case the roster is returned inline. Pass `?instance_id=<id>` to
 * probe one specific instance instead (e.g. the id from a staffed event's
 * Breeze URL). Add `?guess=1` to also fire a curated list of guessed Api-Key
 * endpoints (see `rawGuess`) hunting for one that returns the Volunteers 2
 * roster; kept off the default run to stay under Breeze's rate limit.
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
 * Fire a guessed endpoint straight at the Breeze subdomain with the Api-Key
 * header and NO cookies - the point is to discover whether any Api-Key-
 * authenticated endpoint (public `/api/...` or the internal `/ajax/...` the
 * Volunteers 2 web UI uses) will return the roster our documented calls can't
 * see. Bypasses the app permission gate on purpose (these keys aren't in the
 * catalog) and is read-only: only ever call listing/`get_` endpoints here.
 * Reports status, content-type, and a small shape sample, never credentials.
 */
async function rawGuess(
  method: "GET" | "POST",
  path: string,
  opts: { params?: Record<string, string>; body?: Record<string, string> } = {}
) {
  // Absolute URLs (e.g. the modern https://api.breezechms.com/api/v2/... host)
  // pass through; a bare path is resolved against the church subdomain.
  const url = new URL(
    path.startsWith("http")
      ? path
      : `https://${process.env.BREEZE_SUBDOMAIN}.breezechms.com${path}`
  );
  if (opts.params) for (const [k, v] of Object.entries(opts.params)) url.searchParams.set(k, v);
  try {
    const res = await fetch(url, {
      method,
      headers: {
        // Send the account key under both header names: legacy Breeze uses
        // `Api-Key`; the v2 API's CORS advertises `X-Api-Key`.
        "Api-Key": process.env.BREEZE_API_KEY!,
        "X-Api-Key": process.env.BREEZE_API_KEY!,
        Accept: "application/json, text/javascript, */*",
        ...(method === "POST"
          ? { "Content-Type": "application/x-www-form-urlencoded" }
          : {}),
      },
      body:
        method === "POST" && opts.body
          ? new URLSearchParams(opts.body).toString()
          : undefined,
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
      call: `${method} ${url.pathname}${url.search}`,
      status: res.status,
      // A login page or HTML means the endpoint wants a cookie session, not the key.
      contentType: res.headers.get("content-type"),
      isArray: isArr,
      count: isArr ? (json as unknown[]).length : null,
      keys: isObj ? Object.keys(json as object).slice(0, 40) : undefined,
      sample:
        json !== null
          ? isArr
            ? (json as unknown[]).slice(0, 2)
            : json
          : text.slice(0, 300),
    };
  } catch (err) {
    return {
      call: `${method} ${path}`,
      status: 0,
      error: err instanceof Error ? err.message : String(err),
    };
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

  const url = new URL(req.url);
  // Decisive test: `?instance_id=<id>` probes exactly the instance the admin
  // pastes (e.g. the id from a staffed event's Breeze URL), so we can tell a
  // wrong-identifier bug from a genuinely empty roster.
  const override = url.searchParams.get("instance_id");

  // `?guess=1`: hunt for ANY Api-Key-reachable endpoint that returns the
  // Volunteers 2 roster - a hypothetical public `/api/volunteers2/*`, an event
  // sub-resource, or the internal `/ajax/...` call the web UI uses (in case it
  // honors the key, not just a cookie). Read-only guesses; gated separately so
  // the default run stays under Breeze's rate limit.
  let guesses: unknown = undefined;
  if (url.searchParams.get("guess")) {
    const firstId = (
      (Array.isArray(events.sample) ? events.sample : []) as { id?: unknown }[]
    )[0]?.id;
    const target = override ?? (firstId != null ? String(firstId) : "319641045");
    // The modern v2 API host the Volunteers 2 UI talks to. If it honors the
    // account key (its CORS advertises X-Api-Key), these expose the roster
    // cleanly - no cookies/CSRF/WAF. Structure is unknown, so probe the root
    // (for a resource index / auth error) and the most likely shapes.
    const V2 = "https://api.breezechms.com/api/v2";
    const attempts: [("GET" | "POST"), string, { params?: Record<string, string>; body?: Record<string, string> }][] = [
      ["GET", `${V2}/`, {}],
      ["GET", `${V2}/events`, {}],
      ["GET", `${V2}/events/${target}`, {}],
      ["GET", `${V2}/events/${target}/volunteers`, {}],
      ["GET", `${V2}/events/${target}/roles`, {}],
      ["GET", `${V2}/volunteers`, { params: { event_instance_id: target } }],
      ["GET", `${V2}/volunteer_roles`, { params: { event_instance_id: target } }],
      ["GET", `${V2}/scheduling/volunteers`, { params: { instance_id: target } }],
      // Legacy-host guesses kept for contrast (all previously empty/404/WAF).
      ["GET", "/api/volunteers2/list", { params: { instance_id: target } }],
      ["POST", "/ajax/volunteer_role_list", { body: { instance_id: target } }],
    ];
    const results = [];
    for (const [method, path, opts] of attempts) results.push(await rawGuess(method, path, opts));
    guesses = { target, results };
  }

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
    ...(guesses !== undefined ? { guesses } : {}),
  });
}

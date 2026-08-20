/**
 * Behavior of GET /api/schedule/breeze/diagnose — the read-only, admin-gated
 * Breeze schedule diagnostic that pinpoints why a staffed event returns an
 * empty roster.
 *
 * Drives the real route handler (bearer-token auth path) with a stubbed
 * `fetch` and the shared Supabase gate stub. Asserts the OBSERVABLE contract
 * the diagnostic exists to provide:
 *   - every identifier an event carries (id, event_id, oid) is probed against
 *     both volunteer endpoints, plus the events/list_event detail call;
 *   - `?instance_id=<id>` probes exactly the pasted instance;
 *   - object responses surface their top-level keys (roster-inline check);
 *   - the app-side gate is honored — a denied endpoint (events.show) is never
 *     fetched and shows up in the output as its denial.
 */
import assert from "node:assert/strict";
import { afterEach, beforeEach, describe, it } from "node:test";
import { resetStub, stubState } from "./setup/supabase-server-stub.ts";

process.env.BREEZE_SUBDOMAIN = "testchurch";
process.env.BREEZE_API_KEY = "test-key-123";
process.env.BREEZE_DIAG_TOKEN = "diag-secret";
const { GET } = await import("@/app/api/schedule/breeze/diagnose/route");

const realFetch = globalThis.fetch;

const allow = (key: string) => ({ endpoint_key: key, allowed: true });

/** Records every URL fetched and answers with a shape keyed off the path. */
function stubFetch() {
  const urls: string[] = [];
  globalThis.fetch = (async (input: RequestInfo | URL) => {
    const u = String(input);
    urls.push(u);
    if (u.includes("/api/events/list_event")) {
      // An event-detail OBJECT (not an array): the roster returned inline.
      return new Response(
        JSON.stringify({
          id: "319641045",
          name: "Worship Gathering",
          event_id: "58500229",
          volunteers: [{ role: "Elders", people: 3 }],
        }),
        { status: 200 }
      );
    }
    if (u.includes("/api/events")) {
      // events.list — one occurrence carrying all three identifiers.
      return new Response(
        JSON.stringify([
          { id: "319641045", event_id: "58500229", oid: "42424242", name: "Worship Gathering" },
        ]),
        { status: 200 }
      );
    }
    // volunteers.list / volunteers.list_roles — empty roster (the reported bug).
    return new Response(JSON.stringify([]), { status: 200 });
  }) as typeof fetch;
  return urls;
}

function diagReq(query = "") {
  return new Request(`http://localhost/api/schedule/breeze/diagnose${query}`, {
    headers: { authorization: "Bearer diag-secret" },
  });
}

describe("breeze diagnose route", () => {
  beforeEach(resetStub);
  afterEach(() => {
    globalThis.fetch = realFetch;
  });

  it("rejects a request without the diag token and no admin session", async () => {
    const res = await GET(new Request("http://localhost/api/schedule/breeze/diagnose"));
    assert.equal(res.status, 403);
  });

  it("probes all three identifiers against both volunteer endpoints plus the detail call", async () => {
    stubState.permsRows = [
      allow("events.list"),
      allow("volunteers.list"),
      allow("volunteers.list_roles"),
      allow("events.show"),
    ];
    const urls = stubFetch();

    const res = await GET(diagReq());
    assert.equal(res.status, 200);
    const body = (await res.json()) as {
      probes: { ids: Record<string, unknown>; variants: Record<string, { path: string }> }[];
    };

    // One event in, one probe group out, echoing the three identifiers.
    assert.equal(body.probes.length, 1);
    assert.deepEqual(body.probes[0].ids, {
      id: "319641045",
      event_id: "58500229",
      oid: "42424242",
    });

    // Each identifier VALUE must have been sent to BOTH volunteer endpoints.
    for (const val of ["319641045", "58500229", "42424242"]) {
      assert.ok(
        urls.some((u) => u.includes("/api/volunteers/list?") && u.includes(`instance_id=${val}`)),
        `volunteers/list was probed with instance_id=${val}`
      );
      assert.ok(
        urls.some(
          (u) => u.includes("/api/volunteers/list_roles?") && u.includes(`instance_id=${val}`)
        ),
        `volunteers/list_roles was probed with instance_id=${val}`
      );
    }
    // And the event-detail endpoint hit once with the primary id.
    assert.ok(
      urls.some(
        (u) => u.includes("/api/events/list_event") && u.includes("instance_id=319641045")
      ),
      "events/list_event was probed for the inline roster"
    );
  });

  it("surfaces top-level object keys so an inline roster is visible", async () => {
    stubState.permsRows = [
      allow("events.list"),
      allow("volunteers.list"),
      allow("volunteers.list_roles"),
      allow("events.show"),
    ];
    stubFetch();

    const res = await GET(diagReq());
    const body = (await res.json()) as {
      probes: { variants: Record<string, { keys?: string[]; count: number | null }> }[];
    };
    const variants = body.probes[0].variants;
    const detail = Object.entries(variants).find(([label]) => label.includes("events.list_event"));
    assert.ok(detail, "a detail variant is present");
    const [, result] = detail!;
    // Object response -> keys surfaced, count null (not an array).
    assert.deepEqual(result.keys, ["id", "name", "event_id", "volunteers"]);
    assert.equal(result.count, null);
    assert.ok(result.keys!.includes("volunteers"), "the inline roster field is visible in keys");
  });

  it("probes exactly the pasted instance when ?instance_id is given", async () => {
    stubState.permsRows = [
      allow("volunteers.list"),
      allow("volunteers.list_roles"),
      allow("events.show"),
    ];
    const urls = stubFetch();

    const res = await GET(diagReq("?instance_id=319641045"));
    assert.equal(res.status, 200);
    const body = (await res.json()) as {
      probes: { ids: Record<string, unknown>; variants: Record<string, unknown> }[];
    };
    assert.equal(body.probes.length, 1);
    assert.equal(body.probes[0].ids.id, "319641045");
    assert.equal(body.probes[0].ids.source, "query override");
    assert.equal(Object.keys(body.probes[0].variants).length, 3);

    // Exactly the pasted id, on all three endpoints; no event-list fan-out.
    const volList = urls.filter((u) => u.includes("/api/volunteers/list?"));
    assert.equal(volList.length, 1);
    assert.ok(volList[0].includes("instance_id=319641045"));
    assert.ok(
      urls.some((u) => u.includes("/api/events/list_event") && u.includes("instance_id=319641045"))
    );
  });

  it("honors the gate: a denied events.show is never fetched and shows as its denial", async () => {
    // events.show intentionally NOT allowed (matches the real deployment where
    // it may be off). Volunteer endpoints allowed so the roster probes run.
    stubState.permsRows = [allow("volunteers.list"), allow("volunteers.list_roles")];
    const urls = stubFetch();

    const res = await GET(diagReq("?instance_id=319641045"));
    assert.equal(res.status, 200);
    const body = (await res.json()) as {
      probes: { variants: Record<string, { status: number; error?: string }> }[];
    };
    const detailEntry = Object.entries(body.probes[0].variants).find(([l]) =>
      l.includes("events.list_event")
    )!;
    const detail = detailEntry[1];
    // Denial surfaces in-band: status 0 with the gate's message, no HTTP call.
    assert.equal(detail.status, 0);
    assert.match(detail.error ?? "", /denied/i);
    assert.ok(
      !urls.some((u) => u.includes("/api/events/list_event")),
      "no request may reach events/list_event while events.show is denied"
    );
  });
});

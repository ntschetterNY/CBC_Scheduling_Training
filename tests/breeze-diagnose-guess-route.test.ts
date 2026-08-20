/**
 * Behavior of the `?guess=1` mode on GET /api/schedule/breeze/diagnose.
 *
 * The guess mode hunts for ANY Api-Key-authenticated Breeze endpoint that can
 * return the Volunteers 2 roster the documented calls can't see. Drives the
 * real route handler (bearer-token auth path) with a stubbed `fetch` and the
 * shared Supabase gate stub, and asserts the OBSERVABLE contract:
 *   - `guesses` appears only when `?guess` is present;
 *   - each candidate is fired straight at the Breeze subdomain with the Api-Key
 *     header and NO cookies (a hypothetical public `/api/volunteers2/*`, an
 *     event sub-resource, and the internal `/ajax/get_*` calls the web UI uses);
 *   - the internal `/ajax/get_*` calls are POSTed with instance_id in the body;
 *   - every fired guess is read-only (GET listing or POST `get_*`), never an
 *     add/remove/update call;
 *   - it deliberately bypasses the app permission gate (fires even when the
 *     catalog denies everything);
 *   - each result reports status, content-type, array/count/keys and a sample,
 *     so a real roster (JSON array) is distinguishable from an HTML login page.
 */
import assert from "node:assert/strict";
import { afterEach, beforeEach, describe, it } from "node:test";
import { resetStub, stubState } from "./setup/supabase-server-stub.ts";

process.env.BREEZE_SUBDOMAIN = "testchurch";
process.env.BREEZE_API_KEY = "test-key-123";
process.env.BREEZE_DIAG_TOKEN = "diag-secret";
const { GET } = await import("@/app/api/schedule/breeze/diagnose/route");

const realFetch = globalThis.fetch;

type Captured = { url: string; method: string; headers: Record<string, string>; body?: string };

/**
 * Records every request (url, method, headers, body) and answers by path:
 *  - the events list carries one occurrence;
 *  - `/api/volunteers2/list` is the "winning" guess: a JSON roster array;
 *  - the internal `/ajax/get_volunteer_instance_role_details` returns an HTML
 *    login page (the endpoint wants a cookie session, not the key);
 *  - everything else is an empty roster.
 */
function stubFetch() {
  const calls: Captured[] = [];
  globalThis.fetch = (async (input: RequestInfo | URL, init?: RequestInit) => {
    const u = String(input);
    const rawHeaders = (init?.headers ?? {}) as Record<string, string>;
    calls.push({
      url: u,
      method: (init?.method as string) ?? "GET",
      headers: rawHeaders,
      body: typeof init?.body === "string" ? init.body : undefined,
    });
    if (u.includes("/api/volunteers2/list?")) {
      // The endpoint that actually returns the roster under the Api-Key.
      return new Response(
        JSON.stringify([
          { role: "Elders", person: "Ada" },
          { role: "Ushers", person: "Grace" },
        ]),
        { status: 200, headers: { "content-type": "application/json" } }
      );
    }
    if (u.includes("/ajax/get_volunteer_instance_role_details")) {
      // An HTML login page: honors a cookie session, not the key.
      return new Response("<!doctype html><html><body>Sign In | Breeze</body></html>", {
        status: 200,
        headers: { "content-type": "text/html; charset=utf-8" },
      });
    }
    if (u.includes("/api/events") && !u.includes("/api/events/")) {
      // events.list — one occurrence carrying its identifiers.
      return new Response(
        JSON.stringify([
          { id: "319641045", event_id: "58500229", oid: "42424242", name: "Worship Gathering" },
        ]),
        { status: 200, headers: { "content-type": "application/json" } }
      );
    }
    // Any other guess (volunteers2/list_roles, events/volunteers, the other
    // /ajax get_) — empty JSON array.
    return new Response(JSON.stringify([]), {
      status: 200,
      headers: { "content-type": "application/json" },
    });
  }) as typeof fetch;
  return calls;
}

function diagReq(query = "") {
  return new Request(`http://localhost/api/schedule/breeze/diagnose${query}`, {
    headers: { authorization: "Bearer diag-secret" },
  });
}

type GuessResult = {
  call: string;
  status: number;
  contentType?: string | null;
  isArray?: boolean;
  count?: number | null;
  keys?: string[];
  sample?: unknown;
  error?: string;
};

describe("breeze diagnose ?guess mode", () => {
  beforeEach(resetStub);
  afterEach(() => {
    globalThis.fetch = realFetch;
  });

  it("omits `guesses` unless ?guess is passed", async () => {
    stubState.permsRows = [{ endpoint_key: "events.list", allowed: true }];
    stubFetch();
    const res = await GET(diagReq());
    const body = (await res.json()) as Record<string, unknown>;
    assert.equal("guesses" in body, false, "default run does not include guesses");
  });

  it("fires the curated candidates at the Breeze subdomain with the Api-Key and no cookies", async () => {
    // Only events.list allowed; the guess candidates are NOT in the catalog and
    // must fire regardless (deliberate gate bypass).
    stubState.permsRows = [{ endpoint_key: "events.list", allowed: true }];
    const calls = stubFetch();

    const res = await GET(diagReq("?guess=1"));
    assert.equal(res.status, 200);
    const body = (await res.json()) as { guesses: { target: string; results: GuessResult[] } };

    // Target defaults to the first event's id.
    assert.equal(body.guesses.target, "319641045");

    const guessCalls = calls.filter((c) => !/\/api\/events(\?|$)/.test(c.url));
    assert.ok(guessCalls.length >= 8, "all curated candidates fired");

    // Every guess hits the Breeze subdomain host, carries the Api-Key, and
    // never sends a Cookie header.
    for (const c of guessCalls) {
      assert.ok(
        c.url.startsWith("https://testchurch.breezechms.com/"),
        `guess hit the Breeze subdomain: ${c.url}`
      );
      assert.equal(c.headers["Api-Key"], "test-key-123", `Api-Key sent for ${c.url}`);
      const headerNames = Object.keys(c.headers).map((h) => h.toLowerCase());
      assert.ok(!headerNames.includes("cookie"), `no cookie sent for ${c.url}`);
    }

    // Both the hypothetical public endpoint and the internal /ajax one were tried.
    assert.ok(
      guessCalls.some((c) => c.url.includes("/api/volunteers2/list")),
      "public /api/volunteers2/list guessed"
    );
    assert.ok(
      guessCalls.some((c) => c.url.includes("/ajax/get_volunteer_instance_role_details")),
      "internal /ajax get_ endpoint guessed"
    );
  });

  it("POSTs the internal /ajax get_ calls with instance_id in the body; only read-only calls fire", async () => {
    stubState.permsRows = [{ endpoint_key: "events.list", allowed: true }];
    const calls = stubFetch();
    await GET(diagReq("?guess=1"));

    const guessCalls = calls.filter((c) => !/\/api\/events(\?|$)/.test(c.url));
    for (const c of guessCalls) {
      const path = new URL(c.url).pathname;
      if (path.startsWith("/ajax/")) {
        assert.equal(c.method, "POST", `${path} is POSTed`);
        assert.match(c.body ?? "", /instance_id=319641045/, `${path} carries instance_id`);
        // Read-only guarantee: the internal calls are only ever `get_*`.
        assert.match(path, /\/ajax\/get_/, `${path} is a read-only get_ call`);
      } else {
        assert.equal(c.method, "GET", `${path} is a GET`);
        // Read-only guarantee: public guesses only list/read, never mutate.
        assert.doesNotMatch(
          path,
          /(add|remove|update|delete|create|edit)/i,
          `${path} is not a mutating call`
        );
      }
    }
  });

  it("reports status/content-type/count so a real roster is distinguishable from an HTML login page", async () => {
    stubState.permsRows = [{ endpoint_key: "events.list", allowed: true }];
    stubFetch();

    const res = await GET(diagReq("?guess=1"));
    const body = (await res.json()) as { guesses: { results: GuessResult[] } };
    const byCall = (needle: string) =>
      body.guesses.results.find((r) => r.call.includes(needle))!;

    // The winning guess: a JSON array roster is surfaced as such.
    const winner = byCall("/api/volunteers2/list?");
    assert.equal(winner.status, 200);
    assert.match(winner.contentType ?? "", /application\/json/);
    assert.equal(winner.isArray, true);
    assert.equal(winner.count, 2);
    assert.equal((winner.sample as unknown[]).length, 2);

    // The HTML login page is clearly NOT a roster: html content-type, text sample.
    const login = byCall("/ajax/get_volunteer_instance_role_details");
    assert.equal(login.status, 200);
    assert.match(login.contentType ?? "", /text\/html/);
    assert.notEqual(login.isArray, true);
    assert.match(String(login.sample), /Sign In \| Breeze/);
  });
});

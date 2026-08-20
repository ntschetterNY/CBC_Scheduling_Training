/**
 * Behavior of the `?guess=1` mode on GET /api/schedule/breeze/diagnose.
 *
 * The guess mode hunts for ANY Api-Key-authenticated Breeze endpoint that can
 * return the Volunteers 2 roster the documented calls can't see - including the
 * modern v2 API host (https://api.breezechms.com/api/v2/...) the Volunteers 2
 * UI runs on. Drives the real route handler (bearer-token auth path) with a
 * stubbed `fetch` and the shared Supabase gate stub, and asserts the OBSERVABLE
 * contract:
 *   - `guesses` appears only when `?guess` is present;
 *   - candidates fire against both the church subdomain and the v2 API host,
 *     each carrying the account key under BOTH `Api-Key` and `X-Api-Key`, and
 *     never a Cookie header;
 *   - every fired guess is read-only (GET listing or a POST `*_list`), never an
 *     add/remove/update/delete call;
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
 *  - the v2 `.../events/<id>/volunteers` endpoint is the "winning" guess: a JSON
 *    roster array returned under the account key;
 *  - the internal `/ajax/volunteer_role_list` returns an HTML page (the WAF /
 *    cookie-session wall the key can't clear);
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
    if (/api\.breezechms\.com\/api\/v2\/events\/\d+\/volunteers/.test(u)) {
      // The endpoint that actually returns the roster under the account key.
      return new Response(
        JSON.stringify([
          { role: "Elders", person: "Ada" },
          { role: "Ushers", person: "Grace" },
        ]),
        { status: 200, headers: { "content-type": "application/json" } }
      );
    }
    if (u.includes("/ajax/volunteer_role_list")) {
      // The internal web-app endpoint: HTML, gated by cookie session + WAF.
      return new Response("<!doctype html><html><body>Sign In | Breeze</body></html>", {
        status: 200,
        headers: { "content-type": "text/html; charset=utf-8" },
      });
    }
    if (u.includes("/api/events") && !u.includes("/api/events/") && !u.includes("/api/v2/")) {
      // legacy events.list — one occurrence carrying its identifiers.
      return new Response(
        JSON.stringify([
          { id: "319641045", event_id: "58500229", oid: "42424242", name: "Worship Gathering" },
        ]),
        { status: 200, headers: { "content-type": "application/json" } }
      );
    }
    // Any other guess — empty JSON array.
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

const isGuessCall = (url: string) =>
  url.includes("api.breezechms.com/api/v2") ||
  url.includes("/api/volunteers2/") ||
  url.includes("/ajax/");

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

  it("fires candidates at both the v2 API host and the subdomain, with the key under both header names and no cookies", async () => {
    // Only events.list allowed; the guess candidates are NOT in the catalog and
    // must fire regardless (deliberate gate bypass).
    stubState.permsRows = [{ endpoint_key: "events.list", allowed: true }];
    const calls = stubFetch();

    const res = await GET(diagReq("?guess=1"));
    assert.equal(res.status, 200);
    const body = (await res.json()) as { guesses: { target: string; results: GuessResult[] } };

    // Target defaults to the first event's id.
    assert.equal(body.guesses.target, "319641045");

    const guessCalls = calls.filter((c) => isGuessCall(c.url));
    assert.ok(guessCalls.length >= 8, "all curated candidates fired");

    for (const c of guessCalls) {
      // Each guess carries the account key under BOTH header names and never a cookie.
      assert.equal(c.headers["Api-Key"], "test-key-123", `Api-Key sent for ${c.url}`);
      assert.equal(c.headers["X-Api-Key"], "test-key-123", `X-Api-Key sent for ${c.url}`);
      const headerNames = Object.keys(c.headers).map((h) => h.toLowerCase());
      assert.ok(!headerNames.includes("cookie"), `no cookie sent for ${c.url}`);
    }

    // Both the modern v2 host and the legacy subdomain were probed.
    assert.ok(
      guessCalls.some((c) => c.url.startsWith("https://api.breezechms.com/api/v2/")),
      "modern v2 API host probed"
    );
    assert.ok(
      guessCalls.some((c) => c.url.startsWith("https://testchurch.breezechms.com/")),
      "legacy subdomain probed"
    );
  });

  it("only fires read-only calls (GET, or a POST *_list), never a mutating endpoint", async () => {
    stubState.permsRows = [{ endpoint_key: "events.list", allowed: true }];
    const calls = stubFetch();
    await GET(diagReq("?guess=1"));

    for (const c of calls.filter((c) => isGuessCall(c.url))) {
      const path = new URL(c.url).pathname;
      assert.doesNotMatch(
        path,
        /(add|remove|update|delete|create|edit)/i,
        `${path} is not a mutating call`
      );
      if (c.method === "POST") {
        // The only POST guess is the roster-listing /ajax call, with instance_id in the body.
        assert.match(path, /_list$/, `POST ${path} is a listing call`);
        assert.match(c.body ?? "", /instance_id=319641045/, `${path} carries instance_id`);
      }
    }
  });

  it("reports status/content-type/count so a real roster is distinguishable from an HTML page", async () => {
    stubState.permsRows = [{ endpoint_key: "events.list", allowed: true }];
    stubFetch();

    const res = await GET(diagReq("?guess=1"));
    const body = (await res.json()) as { guesses: { results: GuessResult[] } };
    const byCall = (needle: string) =>
      body.guesses.results.find((r) => r.call.includes(needle))!;

    // The winning guess: a JSON array roster from the v2 host is surfaced as such.
    const winner = byCall("/api/v2/events/319641045/volunteers");
    assert.equal(winner.status, 200);
    assert.match(winner.contentType ?? "", /application\/json/);
    assert.equal(winner.isArray, true);
    assert.equal(winner.count, 2);
    assert.equal((winner.sample as unknown[]).length, 2);

    // The internal /ajax HTML page is clearly NOT a roster: html type, text sample.
    const html = byCall("/ajax/volunteer_role_list");
    assert.equal(html.status, 200);
    assert.match(html.contentType ?? "", /text\/html/);
    assert.notEqual(html.isArray, true);
    assert.match(String(html.sample), /Sign In \| Breeze/);
  });
});

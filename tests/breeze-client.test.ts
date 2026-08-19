/**
 * The Breeze HTTP client honors the gate, and the probe deliberately doesn't.
 *
 * Exercises the real lib/breeze.ts with a recording fetch stub:
 *   - a blocked endpoint throws BEFORE any request leaves the process
 *   - an allowed endpoint reaches Breeze with the Api-Key header
 *   - breezeProbeRequest bypasses the gate (its documented purpose) but
 *     reduces responses to status/row-count - no Breeze payload escapes
 */
import assert from "node:assert/strict";
import { afterEach, beforeEach, describe, it } from "node:test";
import { resetStub, stubState } from "./setup/supabase-server-stub.ts";

process.env.BREEZE_SUBDOMAIN = "testchurch";
process.env.BREEZE_API_KEY = "test-key-123";
const breeze = await import("@/lib/breeze");
const { BreezeAccessDeniedError } = await import("@/lib/breeze-gateway");

const realFetch = globalThis.fetch;
let fetchCalls: { url: string; headers: Record<string, string> }[] = [];
let fetchResponder: (url: string) => Response = () =>
  new Response("[]", { status: 200 });

function installFetchStub() {
  fetchCalls = [];
  globalThis.fetch = (async (input: RequestInfo | URL, init?: RequestInit) => {
    const url = String(input);
    fetchCalls.push({
      url,
      headers: Object.fromEntries(
        Object.entries((init?.headers as Record<string, string>) ?? {})
      ),
    });
    return fetchResponder(url);
  }) as typeof fetch;
}

describe("breeze client obeys the gate", () => {
  beforeEach(() => {
    resetStub();
    installFetchStub();
  });
  afterEach(() => {
    globalThis.fetch = realFetch;
  });

  it("blocked endpoint: listPeople throws and NO request leaves the server", async () => {
    stubState.permsRows = [{ endpoint_key: "people.list", allowed: false }];
    await assert.rejects(breeze.listPeople(), BreezeAccessDeniedError);
    assert.equal(fetchCalls.length, 0, "no network call may happen when denied");
  });

  it("master switch off: even seeded-allowed endpoints make no network call", async () => {
    stubState.settingsRow = { enabled: false };
    stubState.permsRows = [{ endpoint_key: "people.list", allowed: true }];
    await assert.rejects(breeze.listPeople(), BreezeAccessDeniedError);
    assert.equal(fetchCalls.length, 0);
  });

  it("allowed endpoint: request goes to Breeze with the Api-Key header", async () => {
    stubState.permsRows = [{ endpoint_key: "people.list", allowed: true }];
    fetchResponder = () =>
      new Response(
        JSON.stringify([
          {
            id: 42,
            first_name: "Ada",
            last_name: "Lovelace",
            details: {
              "123": [
                { field_type: "email_primary", address: "ada@example.com", is_primary: "1" },
              ],
            },
          },
        ]),
        { status: 200 }
      );
    const people = await breeze.listPeople();
    assert.equal(fetchCalls.length, 1);
    assert.ok(
      fetchCalls[0].url.startsWith("https://testchurch.breezechms.com/api/people"),
      fetchCalls[0].url
    );
    assert.equal(fetchCalls[0].headers["Api-Key"], "test-key-123");
    assert.deepEqual(people, [
      { id: "42", first_name: "Ada", last_name: "Lovelace", email: "ada@example.com" },
    ]);
  });
});

describe("breezeProbeRequest (super-admin probe)", () => {
  beforeEach(() => {
    resetStub();
    installFetchStub();
  });
  afterEach(() => {
    globalThis.fetch = realFetch;
  });

  it("bypasses the gate: probes succeed even with the master switch off and zero rows allowed", async () => {
    stubState.settingsRow = { enabled: false };
    stubState.permsRows = [];
    fetchResponder = () => new Response(JSON.stringify([{ id: 1 }, { id: 2 }]), { status: 200 });
    const result = await breeze.breezeProbeRequest("/giving/list");
    assert.equal(result.ok, true);
    assert.equal(result.status, 200);
    assert.equal(fetchCalls.length, 1, "probe must hit the network despite the gate");
  });

  it("reduces responses to status/row-count - the payload never appears in the result", async () => {
    fetchResponder = () =>
      new Response(
        JSON.stringify([
          { id: 1, amount: "500.00", donor: "Jane Doe" },
          { id: 2, amount: "25.00", donor: "John Doe" },
        ]),
        { status: 200 }
      );
    const result = await breeze.breezeProbeRequest("/giving/list");
    assert.deepEqual(result, { status: 200, ok: true, count: 2, error: null });
    assert.ok(!JSON.stringify(result).includes("Jane"), "no Breeze data may leak through");
  });

  it("flags Breeze's in-band 200 failures ({success:false} / {errors:[...]})", async () => {
    fetchResponder = () =>
      new Response(JSON.stringify({ success: false, errors: ["invalid key"] }), { status: 200 });
    const result = await breeze.breezeProbeRequest("/account/summary");
    assert.equal(result.ok, false);
    assert.equal(result.count, null);
    assert.match(result.error ?? "", /invalid key/);
  });

  it("reports HTTP errors with truncated text, and network failures without throwing", async () => {
    fetchResponder = () => new Response("x".repeat(1000), { status: 403 });
    const denied = await breeze.breezeProbeRequest("/people");
    assert.equal(denied.ok, false);
    assert.equal(denied.status, 403);
    assert.ok((denied.error ?? "").length <= 200);

    globalThis.fetch = (async () => {
      throw new Error("getaddrinfo ENOTFOUND");
    }) as typeof fetch;
    const down = await breeze.breezeProbeRequest("/people");
    assert.deepEqual(down, {
      status: null,
      ok: false,
      count: null,
      error: "getaddrinfo ENOTFOUND",
    });
  });
});

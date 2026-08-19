/**
 * Fail-closed behavior of the Breeze permission gate (lib/breeze-gateway.ts).
 *
 * Run: npm test  (node --test with tests/setup/register.mjs registered)
 *
 * The real gate code executes; only the cookie-bound Supabase server client
 * is stubbed (tests/setup/supabase-server-stub.ts). Every case the intent
 * calls out as MUST-deny is covered: missing rows, unknown endpoint keys,
 * RLS-filtered reads, DB errors, no DB connection, and the master switch.
 */
import assert from "node:assert/strict";
import { beforeEach, describe, it } from "node:test";
import { resetStub, stubState } from "./setup/supabase-server-stub.ts";
import {
  assertBreezeAllowed,
  BreezeAccessDeniedError,
  getBreezeGatewayState,
} from "@/lib/breeze-gateway";

const allowed = (key: string, on = true) => ({ endpoint_key: key, allowed: on });

async function denialMessage(key: string): Promise<string> {
  try {
    await assertBreezeAllowed(key);
  } catch (err) {
    assert.ok(err instanceof BreezeAccessDeniedError, `expected denial, got ${err}`);
    return (err as Error).message;
  }
  assert.fail(`expected ${key} to be denied`);
}

describe("assertBreezeAllowed", () => {
  beforeEach(resetStub);

  it("allows a call only when the master switch is on AND the endpoint row is allowed", async () => {
    stubState.permsRows = [allowed("people.list")];
    await assertBreezeAllowed("people.list"); // must not throw
  });

  it("denies an endpoint whose row says allowed=false", async () => {
    stubState.permsRows = [allowed("giving.list", false)];
    const msg = await denialMessage("giving.list");
    assert.match(msg, /not enabled in \/admin\/api-keys/);
  });

  it("fails closed on a missing permission row (endpoint absent from the table)", async () => {
    stubState.permsRows = [allowed("people.list")];
    await denialMessage("giving.list");
  });

  it("fails closed on an unknown endpoint key nothing ever seeded", async () => {
    stubState.permsRows = [allowed("people.list")];
    const msg = await denialMessage("totally.bogus_endpoint");
    assert.ok(msg.includes("totally.bogus_endpoint"));
  });

  it("master switch off denies even an allowed endpoint", async () => {
    stubState.settingsRow = { enabled: false };
    stubState.permsRows = [allowed("people.list")];
    const msg = await denialMessage("people.list");
    assert.match(msg, /switched off/);
  });

  it("fails closed when the settings row is missing or RLS-filtered", async () => {
    stubState.settingsRow = null; // maybeSingle() -> no row visible
    stubState.permsRows = [allowed("people.list")];
    const msg = await denialMessage("people.list");
    assert.match(msg, /permission state unavailable/);
  });

  it("fails closed when an RLS-filtered read hides all permission rows", async () => {
    // Unapproved/signed-out sessions see settings and zero permission rows.
    stubState.permsRows = [];
    await denialMessage("people.list");
  });

  it("fails closed on a database error", async () => {
    stubState.settingsError = { message: "permission denied for table" };
    const msg = await denialMessage("people.list");
    assert.match(msg, /permission state unavailable/);
  });

  it("fails closed when the DB client cannot even be created", async () => {
    stubState.createError = new Error("connection refused");
    const msg = await denialMessage("people.list");
    assert.match(msg, /connection refused/);
  });

  it("treats non-boolean-true values in rows as denied (no truthy coercion)", async () => {
    stubState.settingsRow = { enabled: "true" }; // string, not boolean
    stubState.permsRows = [{ endpoint_key: "people.list", allowed: 1 }];
    await denialMessage("people.list");
  });
});

describe("getBreezeGatewayState", () => {
  beforeEach(resetStub);

  it("reports loadError (deny-all) when the settings row is missing", async () => {
    stubState.settingsRow = null;
    const state = await getBreezeGatewayState();
    assert.equal(state.enabled, false);
    assert.match(state.loadError ?? "", /settings row missing/);
  });

  it("maps permission rows and master switch through unchanged", async () => {
    stubState.settingsRow = { enabled: true };
    stubState.permsRows = [allowed("people.list"), allowed("giving.list", false)];
    const state = await getBreezeGatewayState();
    assert.equal(state.enabled, true);
    assert.equal(state.loadError, null);
    assert.equal(state.permissions.get("people.list"), true);
    assert.equal(state.permissions.get("giving.list"), false);
  });
});

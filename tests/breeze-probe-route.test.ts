/**
 * Access control on POST /api/admin/breeze-gateway/probe.
 *
 * Invokes the real route handler: anonymous -> 401, a signed-in
 * non-super-admin -> 403, and a super admin gets per-endpoint results with
 * writes never probed, plus an audit_log row recording the run.
 */
import assert from "node:assert/strict";
import { afterEach, beforeEach, describe, it } from "node:test";
import { resetStub, stubState } from "./setup/supabase-server-stub.ts";
import { BREEZE_ENDPOINTS } from "@/lib/breeze-endpoints";

process.env.BREEZE_SUBDOMAIN = "testchurch";
process.env.BREEZE_API_KEY = "test-key-123";
const { POST } = await import("@/app/api/admin/breeze-gateway/probe/route");

const realFetch = globalThis.fetch;

describe("probe route", () => {
  beforeEach(resetStub);
  afterEach(() => {
    globalThis.fetch = realFetch;
  });

  it("returns 401 when not signed in", async () => {
    const res = await POST();
    assert.equal(res.status, 401);
  });

  it("returns 403 for a signed-in user who is not the super admin", async () => {
    stubState.user = { id: "u2", email: "someone@example.com" };
    const res = await POST();
    assert.equal(res.status, 403);
    assert.deepEqual(await res.json(), { error: "Super admin only." });
  });

  it("super admin: probes every read endpoint, never writes, and audit-logs the run", async () => {
    stubState.user = { id: "u1", email: "natecards@gmail.com" };
    const probed: string[] = [];
    globalThis.fetch = (async (input: RequestInfo | URL) => {
      probed.push(String(input));
      return new Response(JSON.stringify([{ id: "7" }]), { status: 200 });
    }) as typeof fetch;

    const res = await POST();
    assert.equal(res.status, 200);
    const body = (await res.json()) as {
      results: Record<string, { kind: string }>;
    };

    const reads = BREEZE_ENDPOINTS.filter((e) => e.operation === "read");
    const writes = BREEZE_ENDPOINTS.filter((e) => e.operation === "write");
    assert.ok(writes.length > 0);
    for (const w of writes) {
      assert.equal(
        body.results[w.key]?.kind,
        "not_probed",
        `${w.key} is a write and must never be live-probed`
      );
      const writePath = w.path.replace("{id}", "");
      assert.ok(
        !probed.some((u) => u.includes(`/api${writePath}`)),
        `no request may be sent to write path ${w.path}`
      );
    }
    for (const r of reads) {
      const kind = body.results[r.key]?.kind;
      assert.ok(
        kind === "ok" || kind === "error" || kind === "skipped",
        `read ${r.key} should have a probe outcome, got ${kind}`
      );
    }

    assert.equal(stubState.auditInserts.length, 1, "probe run must be audit-logged");
    const audit = stubState.auditInserts[0] as {
      event: string;
      target: string;
      detail: { probed: number; ok: number };
    };
    assert.equal(audit.event, "admin_action");
    assert.equal(audit.target, "breeze_probe");
    assert.equal(audit.detail.probed, reads.length);
  });
});

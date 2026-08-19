/**
 * Test double for "@/lib/supabase/server" (swapped in by tests/setup/loader.mjs).
 *
 * Emulates just the PostgREST/auth surface the Breeze gateway code touches:
 *   - from("breeze_gateway_settings").select().eq().maybeSingle()
 *   - from("breeze_endpoint_permissions").select()  (awaited directly)
 *   - from("audit_log").insert()
 *   - auth.getUser()
 * Tests mutate `stubState` to simulate every failure mode the gate must
 * treat as a denial (missing rows, RLS-filtered reads, DB errors, no
 * connection at all).
 */

interface StubUser {
  id: string;
  email: string | null;
}

export const stubState = {
  /** null models an RLS-filtered or missing settings row. */
  settingsRow: { enabled: true } as { enabled: unknown } | null,
  settingsError: null as { message: string } | null,
  permsRows: [] as { endpoint_key: string; allowed: unknown }[],
  permsError: null as { message: string } | null,
  /** When set, createClient() itself rejects (DB unreachable). */
  createError: null as Error | null,
  user: null as StubUser | null,
  auditInserts: [] as Record<string, unknown>[],
};

export function resetStub() {
  stubState.settingsRow = { enabled: true };
  stubState.settingsError = null;
  stubState.permsRows = [];
  stubState.permsError = null;
  stubState.createError = null;
  stubState.user = null;
  stubState.auditInserts = [];
}

export async function createClient() {
  if (stubState.createError) throw stubState.createError;
  return {
    auth: {
      getUser: async () => ({ data: { user: stubState.user } }),
    },
    from(table: string) {
      if (table === "breeze_gateway_settings") {
        return {
          select: () => ({
            eq: () => ({
              maybeSingle: async () => ({
                data: stubState.settingsError ? null : stubState.settingsRow,
                error: stubState.settingsError,
              }),
            }),
          }),
        };
      }
      if (table === "breeze_endpoint_permissions") {
        return {
          select: () =>
            Promise.resolve({
              data: stubState.permsError ? null : stubState.permsRows,
              error: stubState.permsError,
            }),
        };
      }
      if (table === "audit_log") {
        return {
          insert: async (row: Record<string, unknown>) => {
            stubState.auditInserts.push(row);
            return { error: null };
          },
        };
      }
      throw new Error(`stub has no table ${table}`);
    },
  };
}

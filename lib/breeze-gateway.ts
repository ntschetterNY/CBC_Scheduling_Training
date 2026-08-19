import { cache } from "react";
import { createClient } from "@/lib/supabase/server";
import { BREEZE_ENDPOINTS_BY_KEY } from "@/lib/breeze-endpoints";

/**
 * App-side gate in front of every Breeze API call.
 *
 * State lives in two tables managed from /admin/api-keys (super admin only,
 * writes audited via the set_breeze_access RPC):
 *   - breeze_gateway_settings: master on/off for all Breeze traffic
 *   - breeze_endpoint_permissions: per-endpoint allow flags
 *
 * The gate FAILS CLOSED: a missing row, an RLS-filtered read (unapproved or
 * signed-out session), or a database error all deny the call. `lib/breeze.ts`
 * consults `assertBreezeAllowed` before any request leaves the server, so a
 * blocked endpoint can never be reached no matter which code path asks.
 */

export class BreezeAccessDeniedError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "BreezeAccessDeniedError";
  }
}

export interface BreezeGatewayState {
  enabled: boolean;
  /** endpoint_key -> allowed. Keys absent from the table are treated as blocked. */
  permissions: Map<string, boolean>;
  /** Set when the state couldn't be loaded - the gate denies everything. */
  loadError: string | null;
}

/**
 * Load the gateway state once per request (React request cache), under the
 * calling user's session so RLS applies. Breeze-backed pages fan out many
 * calls per request; this keeps the permission check at two small queries.
 */
export const getBreezeGatewayState = cache(
  async (): Promise<BreezeGatewayState> => {
    try {
      const supabase = await createClient();
      const [settingsRes, permsRes] = await Promise.all([
        supabase
          .from("breeze_gateway_settings")
          .select("enabled")
          .eq("id", 1)
          .maybeSingle(),
        supabase
          .from("breeze_endpoint_permissions")
          .select("endpoint_key, allowed"),
      ]);
      if (settingsRes.error || permsRes.error) {
        return {
          enabled: false,
          permissions: new Map(),
          loadError:
            settingsRes.error?.message ?? permsRes.error?.message ?? "unknown",
        };
      }
      return {
        // A missing settings row denies everything - fail closed.
        enabled: settingsRes.data?.enabled === true,
        permissions: new Map(
          (permsRes.data ?? []).map((r) => [
            r.endpoint_key as string,
            r.allowed === true,
          ])
        ),
        loadError: settingsRes.data ? null : "gateway settings row missing",
      };
    } catch (err) {
      return {
        enabled: false,
        permissions: new Map(),
        loadError: err instanceof Error ? err.message : String(err),
      };
    }
  }
);

/** Throw unless the master switch is on AND this endpoint is allowed. */
export async function assertBreezeAllowed(endpointKey: string): Promise<void> {
  const def = BREEZE_ENDPOINTS_BY_KEY.get(endpointKey);
  const label = def ? `${def.name} (${def.path})` : endpointKey;
  const state = await getBreezeGatewayState();
  if (state.loadError) {
    throw new BreezeAccessDeniedError(
      `Breeze call to ${label} denied: permission state unavailable (${state.loadError}).`
    );
  }
  if (!state.enabled) {
    throw new BreezeAccessDeniedError(
      `Breeze call to ${label} denied: Breeze access is switched off in /admin/api-keys.`
    );
  }
  if (state.permissions.get(endpointKey) !== true) {
    throw new BreezeAccessDeniedError(
      `Breeze call to ${label} denied: endpoint not enabled in /admin/api-keys.`
    );
  }
}

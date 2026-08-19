import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { isSuperAdmin } from "@/lib/access";
import {
  isBreezeConfigured,
  breezeProbeRequest,
  breezeProbeFirstId,
  type BreezeProbeResult,
} from "@/lib/breeze";
import { BREEZE_ENDPOINTS } from "@/lib/breeze-endpoints";

/**
 * POST /api/admin/breeze-gateway/probe - live-test the Breeze API surface.
 *
 * Super admin only. Sends one real request to every READ endpoint in the
 * catalog (bypassing the permission gate on purpose - the probe's job is to
 * show what the raw key can reach, so /admin/api-keys can display it next to
 * each toggle). Write endpoints are never called; a live probe would mutate
 * church data. Responses are reduced to status/row-count - no Breeze data is
 * returned to the browser.
 *
 * Endpoints that need a sample id (an event instance, a form, ...) chain it
 * from a prior list call; when no sample exists the probe is reported as
 * skipped rather than failed.
 */

export type ProbeOutcome =
  | { kind: "ok"; status: number; count: number | null }
  | { kind: "error"; status: number | null; message: string }
  | { kind: "skipped"; reason: string }
  | { kind: "not_probed"; reason: string };

const isoDate = (d: Date) => d.toISOString().slice(0, 10);

export async function POST() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Not signed in." }, { status: 401 });
  if (!isSuperAdmin(user.email)) {
    return NextResponse.json({ error: "Super admin only." }, { status: 403 });
  }
  if (!isBreezeConfigured) {
    return NextResponse.json(
      { error: "Breeze isn't configured. Set BREEZE_SUBDOMAIN and BREEZE_API_KEY." },
      { status: 400 }
    );
  }

  // Sample ids for chained probes. A window around today gives the event
  // probes a real instance even during quiet calendar stretches.
  const now = new Date();
  const past = new Date(now);
  past.setDate(past.getDate() - 60);
  const future = new Date(now);
  future.setDate(future.getDate() + 60);
  const dateRange = { start: isoDate(past), end: isoDate(future) };

  const [instanceId, personId, formId, campaignId] = await Promise.all([
    breezeProbeFirstId("/events", dateRange),
    breezeProbeFirstId("/people", { limit: "1" }),
    breezeProbeFirstId("/forms/list_forms"),
    breezeProbeFirstId("/pledges/list_campaigns"),
  ]);
  const samples: Record<string, string | null> = {
    instance_id: instanceId,
    person_id: personId,
    form_id: formId,
    campaign_id: campaignId,
  };

  const results: Record<string, ProbeOutcome> = {};
  const readEndpoints = BREEZE_ENDPOINTS.filter((e) => e.operation === "read");
  for (const e of BREEZE_ENDPOINTS) {
    if (e.operation === "write") {
      results[e.key] = {
        kind: "not_probed",
        reason: "Write endpoint - never probed with a live call.",
      };
    }
  }

  const BATCH = 6;
  for (let i = 0; i < readEndpoints.length; i += BATCH) {
    await Promise.all(
      readEndpoints.slice(i, i + BATCH).map(async (e) => {
        let path = e.path;
        const params: Record<string, string> = { ...(e.probe?.params ?? {}) };
        const needs = e.probe?.needs;
        if (needs === "date_range") {
          params.start = dateRange.start;
          params.end = dateRange.end;
        } else if (needs) {
          const sample = samples[needs];
          if (!sample) {
            results[e.key] = {
              kind: "skipped",
              reason: `No sample ${needs.replace("_", " ")} available to test with.`,
            };
            return;
          }
          if (path.includes("{id}")) path = path.replace("{id}", sample);
          else params[needs] = sample;
        }
        const r: BreezeProbeResult = await breezeProbeRequest(path, params);
        results[e.key] = r.ok
          ? { kind: "ok", status: r.status ?? 200, count: r.count }
          : { kind: "error", status: r.status, message: r.error ?? "Unknown error" };
      })
    );
  }

  // Leave a trace in the audit log - a probe touches the whole account surface.
  await supabase.from("audit_log").insert({
    user_id: user.id,
    email: user.email ?? null,
    event: "admin_action",
    target: "breeze_probe",
    detail: {
      probed: readEndpoints.length,
      ok: Object.values(results).filter((r) => r.kind === "ok").length,
    },
  });

  return NextResponse.json({ probedAt: new Date().toISOString(), results });
}

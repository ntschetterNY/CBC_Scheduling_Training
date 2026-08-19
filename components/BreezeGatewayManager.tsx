"use client";

/**
 * BreezeGatewayManager - super-admin UI for the Breeze API permission matrix.
 *
 * Shows every endpoint the Breeze API key can reach (the key itself has no
 * scoping on Breeze's side), grouped by category, with an allow/block toggle
 * per endpoint plus a master switch that cuts off all Breeze traffic at once.
 * Changes are staged locally and saved through the audited `set_breeze_access`
 * RPC (super-admin only at the database layer too). "Probe" fires one live
 * read against each read endpoint server-side - where the key lives - and
 * reports reachability without ever echoing Breeze data to the browser.
 */

import { useMemo, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import {
  BREEZE_ENDPOINTS,
  type BreezeEndpointDef,
} from "@/lib/breeze-endpoints";
import type { ProbeOutcome } from "@/app/api/admin/breeze-gateway/probe/route";

const CATEGORY_ORDER = [
  "People",
  "Events",
  "Volunteers",
  "Check In",
  "Tags",
  "Forms",
  "Families",
  "Giving",
  "Account",
];

function Toggle({
  on,
  disabled,
  onChange,
  label,
}: {
  on: boolean;
  disabled?: boolean;
  onChange: (next: boolean) => void;
  label: string;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={on}
      aria-label={label}
      disabled={disabled}
      onClick={() => onChange(!on)}
      className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors disabled:cursor-not-allowed disabled:opacity-40 ${
        on ? "bg-brand-success" : "bg-brand-border"
      }`}
    >
      <span
        className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${
          on ? "translate-x-6" : "translate-x-1"
        }`}
      />
    </button>
  );
}

function ProbeCell({ outcome }: { outcome: ProbeOutcome | undefined }) {
  if (!outcome) return <span className="text-xs text-brand-muted">—</span>;
  if (outcome.kind === "ok") {
    return (
      <span className="text-xs font-medium text-brand-success" title="Live probe succeeded">
        ✓ reachable{outcome.count != null ? ` · ${outcome.count} rows` : ""}
      </span>
    );
  }
  if (outcome.kind === "error") {
    const authIssue = outcome.status === 401 || outcome.status === 403;
    return (
      <span
        className={`text-xs font-medium ${authIssue ? "text-brand-danger" : "text-brand-muted"}`}
        title={outcome.message}
      >
        ✗ {outcome.status ?? "network"}
        {authIssue ? " key rejected" : " error"}
      </span>
    );
  }
  if (outcome.kind === "skipped") {
    return (
      <span className="text-xs text-brand-muted" title={outcome.reason}>
        ◌ skipped
      </span>
    );
  }
  return (
    <span className="text-xs text-brand-muted" title={outcome.reason}>
      write · not probed
    </span>
  );
}

function EndpointRow({
  def,
  allowed,
  changed,
  probe,
  onToggle,
}: {
  def: BreezeEndpointDef;
  allowed: boolean;
  changed: boolean;
  probe: ProbeOutcome | undefined;
  onToggle: (next: boolean) => void;
}) {
  return (
    <div
      className={`flex flex-wrap items-center gap-x-3 gap-y-1 px-4 py-3 ${
        changed ? "bg-brand-accent/5" : ""
      }`}
    >
      <Toggle on={allowed} onChange={onToggle} label={`Allow ${def.name}`} />
      <div className="min-w-0 flex-1">
        <p className="flex flex-wrap items-center gap-2 font-medium text-brand-text">
          {def.name}
          <span
            className={`rounded px-1.5 py-0.5 text-[10px] font-bold uppercase ${
              def.operation === "read"
                ? "bg-brand-success/15 text-brand-success"
                : "bg-brand-danger/15 text-brand-danger"
            }`}
          >
            {def.operation}
          </span>
          {def.sensitive && (
            <span className="rounded bg-brand-danger/10 px-1.5 py-0.5 text-[10px] font-bold text-brand-danger">
              💰 sensitive
            </span>
          )}
          {changed && (
            <span className="rounded bg-brand-accent/15 px-1.5 py-0.5 text-[10px] font-bold text-brand-accent">
              unsaved
            </span>
          )}
        </p>
        <p className="text-xs text-brand-muted">
          <code className="text-[11px]">/api{def.path}</code> · {def.description}
        </p>
        {def.usedBy && (
          <p className={`text-xs ${allowed ? "text-brand-muted" : "font-medium text-brand-danger"}`}>
            {allowed ? "In use: " : "⚠ Blocking breaks: "}
            {def.usedBy}
          </p>
        )}
      </div>
      <div className="w-36 text-right">
        <ProbeCell outcome={probe} />
      </div>
    </div>
  );
}

export function BreezeGatewayManager({
  configured,
  subdomain,
  initialEnabled,
  initialPermissions,
}: {
  configured: boolean;
  subdomain: string | null;
  initialEnabled: boolean;
  initialPermissions: Record<string, boolean>;
}) {
  const supabase = useMemo(() => createClient(), []);
  const [savedEnabled, setSavedEnabled] = useState(initialEnabled);
  const [savedPerms, setSavedPerms] = useState(initialPermissions);
  const [enabled, setEnabled] = useState(initialEnabled);
  const [perms, setPerms] = useState<Record<string, boolean>>(initialPermissions);
  const [saving, setSaving] = useState(false);
  const [probing, setProbing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [probes, setProbes] = useState<Record<string, ProbeOutcome>>({});
  const [probedAt, setProbedAt] = useState<string | null>(null);

  const changedKeys = BREEZE_ENDPOINTS.filter(
    (e) => (perms[e.key] ?? false) !== (savedPerms[e.key] ?? false)
  ).map((e) => e.key);
  const dirty = changedKeys.length > 0 || enabled !== savedEnabled;

  const grouped = useMemo(() => {
    const by = new Map<string, BreezeEndpointDef[]>();
    for (const e of BREEZE_ENDPOINTS) {
      (by.get(e.category) ?? by.set(e.category, []).get(e.category)!).push(e);
    }
    return CATEGORY_ORDER.filter((c) => by.has(c)).map((c) => ({
      category: c,
      endpoints: by.get(c)!,
    }));
  }, []);

  async function save() {
    setSaving(true);
    setError(null);
    const changed: Record<string, boolean> = {};
    for (const k of changedKeys) changed[k] = perms[k] ?? false;
    const { error } = await supabase.rpc("set_breeze_access", {
      p_enabled: enabled === savedEnabled ? null : enabled,
      p_permissions: changedKeys.length > 0 ? changed : null,
    });
    setSaving(false);
    if (error) {
      setError(error.message);
      return;
    }
    setSavedEnabled(enabled);
    setSavedPerms({ ...perms });
  }

  function discard() {
    setEnabled(savedEnabled);
    setPerms(savedPerms);
    setError(null);
  }

  async function probeAll() {
    setProbing(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/breeze-gateway/probe", { method: "POST" });
      const body = await res.json();
      if (!res.ok) throw new Error(body?.error || `Probe failed (${res.status})`);
      setProbes(body.results ?? {});
      setProbedAt(body.probedAt ?? null);
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setProbing(false);
    }
  }

  const allowedCount = BREEZE_ENDPOINTS.filter((e) => perms[e.key]).length;

  return (
    <div>
      {/* Key status + master switch */}
      <div className="grid gap-3 sm:grid-cols-2">
        <div className="card p-4">
          <p className="text-xs font-bold uppercase tracking-wide text-brand-muted">
            API key
          </p>
          <p className="mt-1 font-medium text-brand-text">
            {configured ? (
              <>
                <span className="text-brand-success">●</span>{" "}
                {subdomain
                  ? `${subdomain}.breezechms.com`
                  : "Configured"}{" "}
                · key set
              </>
            ) : (
              <>
                <span className="text-brand-danger">●</span> Not configured
              </>
            )}
          </p>
          <p className="mt-1 text-xs text-brand-muted">
            The key itself lives in Vercel env vars (<code>BREEZE_API_KEY</code>,
            marked Sensitive) and is never readable here. To rotate it, generate
            a new key in Breeze (Account Settings → Extensions → API) and update
            the Vercel variable. Breeze keys have no built-in permissions - this
            page is the only thing limiting what the app can touch.
          </p>
        </div>
        <div className="card p-4">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-xs font-bold uppercase tracking-wide text-brand-muted">
                Master switch
              </p>
              <p className="mt-1 font-medium text-brand-text">
                {enabled ? "Breeze access on" : "All Breeze traffic blocked"}
              </p>
            </div>
            <Toggle on={enabled} onChange={setEnabled} label="Master Breeze switch" />
          </div>
          <p className="mt-1 text-xs text-brand-muted">
            Kill switch for every Breeze call the app makes, regardless of the
            per-endpoint settings below. {allowedCount} of{" "}
            {BREEZE_ENDPOINTS.length} endpoints currently allowed.
          </p>
        </div>
      </div>

      {/* Probe + save bar */}
      <div className="mt-4 flex flex-wrap items-center gap-3">
        <button
          type="button"
          className="btn-secondary text-sm"
          onClick={probeAll}
          disabled={probing || !configured}
        >
          {probing ? "Probing…" : "Probe all read endpoints"}
        </button>
        {probedAt && (
          <span className="text-xs text-brand-muted">
            Last probe: {new Date(probedAt).toLocaleString()}
          </span>
        )}
        {dirty && (
          <span className="ml-auto flex items-center gap-2">
            <span className="text-xs font-medium text-brand-accent">
              {changedKeys.length + (enabled !== savedEnabled ? 1 : 0)} unsaved
              change{changedKeys.length + (enabled !== savedEnabled ? 1 : 0) === 1 ? "" : "s"}
            </span>
            <button
              type="button"
              className="btn-secondary text-sm"
              onClick={discard}
              disabled={saving}
            >
              Discard
            </button>
            <button
              type="button"
              className="btn-primary text-sm"
              onClick={save}
              disabled={saving}
            >
              {saving ? "Saving…" : "Save changes"}
            </button>
          </span>
        )}
      </div>

      {error && (
        <p className="mt-3 rounded-lg border border-brand-danger/40 bg-brand-danger/10 px-3 py-2 text-xs text-brand-danger">
          {error}
        </p>
      )}

      {/* Matrix */}
      {grouped.map(({ category, endpoints }) => (
        <section key={category} className="mt-6">
          <h2 className="section-title mb-2 flex items-baseline gap-2">
            {category}
            <span className="text-xs font-normal text-brand-muted">
              {endpoints.filter((e) => perms[e.key]).length}/{endpoints.length} allowed
            </span>
          </h2>
          <div className="card divide-y divide-brand-border/70 overflow-hidden">
            {endpoints.map((def) => (
              <EndpointRow
                key={def.key}
                def={def}
                allowed={perms[def.key] ?? false}
                changed={(perms[def.key] ?? false) !== (savedPerms[def.key] ?? false)}
                probe={probes[def.key]}
                onToggle={(next) => setPerms((p) => ({ ...p, [def.key]: next }))}
              />
            ))}
          </div>
        </section>
      ))}

      <p className="mt-6 text-xs text-brand-muted">
        Blocked-by-default: an endpoint with no row here, or anything added to
        the Breeze API later, is denied until it's explicitly allowed. Every
        change on this page is written to the audit log.
      </p>
    </div>
  );
}

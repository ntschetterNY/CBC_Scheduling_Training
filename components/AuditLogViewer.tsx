"use client";

/**
 * AuditLogViewer — client-side table over the most recent audit events.
 * Filtering (event type, person, text search) happens in the browser since
 * the server already narrowed the window to the latest 500 rows. Timestamps
 * render in the viewer's local timezone.
 */

import { useMemo, useState } from "react";

export type AuditRow = {
  id: number;
  user_id: string | null;
  email: string | null;
  event: "page_view" | "click" | "admin_action";
  path: string | null;
  target: string | null;
  detail: Record<string, unknown> | null;
  duration_ms: number | null;
  created_at: string;
};

const EVENT_META: Record<AuditRow["event"], { label: string; icon: string; badge: string }> = {
  page_view: {
    label: "Page view",
    icon: "📄",
    badge: "bg-brand-teal/10 text-brand-teal",
  },
  click: {
    label: "Click",
    icon: "👆",
    badge: "bg-brand-accent/15 text-brand-accentDark",
  },
  admin_action: {
    label: "Admin action",
    icon: "🛡️",
    badge: "bg-brand-danger/10 text-brand-danger",
  },
};

function formatWhen(iso: string): string {
  const d = new Date(iso);
  const now = new Date();
  const sameDay = d.toDateString() === now.toDateString();
  const time = d.toLocaleTimeString(undefined, {
    hour: "numeric",
    minute: "2-digit",
  });
  if (sameDay) return `Today ${time}`;
  return `${d.toLocaleDateString(undefined, { month: "short", day: "numeric" })} ${time}`;
}

function describeAdminAction(row: AuditRow): string {
  const d = row.detail ?? {};
  if (row.target === "set_user_access") {
    const name = (d.target_name as string) || "user";
    if (d.approved === false) return `Revoked access for ${name}`;
    if (d.role === "admin") return `Made ${name} an admin`;
    return `Approved ${name} as trainee`;
  }
  return row.target || "Admin action";
}

export function AuditLogViewer({
  rows,
  names,
}: {
  rows: AuditRow[];
  names: Record<string, string>;
}) {
  const [eventFilter, setEventFilter] = useState<"all" | AuditRow["event"]>("all");
  const [userFilter, setUserFilter] = useState<string>("all");
  const [query, setQuery] = useState("");

  const who = (row: AuditRow) =>
    (row.user_id && names[row.user_id]) || row.email || "Unknown";

  const people = useMemo(() => {
    const seen = new Map<string, string>();
    for (const r of rows) {
      const key = r.user_id ?? r.email ?? "";
      if (key && !seen.has(key)) seen.set(key, who(r));
    }
    return [...seen.entries()].sort((a, b) => a[1].localeCompare(b[1]));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rows, names]);

  const filtered = rows.filter((r) => {
    if (eventFilter !== "all" && r.event !== eventFilter) return false;
    if (userFilter !== "all" && (r.user_id ?? r.email) !== userFilter) return false;
    if (query.trim()) {
      const q = query.trim().toLowerCase();
      const hay = `${r.path ?? ""} ${r.target ?? ""} ${who(r)}`.toLowerCase();
      if (!hay.includes(q)) return false;
    }
    return true;
  });

  // Summary over the filtered window.
  const loadTimes = filtered
    .filter((r) => r.event === "page_view" && r.duration_ms != null)
    .map((r) => r.duration_ms as number);
  const avgLoad =
    loadTimes.length > 0
      ? Math.round(loadTimes.reduce((a, b) => a + b, 0) / loadTimes.length)
      : null;
  const activeUsers = new Set(filtered.map((r) => r.user_id ?? r.email)).size;
  const oldest = rows.length > 0 ? rows[rows.length - 1].created_at : null;

  const stats = [
    { label: "Events shown", value: String(filtered.length) },
    { label: "People", value: String(activeUsers) },
    {
      label: "Avg page load",
      value: avgLoad != null ? `${(avgLoad / 1000).toFixed(2)}s` : "—",
    },
    {
      label: "Window starts",
      value: oldest ? formatWhen(oldest) : "—",
    },
  ];

  return (
    <div>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {stats.map((s) => (
          <div key={s.label} className="card p-4">
            <p className="text-xs text-brand-muted">{s.label}</p>
            <p className="mt-1 text-xl font-bold text-brand-text">{s.value}</p>
          </div>
        ))}
      </div>

      <div className="mt-5 flex flex-wrap items-center gap-3">
        <div className="flex rounded-lg border border-brand-border bg-brand-surface p-1 text-xs">
          {(
            [
              ["all", "All"],
              ["page_view", "Page views"],
              ["click", "Clicks"],
              ["admin_action", "Admin actions"],
            ] as const
          ).map(([id, label]) => (
            <button
              key={id}
              type="button"
              onClick={() => setEventFilter(id)}
              className={`rounded-md px-3 py-1.5 font-medium transition-colors ${
                eventFilter === id
                  ? "bg-brand-accent text-brand-bg"
                  : "text-brand-muted hover:text-brand-text"
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        <select
          className="input w-auto text-xs"
          value={userFilter}
          onChange={(e) => setUserFilter(e.target.value)}
          aria-label="Filter by person"
        >
          <option value="all">Everyone</option>
          {people.map(([key, name]) => (
            <option key={key} value={key}>
              {name}
            </option>
          ))}
        </select>

        <input
          className="input w-full max-w-xs text-xs"
          type="search"
          placeholder="Search path, target, person…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          aria-label="Search events"
        />
      </div>

      <div className="mt-4 overflow-x-auto">
        <div className="card min-w-[760px] overflow-hidden">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="border-b border-brand-border bg-brand-surface/60 text-left">
                <th className="px-4 py-3 font-semibold">When</th>
                <th className="px-4 py-3 font-semibold">Who</th>
                <th className="px-4 py-3 font-semibold">Event</th>
                <th className="px-4 py-3 font-semibold">Where / what</th>
                <th className="px-4 py-3 text-right font-semibold">Load</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-4 py-10 text-center text-brand-muted">
                    No events match. Activity appears here as people use the
                    app.
                  </td>
                </tr>
              )}
              {filtered.map((r) => {
                const meta = EVENT_META[r.event];
                return (
                  <tr
                    key={r.id}
                    className="border-b border-brand-border/60 align-top last:border-0"
                  >
                    <td className="whitespace-nowrap px-4 py-2.5 text-xs text-brand-muted">
                      {formatWhen(r.created_at)}
                    </td>
                    <td className="max-w-[160px] truncate px-4 py-2.5 font-medium text-brand-text">
                      {who(r)}
                    </td>
                    <td className="whitespace-nowrap px-4 py-2.5">
                      <span
                        className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${meta.badge}`}
                      >
                        {meta.icon} {meta.label}
                      </span>
                    </td>
                    <td className="max-w-[380px] px-4 py-2.5">
                      {r.event === "admin_action" ? (
                        <span className="text-brand-text">{describeAdminAction(r)}</span>
                      ) : (
                        <>
                          <span className="font-mono text-xs text-brand-text">
                            {r.path || "—"}
                          </span>
                          {r.target && (
                            <span className="block truncate text-xs text-brand-muted">
                              {r.target}
                            </span>
                          )}
                        </>
                      )}
                    </td>
                    <td className="whitespace-nowrap px-4 py-2.5 text-right text-xs text-brand-muted">
                      {r.duration_ms != null
                        ? `${(r.duration_ms / 1000).toFixed(2)}s`
                        : "—"}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

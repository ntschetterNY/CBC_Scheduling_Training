"use client";

/**
 * UserDirectory — super-admin UI for approving users and seeding admins.
 *
 * New sign-ups arrive unapproved and locked out of the app; they show first
 * here with an Approve button. Approved users can be granted/revoked the
 * `admin` role or have their access revoked entirely. All changes go through
 * the `set_user_access` RPC, which is super-admin only and writes to the
 * audit log.
 */

import { useMemo, useState } from "react";
import { createClient } from "@/lib/supabase/client";

export type DirUser = {
  id: string;
  full_name: string | null;
  role: string;
  approved: boolean;
};

export function UserDirectory({
  users,
  selfId,
}: {
  users: DirUser[];
  selfId: string;
}) {
  const supabase = useMemo(() => createClient(), []);
  const [rows, setRows] = useState<DirUser[]>(users);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState("");

  const filtered = rows
    .filter((u) =>
      (u.full_name || "Unnamed tech").toLowerCase().includes(query.trim().toLowerCase())
    )
    .sort((a, b) => {
      // Pending approvals float to the top — they're the action items.
      if (a.approved !== b.approved) return a.approved ? 1 : -1;
      return (a.full_name || "").localeCompare(b.full_name || "");
    });

  const adminCount = rows.filter((u) => u.role === "admin").length;
  const pendingCount = rows.filter((u) => !u.approved).length;

  async function setAccess(id: string, role: "admin" | "trainee", approved: boolean) {
    setBusyId(id);
    setError(null);
    const prev = rows;
    // optimistic
    setRows((rs) => rs.map((u) => (u.id === id ? { ...u, role, approved } : u)));
    const { error } = await supabase.rpc("set_user_access", {
      p_user_id: id,
      p_role: role,
      p_approved: approved,
    });
    setBusyId(null);
    if (error) {
      setRows(prev); // revert
      setError(error.message);
    }
  }

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="relative w-full max-w-xs">
          <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-brand-muted">
            🔎
          </span>
          <input
            className="input pl-10"
            type="search"
            placeholder="Search people…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            aria-label="Search users"
          />
        </div>
        <p className="text-xs text-brand-muted">
          {rows.length} people · {adminCount} admin{adminCount === 1 ? "" : "s"}
          {pendingCount > 0 && (
            <span className="ml-2 rounded-full bg-brand-danger/10 px-2 py-0.5 font-bold text-brand-danger">
              {pendingCount} awaiting approval
            </span>
          )}
        </p>
      </div>

      {error && (
        <p className="mt-3 rounded-lg border border-brand-danger/40 bg-brand-danger/10 px-3 py-2 text-xs text-brand-danger">
          Couldn&rsquo;t update user: {error}
        </p>
      )}

      <div className="mt-4 card divide-y divide-brand-border/70 overflow-hidden">
        {filtered.length === 0 && (
          <p className="px-4 py-8 text-center text-sm text-brand-muted">
            No matching people.
          </p>
        )}
        {filtered.map((u) => {
          const isSelf = u.id === selfId;
          const isAdmin = u.role === "admin";
          const busy = busyId === u.id;
          return (
            <div key={u.id} className="flex items-center gap-3 px-4 py-3">
              <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-brand-surface text-sm font-bold text-brand-accentDark">
                {(u.full_name || "?").trim().charAt(0).toUpperCase() || "?"}
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate font-medium text-brand-text">
                  {u.full_name || "Unnamed tech"}
                  {isSelf && (
                    <span className="ml-2 text-xs font-normal text-brand-muted">
                      (you)
                    </span>
                  )}
                </p>
                <p className="text-xs text-brand-muted">
                  {isSelf
                    ? "Super admin"
                    : !u.approved
                      ? "Awaiting approval — no app access"
                      : isAdmin
                        ? "Admin"
                        : "Trainee"}
                </p>
              </div>

              {isSelf ? (
                <span className="rounded-full bg-brand-teal/10 px-2.5 py-1 text-[10px] font-bold text-brand-teal">
                  super admin
                </span>
              ) : !u.approved ? (
                <button
                  className="btn-primary text-xs"
                  disabled={busy}
                  onClick={() => setAccess(u.id, "trainee", true)}
                >
                  {busy ? "…" : "Approve"}
                </button>
              ) : (
                <>
                  {isAdmin && (
                    <span className="rounded-full bg-brand-accent/15 px-2.5 py-1 text-[10px] font-bold text-brand-accent">
                      admin
                    </span>
                  )}
                  {isAdmin ? (
                    <button
                      className="btn-secondary text-xs"
                      disabled={busy}
                      onClick={() => setAccess(u.id, "trainee", true)}
                    >
                      {busy ? "…" : "Revoke admin"}
                    </button>
                  ) : (
                    <button
                      className="btn-primary text-xs"
                      disabled={busy}
                      onClick={() => setAccess(u.id, "admin", true)}
                    >
                      {busy ? "…" : "Make admin"}
                    </button>
                  )}
                  <button
                    className="btn-ghost text-xs text-brand-danger"
                    disabled={busy}
                    onClick={() => setAccess(u.id, "trainee", false)}
                    title="Locks this user out of the app until re-approved"
                  >
                    {busy ? "…" : "Revoke access"}
                  </button>
                </>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

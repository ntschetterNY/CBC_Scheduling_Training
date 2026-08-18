"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { createClient } from "@/lib/supabase/client";

type Team = { id: string; name: string; slug: string; active: boolean; sort_order: number };
type Role = { id: string; name: string; category: string; sort_order: number; active: boolean };
type Member = {
  membershipId: string;
  personId: string;
  fullName: string;
  email: string | null;
  active: boolean;
};
type Assignment = {
  id: string;
  role_id: string;
  person_id: string | null;
  service_date: string;
  status: string;
};
type Blackout = {
  id: string;
  person_id: string;
  starts_on: string;
  ends_on: string;
  reason: string | null;
};

const CATEGORIES = [
  { value: "general", label: "General (plain rotation)" },
  { value: "opening", label: "Opening" },
  { value: "closing", label: "Closing" },
  { value: "speaking", label: "Speaking" },
  { value: "reserve", label: "Reserve (backup speaker)" },
];

const prettyDate = (iso: string) =>
  new Date(iso + "T00:00:00").toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });

const cardDate = (iso: string) =>
  new Date(iso + "T00:00:00").toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });

export function ScheduleAdmin({ teams }: { teams: Team[] }) {
  const supabase = useMemo(() => createClient(), []);
  const [teamId, setTeamId] = useState(teams[0]?.id ?? "");
  const [roles, setRoles] = useState<Role[]>([]);
  const [members, setMembers] = useState<Member[]>([]);
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [blackouts, setBlackouts] = useState<Blackout[]>([]);
  const [notice, setNotice] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  // form state
  const [newName, setNewName] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newRoleName, setNewRoleName] = useState("");
  const [newRoleCategory, setNewRoleCategory] = useState("general");
  const [weeks, setWeeks] = useState(12);
  const [startDate, setStartDate] = useState(() =>
    new Date().toISOString().slice(0, 10)
  );

  const load = useCallback(async () => {
    if (!teamId) return;
    setError(null);
    const today = new Date().toISOString().slice(0, 10);
    const [rolesRes, membersRes, assignRes] = await Promise.all([
      supabase
        .from("schedule_roles")
        .select("id, name, category, sort_order, active")
        .eq("team_id", teamId)
        .order("sort_order"),
      supabase
        .from("team_members")
        .select("id, person_id, people(id, full_name, email, active)")
        .eq("team_id", teamId),
      supabase
        .from("assignments")
        .select("id, role_id, person_id, service_date, status")
        .eq("team_id", teamId)
        .gte("service_date", today)
        .order("service_date"),
    ]);
    if (rolesRes.error || membersRes.error || assignRes.error) {
      setError(
        (rolesRes.error ?? membersRes.error ?? assignRes.error)!.message
      );
      return;
    }
    setRoles((rolesRes.data ?? []) as Role[]);
    const mem = (membersRes.data ?? []).map((m) => {
      const p = m.people as unknown as {
        id: string;
        full_name: string;
        email: string | null;
        active: boolean;
      };
      return {
        membershipId: m.id as string,
        personId: p.id,
        fullName: p.full_name,
        email: p.email,
        active: p.active,
      };
    });
    mem.sort((a, b) => a.fullName.localeCompare(b.fullName));
    setMembers(mem);
    setAssignments((assignRes.data ?? []) as Assignment[]);

    const personIds = mem.map((m) => m.personId);
    if (personIds.length > 0) {
      const { data: bo } = await supabase
        .from("blackout_dates")
        .select("id, person_id, starts_on, ends_on, reason")
        .in("person_id", personIds)
        .gte("ends_on", today)
        .order("starts_on");
      setBlackouts((bo ?? []) as Blackout[]);
    } else {
      setBlackouts([]);
    }
  }, [supabase, teamId]);

  useEffect(() => {
    void load();
  }, [load]);

  function flash(msg: string) {
    setNotice(msg);
    setTimeout(() => setNotice(null), 6000);
  }

  /* ---------------- roster ---------------- */

  async function addMember(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    const name = newName.trim();
    if (!name) return;
    const email = newEmail.trim().toLowerCase() || null;
    setBusy(true);
    try {
      // Reuse an existing person (matched by email, then name) or create one.
      let personId: string | null = null;
      if (email) {
        const { data } = await supabase
          .from("people")
          .select("id")
          .ilike("email", email)
          .maybeSingle();
        personId = data?.id ?? null;
      }
      if (!personId) {
        const { data } = await supabase
          .from("people")
          .select("id")
          .eq("full_name", name)
          .maybeSingle();
        personId = data?.id ?? null;
        if (personId && email) {
          await supabase.from("people").update({ email }).eq("id", personId);
        }
      }
      if (!personId) {
        const { data, error } = await supabase
          .from("people")
          .insert({ full_name: name, email })
          .select("id")
          .single();
        if (error) throw error;
        personId = data.id;
      }
      const { error: linkErr } = await supabase
        .from("team_members")
        .insert({ team_id: teamId, person_id: personId });
      if (linkErr && !linkErr.message.includes("duplicate")) throw linkErr;
      setNewName("");
      setNewEmail("");
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setBusy(false);
    }
  }

  async function updateEmail(m: Member) {
    const email = prompt(`Email for ${m.fullName}:`, m.email ?? "");
    if (email === null) return;
    const { error } = await supabase
      .from("people")
      .update({ email: email.trim().toLowerCase() || null })
      .eq("id", m.personId);
    if (error) setError(error.message);
    else await load();
  }

  async function toggleActive(m: Member) {
    const { error } = await supabase
      .from("people")
      .update({ active: !m.active })
      .eq("id", m.personId);
    if (error) setError(error.message);
    else await load();
  }

  async function removeMember(m: Member) {
    if (!confirm(`Remove ${m.fullName} from this team? Existing assignments stay.`))
      return;
    const { error } = await supabase
      .from("team_members")
      .delete()
      .eq("id", m.membershipId);
    if (error) setError(error.message);
    else await load();
  }

  /* ---------------- roles ---------------- */

  async function addRole(e: React.FormEvent) {
    e.preventDefault();
    const name = newRoleName.trim();
    if (!name) return;
    const slug = name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
    const { error } = await supabase.from("schedule_roles").insert({
      team_id: teamId,
      slug,
      name,
      category: newRoleCategory,
      sort_order: (roles[roles.length - 1]?.sort_order ?? 0) + 1,
    });
    if (error) setError(error.message);
    else {
      setNewRoleName("");
      await load();
    }
  }

  async function removeRole(r: Role) {
    if (!confirm(`Delete the "${r.name}" role and its assignments?`)) return;
    const { error } = await supabase
      .from("schedule_roles")
      .delete()
      .eq("id", r.id);
    if (error) setError(error.message);
    else await load();
  }

  /* ---------------- generate / notify ---------------- */

  async function generate() {
    setBusy(true);
    setError(null);
    try {
      const res = await fetch("/api/schedule/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ teamId, startDate, weeks }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Generation failed.");
      flash(
        `Generated ${data.created} assignments across ${data.weeks} Sundays` +
          (data.unfilled > 0
            ? ` — ${data.unfilled} slot(s) had nobody available.`
            : ".")
      );
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setBusy(false);
    }
  }

  async function notify(kind: "reminder" | "availability_poll") {
    setBusy(true);
    setError(null);
    try {
      const res = await fetch("/api/schedule/notify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ teamId, kind, weeks: 2 }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Notify failed.");
      flash(
        data.emailConfigured
          ? `Sent ${data.sent} email(s); ${data.errors} error(s); ${data.noEmail} member(s) have no email on file.`
          : `Email isn't configured yet (waiting on the Resend DNS setup) — ${data.skipped} send(s) were prepped and logged, ${data.noEmail} member(s) have no email on file.`
      );
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setBusy(false);
    }
  }

  async function reassign(a: Assignment, personId: string) {
    const { error } = await supabase
      .from("assignments")
      .update({ person_id: personId || null, status: "scheduled" })
      .eq("id", a.id);
    if (error) setError(error.message);
    else
      setAssignments((list) =>
        list.map((x) =>
          x.id === a.id
            ? { ...x, person_id: personId || null, status: "scheduled" }
            : x
        )
      );
  }

  /* ---------------- render ---------------- */

  const dates = [...new Set(assignments.map((a) => a.service_date))].sort();
  const activeRoles = roles.filter((r) => r.active);
  const currentTeam = teams.find((t) => t.id === teamId);

  /** Person picker for one assignment cell — shared by table and mobile cards. */
  const assignmentSelect = (a: Assignment) => (
    <select
      value={a.person_id ?? ""}
      onChange={(e) => void reassign(a, e.target.value)}
      className={`input py-1.5 ${
        !a.person_id
          ? "border-red-300 bg-red-50"
          : a.status === "declined"
            ? "border-red-300"
            : ""
      }`}
    >
      <option value="">— unassigned —</option>
      {members
        .filter((m) => m.active || m.personId === a.person_id)
        .map((m) => (
          <option key={m.personId} value={m.personId}>
            {m.fullName}
            {a.person_id === m.personId && a.status === "confirmed" ? " ✓" : ""}
            {a.person_id === m.personId && a.status === "declined"
              ? " ✗ declined"
              : ""}
          </option>
        ))}
    </select>
  );

  return (
    <div className="space-y-8">
      {/* team tabs */}
      <div className="flex flex-wrap gap-2">
        {teams.map((t) => (
          <button
            key={t.id}
            onClick={() => setTeamId(t.id)}
            className={t.id === teamId ? "btn-teal" : "btn-secondary"}
          >
            {t.name}
            {!t.active && " (inactive)"}
          </button>
        ))}
      </div>

      {notice && (
        <p className="rounded-xl bg-brand-success/10 px-4 py-3 font-sans text-sm text-brand-success">
          {notice}
        </p>
      )}
      {error && (
        <p className="rounded-xl bg-red-50 px-4 py-3 font-sans text-sm text-red-700">
          {error}
        </p>
      )}
      {currentTeam && !currentTeam.active && (
        <p className="rounded-xl bg-brand-surface px-4 py-3 font-sans text-sm text-brand-muted">
          This team is inactive (hidden from the schedule page). Sound Tech
          turns on once the Breeze roster sync is connected.
        </p>
      )}

      <div className="grid gap-6 lg:grid-cols-2">
        {/* roster */}
        <section className="card p-5">
          <h2 className="section-title mb-4">Roster</h2>
          {members.length === 0 ? (
            <p className="prose-body mb-4 text-sm">No members yet.</p>
          ) : (
            <ul className="mb-4 space-y-2">
              {members.map((m) => (
                <li
                  key={m.membershipId}
                  className="flex flex-wrap items-center justify-between gap-x-2 gap-y-1 rounded-xl border border-brand-border px-4 py-2.5"
                >
                  <div className="min-w-0 flex-1 basis-40">
                    <p className="font-sans text-sm font-semibold text-brand-text">
                      {m.fullName}
                      {!m.active && (
                        <span className="ml-2 text-xs font-normal text-brand-muted">
                          inactive
                        </span>
                      )}
                    </p>
                    <p className="truncate text-xs text-brand-muted">
                      {m.email ?? "no email — can't get reminders or set blackouts"}
                    </p>
                  </div>
                  <div className="flex shrink-0 gap-1">
                    <button onClick={() => void updateEmail(m)} className="btn-ghost text-xs">
                      Email
                    </button>
                    <button onClick={() => void toggleActive(m)} className="btn-ghost text-xs">
                      {m.active ? "Pause" : "Resume"}
                    </button>
                    <button onClick={() => void removeMember(m)} className="btn-ghost text-xs">
                      Remove
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
          <form onSubmit={addMember} className="grid gap-2 sm:flex sm:flex-wrap">
            <input
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              placeholder="Full name"
              className="input sm:flex-1"
              required
            />
            <input
              value={newEmail}
              onChange={(e) => setNewEmail(e.target.value)}
              placeholder="Email (optional)"
              type="email"
              className="input sm:flex-1"
            />
            <button type="submit" disabled={busy} className="btn-primary w-full sm:w-auto">
              Add
            </button>
          </form>
        </section>

        {/* roles */}
        <section className="card p-5">
          <h2 className="section-title mb-4">Roles</h2>
          {activeRoles.length === 0 ? (
            <p className="prose-body mb-4 text-sm">No roles yet.</p>
          ) : (
            <ul className="mb-4 space-y-2">
              {activeRoles.map((r) => (
                <li
                  key={r.id}
                  className="flex items-center justify-between gap-2 rounded-xl border border-brand-border px-4 py-2.5"
                >
                  <div>
                    <p className="font-sans text-sm font-semibold text-brand-text">
                      {r.name}
                    </p>
                    <p className="text-xs text-brand-muted">
                      {CATEGORIES.find((c) => c.value === r.category)?.label ??
                        r.category}
                    </p>
                  </div>
                  <button onClick={() => void removeRole(r)} className="btn-ghost text-xs">
                    Remove
                  </button>
                </li>
              ))}
            </ul>
          )}
          <form onSubmit={addRole} className="grid gap-2 sm:flex sm:flex-wrap">
            <input
              value={newRoleName}
              onChange={(e) => setNewRoleName(e.target.value)}
              placeholder="Role name"
              className="input sm:flex-1"
              required
            />
            <select
              value={newRoleCategory}
              onChange={(e) => setNewRoleCategory(e.target.value)}
              className="input sm:w-auto"
            >
              {CATEGORIES.map((c) => (
                <option key={c.value} value={c.value}>
                  {c.label}
                </option>
              ))}
            </select>
            <button type="submit" disabled={busy} className="btn-primary w-full sm:w-auto">
              Add
            </button>
          </form>
        </section>
      </div>

      {/* upcoming blackouts */}
      {blackouts.length > 0 && (
        <section className="card p-5">
          <h2 className="section-title mb-3">Upcoming blackout dates</h2>
          <ul className="flex flex-wrap gap-2">
            {blackouts.map((b) => {
              const person = members.find((m) => m.personId === b.person_id);
              return (
                <li key={b.id} className="chip">
                  <span className="font-semibold text-brand-text">
                    {person?.fullName ?? "?"}
                  </span>
                  {b.starts_on === b.ends_on
                    ? prettyDate(b.starts_on)
                    : `${prettyDate(b.starts_on)} – ${prettyDate(b.ends_on)}`}
                  {b.reason && <span className="text-brand-muted">({b.reason})</span>}
                </li>
              );
            })}
          </ul>
        </section>
      )}

      {/* generate + notify */}
      <section className="card p-5">
        <h2 className="section-title mb-4">Generate schedule</h2>
        <div className="grid gap-3 sm:flex sm:flex-wrap sm:items-end">
          <div className="grid grid-cols-2 gap-3 sm:contents">
            <label className="block">
              <span className="mb-1 block font-sans text-xs font-semibold text-brand-muted">
                First Sunday on/after
              </span>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="input sm:w-auto"
              />
            </label>
            <label className="block">
              <span className="mb-1 block font-sans text-xs font-semibold text-brand-muted">
                Weeks
              </span>
              <input
                type="number"
                min={1}
                max={52}
                value={weeks}
                onChange={(e) => setWeeks(Number(e.target.value))}
                className="input sm:w-24"
              />
            </label>
          </div>
          <button
            onClick={() => void generate()}
            disabled={busy}
            className="btn-primary w-full sm:w-auto"
          >
            {busy ? "Working…" : "Generate rotation"}
          </button>
          <button
            onClick={() => void notify("availability_poll")}
            disabled={busy}
            className="btn-secondary w-full sm:w-auto"
          >
            Send availability poll
          </button>
          <button
            onClick={() => void notify("reminder")}
            disabled={busy}
            className="btn-secondary w-full sm:w-auto"
          >
            Send reminders
          </button>
        </div>
        <p className="mt-3 text-xs text-brand-muted">
          Generating replaces any existing assignments in the window, honors
          blackout dates, and balances load using the last six months of
          history. Notifications cover the next two weeks; until the Resend
          domain is verified they're logged but not delivered.
        </p>
      </section>

      {/* schedule grid with reassignment */}
      <section>
        <h2 className="section-title mb-3">Upcoming schedule</h2>
        {dates.length === 0 ? (
          <p className="prose-body text-sm">
            Nothing scheduled yet — generate a rotation above.
          </p>
        ) : (
          <>
            {/* Phones: one card per Sunday */}
            <div className="space-y-3 sm:hidden">
              {dates.map((date) => (
                <div key={date} className="card overflow-hidden">
                  <p className="border-b border-brand-border bg-brand-teal px-4 py-3 font-sans text-sm font-semibold text-white">
                    {cardDate(date)}
                  </p>
                  <div className="space-y-3 p-4">
                    {activeRoles.map((r) => {
                      const a = assignments.find(
                        (x) => x.service_date === date && x.role_id === r.id
                      );
                      if (!a) return null;
                      return (
                        <div key={r.id}>
                          <p className="mb-1 font-sans text-xs font-semibold text-brand-muted">
                            {r.name}
                          </p>
                          {assignmentSelect(a)}
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>

            {/* Tablet & desktop: roles as columns */}
            <div className="card hidden overflow-x-auto sm:block">
              <table className="w-full min-w-[640px] font-sans text-sm">
                <thead>
                  <tr className="border-b border-brand-border text-left">
                    <th className="px-4 py-3 font-semibold text-brand-muted">Sunday</th>
                    {activeRoles.map((r) => (
                      <th key={r.id} className="px-4 py-3 font-semibold text-brand-muted">
                        {r.name}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {dates.map((date) => (
                    <tr key={date} className="border-b border-brand-border/60 last:border-0">
                      <td className="whitespace-nowrap px-4 py-2.5 font-semibold text-brand-text">
                        {prettyDate(date)}
                      </td>
                      {activeRoles.map((r) => {
                        const a = assignments.find(
                          (x) => x.service_date === date && x.role_id === r.id
                        );
                        if (!a) return <td key={r.id} className="px-4 py-2.5">—</td>;
                        return (
                          <td key={r.id} className="px-2 py-1.5">
                            {assignmentSelect(a)}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </section>
    </div>
  );
}

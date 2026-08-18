"use client";

import { useCallback, useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

type Blackout = {
  id: string;
  starts_on: string;
  ends_on: string;
  reason: string | null;
};

const prettyDate = (iso: string) =>
  new Date(iso + "T00:00:00").toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

/**
 * Self-service blackout dates. `personId` is the people-row already matched
 * to the signed-in user's email by the server page; RLS enforces the same
 * match on every write.
 */
export function BlackoutManager({ personId }: { personId: string }) {
  const supabase = createClient();
  const [blackouts, setBlackouts] = useState<Blackout[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [startsOn, setStartsOn] = useState("");
  const [endsOn, setEndsOn] = useState("");
  const [reason, setReason] = useState("");

  const load = useCallback(async () => {
    const { data, error } = await supabase
      .from("blackout_dates")
      .select("id, starts_on, ends_on, reason")
      .eq("person_id", personId)
      .order("starts_on");
    if (error) setError(error.message);
    else setBlackouts((data ?? []) as Blackout[]);
    setLoading(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [personId]);

  useEffect(() => {
    void load();
  }, [load]);

  async function add(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!startsOn) return;
    const end = endsOn || startsOn;
    if (end < startsOn) {
      setError("End date can't be before the start date.");
      return;
    }
    setSaving(true);
    const { error } = await supabase.from("blackout_dates").insert({
      person_id: personId,
      starts_on: startsOn,
      ends_on: end,
      reason: reason.trim() || null,
    });
    setSaving(false);
    if (error) {
      setError(error.message);
      return;
    }
    setStartsOn("");
    setEndsOn("");
    setReason("");
    void load();
  }

  async function remove(id: string) {
    setError(null);
    const { error } = await supabase.from("blackout_dates").delete().eq("id", id);
    if (error) setError(error.message);
    else setBlackouts((b) => b.filter((x) => x.id !== id));
  }

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <form onSubmit={add} className="card p-5">
        <h2 className="section-title mb-4">Add a blackout range</h2>
        <div className="grid gap-3 sm:grid-cols-2">
          <label className="block">
            <span className="mb-1 block font-sans text-xs font-semibold text-brand-muted">
              First day away
            </span>
            <input
              type="date"
              required
              value={startsOn}
              onChange={(e) => setStartsOn(e.target.value)}
              className="input"
            />
          </label>
          <label className="block">
            <span className="mb-1 block font-sans text-xs font-semibold text-brand-muted">
              Last day away <span className="font-normal">(optional)</span>
            </span>
            <input
              type="date"
              value={endsOn}
              min={startsOn || undefined}
              onChange={(e) => setEndsOn(e.target.value)}
              className="input"
            />
          </label>
        </div>
        <label className="mt-3 block">
          <span className="mb-1 block font-sans text-xs font-semibold text-brand-muted">
            Reason <span className="font-normal">(optional)</span>
          </span>
          <input
            type="text"
            value={reason}
            maxLength={200}
            placeholder="Vacation, work travel, ..."
            onChange={(e) => setReason(e.target.value)}
            className="input"
          />
        </label>
        {error && (
          <p className="mt-3 font-sans text-sm text-red-600">{error}</p>
        )}
        <button type="submit" disabled={saving || !startsOn} className="btn-primary mt-4">
          {saving ? "Saving..." : "Add blackout dates"}
        </button>
      </form>

      <div className="card p-5">
        <h2 className="section-title mb-4">Your blackout dates</h2>
        {loading ? (
          <p className="prose-body text-sm">Loading…</p>
        ) : blackouts.length === 0 ? (
          <p className="prose-body text-sm">
            None yet — you're available every Sunday.
          </p>
        ) : (
          <ul className="space-y-2">
            {blackouts.map((b) => (
              <li
                key={b.id}
                className="flex items-center justify-between gap-3 rounded-xl border border-brand-border px-4 py-3"
              >
                <div className="min-w-0">
                  <p className="font-sans text-sm font-semibold text-brand-text">
                    {b.starts_on === b.ends_on
                      ? prettyDate(b.starts_on)
                      : `${prettyDate(b.starts_on)} – ${prettyDate(b.ends_on)}`}
                  </p>
                  {b.reason && (
                    <p className="truncate text-xs text-brand-muted">{b.reason}</p>
                  )}
                </div>
                <button
                  onClick={() => void remove(b.id)}
                  className="btn-ghost shrink-0 text-xs"
                  aria-label="Remove blackout"
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

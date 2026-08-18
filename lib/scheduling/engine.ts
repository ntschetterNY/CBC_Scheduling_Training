/**
 * Fair-rotation scheduling engine.
 *
 * Pure functions — no database access — so the rules are easy to reason
 * about and to test. The generate API route loads members/roles/blackouts/
 * history from Supabase and feeds them in.
 *
 * Rules encoded here (driven by each role's `category`):
 *   - Nobody takes both the opening and closing slot in the same week.
 *   - Nobody takes two speaking slots in the same week.
 *   - The reserve deacon never takes a speaking slot that week (they're the
 *     backup speaker), but may also take an opening/closing slot.
 *   - Goal (soft): pair an opening/closing slot with one speaking slot, so a
 *     deacon who speaks also opens or closes that week.
 *   - "general" roles are a plain rotation: one slot per person per week.
 *   - Everyone is spread as evenly as possible, both in total serving days
 *     and within each role category, honoring blackout dates.
 */

export type RoleCategory =
  | "opening"
  | "closing"
  | "speaking"
  | "reserve"
  | "general";

export interface EngineRole {
  id: string;
  name: string;
  category: RoleCategory;
  sortOrder: number;
}

export interface EngineMember {
  id: string;
  name: string;
}

export interface EngineBlackout {
  personId: string;
  /** ISO dates, inclusive range */
  startsOn: string;
  endsOn: string;
}

/**
 * A person is capable of filling a role. Drives eligibility: see
 * `generateSchedule` for the restrict-when-configured fallback.
 */
export interface EngineCapability {
  personId: string;
  roleId: string;
}

/** A past (or already-saved) assignment that should count toward fairness. */
export interface EngineHistoryEntry {
  personId: string;
  category: RoleCategory;
  serviceDate: string; // ISO date
}

export interface GeneratedAssignment {
  serviceDate: string; // ISO date
  roleId: string;
  /** null when nobody was available for the slot */
  personId: string | null;
}

/** List the ISO dates of every Sunday from `from` (inclusive) for `weeks` weeks. */
export function listSundays(from: Date, weeks: number): string[] {
  const d = new Date(Date.UTC(from.getUTCFullYear(), from.getUTCMonth(), from.getUTCDate()));
  const day = d.getUTCDay();
  if (day !== 0) d.setUTCDate(d.getUTCDate() + (7 - day));
  const out: string[] = [];
  for (let i = 0; i < weeks; i++) {
    out.push(d.toISOString().slice(0, 10));
    d.setUTCDate(d.getUTCDate() + 7);
  }
  return out;
}

interface PersonState {
  daysServed: number;
  byCategory: Record<RoleCategory, number>;
  lastServed: string | null; // ISO date
}

function emptyCategoryCounts(): Record<RoleCategory, number> {
  return { opening: 0, closing: 0, speaking: 0, reserve: 0, general: 0 };
}

/** Hard same-day compatibility: can `category` be added to what they hold? */
function allowedWith(category: RoleCategory, held: Set<RoleCategory>): boolean {
  if (held.size >= 2) return false; // never more than two roles in a day
  switch (category) {
    case "speaking":
      // one speaking max; the reserve never speaks
      return !held.has("speaking") && !held.has("reserve");
    case "reserve":
      return !held.has("reserve") && !held.has("speaking");
    case "opening":
      return !held.has("opening") && !held.has("closing");
    case "closing":
      return !held.has("closing") && !held.has("opening");
    case "general":
      return held.size === 0;
  }
}

/**
 * Generate a schedule for the given Sundays.
 *
 * Greedy, deterministic: per week, speaking roles are assigned first, then
 * reserve, then opening/closing (which prefer that week's speakers, per the
 * pairing goal), then general roles. Candidates are scored by how much
 * they've already served — least-served wins — with a small penalty for
 * having served the previous week and a strong bonus for the pairing goal.
 */
export function generateSchedule({
  sundays,
  roles,
  members,
  blackouts,
  history,
  capabilities = [],
}: {
  sundays: string[];
  roles: EngineRole[];
  members: EngineMember[];
  blackouts: EngineBlackout[];
  history: EngineHistoryEntry[];
  /**
   * Which people can fill which roles. A role that appears in at least one
   * capability row is "restricted" — only the people listed for it are
   * candidates. A role with no capability rows stays open to every member, so
   * teams that haven't set capabilities yet keep working unchanged.
   */
  capabilities?: EngineCapability[];
}): GeneratedAssignment[] {
  const restrictedRoles = new Set<string>();
  const capablePairs = new Set<string>();
  for (const c of capabilities) {
    restrictedRoles.add(c.roleId);
    capablePairs.add(`${c.personId}::${c.roleId}`);
  }
  const isEligible = (personId: string, roleId: string) =>
    !restrictedRoles.has(roleId) || capablePairs.has(`${personId}::${roleId}`);

  const state = new Map<string, PersonState>();
  for (const m of members) {
    state.set(m.id, { daysServed: 0, byCategory: emptyCategoryCounts(), lastServed: null });
  }

  // Fold history into the fairness counters (distinct days served per person).
  const historyDays = new Map<string, Set<string>>();
  for (const h of history) {
    const s = state.get(h.personId);
    if (!s) continue;
    s.byCategory[h.category] += 1;
    let days = historyDays.get(h.personId);
    if (!days) historyDays.set(h.personId, (days = new Set()));
    days.add(h.serviceDate);
    if (!s.lastServed || h.serviceDate > s.lastServed) s.lastServed = h.serviceDate;
  }
  for (const [personId, days] of historyDays) {
    state.get(personId)!.daysServed = days.size;
  }

  const categoryOrder: Record<RoleCategory, number> = {
    speaking: 0,
    reserve: 1,
    opening: 2,
    closing: 3,
    general: 4,
  };
  const orderedRoles = [...roles].sort(
    (a, b) =>
      categoryOrder[a.category] - categoryOrder[b.category] ||
      a.sortOrder - b.sortOrder
  );

  const sortedMembers = [...members].sort((a, b) => a.name.localeCompare(b.name));
  const memberIndex = new Map(sortedMembers.map((m, i) => [m.id, i]));

  const isBlackedOut = (personId: string, date: string) =>
    blackouts.some(
      (b) => b.personId === personId && b.startsOn <= date && b.endsOn >= date
    );

  const out: GeneratedAssignment[] = [];

  sundays.forEach((date, weekIdx) => {
    const heldToday = new Map<string, Set<RoleCategory>>();
    const servedToday = new Set<string>();

    for (const role of orderedRoles) {
      let best: EngineMember | null = null;
      let bestScore = Infinity;

      for (const m of sortedMembers) {
        if (!isEligible(m.id, role.id)) continue;
        if (isBlackedOut(m.id, date)) continue;
        const held = heldToday.get(m.id) ?? new Set<RoleCategory>();
        if (!allowedWith(role.category, held)) continue;

        const s = state.get(m.id)!;
        let score =
          s.byCategory[role.category] * 10 +
          s.daysServed * 4 +
          (servedLastWeek(s.lastServed, date) ? 2 : 0);

        // Pairing goal: give this week's speakers the opening/closing slots.
        if (
          (role.category === "opening" || role.category === "closing") &&
          held.has("speaking")
        ) {
          score -= 8;
        }
        // Mild preference for resting people who already have a role today
        // when the pairing goal doesn't apply.
        else if (held.size > 0) {
          score += 1;
        }

        // Deterministic tie-break that rotates week to week so equal-score
        // candidates take turns instead of always going alphabetically.
        const rotation =
          ((memberIndex.get(m.id)! + weekIdx) % sortedMembers.length) /
          sortedMembers.length;
        score += rotation * 0.5;

        if (score < bestScore) {
          bestScore = score;
          best = m;
        }
      }

      out.push({ serviceDate: date, roleId: role.id, personId: best?.id ?? null });

      if (best) {
        const held = heldToday.get(best.id) ?? new Set<RoleCategory>();
        held.add(role.category);
        heldToday.set(best.id, held);
        const s = state.get(best.id)!;
        s.byCategory[role.category] += 1;
        if (!servedToday.has(best.id)) {
          s.daysServed += 1;
          servedToday.add(best.id);
        }
        s.lastServed = date;
      }
    }
  });

  return out;
}

/** True when `lastServed` is exactly the Sunday before `date`. */
function servedLastWeek(lastServed: string | null, date: string): boolean {
  if (!lastServed) return false;
  const prev = new Date(date + "T00:00:00Z");
  prev.setUTCDate(prev.getUTCDate() - 7);
  return lastServed === prev.toISOString().slice(0, 10);
}

/**
 * Breeze ChMS API client - read-only source of truth for the people directory.
 *
 * Configure by setting:
 *   BREEZE_SUBDOMAIN  the church's Breeze subdomain, e.g. "crossbridge" for
 *                     crossbridge.breezechms.com
 *   BREEZE_API_KEY    from Breeze: Account Settings → Extensions → API
 *
 * Until both are set, `isBreezeConfigured` is false and every call returns
 * a clear "not configured" error instead of hitting the network. Once the key
 * lands, `planDirectoryImport` fetches the whole Breeze directory in one call
 * and links existing `people` rows by email / imports the rest. The sync is
 * one-way: nothing is ever written back to Breeze.
 *
 * Breeze API docs: https://app.breezechms.com/api
 */

export const isBreezeConfigured = Boolean(
  process.env.BREEZE_SUBDOMAIN && process.env.BREEZE_API_KEY
);

export class BreezeNotConfiguredError extends Error {
  constructor() {
    super(
      "Breeze is not configured. Set BREEZE_SUBDOMAIN and BREEZE_API_KEY to enable the sync."
    );
    this.name = "BreezeNotConfiguredError";
  }
}

export interface BreezePerson {
  id: string;
  first_name: string;
  last_name: string;
  /** Breeze nests contact details; flattened by `listPeople`. */
  email: string | null;
}

async function breezeFetch<T>(path: string, params: Record<string, string> = {}): Promise<T> {
  if (!isBreezeConfigured) throw new BreezeNotConfiguredError();
  const url = new URL(
    `https://${process.env.BREEZE_SUBDOMAIN}.breezechms.com/api${path}`
  );
  for (const [k, v] of Object.entries(params)) url.searchParams.set(k, v);
  const res = await fetch(url, {
    headers: { "Api-Key": process.env.BREEZE_API_KEY! },
  });
  if (!res.ok) {
    throw new Error(`Breeze API ${res.status} on ${path}: ${(await res.text()).slice(0, 300)}`);
  }
  return (await res.json()) as T;
}

/**
 * Pull the primary email out of a Breeze `details` blob. Breeze keys `details`
 * by per-church numeric profile-field ids, so the email can't be addressed by
 * name; instead it's an array value whose entries carry
 * `field_type: "email_primary"` and the address under `address`. Entries exist
 * even when the address is blank, so empty strings collapse to null.
 */
function extractPrimaryEmail(details: Record<string, unknown> | null | undefined): string | null {
  if (!details || typeof details !== "object") return null;
  const candidates: { address: string; isPrimary: boolean }[] = [];
  for (const value of Object.values(details)) {
    if (!Array.isArray(value)) continue;
    for (const entry of value) {
      if (!entry || typeof entry !== "object") continue;
      const e = entry as { field_type?: unknown; address?: unknown; is_primary?: unknown };
      if (e.field_type !== "email_primary") continue;
      if (typeof e.address !== "string" || !e.address.trim()) continue;
      candidates.push({ address: e.address.trim(), isPrimary: e.is_primary === "1" });
    }
  }
  return (candidates.find((c) => c.isPrimary) ?? candidates[0])?.address ?? null;
}

/** List everyone in Breeze with their primary email flattened out. */
export async function listPeople(): Promise<BreezePerson[]> {
  type Raw = {
    id: string;
    first_name: string;
    last_name: string;
    details?: Record<string, unknown> | null;
  };
  const raw = await breezeFetch<Raw[]>("/people", { details: "1" });
  return raw.map((p) => ({
    id: String(p.id),
    first_name: p.first_name,
    last_name: p.last_name,
    email: extractPrimaryEmail(p.details),
  }));
}

/** An app `people` row as the planner needs to see it. */
export interface AppPersonRow {
  id: string;
  full_name: string;
  email: string | null;
  breeze_person_id: string | null;
  active: boolean;
  deactivated_by_sync: boolean;
}

export interface BreezeDirectoryPlan {
  /** New Breeze people with no app row — insert them. */
  toImport: { breezePersonId: string; fullName: string; email: string | null }[];
  /** Unlinked app rows matched to a Breeze person by email — set breeze_person_id + refresh name/email. */
  toLink: { personId: string; breezePersonId: string; fullName: string; email: string | null }[];
  /** Already-linked app rows whose name/email drifted from Breeze — refresh them. */
  toUpdate: { personId: string; fullName: string; email: string | null; changes: string[] }[];
  /** Linked app rows Breeze no longer lists — flag inactive (never deleted, history kept). */
  toDeactivate: { personId: string; fullName: string; breezePersonId: string }[];
  /** Linked rows back in Breeze that sync had deactivated — reactivate (never touches manual pauses). */
  toReactivate: { personId: string; fullName: string; breezePersonId: string }[];
  /**
   * Breeze people whose email is already owned by a different app row (or was
   * claimed by an earlier Breeze row this pass) — reported, email not applied.
   * `ownerPersonId` is the owning app row's id, or `import:<breezeId>` when the
   * claimer is a new import from the same pass.
   */
  conflicts: { breezePersonId: string; fullName: string; email: string; ownerPersonId: string }[];
  /** App rows with no Breeze link and no email match — hand-added; reported, untouched. */
  unlinked: { personId: string; fullName: string; email: string | null }[];
}

const breezeFullName = (p: BreezePerson) =>
  `${p.first_name ?? ""} ${p.last_name ?? ""}`.trim();

/**
 * Dry-run planner for a full read-only directory import from Breeze. Pass the
 * current `people` rows in; it fetches the whole Breeze directory (one call)
 * and classifies every person into import / link / update / deactivate, plus
 * reports conflicts and untouched hand-added rows. Pure planner — the caller
 * decides whether to write. Deterministic and side-effect free apart from the
 * single Breeze read, so preview and apply can each recompute against fresh
 * Breeze data instead of trusting a client round-trip.
 */
export async function planDirectoryImport(
  appPeople: AppPersonRow[]
): Promise<BreezeDirectoryPlan> {
  const breezePeople = await listPeople();
  const breezeIds = new Set(breezePeople.map((b) => b.id));

  const appByBreezeId = new Map(
    appPeople.filter((p) => p.breeze_person_id).map((p) => [p.breeze_person_id!, p])
  );
  // Every app email (linked or not) — used both to link and to spot conflicts.
  const appByEmail = new Map<string, AppPersonRow>();
  for (const p of appPeople) {
    if (p.email) appByEmail.set(p.email.toLowerCase(), p);
  }

  const plan: BreezeDirectoryPlan = {
    toImport: [],
    toLink: [],
    toUpdate: [],
    toDeactivate: [],
    toReactivate: [],
    conflicts: [],
    unlinked: [],
  };
  const linkedPersonIds = new Set<string>();
  // Guard the people.email UNIQUE constraint everywhere an email can be
  // written (update, link, import): lowercase email -> owning app row id, or
  // `import:<breezeId>` for rows created this pass. Seeded with every current
  // app email; Breeze rows claim emails as the pass hands them out, so two
  // Breeze people sharing an address can never both write it.
  const claimedEmails = new Map<string, string>();
  for (const p of appPeople) {
    if (p.email) claimedEmails.set(p.email.toLowerCase(), p.id);
  }

  for (const b of breezePeople) {
    const fullName = breezeFullName(b);
    const linked = appByBreezeId.get(b.id);
    if (linked) {
      // A row paused by hand (inactive without the sync flag) is off-limits to
      // sync entirely — leave name, email, and active state alone.
      if (!linked.active && !linked.deactivated_by_sync) continue;
      // Sync-deactivated row that's back in Breeze — reactivate it.
      if (!linked.active && linked.deactivated_by_sync) {
        plan.toReactivate.push({ personId: linked.id, fullName, breezePersonId: b.id });
      }
      const changes: string[] = [];
      if (fullName && fullName !== linked.full_name) changes.push("name");
      if (b.email && b.email.toLowerCase() !== (linked.email ?? "").toLowerCase()) {
        const key = b.email.toLowerCase();
        const owner = claimedEmails.get(key);
        if (owner !== undefined && owner !== linked.id) {
          // Another row already holds this email — updating would violate the
          // UNIQUE constraint. Report it; the name refresh (if any) still runs.
          plan.conflicts.push({
            breezePersonId: b.id,
            fullName,
            email: b.email,
            ownerPersonId: owner,
          });
        } else {
          claimedEmails.set(key, linked.id);
          changes.push("email");
        }
      }
      if (changes.length) {
        plan.toUpdate.push({ personId: linked.id, fullName, email: b.email, changes });
      }
      continue;
    }

    const match = b.email ? appByEmail.get(b.email.toLowerCase()) : undefined;
    if (match && !match.breeze_person_id && !linkedPersonIds.has(match.id)) {
      plan.toLink.push({ personId: match.id, breezePersonId: b.id, fullName, email: b.email });
      linkedPersonIds.add(match.id);
      continue;
    }
    if (match && (match.breeze_person_id || linkedPersonIds.has(match.id))) {
      // Email already tied to a different Breeze person (or claimed by an
      // earlier Breeze row this pass) — report the conflict, don't create a dup.
      plan.conflicts.push({
        breezePersonId: b.id,
        fullName,
        email: b.email!,
        ownerPersonId: match.id,
      });
      continue;
    }

    // Brand new person. Only carry the email if nothing else has claimed it.
    const key = b.email?.toLowerCase();
    const email = key && !claimedEmails.has(key) ? b.email : null;
    if (key && email) claimedEmails.set(key, `import:${b.id}`);
    plan.toImport.push({ breezePersonId: b.id, fullName, email });
  }

  for (const p of appPeople) {
    if (p.breeze_person_id && !breezeIds.has(p.breeze_person_id)) {
      if (p.active) {
        plan.toDeactivate.push({
          personId: p.id,
          fullName: p.full_name,
          breezePersonId: p.breeze_person_id,
        });
      }
    } else if (!p.breeze_person_id && !linkedPersonIds.has(p.id)) {
      plan.unlinked.push({ personId: p.id, fullName: p.full_name, email: p.email });
    }
  }

  return plan;
}

/** Bucket counts for a directory plan — the headline the admin confirms against. */
export function summarizeDirectoryPlan(plan: BreezeDirectoryPlan) {
  return {
    import: plan.toImport.length,
    link: plan.toLink.length,
    update: plan.toUpdate.length,
    deactivate: plan.toDeactivate.length,
    reactivate: plan.toReactivate.length,
    conflicts: plan.conflicts.length,
    unlinked: plan.unlinked.length,
  };
}

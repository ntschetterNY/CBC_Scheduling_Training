/**
 * Breeze ChMS API client — prepped but dormant until an API key exists.
 *
 * Configure by setting:
 *   BREEZE_SUBDOMAIN  the church's Breeze subdomain, e.g. "crossbridge" for
 *                     crossbridge.breezechms.com
 *   BREEZE_API_KEY    from Breeze: Account Settings → Extensions → API
 *
 * Until both are set, `isBreezeConfigured` is false and every call returns
 * a clear "not configured" error instead of hitting the network. The
 * `people.breeze_person_id` column is already in place, so once the key
 * lands, `syncPeopleFromBreeze` can link existing rows by email and pull in
 * the Sound Tech roster.
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

/** List everyone in Breeze with their primary email flattened out. */
export async function listPeople(): Promise<BreezePerson[]> {
  type Raw = {
    id: string;
    first_name: string;
    last_name: string;
    details?: { email_primary?: string } | null;
  };
  const raw = await breezeFetch<Raw[]>("/people", { details: "1" });
  return raw.map((p) => ({
    id: String(p.id),
    first_name: p.first_name,
    last_name: p.last_name,
    email: p.details?.email_primary || null,
  }));
}

export interface BreezeSyncPlan {
  /** Breeze people whose email matches an app person missing a breeze_person_id */
  matches: { personId: string; breezePersonId: string; email: string }[];
  /** Breeze people with no matching app person (candidates to import) */
  unmatched: BreezePerson[];
}

/**
 * Dry-run matcher between Breeze and the app's `people` table. Pass the
 * current people rows in; returns what a sync would link/import. Kept as a
 * pure planner so the caller decides what to write back to Supabase.
 */
export async function planPeopleSync(
  appPeople: { id: string; email: string | null; breeze_person_id: string | null }[]
): Promise<BreezeSyncPlan> {
  const breezePeople = await listPeople();
  const byEmail = new Map(
    appPeople
      .filter((p) => p.email && !p.breeze_person_id)
      .map((p) => [p.email!.toLowerCase(), p])
  );
  const matches: BreezeSyncPlan["matches"] = [];
  const unmatched: BreezePerson[] = [];
  for (const bp of breezePeople) {
    const app = bp.email ? byEmail.get(bp.email.toLowerCase()) : undefined;
    if (app) matches.push({ personId: app.id, breezePersonId: bp.id, email: bp.email! });
    else unmatched.push(bp);
  }
  return { matches, unmatched };
}

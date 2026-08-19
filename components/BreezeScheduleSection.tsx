import {
  getVolunteerSchedule,
  isBreezeConfigured,
  type BreezeEventVolunteers,
  type BreezeVolunteerAssignment,
} from "@/lib/breeze";

/**
 * Read-only view of the volunteer schedule as it stands in Breeze — every
 * upcoming calendar event with volunteer roles or sign-ups, each volunteer
 * shown with their reply status. Server component: the Breeze pull happens
 * here so the page can stream it in behind a Suspense fallback.
 */

const WEEKS_AHEAD = 6;

const cardDate = (iso: string) =>
  new Date(iso + "T00:00:00").toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });

const statusMark: Record<BreezeVolunteerAssignment["response"], string | null> = {
  accepted: "✓",
  declined: "✗",
  pending: null,
};

function VolunteerPill({
  volunteer,
  myEmail,
}: {
  volunteer: BreezeVolunteerAssignment;
  myEmail: string;
}) {
  const isMe =
    !!volunteer.email && volunteer.email.toLowerCase() === myEmail;
  const tone =
    volunteer.response === "accepted"
      ? "border-brand-success/40 bg-brand-success/10 text-brand-success"
      : volunteer.response === "declined"
        ? "border-brand-danger/40 bg-brand-danger/10 text-brand-danger"
        : "border-brand-border bg-brand-muted/10 text-brand-text/80";
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 font-sans text-xs font-medium ${tone} ${
        isMe ? "ring-2 ring-brand-accent" : ""
      }`}
      title={
        volunteer.response === "pending"
          ? "Hasn't replied yet"
          : volunteer.response === "accepted"
            ? "Accepted"
            : "Declined"
      }
    >
      {volunteer.name}
      {isMe && <span className="font-bold text-brand-accentDark">(you)</span>}
      {statusMark[volunteer.response] && (
        <span aria-hidden>{statusMark[volunteer.response]}</span>
      )}
    </span>
  );
}

function EventCard({
  event,
  myEmail,
  nextUp,
}: {
  event: BreezeEventVolunteers;
  myEmail: string;
  nextUp: boolean;
}) {
  const byRole = (roleId: string) =>
    event.volunteers.filter((v) => v.roleIds.includes(roleId));
  const roleIds = new Set(event.roles.map((r) => r.id));
  const unroled = event.volunteers.filter(
    (v) => !v.roleIds.some((id) => roleIds.has(id))
  );

  return (
    <div className="card flex flex-col overflow-hidden">
      <div className="flex items-center justify-between gap-2 border-b border-brand-border bg-brand-teal px-4 py-3">
        <div className="min-w-0">
          <p className="truncate font-sans text-sm font-semibold text-white">
            {event.name}
          </p>
          <p className="font-sans text-xs text-white/80">
            {cardDate(event.date)}
            {event.time && ` · ${event.time}`}
          </p>
        </div>
        {nextUp && (
          <span className="shrink-0 rounded-full bg-brand-accent px-2.5 py-0.5 font-sans text-[10px] font-bold uppercase tracking-wider text-white">
            Next up
          </span>
        )}
      </div>

      <div className="space-y-3 p-4">
        {event.roles.map((role) => {
          const assigned = byRole(role.id);
          return (
            <div key={role.id}>
              <p className="mb-1 font-sans text-[11px] font-semibold uppercase tracking-wider text-brand-muted">
                {role.name}
                {role.quantity != null && (
                  <span
                    className={
                      assigned.length < role.quantity
                        ? "ml-1.5 normal-case tracking-normal text-brand-danger"
                        : "ml-1.5 normal-case tracking-normal text-brand-muted/70"
                    }
                  >
                    {assigned.length}/{role.quantity} filled
                  </span>
                )}
              </p>
              {assigned.length ? (
                <div className="flex flex-wrap gap-1.5">
                  {assigned.map((v) => (
                    <VolunteerPill key={v.personId} volunteer={v} myEmail={myEmail} />
                  ))}
                </div>
              ) : (
                <p className="font-sans text-sm text-brand-muted/70">Open — no one yet</p>
              )}
            </div>
          );
        })}

        {unroled.length > 0 && (
          <div>
            {event.roles.length > 0 && (
              <p className="mb-1 font-sans text-[11px] font-semibold uppercase tracking-wider text-brand-muted">
                Also serving
              </p>
            )}
            <div className="flex flex-wrap gap-1.5">
              {unroled.map((v) => (
                <VolunteerPill key={v.personId} volunteer={v} myEmail={myEmail} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/** Suspense fallback: three ghost cards where the Breeze schedule will land. */
export function BreezeScheduleSkeleton() {
  return (
    <section className="mb-10">
      <h2 className="section-title mb-3">On the Breeze calendar</h2>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {[0, 1, 2].map((i) => (
          <div key={i} className="card h-40 animate-pulse bg-brand-muted/5" />
        ))}
      </div>
    </section>
  );
}

export async function BreezeScheduleSection({ myEmail }: { myEmail: string }) {
  if (!isBreezeConfigured) return null;

  const start = new Date().toISOString().slice(0, 10);
  const horizon = new Date();
  horizon.setDate(horizon.getDate() + WEEKS_AHEAD * 7);
  const end = horizon.toISOString().slice(0, 10);

  let events: BreezeEventVolunteers[];
  try {
    events = await getVolunteerSchedule(start, end);
  } catch (err) {
    console.error("Breeze volunteer schedule failed:", err);
    return (
      <section className="mb-10">
        <h2 className="section-title mb-3">On the Breeze calendar</h2>
        <p className="prose-body text-sm text-brand-muted">
          Couldn&apos;t reach Breeze right now — the volunteer schedule will be
          back on the next refresh.
        </p>
      </section>
    );
  }

  if (events.length === 0) return null;

  return (
    <section className="mb-10">
      <div className="mb-3 flex flex-wrap items-baseline justify-between gap-2">
        <h2 className="section-title">On the Breeze calendar</h2>
        <p className="font-sans text-xs text-brand-muted">
          Next {WEEKS_AHEAD} weeks, straight from Breeze ·{" "}
          <span className="text-brand-success">✓ accepted</span> ·{" "}
          <span className="text-brand-danger">✗ declined</span> · no mark =
          hasn&apos;t replied
        </p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {events.map((event, i) => (
          <EventCard key={event.instanceId} event={event} myEmail={myEmail} nextUp={i === 0} />
        ))}
      </div>
    </section>
  );
}

type Role = { id: string; name: string };
type Assignment = {
  id: string;
  role_id: string;
  service_date: string;
  status: string;
  people: { id: string; full_name: string; email: string | null } | null;
};

const shortDate = (iso: string) =>
  new Date(iso + "T00:00:00").toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });

const cardDate = (iso: string) =>
  new Date(iso + "T00:00:00").toLocaleDateString("en-US", {
    weekday: "short",
    month: "long",
    day: "numeric",
  });

/**
 * One team's upcoming schedule. Desktop (`sm+`) gets the roles-as-columns
 * table; phones get one card per Sunday with role → person rows, so nothing
 * needs horizontal scrolling.
 */
export function TeamScheduleView({
  roles,
  assignments,
  myEmail,
}: {
  roles: Role[];
  assignments: Assignment[];
  /** lowercased email of the signed-in user, for highlighting */
  myEmail: string;
}) {
  const dates = [...new Set(assignments.map((a) => a.service_date))].sort();
  const cell = (date: string, roleId: string) =>
    assignments.find((a) => a.service_date === date && a.role_id === roleId);
  const isMe = (a?: Assignment) =>
    !!a?.people?.email && a.people.email.toLowerCase() === myEmail;

  const personLabel = (a?: Assignment) =>
    a?.people ? (
      <span
        className={
          isMe(a)
            ? "rounded-full bg-brand-accent/15 px-2 py-0.5 font-semibold text-brand-accentDark"
            : "text-brand-text/90"
        }
      >
        {a.people.full_name}
        {a.status === "confirmed" && " ✓"}
        {a.status === "declined" && " ✗"}
      </span>
    ) : (
      <span className="text-brand-muted/60">—</span>
    );

  return (
    <>
      {/* Phones: one card per Sunday */}
      <div className="space-y-3 sm:hidden">
        {dates.map((date) => (
          <div key={date} className="card overflow-hidden">
            <p className="border-b border-brand-border bg-brand-surface/60 px-4 py-2.5 font-sans text-sm font-bold text-brand-text">
              {cardDate(date)}
            </p>
            <ul className="divide-y divide-brand-border/60">
              {roles.map((r) => (
                <li
                  key={r.id}
                  className="flex items-center justify-between gap-3 px-4 py-2.5 font-sans text-sm"
                >
                  <span className="shrink-0 text-xs font-semibold text-brand-muted">
                    {r.name}
                  </span>
                  {personLabel(cell(date, r.id))}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* Tablet & desktop: roles as columns */}
      <div className="card hidden overflow-x-auto sm:block">
        <table className="w-full min-w-[640px] font-sans text-sm">
          <thead>
            <tr className="border-b border-brand-border text-left">
              <th className="px-4 py-3 font-semibold text-brand-muted">Sunday</th>
              {roles.map((r) => (
                <th key={r.id} className="px-4 py-3 font-semibold text-brand-muted">
                  {r.name}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {dates.map((date) => (
              <tr key={date} className="border-b border-brand-border/60 last:border-0">
                <td className="whitespace-nowrap px-4 py-3 font-semibold text-brand-text">
                  {shortDate(date)}
                </td>
                {roles.map((r) => (
                  <td key={r.id} className="px-4 py-3">
                    {personLabel(cell(date, r.id))}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

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
    weekday: "long",
    month: "long",
    day: "numeric",
  });

/**
 * One team's upcoming schedule. Desktop (`sm+`) gets the roles-as-columns
 * table; phones get one card per Sunday laid out like the admin scheduling
 * form — each role as a labeled field with the person underneath — so
 * nothing scrolls sideways and both pages read the same way.
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

  const tablePersonLabel = (a?: Assignment) =>
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
      {/* Phones: one card per Sunday, formatted like the admin scheduling form */}
      <div className="space-y-4 sm:hidden">
        {dates.map((date, i) => (
          <div key={date} className="card overflow-hidden">
            <div className="flex items-center justify-between gap-2 border-b border-brand-border bg-brand-teal px-4 py-3">
              <p className="font-sans text-sm font-semibold text-white">
                {cardDate(date)}
              </p>
              {i === 0 && (
                <span className="rounded-full bg-brand-accent px-2.5 py-0.5 font-sans text-[10px] font-bold uppercase tracking-wider text-white">
                  Next up
                </span>
              )}
            </div>
            <div className="space-y-3 p-4">
              {roles.map((r) => {
                const a = cell(date, r.id);
                const mine = isMe(a);
                return (
                  <div key={r.id}>
                    <p className="mb-0.5 font-sans text-[11px] font-semibold uppercase tracking-wider text-brand-muted">
                      {r.name}
                    </p>
                    {a?.people ? (
                      <p
                        className={`font-sans text-base ${
                          mine
                            ? "font-bold text-brand-accentDark"
                            : "font-medium text-brand-text"
                        }`}
                      >
                        {a.people.full_name}
                        {mine && " (you)"}
                        {a.status === "confirmed" && (
                          <span className="ml-1.5 text-sm font-semibold text-brand-success">
                            ✓ confirmed
                          </span>
                        )}
                        {a.status === "declined" && (
                          <span className="ml-1.5 text-sm font-semibold text-red-600">
                            ✗ declined
                          </span>
                        )}
                      </p>
                    ) : (
                      <p className="font-sans text-base text-brand-muted/70">
                        Unassigned
                      </p>
                    )}
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
                    {tablePersonLabel(cell(date, r.id))}
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

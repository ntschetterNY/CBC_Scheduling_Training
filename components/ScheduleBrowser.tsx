"use client";

import { useState } from "react";
import { TeamScheduleView } from "./TeamScheduleView";

type Team = { id: string; name: string };
type Role = { id: string; team_id: string; name: string };
type Assignment = {
  id: string;
  team_id: string;
  role_id: string;
  service_date: string;
  status: string;
  people: { id: string; full_name: string; email: string | null } | null;
};

/**
 * Team-tabbed schedule browser — mirrors the admin scheduling page, so
 * "viewing the schedule" and "setting the schedule" read the same way.
 * One team shows at a time, which keeps mobile to a short, focused scroll.
 */
export function ScheduleBrowser({
  teams,
  roles,
  assignments,
  myEmail,
  isAdmin,
}: {
  teams: Team[];
  roles: Role[];
  assignments: Assignment[];
  myEmail: string;
  isAdmin: boolean;
}) {
  // Default to the first team that actually has a schedule.
  const [teamId, setTeamId] = useState(
    () =>
      teams.find((t) => assignments.some((a) => a.team_id === t.id))?.id ??
      teams[0]?.id ??
      ""
  );

  const teamRoles = roles.filter((r) => r.team_id === teamId);
  const teamAssignments = assignments.filter((a) => a.team_id === teamId);

  return (
    <div>
      <div className="mb-4 flex flex-wrap gap-2">
        {teams.map((t) => (
          <button
            key={t.id}
            onClick={() => setTeamId(t.id)}
            className={t.id === teamId ? "btn-teal" : "btn-secondary"}
          >
            {t.name}
          </button>
        ))}
      </div>

      {teamAssignments.length === 0 ? (
        <p className="prose-body text-sm">
          No schedule generated for this team yet
          {isAdmin ? " — generate one from the Manage page." : "."}
        </p>
      ) : (
        <TeamScheduleView
          roles={teamRoles}
          assignments={teamAssignments}
          myEmail={myEmail}
        />
      )}
    </div>
  );
}

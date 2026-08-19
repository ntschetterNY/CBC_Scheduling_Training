/**
 * The complete Breeze ChMS API surface, as a static catalog.
 *
 * Breeze API keys have NO scoping on Breeze's side - any key can read and
 * write everything in the account (people, tags, events, attendance,
 * volunteers, forms, families, and even contributions), all over plain GET
 * requests. This catalog is the source of truth for the app-side gateway
 * that fixes that: every endpoint gets an on/off switch stored in
 * `breeze_endpoint_permissions`, managed from /admin/api-keys, and enforced
 * in `lib/breeze.ts` before any request leaves the server.
 *
 * Sources: https://app.breezechms.com/api (People, Tags, Events, Check In,
 * Forms, Volunteers, Families, Account) plus the Giving/Funds/Pledges
 * endpoints that Breeze ships in its official client libraries but leaves
 * out of the docs page - included here because the key can reach them, and
 * they carry the most sensitive data in the account.
 *
 * Pure data - safe to import from client components.
 */

export type BreezeOperation = "read" | "write";

export interface BreezeEndpointDef {
  /** Stable key, primary key of breeze_endpoint_permissions. */
  key: string;
  category: string;
  name: string;
  /** Path under https://<subdomain>.breezechms.com/api */
  path: string;
  operation: BreezeOperation;
  description: string;
  /** App feature that calls this endpoint today (shown as a warning before turning it off). */
  usedBy?: string;
  /** Financial / giving data - extra-sensitive even for reads. */
  sensitive?: boolean;
  /**
   * How the probe exercises a read endpoint. `params` are static; `needs`
   * names a value the probe chains from an earlier call (an event instance,
   * a form id, ...). Write endpoints are never probed - a live call would
   * mutate church data.
   */
  probe?: {
    params?: Record<string, string>;
    needs?: "instance_id" | "form_id" | "person_id" | "campaign_id" | "date_range";
  };
}

export const BREEZE_ENDPOINTS: BreezeEndpointDef[] = [
  // ---- People ------------------------------------------------------------
  {
    key: "people.list",
    category: "People",
    name: "List People",
    path: "/people",
    operation: "read",
    description: "Every person in the directory, optionally with full profile details.",
    usedBy: "Directory sync, volunteer schedule, people search",
    probe: { params: { limit: "1" } },
  },
  {
    key: "people.show",
    category: "People",
    name: "Show Person",
    path: "/people/{id}",
    operation: "read",
    description: "Full profile for a single person.",
    probe: { needs: "person_id" },
  },
  {
    key: "people.profile_fields",
    category: "People",
    name: "List Profile Fields",
    path: "/profile",
    operation: "read",
    description: "The account's custom profile field definitions.",
    probe: {},
  },
  {
    key: "people.add",
    category: "People",
    name: "Add Person",
    path: "/people/add",
    operation: "write",
    description: "Creates a new person record in Breeze.",
  },
  {
    key: "people.update",
    category: "People",
    name: "Update Person",
    path: "/people/update",
    operation: "write",
    description: "Modifies an existing person's profile.",
  },
  {
    key: "people.delete",
    category: "People",
    name: "Delete Person",
    path: "/people/delete",
    operation: "write",
    description: "Permanently removes a person from Breeze.",
  },

  // ---- Tags --------------------------------------------------------------
  {
    key: "tags.list_tags",
    category: "Tags",
    name: "List Tags",
    path: "/tags/list_tags",
    operation: "read",
    description: "All tags in the account.",
    probe: {},
  },
  {
    key: "tags.list_folders",
    category: "Tags",
    name: "List Tag Folders",
    path: "/tags/list_folders",
    operation: "read",
    description: "The tag folder hierarchy.",
    probe: {},
  },
  {
    key: "tags.add_tag",
    category: "Tags",
    name: "Add Tag",
    path: "/tags/add_tag",
    operation: "write",
    description: "Creates a new tag.",
  },
  {
    key: "tags.add_tag_folder",
    category: "Tags",
    name: "Add Tag Folder",
    path: "/tags/add_tag_folder",
    operation: "write",
    description: "Creates a tag folder.",
  },
  {
    key: "tags.delete_tag",
    category: "Tags",
    name: "Delete Tag",
    path: "/tags/delete_tag",
    operation: "write",
    description: "Removes a tag.",
  },
  {
    key: "tags.delete_tag_folder",
    category: "Tags",
    name: "Delete Tag Folder",
    path: "/tags/delete_tag_folder",
    operation: "write",
    description: "Removes a tag folder.",
  },
  {
    key: "tags.assign",
    category: "Tags",
    name: "Assign Tag",
    path: "/tags/assign",
    operation: "write",
    description: "Assigns a tag to a person.",
  },
  {
    key: "tags.unassign",
    category: "Tags",
    name: "Unassign Tag",
    path: "/tags/unassign",
    operation: "write",
    description: "Removes a tag from a person.",
  },

  // ---- Events ------------------------------------------------------------
  {
    key: "events.list",
    category: "Events",
    name: "List Events",
    path: "/events",
    operation: "read",
    description: "Calendar events for a date range.",
    usedBy: "Volunteer schedule on /schedule",
    probe: { needs: "date_range" },
  },
  {
    key: "events.show",
    category: "Events",
    name: "Show Event",
    path: "/events/list_event",
    operation: "read",
    description: "A single event instance.",
    probe: { needs: "instance_id" },
  },
  {
    key: "events.calendars",
    category: "Events",
    name: "List Calendars",
    path: "/events/calendars/list",
    operation: "read",
    description: "The account's calendars.",
    probe: {},
  },
  {
    key: "events.locations",
    category: "Events",
    name: "List Locations",
    path: "/events/locations",
    operation: "read",
    description: "Event locations.",
    probe: {},
  },
  {
    key: "events.add",
    category: "Events",
    name: "Add Event",
    path: "/events/add",
    operation: "write",
    description: "Creates a calendar event.",
  },
  {
    key: "events.delete",
    category: "Events",
    name: "Delete Event",
    path: "/events/delete",
    operation: "write",
    description: "Removes a calendar event.",
  },

  // ---- Check In (attendance) --------------------------------------------
  {
    key: "attendance.list",
    category: "Check In",
    name: "List Attendance",
    path: "/events/attendance/list",
    operation: "read",
    description: "Attendance records for an event instance.",
    probe: { needs: "instance_id" },
  },
  {
    key: "attendance.eligible",
    category: "Check In",
    name: "List Eligible People",
    path: "/events/attendance/eligible",
    operation: "read",
    description: "People eligible to check in to an event instance.",
    probe: { needs: "instance_id" },
  },
  {
    key: "attendance.add",
    category: "Check In",
    name: "Add Attendance",
    path: "/events/attendance/add",
    operation: "write",
    description: "Checks a person in to an event.",
  },
  {
    key: "attendance.delete",
    category: "Check In",
    name: "Remove Attendance",
    path: "/events/attendance/delete",
    operation: "write",
    description: "Removes an attendance record.",
  },

  // ---- Volunteers --------------------------------------------------------
  {
    key: "volunteers.list",
    category: "Volunteers",
    name: "List Volunteers",
    path: "/volunteers/list",
    operation: "read",
    description: "Volunteers scheduled for an event instance, with reply status.",
    usedBy: "Volunteer schedule on /schedule",
    probe: { needs: "instance_id" },
  },
  {
    key: "volunteers.list_roles",
    category: "Volunteers",
    name: "List Volunteer Roles",
    path: "/volunteers/list_roles",
    operation: "read",
    description: "Volunteer roles defined on an event instance.",
    usedBy: "Volunteer schedule on /schedule",
    probe: { needs: "instance_id", params: { show_quantity: "1" } },
  },
  {
    key: "volunteers.add",
    category: "Volunteers",
    name: "Add Volunteer",
    path: "/volunteers/add",
    operation: "write",
    description: "Schedules a person as a volunteer on an event.",
  },
  {
    key: "volunteers.remove",
    category: "Volunteers",
    name: "Remove Volunteer",
    path: "/volunteers/remove",
    operation: "write",
    description: "Unschedules a volunteer from an event.",
  },
  {
    key: "volunteers.update",
    category: "Volunteers",
    name: "Update Volunteer",
    path: "/volunteers/update",
    operation: "write",
    description: "Changes a volunteer's roles on an event.",
  },
  {
    key: "volunteers.add_role",
    category: "Volunteers",
    name: "Add Volunteer Role",
    path: "/volunteers/add_role",
    operation: "write",
    description: "Creates a volunteer role on an event.",
  },
  {
    key: "volunteers.remove_role",
    category: "Volunteers",
    name: "Remove Volunteer Role",
    path: "/volunteers/remove_role",
    operation: "write",
    description: "Deletes a volunteer role from an event.",
  },

  // ---- Forms -------------------------------------------------------------
  {
    key: "forms.list",
    category: "Forms",
    name: "List Forms",
    path: "/forms/list_forms",
    operation: "read",
    description: "All forms in the account.",
    probe: {},
  },
  {
    key: "forms.fields",
    category: "Forms",
    name: "List Form Fields",
    path: "/forms/list_form_fields",
    operation: "read",
    description: "Field definitions for a form.",
    probe: { needs: "form_id" },
  },
  {
    key: "forms.entries",
    category: "Forms",
    name: "List Form Entries",
    path: "/forms/list_form_entries",
    operation: "read",
    description: "Submissions to a form (can include personal details).",
    probe: { needs: "form_id" },
  },
  {
    key: "forms.remove_entry",
    category: "Forms",
    name: "Remove Form Entry",
    path: "/forms/remove_form_entry",
    operation: "write",
    description: "Deletes a form submission.",
  },

  // ---- Families ----------------------------------------------------------
  {
    key: "families.create",
    category: "Families",
    name: "Create Family",
    path: "/families/create",
    operation: "write",
    description: "Links existing profiles into a new family.",
  },
  {
    key: "families.destroy",
    category: "Families",
    name: "Destroy Family",
    path: "/families/destroy",
    operation: "write",
    description: "Unlinks all members of a family.",
  },
  {
    key: "families.add",
    category: "Families",
    name: "Add to Family",
    path: "/families/add",
    operation: "write",
    description: "Adds a person to an existing family.",
  },
  {
    key: "families.remove",
    category: "Families",
    name: "Remove from Family",
    path: "/families/remove",
    operation: "write",
    description: "Removes a person from a family.",
  },

  // ---- Giving (undocumented but reachable by every API key) ---------------
  {
    key: "giving.list",
    category: "Giving",
    name: "List Contributions",
    path: "/giving/list",
    operation: "read",
    sensitive: true,
    description: "Contribution records - amounts, donors, methods. Most sensitive read in the API.",
    probe: { needs: "date_range" },
  },
  {
    key: "giving.add",
    category: "Giving",
    name: "Add Contribution",
    path: "/giving/add",
    operation: "write",
    sensitive: true,
    description: "Records a contribution.",
  },
  {
    key: "giving.edit",
    category: "Giving",
    name: "Edit Contribution",
    path: "/giving/edit",
    operation: "write",
    sensitive: true,
    description: "Modifies a contribution record.",
  },
  {
    key: "giving.delete",
    category: "Giving",
    name: "Delete Contribution",
    path: "/giving/delete",
    operation: "write",
    sensitive: true,
    description: "Deletes a contribution record.",
  },
  {
    key: "funds.list",
    category: "Giving",
    name: "List Funds",
    path: "/funds/list",
    operation: "read",
    sensitive: true,
    description: "Giving funds (optionally with totals).",
    probe: {},
  },
  {
    key: "pledges.list_campaigns",
    category: "Giving",
    name: "List Pledge Campaigns",
    path: "/pledges/list_campaigns",
    operation: "read",
    sensitive: true,
    description: "Pledge campaigns.",
    probe: {},
  },
  {
    key: "pledges.list_pledges",
    category: "Giving",
    name: "List Pledges",
    path: "/pledges/list_pledges",
    operation: "read",
    sensitive: true,
    description: "Pledges within a campaign.",
    probe: { needs: "campaign_id" },
  },

  // ---- Account -----------------------------------------------------------
  {
    key: "account.summary",
    category: "Account",
    name: "Account Summary",
    path: "/account/summary",
    operation: "read",
    description: "Account name, subdomain, and enabled features. Harmless - used as the key health check.",
    probe: {},
  },
  {
    key: "account.log",
    category: "Account",
    name: "Account Log",
    path: "/account/list_log",
    operation: "read",
    description: "Breeze's own action log (who changed what inside Breeze).",
    probe: { params: { action: "person_updated" } },
  },
];

export const BREEZE_ENDPOINT_KEYS = BREEZE_ENDPOINTS.map((e) => e.key);

export const BREEZE_ENDPOINTS_BY_KEY = new Map(
  BREEZE_ENDPOINTS.map((e) => [e.key, e])
);

/** Endpoints the app actively depends on - seeded as allowed in the migration. */
export const BREEZE_KEYS_IN_USE = BREEZE_ENDPOINTS.filter((e) => e.usedBy).map(
  (e) => e.key
);

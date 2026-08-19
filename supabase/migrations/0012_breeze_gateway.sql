-- Breeze API gateway: per-endpoint permissions + master switch
-- Run after 0011_audit_and_approval.sql.
--
-- Breeze API keys carry no permissions on Breeze's side - one key can read
-- and write the entire account, including giving records. This migration adds
-- the app-side gate:
--   1. breeze_gateway_settings - single row, master on/off for all Breeze
--      traffic from this app.
--   2. breeze_endpoint_permissions - one row per Breeze endpoint (the catalog
--      lives in lib/breeze-endpoints.ts); a missing or false row means the
--      endpoint is blocked. Ten read endpoints are seeded as allowed: the
--      four the app uses today plus the six reads Nathan approved on
--      2026-08-18 (events.show/calendars/locations, tags.list_tags/
--      list_folders, account.summary).
--   3. set_breeze_access() RPC - the only write path. Super-admin only, and
--      every change lands in audit_log as an admin_action.
-- Enforcement happens in lib/breeze.ts before any request leaves the server;
-- these tables are the state it checks.

-- ---------------------------------------------------------------------------
-- 1. master switch
-- ---------------------------------------------------------------------------
create table if not exists public.breeze_gateway_settings (
  id         smallint primary key default 1 check (id = 1),
  enabled    boolean not null default true,
  updated_at timestamptz not null default now()
);

insert into public.breeze_gateway_settings (id, enabled)
values (1, true)
on conflict (id) do nothing;

alter table public.breeze_gateway_settings enable row level security;

-- Every approved user's server session reads this on Breeze-backed pages.
drop policy if exists "breeze_settings_select" on public.breeze_gateway_settings;
create policy "breeze_settings_select"
  on public.breeze_gateway_settings for select to authenticated
  using (public.is_approved());

-- No insert/update/delete policies: writes go through set_breeze_access().

-- ---------------------------------------------------------------------------
-- 2. per-endpoint permissions
-- ---------------------------------------------------------------------------
create table if not exists public.breeze_endpoint_permissions (
  endpoint_key text primary key,
  allowed      boolean not null default false,
  updated_at   timestamptz not null default now()
);

alter table public.breeze_endpoint_permissions enable row level security;

drop policy if exists "breeze_permissions_select" on public.breeze_endpoint_permissions;
create policy "breeze_permissions_select"
  on public.breeze_endpoint_permissions for select to authenticated
  using (public.is_approved());

-- Seed the full catalog (keys mirror lib/breeze-endpoints.ts). Everything is
-- blocked except the reads the app already depends on, plus the reads Nathan
-- approved on 2026-08-18 (event show/calendars/locations, tag lists,
-- account summary).
insert into public.breeze_endpoint_permissions (endpoint_key, allowed) values
  -- People
  ('people.list',            true),
  ('people.show',            false),
  ('people.profile_fields',  false),
  ('people.add',             false),
  ('people.update',          false),
  ('people.delete',          false),
  -- Tags
  ('tags.list_tags',         true),
  ('tags.list_folders',      true),
  ('tags.add_tag',           false),
  ('tags.add_tag_folder',    false),
  ('tags.delete_tag',        false),
  ('tags.delete_tag_folder', false),
  ('tags.assign',            false),
  ('tags.unassign',          false),
  -- Events
  ('events.list',            true),
  ('events.show',            true),
  ('events.calendars',       true),
  ('events.locations',       true),
  ('events.add',             false),
  ('events.delete',          false),
  -- Check In
  ('attendance.list',        false),
  ('attendance.eligible',    false),
  ('attendance.add',         false),
  ('attendance.delete',      false),
  -- Volunteers
  ('volunteers.list',        true),
  ('volunteers.list_roles',  true),
  ('volunteers.add',         false),
  ('volunteers.remove',      false),
  ('volunteers.update',      false),
  ('volunteers.add_role',    false),
  ('volunteers.remove_role', false),
  -- Forms
  ('forms.list',             false),
  ('forms.fields',           false),
  ('forms.entries',          false),
  ('forms.remove_entry',     false),
  -- Families
  ('families.create',        false),
  ('families.destroy',       false),
  ('families.add',           false),
  ('families.remove',        false),
  -- Giving (financially sensitive; keep blocked unless a feature needs it)
  ('giving.list',            false),
  ('giving.add',             false),
  ('giving.edit',            false),
  ('giving.delete',          false),
  ('funds.list',             false),
  ('pledges.list_campaigns', false),
  ('pledges.list_pledges',   false),
  -- Account
  ('account.summary',        true),
  ('account.log',            false)
on conflict (endpoint_key) do nothing;

-- ---------------------------------------------------------------------------
-- 3. audited write path
-- ---------------------------------------------------------------------------
-- p_enabled: new master-switch value, or null to leave it alone.
-- p_permissions: jsonb object of endpoint_key -> boolean, or null for none.
-- Unknown endpoint keys are rejected so a typo can't silently create a
-- toggle that nothing enforces.
create or replace function public.set_breeze_access(
  p_enabled     boolean default null,
  p_permissions jsonb   default null
)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_key     text;
  v_allowed boolean;
  v_changed jsonb := '{}'::jsonb;
begin
  if not public.is_super_admin() then
    raise exception 'Only the super admin can change Breeze API access';
  end if;

  if p_enabled is not null then
    update public.breeze_gateway_settings
       set enabled = p_enabled, updated_at = now()
     where id = 1 and enabled is distinct from p_enabled;
    if found then
      v_changed := v_changed || jsonb_build_object('enabled', p_enabled);
    end if;
  end if;

  if p_permissions is not null then
    for v_key, v_allowed in
      select key, (value #>> '{}')::boolean from jsonb_each(p_permissions)
    loop
      update public.breeze_endpoint_permissions
         set allowed = v_allowed, updated_at = now()
       where endpoint_key = v_key and allowed is distinct from v_allowed;
      if found then
        v_changed := v_changed || jsonb_build_object(v_key, v_allowed);
      elsif not exists (
        select 1 from public.breeze_endpoint_permissions where endpoint_key = v_key
      ) then
        raise exception 'Unknown Breeze endpoint key: %', v_key;
      end if;
    end loop;
  end if;

  if v_changed <> '{}'::jsonb then
    insert into public.audit_log (user_id, email, event, target, detail)
    values (
      auth.uid(),
      lower(coalesce(auth.jwt() ->> 'email', '')),
      'admin_action',
      'set_breeze_access',
      v_changed
    );
  end if;
end;
$$;

grant execute on function public.set_breeze_access(boolean, jsonb) to authenticated;

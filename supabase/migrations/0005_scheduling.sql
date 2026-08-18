-- Serve Team Scheduling
-- ---------------------
-- Rotational scheduling for CrossBridge serve teams (Deacons first, then
-- Safety & Security, later Sound Tech via a Breeze tie-in).
--
-- What it creates:
--   teams                     serve teams (Deacons, Safety & Security, ...)
--   schedule_roles            per-team roles with a category that drives the
--                             pairing rules (opening/closing/speaking/reserve)
--   people                    schedulable people; optionally linked to a
--                             login by email and to Breeze by breeze_person_id
--   team_members              which people serve on which teams
--   blackout_dates            self-service "I'm not available" date ranges
--   assignments               one person in one role on one service date
--   assignment_confirmations  tokenized availability-poll responses (email)
--   email_log                 audit trail of reminder/poll sends
--
-- Reads are open to all signed-in users; writes are admin-only except a
-- person's own blackout dates (matched to their login email). Availability
-- polls answer through security-definer functions so the email link works
-- without signing in.

-- ---------------------------------------------------------------------------
-- helper: app admin = profiles.role of 'admin' OR the super admin
-- ---------------------------------------------------------------------------
create or replace function public.is_app_admin()
returns boolean
language sql
security definer set search_path = public
stable
as $$
  select public.is_super_admin()
      or exists (
        select 1 from public.profiles p
        where p.id = auth.uid() and p.role = 'admin'
      );
$$;

grant execute on function public.is_app_admin() to authenticated;

-- ---------------------------------------------------------------------------
-- teams
-- ---------------------------------------------------------------------------
create table if not exists public.teams (
  id          uuid primary key default gen_random_uuid(),
  slug        text not null unique,
  name        text not null,
  active      boolean not null default true,
  sort_order  integer not null default 0,
  created_at  timestamptz not null default now()
);

alter table public.teams enable row level security;

drop policy if exists "teams_select_authenticated" on public.teams;
create policy "teams_select_authenticated"
  on public.teams for select to authenticated
  using (true);

drop policy if exists "teams_write_admin" on public.teams;
create policy "teams_write_admin"
  on public.teams for all to authenticated
  using (public.is_app_admin())
  with check (public.is_app_admin());

-- ---------------------------------------------------------------------------
-- schedule_roles
-- ---------------------------------------------------------------------------
-- category drives the scheduling rules:
--   opening / closing  bookend roles; one person never takes both in a week,
--                      but pairing one of them with a speaking role is a goal
--   speaking           Call to Worship, Missions Spotlight; max one per
--                      person per week
--   reserve            backup for the speaking roles; may also take an
--                      opening/closing slot that week but never a speaking one
--   general            plain rotation slot (Safety & Security, Sound Tech)
create table if not exists public.schedule_roles (
  id          uuid primary key default gen_random_uuid(),
  team_id     uuid not null references public.teams (id) on delete cascade,
  slug        text not null,
  name        text not null,
  category    text not null default 'general'
              check (category in ('opening', 'closing', 'speaking', 'reserve', 'general')),
  sort_order  integer not null default 0,
  active      boolean not null default true,
  created_at  timestamptz not null default now(),
  unique (team_id, slug)
);

alter table public.schedule_roles enable row level security;

drop policy if exists "roles_select_authenticated" on public.schedule_roles;
create policy "roles_select_authenticated"
  on public.schedule_roles for select to authenticated
  using (true);

drop policy if exists "roles_write_admin" on public.schedule_roles;
create policy "roles_write_admin"
  on public.schedule_roles for all to authenticated
  using (public.is_app_admin())
  with check (public.is_app_admin());

-- ---------------------------------------------------------------------------
-- people
-- ---------------------------------------------------------------------------
-- Separate from auth.users/profiles because most serve-team members are
-- scheduled before they ever sign in. `email` links a person to their login
-- (for self-service blackout dates); `breeze_person_id` is reserved for the
-- future Breeze ChMS sync.
create table if not exists public.people (
  id                uuid primary key default gen_random_uuid(),
  full_name         text not null,
  email             text unique,
  breeze_person_id  text unique,
  active            boolean not null default true,
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now()
);

alter table public.people enable row level security;

drop policy if exists "people_select_authenticated" on public.people;
create policy "people_select_authenticated"
  on public.people for select to authenticated
  using (true);

drop policy if exists "people_write_admin" on public.people;
create policy "people_write_admin"
  on public.people for all to authenticated
  using (public.is_app_admin())
  with check (public.is_app_admin());

drop trigger if exists touch_people on public.people;
create trigger touch_people before update on public.people
  for each row execute function public.touch_updated_at();

-- ---------------------------------------------------------------------------
-- team_members
-- ---------------------------------------------------------------------------
create table if not exists public.team_members (
  id          uuid primary key default gen_random_uuid(),
  team_id     uuid not null references public.teams (id) on delete cascade,
  person_id   uuid not null references public.people (id) on delete cascade,
  created_at  timestamptz not null default now(),
  unique (team_id, person_id)
);

alter table public.team_members enable row level security;

drop policy if exists "members_select_authenticated" on public.team_members;
create policy "members_select_authenticated"
  on public.team_members for select to authenticated
  using (true);

drop policy if exists "members_write_admin" on public.team_members;
create policy "members_write_admin"
  on public.team_members for all to authenticated
  using (public.is_app_admin())
  with check (public.is_app_admin());

-- ---------------------------------------------------------------------------
-- blackout_dates
-- ---------------------------------------------------------------------------
-- Self-service: a signed-in user manages blackout ranges for the person row
-- whose email matches their login. Admins can manage anyone's.
create table if not exists public.blackout_dates (
  id          uuid primary key default gen_random_uuid(),
  person_id   uuid not null references public.people (id) on delete cascade,
  starts_on   date not null,
  ends_on     date not null,
  reason      text,
  created_at  timestamptz not null default now(),
  check (ends_on >= starts_on)
);

create index if not exists blackout_dates_person_idx
  on public.blackout_dates (person_id);

alter table public.blackout_dates enable row level security;

drop policy if exists "blackouts_select_authenticated" on public.blackout_dates;
create policy "blackouts_select_authenticated"
  on public.blackout_dates for select to authenticated
  using (true);

drop policy if exists "blackouts_write_own_or_admin" on public.blackout_dates;
create policy "blackouts_write_own_or_admin"
  on public.blackout_dates for all to authenticated
  using (
    public.is_app_admin()
    or exists (
      select 1 from public.people p
      where p.id = person_id
        and p.email is not null
        and lower(p.email) = lower(coalesce(auth.jwt() ->> 'email', ''))
    )
  )
  with check (
    public.is_app_admin()
    or exists (
      select 1 from public.people p
      where p.id = person_id
        and p.email is not null
        and lower(p.email) = lower(coalesce(auth.jwt() ->> 'email', ''))
    )
  );

-- ---------------------------------------------------------------------------
-- assignments
-- ---------------------------------------------------------------------------
create table if not exists public.assignments (
  id            uuid primary key default gen_random_uuid(),
  team_id       uuid not null references public.teams (id) on delete cascade,
  role_id       uuid not null references public.schedule_roles (id) on delete cascade,
  person_id     uuid references public.people (id) on delete set null,
  service_date  date not null,
  status        text not null default 'scheduled'
                check (status in ('scheduled', 'confirmed', 'declined')),
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now(),
  unique (role_id, service_date)
);

create index if not exists assignments_team_date_idx
  on public.assignments (team_id, service_date);
create index if not exists assignments_person_idx
  on public.assignments (person_id);

alter table public.assignments enable row level security;

drop policy if exists "assignments_select_authenticated" on public.assignments;
create policy "assignments_select_authenticated"
  on public.assignments for select to authenticated
  using (true);

drop policy if exists "assignments_write_admin" on public.assignments;
create policy "assignments_write_admin"
  on public.assignments for all to authenticated
  using (public.is_app_admin())
  with check (public.is_app_admin());

drop trigger if exists touch_assignments on public.assignments;
create trigger touch_assignments before update on public.assignments
  for each row execute function public.touch_updated_at();

-- ---------------------------------------------------------------------------
-- assignment_confirmations
-- ---------------------------------------------------------------------------
-- One row per availability-poll email. The emailed link carries the token;
-- responding flips the parent assignment to confirmed/declined via the
-- security-definer functions below, so no login is required.
create table if not exists public.assignment_confirmations (
  id             uuid primary key default gen_random_uuid(),
  assignment_id  uuid not null references public.assignments (id) on delete cascade,
  token          uuid not null unique default gen_random_uuid(),
  sent_at        timestamptz,
  responded_at   timestamptz,
  response       text check (response in ('yes', 'no')),
  created_at     timestamptz not null default now()
);

create index if not exists confirmations_assignment_idx
  on public.assignment_confirmations (assignment_id);

alter table public.assignment_confirmations enable row level security;

drop policy if exists "confirmations_admin" on public.assignment_confirmations;
create policy "confirmations_admin"
  on public.assignment_confirmations for all to authenticated
  using (public.is_app_admin())
  with check (public.is_app_admin());

-- Look up what a poll token refers to (safe to expose: no email addresses).
create or replace function public.confirmation_details(p_token uuid)
returns table (
  person_name  text,
  role_name    text,
  team_name    text,
  service_date date,
  response     text,
  responded_at timestamptz
)
language sql
security definer set search_path = public
stable
as $$
  select p.full_name, r.name, t.name, a.service_date, c.response, c.responded_at
  from public.assignment_confirmations c
  join public.assignments a on a.id = c.assignment_id
  join public.schedule_roles r on r.id = a.role_id
  join public.teams t on t.id = a.team_id
  left join public.people p on p.id = a.person_id
  where c.token = p_token;
$$;

-- Record a yes/no response and update the assignment status to match.
create or replace function public.respond_to_confirmation(p_token uuid, p_response text)
returns boolean
language plpgsql
security definer set search_path = public
as $$
declare
  v_assignment uuid;
begin
  if p_response not in ('yes', 'no') then
    raise exception 'response must be yes or no';
  end if;

  update public.assignment_confirmations
     set response = p_response, responded_at = now()
   where token = p_token
   returning assignment_id into v_assignment;

  if v_assignment is null then
    return false;
  end if;

  update public.assignments
     set status = case when p_response = 'yes' then 'confirmed' else 'declined' end
   where id = v_assignment;

  return true;
end;
$$;

grant execute on function public.confirmation_details(uuid) to anon, authenticated;
grant execute on function public.respond_to_confirmation(uuid, text) to anon, authenticated;

-- ---------------------------------------------------------------------------
-- email_log
-- ---------------------------------------------------------------------------
create table if not exists public.email_log (
  id             uuid primary key default gen_random_uuid(),
  kind           text not null check (kind in ('reminder', 'availability_poll')),
  to_email       text not null,
  assignment_id  uuid references public.assignments (id) on delete set null,
  status         text not null check (status in ('sent', 'skipped_unconfigured', 'error')),
  detail         text,
  created_at     timestamptz not null default now()
);

alter table public.email_log enable row level security;

drop policy if exists "email_log_admin" on public.email_log;
create policy "email_log_admin"
  on public.email_log for all to authenticated
  using (public.is_app_admin())
  with check (public.is_app_admin());

-- ---------------------------------------------------------------------------
-- seed data — teams, deacon roles, deacons
-- ---------------------------------------------------------------------------
insert into public.teams (slug, name, active, sort_order) values
  ('safety-security', 'Safety & Security', true, 1),
  ('deacons',         'Deacons',           true, 2),
  ('sound-tech',      'Sound Tech',        false, 3)  -- enabled once Breeze is wired up
on conflict (slug) do nothing;

insert into public.schedule_roles (team_id, slug, name, category, sort_order)
select t.id, r.slug, r.name, r.category, r.sort_order
from public.teams t
cross join (values
  ('opening',            'Opening Deacon',            'opening',  1),
  ('call-to-worship',    'Call To Worship Deacon',    'speaking', 2),
  ('missions-spotlight', 'Missions Spotlight Deacon', 'speaking', 3),
  ('reserve',            'Reserve Deacon',            'reserve',  4),
  ('closing',            'Closing Deacon',            'closing',  5)
) as r (slug, name, category, sort_order)
where t.slug = 'deacons'
on conflict (team_id, slug) do nothing;

-- Default Safety & Security rotation slots — rename/add in the admin UI.
insert into public.schedule_roles (team_id, slug, name, category, sort_order)
select t.id, r.slug, r.name, 'general', r.sort_order
from public.teams t
cross join (values
  ('safety-lead', 'Safety Lead', 1),
  ('safety-team', 'Safety Team', 2)
) as r (slug, name, sort_order)
where t.slug = 'safety-security'
on conflict (team_id, slug) do nothing;

-- Deacons (emails other than Nathan's get linked later in the admin UI).
insert into public.people (full_name, email)
select v.full_name, v.email
from (values
  ('Nathan Tschetter',   'natecards@gmail.com'),
  ('Carlos Urquilla',    null),
  ('Dave Takseraas',     null),
  ('Juan Carlos Pinilla', null),
  ('Akbar Vanterpool',   null)
) as v (full_name, email)
where not exists (
  select 1 from public.people p where p.full_name = v.full_name
);

insert into public.team_members (team_id, person_id)
select t.id, p.id
from public.teams t
join public.people p on p.full_name in (
  'Nathan Tschetter', 'Carlos Urquilla', 'Dave Takseraas',
  'Juan Carlos Pinilla', 'Akbar Vanterpool'
)
where t.slug = 'deacons'
on conflict (team_id, person_id) do nothing;

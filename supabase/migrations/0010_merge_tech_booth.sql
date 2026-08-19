-- Merge Slides / Lights back into one "Tech Booth" pill (reverses FR-033 / 0007)
-- ---------------------------------------------------------------------------
-- FR-033 split Slides / Lights into its own team because a single team couldn't
-- express that the sound board and slides/lights draw from different operators.
-- Per-person role capabilities (person_roles, migrations 0008-0009) now solve
-- that directly: one team can hold both roles and the capability checkboxes
-- decide who runs which position. So collapse the two pills back into one.
--
-- The Sound Tech team is renamed "Tech Booth" and absorbs the Slides / Lights
-- Operator role, its assignments, and its roster; the now-empty Slides / Lights
-- team is removed. The team slug stays `sound-tech` (nothing user-facing keys
-- off it, and the training catalog's separate `sound-tech` program is
-- unaffected). Role IDs are unchanged, so existing person_roles capabilities
-- carry over untouched.

begin;

-- 1. Rename the surviving team to reflect both booth positions.
update public.teams
   set name = 'Tech Booth'
 where slug = 'sound-tech';

-- 2. Move the Slides / Lights Operator role back under Tech Booth.
update public.schedule_roles r
   set team_id = t_sound.id,
       sort_order = 2
  from public.teams t_sound, public.teams t_sl
 where t_sound.slug = 'sound-tech'
   and t_sl.slug = 'slides-lights'
   and r.team_id = t_sl.id
   and r.slug = 'slides-lights-operator';

-- 3. Re-home that role's assignments (assignments carry a denormalized team_id).
update public.assignments a
   set team_id = r.team_id
  from public.schedule_roles r
 where r.id = a.role_id
   and a.team_id <> r.team_id;

-- 4. Fold the Slides / Lights roster into Tech Booth (union; keep everyone).
insert into public.team_members (team_id, person_id)
select t_sound.id, tm.person_id
from public.team_members tm
join public.teams t_sl on t_sl.id = tm.team_id and t_sl.slug = 'slides-lights'
cross join public.teams t_sound
where t_sound.slug = 'sound-tech'
on conflict (team_id, person_id) do nothing;

-- 5. Remove the now-empty Slides / Lights team so it stops showing as a pill.
--    Its role and assignments moved to Tech Booth above; the only children left
--    are its redundant team_members rows (those people are now on Tech Booth),
--    which cascade away with the team.
delete from public.teams where slug = 'slides-lights';

commit;

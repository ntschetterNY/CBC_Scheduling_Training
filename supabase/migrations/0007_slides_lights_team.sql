-- Slides / Lights as its own serve team (FR-033)
-- ----------------------------------------------
-- The tech booth positions rotate independently: the sound board has its own
-- pool of trained operators, and slides/lights can draw from a wider roster.
-- Split the Slides / Lights Operator role out of Sound Tech into a new team so
-- it gets its own pill, roster, and rotation on the schedule pages.
--
-- Existing slides/lights assignments move with the role, and the Sound Tech
-- roster is copied to the new team so those assignments keep rendering;
-- prune either roster in the admin UI afterward.

insert into public.teams (slug, name, active, sort_order)
values ('slides-lights', 'Slides / Lights', true, 4)
on conflict (slug) do nothing;

-- Move the role from Sound Tech to the new team.
update public.schedule_roles r
   set team_id = t_new.id,
       sort_order = 1
  from public.teams t_new,
       public.teams t_old
 where t_new.slug = 'slides-lights'
   and t_old.slug = 'sound-tech'
   and r.team_id = t_old.id
   and r.slug = 'slides-lights-operator';

-- Re-home the role's assignments (assignments carry a denormalized team_id).
update public.assignments a
   set team_id = r.team_id
  from public.schedule_roles r
 where r.id = a.role_id
   and a.team_id <> r.team_id;

-- Copy the Sound Tech roster so existing slides/lights picks stay selectable.
insert into public.team_members (team_id, person_id)
select t_new.id, tm.person_id
from public.team_members tm
join public.teams t_old on t_old.id = tm.team_id and t_old.slug = 'sound-tech'
cross join public.teams t_new
where t_new.slug = 'slides-lights'
on conflict (team_id, person_id) do nothing;

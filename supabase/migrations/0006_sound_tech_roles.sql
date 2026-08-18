-- Sound Tech roles + activation
-- -----------------------------
-- The tech booth splits into two positions each Sunday: one person on the
-- sound board and one running slides and lights. Seed both as plain-rotation
-- roles and turn the Sound Tech team on so it shows up on the schedule pages.
-- (The roster is managed by hand in the admin UI until the Breeze sync lands.)

insert into public.schedule_roles (team_id, slug, name, category, sort_order)
select t.id, r.slug, r.name, 'general', r.sort_order
from public.teams t
cross join (values
  ('sound-operator',         'Sound Operator',           1),
  ('slides-lights-operator', 'Slides / Lights Operator', 2)
) as r (slug, name, sort_order)
where t.slug = 'sound-tech'
on conflict (team_id, slug) do nothing;

update public.teams
   set active = true
 where slug = 'sound-tech'
   and active = false;

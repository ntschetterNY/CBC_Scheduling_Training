# CrossBridge Sound Tech Training — SQ-6

An interactive training program that takes CrossBridge volunteers from their
first look at the board to confidently mixing a Sunday service on the
**Allen & Heath SQ-6** digital console.

- **Interactive lessons** — step-by-step walkthroughs for every core skill,
  with EQ/compression charts and diagrams for visual learners
- **Interactive SQ-6 Guide** — learn the console surface region by region, with
  a jump straight to the module that covers each part
- **Searchable knowledge base** — type a live problem ("blue mic static", "no
  sound") and jump to the module that answers it
- **Knowledge-check quizzes** — 70% to complete each module
- **Accounts & progress tracking** — sign in and pick up where you left off
- **Admin view** — leads see the whole team's progress; the super admin also
  sees time-on-task analytics and manages admins from the app

Built with **Next.js (App Router)** + **Supabase** and designed to deploy to
**Vercel**.

---

## 1. Prerequisites

- Node.js 18.18+ (Node 20+ recommended)
- A free [Supabase](https://supabase.com) project
- A [Vercel](https://vercel.com) account (for hosting)

## 2. Set up Supabase

1. Create a new project at [supabase.com](https://supabase.com).
2. Open **SQL Editor** and run the migrations in order:
   [`supabase/migrations/0001_init.sql`](supabase/migrations/0001_init.sql)
   (creates the `profiles` and `module_progress` tables, row-level security
   policies, and the profile-on-signup trigger), then
   [`supabase/migrations/0002_admin_analytics.sql`](supabase/migrations/0002_admin_analytics.sql)
   (adds time-on-task tracking columns, the `add_module_time` RPC, and the
   super-admin policies). If you want to be the super admin, edit the email in
   both `0002_admin_analytics.sql` (`is_super_admin()`) and
   [`lib/access.ts`](lib/access.ts) (`SUPER_ADMIN_EMAILS`) before running.
3. In **Project Settings → API**, copy your **Project URL** and **anon public
   key**.
4. *(Recommended)* In **Authentication → Providers → Email**, uncheck
   **"Confirm email"**. Password sign-in never sends email, so unchecking this
   keeps you clear of the 2-emails-per-hour limit entirely and new accounts go
   straight into the app.

### Login

Login is **email + password** — nothing else to set up. A signed-in user goes
straight to the dashboard; middleware bounces anyone not signed in to `/login`.

> **Roadmap:** the authenticator-app (TOTP) second factor has been removed for
> now. The plan is to add a **magic-link email from CrossBridge** as the login
> method later; when that lands, this section will document it.

### Make yourself an admin

There are two levels:

- **Super admin** — that's you, the person whose email is listed in
  `SUPER_ADMIN_EMAILS` (`lib/access.ts`) and `is_super_admin()`
  (`0002_admin_analytics.sql`). No table edit needed — it's email-based, so you
  get it automatically on your first sign-in. The super admin sees **Time
  Analytics** (time spent per person on each module and each test) and the
  **Users** directory.
- **Admins** — everyone else you promote. Once you're the super admin, open the
  **Users** page in the app and click **Make admin** next to anyone. They then
  get the **Team Progress** view. No Supabase editing required — it's all in the
  UI. (You can still promote via **Table Editor → `profiles`** if you prefer.)

## 3. Run locally

```bash
cp .env.local.example .env.local   # then fill in your Supabase values
npm install
npm run dev
```

Visit http://localhost:3000.

`.env.local` needs:

```
NEXT_PUBLIC_SUPABASE_URL=https://YOUR-PROJECT-ref.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-public-key
```

## 4. Deploy to Vercel

1. Push this repo to GitHub (already done if you're reading this there).
2. In Vercel, **New Project → Import** this repository. Vercel auto-detects
   Next.js — no build config needed.
3. Add the two environment variables from step 2 under
   **Settings → Environment Variables** (`NEXT_PUBLIC_SUPABASE_URL` and
   `NEXT_PUBLIC_SUPABASE_ANON_KEY`).
4. Deploy. 🎉
5. Back in Supabase, set your Vercel URL as the **Site URL** under
   **Authentication → URL Configuration** so the project points at the right
   host. Email + password login needs no extra redirect setup.

---

## Editing the training content

All lessons and quizzes live in one file:
[`lib/curriculum.ts`](lib/curriculum.ts).

- **Edit a lesson** — change the `body` / `tip` text of a section.
- **Add a module** — append a new object to the `curriculum` array. The
  dashboard, module list, quizzes, and admin grid pick it up automatically.
- **`[CrossBridge]` notes** flag places to drop in details specific to our
  house system — layer layout, SoftKey assignments, color coding, power
  sequence, Scene policy.

### Bringing in the PDFs

The starter content is accurate general SQ-6 operation. To match it to our
exact system outline from the training PDFs:

1. Replace or expand the `body` text in the relevant module sections with our
   house specifics.
2. Fill in every `[CrossBridge]` note.
3. Optionally add a module (e.g., "Our Input List & Stage Plot") following the
   same structure.

If you'd like the PDFs turned into modules automatically, share them and we
can generate the sections and quizzes from their content.

---

## Feature Request tracker (Feedback page)

Signed-in users get a **Feedback** page (`/feature-requests`) where they can
file a feature request or bug report — with screenshots — straight from the
app. Each submission opens a **GitHub issue** (labelled `feature-request`) in
the repo, and the page lists the open and closed requests read back from
GitHub. A maintainer or the person who filed it can comment **`/close`** on the
issue to close it (handled by `.github/workflows/close-on-comment.yml`).

To turn it on:

1. **Create the storage bucket.** Run the migration
   [`supabase/migrations/0003_feature_requests.sql`](supabase/migrations/0003_feature_requests.sql)
   in the Supabase SQL Editor. It creates a public `feature-request-photos`
   bucket (so GitHub can render the embedded screenshots) and lets signed-in
   users upload to it.
2. **Add a GitHub token.** Create a Personal Access Token with **Issues:
   read & write** on this repo (classic scope `repo`, or a fine-grained token
   scoped to Issues), then set two environment variables (locally in
   `.env.local`, and in Vercel under **Settings → Environment Variables**):

   ```
   GITHUB_TOKEN=github_pat_xxxxxxxx      # server-side only — never NEXT_PUBLIC
   GITHUB_REPO=ntschetterNY/CBC_Scheduling_Training
   ```

Until `GITHUB_TOKEN` is set the page shows a "not connected yet" notice and the
form is disabled — everything else in the app keeps working. Photos are
uploaded from the browser to Supabase Storage; only their public URLs (from
that one bucket) are sent to the server, which opens the issue with the token.

## Serve Team Scheduling

Rotational Sunday scheduling for serve teams - the Deacons (five roles, five
deacons), Safety & Security, Sound Tech, and Slides / Lights.

1. Run [`supabase/migrations/0005_scheduling.sql`](supabase/migrations/0005_scheduling.sql)
   in the Supabase SQL Editor (tables + RLS, seeds the teams, the five deacon
   roles, and the five deacons), then
   [`0006_sound_tech_roles.sql`](supabase/migrations/0006_sound_tech_roles.sql)
   and [`0007_slides_lights_team.sql`](supabase/migrations/0007_slides_lights_team.sql)
   (activate Sound Tech and split Slides / Lights into its own team). Then run
   [`0008_role_capabilities.sql`](supabase/migrations/0008_role_capabilities.sql)
   (per-person role capabilities) and
   [`0009_sync_deactivation_flag.sql`](supabase/migrations/0009_sync_deactivation_flag.sql)
   (marks sync-driven deactivations apart from manual pauses).
2. Visit **/admin/schedule** (admins only) to manage rosters/roles and
   generate a rotation. Everyone can view **/schedule** and manage their own
   blackout dates at **/schedule/availability** (their login email must be on
   their roster entry — set it from the admin page).

The generator (in `lib/scheduling/engine.ts`) balances load evenly using the
last six months of history and honors blackout dates. It also enforces per-role
capabilities set from the admin roster: once anyone is checked for a role, only
those people are eligible for it; a role with nobody checked stays open to every
member. For the deacons it also
enforces: never opening *and* closing for one person in a week, never two
speaking roles, the reserve deacon never speaks (they're the backup speaker,
though they may open or close), and it aims to pair each opening/closing slot
with one speaking slot.

### Email reminders & availability polls (Resend — prepped, dormant)

The notify flow works end-to-end today but skips actual delivery until the
Resend domain DNS is verified. Then set:

```
RESEND_API_KEY=re_...
SCHEDULE_FROM_EMAIL="CrossBridge Scheduling <scheduling@yourdomain.org>"
NEXT_PUBLIC_APP_URL=https://your-production-url
```

Polls email each person a tokenized yes/no link (`/schedule/confirm`) that
works without signing in and flips their assignment to confirmed/declined.
Every send (including skipped ones) is recorded in `email_log`.

### Breeze ChMS directory sync (read-only)

`lib/breeze.ts` imports the whole Breeze directory into the app's `people`
table as a **one-way, read-only** sync - the app never writes back to Breeze.
Breeze owns names and emails; team membership and role capabilities stay in the
app. Set both to enable it:

```
BREEZE_SUBDOMAIN=crossbridge        # crossbridge.breezechms.com
BREEZE_API_KEY=...
```

Until both are set, `isBreezeConfigured` is false and the sync panel is
disabled. The sync is manual and two-step from the Scheduling admin: **Preview
sync** dry-runs `planDirectoryImport` (one Breeze read, writes nothing) and
shows what would change; **Apply** recomputes against fresh Breeze data and
writes. People Breeze no longer lists are flagged inactive (never deleted, so
history is preserved) and reactivated automatically if Breeze lists them again;
a manual pause is left untouched. See `app/api/schedule/breeze/preview` and
`/apply`.

## Project structure

```
app/
  page.tsx              Landing page (public)
  login/                Sign in / create account
  dashboard/            Trainee home + progress
  learn/                Sound Tech module list
  learn/[slug]/         A single Sound Tech module (lessons + quiz)
  safety/               Safety & Security module list (draft track)
  safety/[slug]/        A single Safety & Security module (lessons + quiz)
  feature-requests/     Feedback page: file a request → opens a GitHub issue
  api/feature-requests/ Route handler that creates the GitHub issue
  schedule/             Serve schedule (all teams + "my assignments")
  schedule/availability Self-service blackout dates
  schedule/confirm      Tokenized availability-poll response (no login)
  api/schedule/         Route handlers: generate rotation, send notifications,
                        Breeze directory sync (breeze/preview + breeze/apply)
  admin/                Team progress (admins only)
  admin/schedule/       Scheduling admin: rosters, roles, generate, notify
  admin/analytics/      Time-on-task analytics (super admin only)
  admin/users/          User directory + admin seeding (super admin only)
  auth/signout/         Sign-out route handler
components/             UI: header, board explorer, module runner, quiz, auth form,
                        lesson visuals, knowledge search, user directory,
                        feature-request form
lib/
  curriculum.ts         ← Sound Tech training content lives here
  safety-curriculum.ts  Safety & Security track content (draft)
  access.ts             Super-admin list + time formatting helpers
  progress.ts           Progress fetch helpers
  github.ts             Server-only GitHub issue helpers (feature tracker)
  feature-requests.ts   Shared, non-secret tracker constants
  supabase/             Browser / server / middleware Supabase clients
  scheduling/           Fair-rotation engine + server helpers
  email.ts              Resend sending + templates (dormant until DNS)
  breeze.ts             Breeze ChMS client + read-only directory sync planner
supabase/migrations/    Database schema + RLS (run in numeric order; each
                        file's header comment says what it adds)
.github/                Issue template + /close-comment workflow
middleware.ts           Refreshes auth session, guards protected routes
```

## Notes

- The app renders and is navigable even before Supabase is configured; auth and
  progress features activate once the two env vars are set.
- Only the **anon** key is used in the app — never expose the service-role key
  to the browser.

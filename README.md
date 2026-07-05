# CrossBridge Sound Tech Training — SQ-6

An interactive training program that takes CrossBridge volunteers from their
first look at the board to confidently mixing a Sunday service on the
**Allen & Heath SQ-6** digital console.

- **Interactive lessons** — step-by-step walkthroughs for every core skill
- **Clickable Board Explorer** — learn the SQ-6 surface region by region
- **Knowledge-check quizzes** — 70% to complete each module
- **Accounts & progress tracking** — sign in and pick up where you left off
- **Admin view** — leads can see the whole team's progress

Built with **Next.js (App Router)** + **Supabase** and designed to deploy to
**Vercel**.

---

## 1. Prerequisites

- Node.js 18.18+ (Node 20+ recommended)
- A free [Supabase](https://supabase.com) project
- A [Vercel](https://vercel.com) account (for hosting)

## 2. Set up Supabase

1. Create a new project at [supabase.com](https://supabase.com).
2. Open **SQL Editor** and run the migration in
   [`supabase/migrations/0001_init.sql`](supabase/migrations/0001_init.sql).
   This creates the `profiles` and `module_progress` tables, row-level
   security policies, and the trigger that auto-creates a profile on signup.
3. In **Project Settings → API**, copy your **Project URL** and **anon public
   key**.
4. **Set up "Continue with Microsoft"** (recommended login). This is the
   primary, email-free way in — Microsoft handles identity **and** MFA, so
   Supabase never sends an email and you never hit its 2-emails-per-hour
   limit. See [Microsoft (Entra) sign-in](#microsoft-entra-sign-in) below for
   the one-time setup. The email + password form remains as a fallback.

### Microsoft (Entra) sign-in

"Continue with Microsoft" lets volunteers sign in with their Microsoft
account. Microsoft verifies who they are and enforces any MFA your
organization requires (Microsoft Authenticator, etc.). Supabase sends **no
email**, so the 2-emails-per-hour limit never applies. Set it up once:

1. **Register an app in Microsoft (Azure/Entra).** Go to the
   [Entra admin center](https://entra.microsoft.com) → **App registrations**
   → **New registration**.
   - Name it e.g. `CrossBridge Sound Training`.
   - **Supported account types:** pick who may sign in — "Accounts in this
     organizational directory only" (just your church tenant) is the most
     locked-down; a broader option lets any Microsoft account in.
   - **Redirect URI:** platform **Web**, value:
     `https://YOUR-PROJECT-ref.supabase.co/auth/v1/callback`
     (this is your Supabase callback, shown on the Azure provider page in
     step 3).
2. **Create a client secret.** In the app → **Certificates & secrets** →
   **New client secret**. Copy the secret **Value** (not the ID) now — it's
   only shown once. Also copy the **Application (client) ID** from the app's
   Overview page.
3. **Enable the provider in Supabase.** In your Supabase project →
   **Authentication → Providers → Azure**, toggle it on and paste:
   - **Application (client) ID** from step 2
   - **Secret Value** from step 2
   - **Azure Tenant URL** — use
     `https://login.microsoftonline.com/<TENANT_ID>` for a single tenant, or
     `https://login.microsoftonline.com/common` to allow any Microsoft
     account. Save.
4. **Set the redirect URLs.** In Supabase → **Authentication → URL
   Configuration**, set **Site URL** to your app's URL and add it (plus
   `http://localhost:3000` for local dev) to **Redirect URLs**. The app sends
   users to `/auth/callback` after Microsoft signs them in.

That's it — the **Continue with Microsoft** button on the login page now
works. New volunteers get a profile row created automatically on first
sign-in (see [Make yourself an admin](#make-yourself-an-admin) to grant admin).

### Make yourself an admin

After you sign in once, open **Table Editor → `profiles`**, find your row, and
change `role` from `trainee` to `admin`. You'll then see the **Team Progress**
tab.

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
5. Back in Supabase, add your Vercel URL to **Authentication → URL
   Configuration** (**Site URL** and **Redirect URLs**) so "Continue with
   Microsoft" redirects back to the deployed app — see
   [Microsoft (Entra) sign-in](#microsoft-entra-sign-in).

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

## Project structure

```
app/
  page.tsx              Landing page (public)
  login/                Sign in / create account
  dashboard/            Trainee home + progress
  learn/                Module list
  learn/[slug]/         A single module (lessons + quiz)
  admin/                Team progress (admins only)
  auth/signout/         Sign-out route handler
components/             UI: header, board explorer, module runner, quiz, auth form
lib/
  curriculum.ts         ← All training content lives here
  progress.ts           Progress fetch helpers
  supabase/             Browser / server / middleware Supabase clients
supabase/migrations/    Database schema + RLS
middleware.ts           Refreshes auth session, guards protected routes
```

## Notes

- The app renders and is navigable even before Supabase is configured; auth and
  progress features activate once the two env vars are set.
- Only the **anon** key is used in the app — never expose the service-role key
  to the browser.

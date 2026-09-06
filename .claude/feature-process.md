# Feature-request process (this repo)

How the CrossBridge Training Center backlog is worked. This is the repo-local
profile for the `process-feature-issues` skill; the generic pipeline (triage,
design reviews, honest verification) lives in the skill - this file holds the
conventions specific to this repo.

## Where requests live

Everything is a **GitHub Issue** on `ntschetterNY/CBC_Scheduling_Training`,
filed either from the in-app request dialog (`/feature-requests`) or from the
in-app lavish markup tool (`Lavish markup: <route>` issues - the `fr-markup`
HTML comment holds base64 JSON with route + CSS selector + requested change
per element; decode it for exact targets).

## Labels

- Lifecycle: `status:pending` → `status:testing` (implemented, awaiting
  verification) → `status:closed`.
- Every request keeps `feature-request`, one `priority:Low|Medium|High|Critical`,
  and one `type:adjustment|new-feature` (missing `type:` reads as adjustment).
- When moving status, swap only the `status:*` label
  (`gh issue edit N --remove-label status:X --add-label status:Y`).

## Repo conventions

- **Stack:** Next.js App Router + TypeScript + Tailwind (`app/`,
  `components/`), shared logic in `lib/` (curricula in `lib/*curriculum*.ts`,
  access rules in `lib/access.ts`), Supabase SQL in `supabase/migrations/`
  (applied to prod via the Supabase Management API query endpoint), deployed
  on Vercel (auto-deploys `main`).
- **Ship norm:** branch + PR into `main`, branches named `claude/<slug>`.
  One commit per issue: `Implement #N: <summary>` / `Fix #N: <summary>`.
- **Verify before committing:** `npx tsc --noEmit` always; `npm test` when
  `lib/` or `app/api` logic changed; `npm run build` for larger UI changes.
- **Docs:** update `README.md` when setup or user-visible behavior changes.
- **Never create Supabase users** (not even test aliases) - use an existing
  session or ask Nathan.

## Design reviews (open questions back to the requester)

There is no in-app review-publish route yet. When an issue says WHAT but
leaves the HOW open: build the review as a lavish HTML artifact, publish it,
and post a `📐 Design review published` comment with the link and the
questions on the issue. Answers come back as `📐 Design review response`
comments (treat them as requirements and cite them when shipping). Don't
build on unanswered questions.

## Status moves

- PR opened for issue #N → comment the PR link on the issue and move it to
  `status:testing`.
- Closing (`status:closed` + close as completed) happens only when Nathan
  confirms the item verified on the deployed app.

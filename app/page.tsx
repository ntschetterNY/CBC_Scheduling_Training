import Link from "next/link";
import { Logo } from "@/components/Logo";
import { NavMenu } from "@/components/NavMenu";
import { isSuperAdmin } from "@/lib/access";
import { curriculum } from "@/lib/curriculum";
import { safetyCurriculum } from "@/lib/safety-curriculum";
import { programs, STATUS_LABEL, type ProgramStatus } from "@/lib/programs";
import { createClient } from "@/lib/supabase/server";

/** Compact "N modules · ~a–b hours" meta line for a set of modules. */
function programMeta(modules: { estMinutes: number }[]): string {
  const totalMin = modules.reduce((a, m) => a + m.estMinutes, 0);
  return `${modules.length} modules · ~${Math.floor(totalMin / 60)}–${Math.ceil(
    totalMin / 60
  )} hours`;
}

export default async function Home() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: profile } = user
    ? await supabase.from("profiles").select("role").eq("id", user.id).maybeSingle()
    : { data: null };

  const primaryHref = user ? "/dashboard" : "/login";
  const primaryLabel = user ? "Go to dashboard" : "Start training";
  const metaBySlug: Record<string, string> = {
    "sound-tech": programMeta(curriculum),
    "physical-security": programMeta(safetyCurriculum),
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Top nav */}
      <header className="border-b border-brand-border">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
          <Link href="/" aria-label="CrossBridge Training Center home">
            <Logo />
          </Link>
          <div className="flex items-center gap-2 sm:gap-3">
            {user && (
              <NavMenu
                email={user.email}
                isAdmin={profile?.role === "admin"}
                superAdmin={isSuperAdmin(user.email)}
              />
            )}
            <Link href={primaryHref} className="btn-primary">
              {primaryLabel}
            </Link>
          </div>
        </div>
      </header>

      {/* Hero — deep teal, like the CrossBridge homepage overlay */}
      <section className="relative overflow-hidden bg-brand-teal">
        <div
          className="pointer-events-none absolute inset-0 opacity-90"
          style={{
            background:
              "radial-gradient(120% 90% at 50% -10%, #2f6a7b 0%, #1e5162 45%, #163e4a 100%)",
          }}
        />
        <div className="relative mx-auto max-w-3xl px-4 py-20 text-center sm:px-6 sm:py-28">
          <p className="font-sans text-[11px] font-semibold uppercase tracking-[0.28em] text-brand-accent">
            CrossBridge Church · Volunteer Equipping
          </p>
          <h1 className="mt-5 font-sans text-4xl font-light tracking-tight text-white sm:text-5xl">
            Training Center
          </h1>
          <p className="mx-auto mt-4 max-w-2xl font-serif text-lg italic text-white/85">
            Bring your best to every place you serve.
          </p>
          <p className="mx-auto mt-5 max-w-xl font-serif text-[15px] leading-relaxed text-white/75">
            One home for every CrossBridge training program — from the sound
            booth to the security team to the teaching platform. Pick your area,
            work at your own pace, and your progress follows you.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link href={primaryHref} className="btn-primary px-7 py-3 text-base">
              {primaryLabel}
            </Link>
            <a
              href="#programs"
              className="btn px-7 py-3 text-base border border-white/40 text-white hover:bg-white/10"
            >
              Browse all trainings
            </a>
          </div>
        </div>
      </section>

      {/* Gold quick-facts band — mirrors the CrossBridge gold strip */}
      <section className="bg-brand-accent">
        <div className="mx-auto grid max-w-6xl gap-6 px-4 py-8 text-white sm:grid-cols-3 sm:px-6">
          {[
            {
              icon: "📚",
              title: "Multiple training tracks",
              body: "Each ministry area has its own guided path.",
            },
            {
              icon: "✓",
              title: "Knowledge checks",
              body: "A short quiz closes out every module.",
            },
            {
              icon: "⏱️",
              title: "Go at your own pace",
              body: "Sign in once; progress is saved everywhere.",
            },
          ].map((f) => (
            <div key={f.title} className="flex items-start gap-3">
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-white/40 text-lg">
                {f.icon}
              </span>
              <div>
                <p className="font-sans text-sm font-semibold">{f.title}</p>
                <p className="font-serif text-sm text-white/85">{f.body}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Programs grid — choose your training area */}
      <section id="programs" className="bg-brand-surface py-16">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="mb-8 text-center">
            <p className="eyebrow">Training programs</p>
            <h2 className="mt-3 font-sans text-3xl font-light tracking-tight text-brand-text">
              Choose your area to serve
            </h2>
            <p className="mx-auto mt-2 max-w-xl font-serif text-brand-text/70">
              Every CrossBridge equipping track in one place. New programs are
              added as they&rsquo;re built.
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {programs.map((p) => {
              const available = p.status === "available";
              // Where an available card sends the volunteer. Route through
              // /login (preserving the destination) when they're not signed in.
              const dest = p.href ?? "/dashboard";
              const cardHref = user
                ? dest
                : `/login?redirectedFrom=${encodeURIComponent(dest)}`;
              const metaLine = metaBySlug[p.slug];
              const meta = (
                <>
                  <div className="flex items-start gap-3">
                    <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-brand-surface text-xl">
                      {p.icon}
                    </span>
                    <div className="min-w-0">
                      <p className="eyebrow">{p.category}</p>
                      <h3 className="font-sans text-[15px] font-semibold leading-tight text-brand-text">
                        {p.name}
                      </h3>
                    </div>
                  </div>
                  <p className="mt-3 flex-1 font-serif text-sm leading-relaxed text-brand-text/75">
                    {p.description}
                  </p>
                  {available && metaLine && (
                    <p className="mt-3 font-sans text-xs text-brand-muted">
                      {metaLine}
                    </p>
                  )}
                  <div className="mt-4 flex items-center justify-between gap-2">
                    <StatusBadge status={p.status} />
                    <span
                      className={`font-sans text-sm font-semibold ${
                        available ? "text-brand-accentDark" : "text-brand-muted"
                      }`}
                    >
                      {available ? "Start training →" : "Notify me"}
                    </span>
                  </div>
                </>
              );

              return available ? (
                <Link
                  key={p.slug}
                  href={cardHref}
                  className="card group flex flex-col p-5 transition-colors hover:border-brand-accent/40"
                >
                  {meta}
                </Link>
              ) : (
                <div
                  key={p.slug}
                  className="card flex flex-col p-5 opacity-75"
                >
                  {meta}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Welcome / intro — light, two-column like the CrossBridge welcome */}
      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <div className="grid items-center gap-10 md:grid-cols-2">
          <div>
            <p className="eyebrow">Welcome, volunteer</p>
            <h2 className="mt-3 font-sans text-3xl font-light tracking-tight text-brand-text">
              Equipped to serve, wherever you&rsquo;re called
            </h2>
            <div className="mt-4 space-y-4 font-serif text-[15px] leading-relaxed text-brand-text/80">
              <p>
                Every team at CrossBridge does its best work when it&rsquo;s
                trained well. This is the one place to learn your role &mdash;
                clear, consistent, and built around how we actually do things
                here.
              </p>
              <p>
                Pick the program that fits where you serve. Whether you&rsquo;ve
                done it for years or you&rsquo;re brand new, work through the
                modules in order &mdash; each one builds on the last and tracks
                your progress along the way.
              </p>
            </div>
            <Link href={primaryHref} className="btn-teal mt-6">
              {primaryLabel}
            </Link>
          </div>

          {/* Featured "start here" card — the one live track today */}
          <div className="card overflow-hidden">
            <div className="bg-brand-surface px-6 py-4">
              <p className="eyebrow">Available now</p>
              <p className="mt-1 font-sans text-lg text-brand-text">
                Start with Sound Tech
              </p>
            </div>
            <ul className="divide-y divide-brand-border">
              {curriculum.slice(0, 4).map((m) => (
                <li key={m.slug} className="flex items-center gap-4 px-6 py-3.5">
                  <span className="date-badge h-11 w-11 shrink-0 text-center">
                    <span className="text-[9px] font-bold uppercase leading-none opacity-90">
                      Mod
                    </span>
                    <span className="font-sans text-base font-bold leading-none">
                      {m.order}
                    </span>
                  </span>
                  <div className="min-w-0">
                    <p className="truncate font-sans text-[15px] font-medium text-brand-text">
                      {m.title}
                    </p>
                    <p className="truncate font-serif text-xs text-brand-muted">
                      ~{m.estMinutes} min
                    </p>
                  </div>
                </li>
              ))}
            </ul>
            <div className="px-6 py-3">
              <Link
                href={primaryHref}
                className="font-sans text-sm font-semibold text-brand-accentDark hover:underline"
              >
                See all {curriculum.length} modules →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-4xl px-4 py-16 text-center sm:px-6">
        <p className="eyebrow">Ready to serve?</p>
        <h2 className="mt-3 font-sans text-3xl font-light tracking-tight text-brand-text">
          Sign in and pick up where you left off
        </h2>
        <p className="mx-auto mt-2 max-w-lg font-serif text-brand-text/70">
          New to a team? Reach out to your ministry lead for access, then start
          with Module 1.
        </p>
        <Link href={primaryHref} className="btn-primary mt-6 px-7 py-3 text-base">
          {primaryLabel}
        </Link>
      </section>

      {/* Footer — deep teal, echoing the CrossBridge footer */}
      <footer className="bg-brand-teal text-white">
        <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
          <div className="grid gap-8 sm:grid-cols-3">
            <div>
              <p className="font-sans text-xs font-semibold uppercase tracking-[0.18em] text-white/70">
                CrossBridge Church
              </p>
              <p className="mt-2 font-serif text-sm text-white/80">
                600 Bob Reed Ln
                <br />
                Westbury, NY 11590
              </p>
            </div>
            <div>
              <p className="font-sans text-xs font-semibold uppercase tracking-[0.18em] text-white/70">
                Training Center
              </p>
              <ul className="mt-2 space-y-1.5 font-serif text-sm text-white/80">
                <li>
                  <Link href="/login" className="hover:text-brand-accent">
                    Sign in
                  </Link>
                </li>
                <li>
                  <a href="#programs" className="hover:text-brand-accent">
                    Browse trainings
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <p className="font-sans text-xs font-semibold uppercase tracking-[0.18em] text-white/70">
                For leads
              </p>
              <p className="mt-2 font-serif text-sm text-white/80">
                Track your team&rsquo;s progress and manage access from the
                admin view.
              </p>
            </div>
          </div>
          <div className="mt-10 flex flex-col items-center justify-between gap-4 border-t border-white/15 pt-6 sm:flex-row">
            <Link href="/" aria-label="CrossBridge Training Center home">
              <Logo tone="light" />
            </Link>
            <p className="font-serif text-xs text-white/60">
              CrossBridge Training Center · Equipping volunteers to serve
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

function StatusBadge({ status }: { status: ProgramStatus }) {
  const styles: Record<ProgramStatus, string> = {
    available: "bg-brand-success/15 text-brand-success",
    in_progress: "bg-brand-accent/15 text-brand-accentDark",
    coming_soon: "bg-brand-surface text-brand-muted",
  };
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 font-sans text-[10px] font-bold uppercase tracking-wide ${styles[status]}`}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-current" />
      {STATUS_LABEL[status]}
    </span>
  );
}

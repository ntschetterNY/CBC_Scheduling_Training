import Link from "next/link";
import { Logo } from "@/components/Logo";
import { curriculum } from "@/lib/curriculum";
import { createClient } from "@/lib/supabase/server";

export default async function Home() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const primaryHref = user ? "/dashboard" : "/login";
  const primaryLabel = user ? "Go to dashboard" : "Start training";
  const totalMin = curriculum.reduce((a, m) => a + m.estMinutes, 0);

  return (
    <div className="min-h-screen bg-white">
      {/* Top nav */}
      <header className="border-b border-brand-border">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
          <Logo />
          <div className="flex items-center gap-2 sm:gap-3">
            <Link href="/login" className="btn-ghost">
              {user ? "Dashboard" : "Sign in"}
            </Link>
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
            Allen &amp; Heath SQ-6 · Interactive Guide
          </p>
          <h1 className="mt-5 font-sans text-4xl font-light tracking-tight text-white sm:text-5xl">
            Sound Tech Training
          </h1>
          <p className="mx-auto mt-4 max-w-2xl font-serif text-lg italic text-white/85">
            Bring your best to worship. Learn the board. Serve the room.
          </p>
          <p className="mx-auto mt-5 max-w-xl font-serif text-[15px] leading-relaxed text-white/75">
            A hands-on, step-by-step program that takes you from your first look
            at the console to confidently mixing a Sunday service on our SQ-6.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link href={primaryHref} className="btn-primary px-7 py-3 text-base">
              {primaryLabel}
            </Link>
            <a
              href="#curriculum"
              className="btn px-7 py-3 text-base border border-white/40 text-white hover:bg-white/10"
            >
              See the curriculum
            </a>
          </div>
        </div>
      </section>

      {/* Gold quick-facts band — mirrors the CrossBridge gold strip */}
      <section className="bg-brand-accent">
        <div className="mx-auto grid max-w-6xl gap-6 px-4 py-8 text-white sm:grid-cols-3 sm:px-6">
          {[
            {
              icon: "🎚️",
              title: `${curriculum.length} interactive modules`,
              body: "Lessons, tips, and a clickable board explorer.",
            },
            {
              icon: "✓",
              title: "Knowledge checks",
              body: "A short quiz closes out every module.",
            },
            {
              icon: "⏱️",
              title: `About ${Math.floor(totalMin / 60)}–${Math.ceil(
                totalMin / 60
              )} hours`,
              body: "Go at your own pace; progress is saved.",
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

      {/* Welcome / intro — light, two-column like the CrossBridge welcome */}
      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <div className="grid items-center gap-10 md:grid-cols-2">
          <div>
            <p className="eyebrow">Welcome, volunteer</p>
            <h2 className="mt-3 font-sans text-3xl font-light tracking-tight text-brand-text">
              Serving on the CrossBridge sound team
            </h2>
            <div className="mt-4 space-y-4 font-serif text-[15px] leading-relaxed text-brand-text/80">
              <p>
                Great sound is invisible. When it&rsquo;s done well, nobody
                thinks about the mix &mdash; they&rsquo;re free to worship. This
                program equips you to serve the congregation and the platform
                team with clear, consistent, distraction-free audio.
              </p>
              <p>
                Whether you&rsquo;ve never touched a mixer or you&rsquo;re
                sharpening your skills, work through the modules in order. Each
                one builds on the last and tracks your progress along the way.
              </p>
            </div>
            <Link href={primaryHref} className="btn-teal mt-6">
              {primaryLabel}
            </Link>
          </div>

          {/* Featured "up next" style card echoing the sermons list */}
          <div className="card overflow-hidden">
            <div className="bg-brand-surface px-6 py-4">
              <p className="eyebrow">Start here</p>
              <p className="mt-1 font-sans text-lg text-brand-text">
                The training path
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
              <a
                href="#curriculum"
                className="font-sans text-sm font-semibold text-brand-accentDark hover:underline"
              >
                See all {curriculum.length} modules →
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Curriculum grid */}
      <section id="curriculum" className="bg-brand-surface py-16">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="mb-8 text-center">
            <p className="eyebrow">The curriculum</p>
            <h2 className="mt-3 font-sans text-3xl font-light tracking-tight text-brand-text">
              Everything you need to run the SQ-6
            </h2>
            <p className="mx-auto mt-2 max-w-xl font-serif text-brand-text/70">
              Thirteen modules, in order &mdash; each one builds on the last.
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {curriculum.map((m) => (
              <div key={m.slug} className="card p-5">
                <div className="flex items-center gap-3">
                  <span className="grid h-11 w-11 place-items-center rounded-full bg-brand-surface text-xl">
                    {m.icon}
                  </span>
                  <div>
                    <p className="eyebrow">Module {m.order}</p>
                    <h3 className="font-sans text-[15px] font-semibold leading-tight text-brand-text">
                      {m.title}
                    </h3>
                  </div>
                </div>
                <p className="mt-3 font-serif text-sm leading-relaxed text-brand-text/75">
                  {m.subtitle}
                </p>
                <p className="mt-3 font-sans text-xs text-brand-muted">
                  ~{m.estMinutes} min · {m.quiz.length} question quiz
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-4xl px-4 py-16 text-center sm:px-6">
        <p className="eyebrow">Ready to serve?</p>
        <h2 className="mt-3 font-sans text-3xl font-light tracking-tight text-brand-text">
          Create your account and start with Module 1
        </h2>
        <p className="mx-auto mt-2 max-w-lg font-serif text-brand-text/70">
          Reach out to your sound lead if you need access to the team.
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
                Sound Team
              </p>
              <ul className="mt-2 space-y-1.5 font-serif text-sm text-white/80">
                <li>
                  <Link href="/login" className="hover:text-brand-accent">
                    Sign in
                  </Link>
                </li>
                <li>
                  <a href="#curriculum" className="hover:text-brand-accent">
                    Curriculum
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <p className="font-sans text-xs font-semibold uppercase tracking-[0.18em] text-white/70">
                Console
              </p>
              <p className="mt-2 font-serif text-sm text-white/80">
                Allen &amp; Heath SQ-6
                <br />
                Digital Mixing System
              </p>
            </div>
          </div>
          <div className="mt-10 flex flex-col items-center justify-between gap-4 border-t border-white/15 pt-6 sm:flex-row">
            <Logo tone="light" />
            <p className="font-serif text-xs text-white/60">
              CrossBridge Sound Tech Training · Built for the SQ-6
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

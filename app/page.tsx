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

  return (
    <div className="min-h-screen">
      {/* Nav */}
      <header className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Logo />
        <div className="flex items-center gap-3">
          <Link href="/login" className="btn-ghost">
            {user ? "Dashboard" : "Sign in"}
          </Link>
          <Link href={primaryHref} className="btn-primary">
            {primaryLabel}
          </Link>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div
          className="pointer-events-none absolute inset-0 opacity-40"
          style={{
            background:
              "radial-gradient(60% 60% at 50% 0%, rgba(245,166,35,0.18), transparent 70%)",
          }}
        />
        <div className="relative mx-auto max-w-4xl px-4 pb-16 pt-14 text-center sm:px-6 sm:pt-20">
          <span className="chip mx-auto border-brand-accent/40 text-brand-accent">
            🎛️ Allen &amp; Heath SQ-6 · Interactive Guide
          </span>
          <h1 className="mt-6 text-4xl font-extrabold tracking-tight text-brand-text sm:text-5xl">
            Learn to run sound at{" "}
            <span className="text-brand-accent">CrossBridge</span>
          </h1>
          <p className="prose-body mx-auto mt-5 max-w-2xl text-lg">
            A hands-on, step-by-step training program that takes you from your
            first look at the board to confidently mixing a Sunday service on
            our SQ-6 digital console. Learn the concepts, practice the moves,
            and track your progress.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link href={primaryHref} className="btn-primary px-6 py-3 text-base">
              {primaryLabel} →
            </Link>
            <a href="#curriculum" className="btn-secondary px-6 py-3 text-base">
              See the curriculum
            </a>
          </div>
          <p className="mt-4 text-xs text-brand-muted">
            {curriculum.length} interactive modules ·{" "}
            {curriculum.reduce((a, m) => a + m.estMinutes, 0)} minutes ·
            Knowledge checks &amp; progress tracking
          </p>
        </div>
      </section>

      {/* Features */}
      <section className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        <div className="grid gap-4 sm:grid-cols-3">
          {[
            {
              icon: "🧭",
              title: "Learn by doing",
              body: "Interactive walkthroughs and a clickable board explorer connect every concept to a real control on the SQ-6.",
            },
            {
              icon: "✅",
              title: "Check your knowledge",
              body: "Each module ends with a short quiz so you (and your leads) know the material is really sticking.",
            },
            {
              icon: "📈",
              title: "Track your progress",
              body: "Sign in and your completed modules and scores are saved, so you always know what's next.",
            },
          ].map((f) => (
            <div key={f.title} className="card p-5">
              <div className="text-2xl">{f.icon}</div>
              <h3 className="mt-3 font-bold text-brand-text">{f.title}</h3>
              <p className="prose-body mt-1 text-sm">{f.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Curriculum */}
      <section id="curriculum" className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <div className="mb-6 text-center">
          <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
            The curriculum
          </h2>
          <p className="prose-body mx-auto mt-2 max-w-xl">
            Work through the modules in order — each one builds on the last.
          </p>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {curriculum.map((m) => (
            <div key={m.slug} className="card p-5">
              <div className="flex items-center gap-3">
                <span className="grid h-10 w-10 place-items-center rounded-xl bg-brand-surface text-xl">
                  {m.icon}
                </span>
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-wider text-brand-muted">
                    Module {m.order}
                  </p>
                  <h3 className="font-bold leading-tight text-brand-text">
                    {m.title}
                  </h3>
                </div>
              </div>
              <p className="prose-body mt-3 text-sm">{m.subtitle}</p>
              <p className="mt-3 text-xs text-brand-muted">
                ~{m.estMinutes} min · {m.quiz.length} question quiz
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
        <div className="card bg-gradient-to-br from-brand-card to-brand-surface p-8 text-center sm:p-12">
          <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
            Ready to serve on the sound team?
          </h2>
          <p className="prose-body mx-auto mt-2 max-w-lg">
            Create your account and start with Module 1. Reach out to your sound
            lead if you need access.
          </p>
          <Link
            href={primaryHref}
            className="btn-primary mt-6 px-6 py-3 text-base"
          >
            {primaryLabel} →
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-brand-border/60">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 px-4 py-8 text-xs text-brand-muted sm:flex-row sm:px-6">
          <Logo />
          <p>
            CrossBridge Sound Tech Training · Built for the Allen &amp; Heath
            SQ-6
          </p>
        </div>
      </footer>
    </div>
  );
}

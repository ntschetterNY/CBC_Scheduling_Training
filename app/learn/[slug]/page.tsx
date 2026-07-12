import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { AppHeader } from "@/components/AppHeader";
import { ModuleRunner } from "@/components/ModuleRunner";
import { PageHero } from "@/components/PageHero";
import { curriculum, getModule, moduleOrder } from "@/lib/curriculum";
import { getMyProgress } from "@/lib/progress";
import { createClient } from "@/lib/supabase/server";

export function generateStaticParams() {
  return curriculum.map((m) => ({ slug: m.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const module = getModule(slug);
  return { title: module ? module.title : "Module" };
}

export default async function ModulePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const module = getModule(slug);
  if (!module) notFound();

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect(`/login?redirectedFrom=/learn/${slug}`);
  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .maybeSingle();

  const progress = await getMyProgress();
  const alreadyCompleted = progress[module.slug]?.status === "completed";

  const idx = moduleOrder.indexOf(module.slug);
  const prevSlug = idx > 0 ? moduleOrder[idx - 1] : null;
  const nextSlug =
    idx < moduleOrder.length - 1 ? moduleOrder[idx + 1] : null;

  return (
    <div className="min-h-screen">
      <AppHeader email={user?.email} isAdmin={profile?.role === "admin"} />

      <PageHero
        width="3xl"
        backHref="/learn"
        backLabel="All modules"
        icon={module.icon}
        eyebrow={
          <>
            Module {module.order} of {curriculum.length}
            {alreadyCompleted && (
              <span className="ml-2 normal-case tracking-normal text-white/80">
                · Completed ✓
              </span>
            )}
          </>
        }
        title={module.title}
        description={module.subtitle}
      />

      <main className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
        <div className="mb-6">
          {/* Objectives */}
          <div className="rounded-xl border border-brand-border bg-brand-surface/50 p-4">
            <p className="text-xs font-bold uppercase tracking-wider text-brand-muted">
              What you’ll learn
            </p>
            <ul className="mt-2 space-y-1.5">
              {module.objectives.map((o, i) => (
                <li key={i} className="flex gap-2.5 text-sm text-brand-text/90">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-accent2" />
                  {o}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <ModuleRunner
          module={module}
          userId={user.id}
          nextSlug={nextSlug}
          alreadyCompleted={alreadyCompleted}
        />

        {/* prev/next footer */}
        <div className="mt-8 flex items-center justify-between border-t border-brand-border pt-5">
          {prevSlug ? (
            <Link href={`/learn/${prevSlug}`} className="btn-ghost">
              ← Previous module
            </Link>
          ) : (
            <span />
          )}
          {nextSlug ? (
            <Link href={`/learn/${nextSlug}`} className="btn-ghost">
              Next module →
            </Link>
          ) : (
            <span />
          )}
        </div>
      </main>
    </div>
  );
}

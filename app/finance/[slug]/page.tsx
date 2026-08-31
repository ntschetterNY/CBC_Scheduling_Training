import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { AppHeader } from "@/components/AppHeader";
import { ModuleRunner } from "@/components/ModuleRunner";
import { PageHero } from "@/components/PageHero";
import {
  financeCurriculum,
  getFinanceModule,
  financeModuleOrder,
} from "@/lib/finance-curriculum";
import { getMyProgress } from "@/lib/progress";
import { createClient } from "@/lib/supabase/server";

export function generateStaticParams() {
  return financeCurriculum.map((m) => ({ slug: m.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const module = getFinanceModule(slug);
  return { title: module ? module.title : "Module" };
}

export default async function FinanceModulePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const module = getFinanceModule(slug);
  if (!module) notFound();

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect(`/login?redirectedFrom=/finance/${slug}`);
  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .maybeSingle();

  const progress = await getMyProgress();
  const alreadyCompleted = progress[module.slug]?.status === "completed";

  const idx = financeModuleOrder.indexOf(module.slug);
  const prevSlug = idx > 0 ? financeModuleOrder[idx - 1] : null;
  const nextSlug =
    idx < financeModuleOrder.length - 1 ? financeModuleOrder[idx + 1] : null;

  return (
    <div className="min-h-screen">
      <AppHeader email={user?.email} isAdmin={profile?.role === "admin"} />

      <PageHero
        width="3xl"
        backHref="/finance"
        backLabel="All modules"
        icon={module.icon}
        eyebrow={
          <>
            Module {module.order} of {financeCurriculum.length}
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
          basePath="/finance"
          homeHref="/finance"
          homeLabel="All modules"
        />

        {/* prev/next footer */}
        <div className="mt-8 flex items-center justify-between border-t border-brand-border pt-5">
          {prevSlug ? (
            <Link href={`/finance/${prevSlug}`} className="btn-ghost">
              ← Previous module
            </Link>
          ) : (
            <span />
          )}
          {nextSlug ? (
            <Link href={`/finance/${nextSlug}`} className="btn-ghost">
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

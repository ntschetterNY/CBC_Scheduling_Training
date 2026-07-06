import Link from "next/link";
import { redirect } from "next/navigation";
import { AppHeader } from "@/components/AppHeader";
import { BoardExplorer } from "@/components/BoardExplorer";
import { GearGallery } from "@/components/GearGallery";
import { KnowledgeSearch } from "@/components/KnowledgeSearch";
import { curriculum } from "@/lib/curriculum";
import { getMyProgress } from "@/lib/progress";
import { createClient } from "@/lib/supabase/server";

export const metadata = { title: "Modules" };

export default async function LearnIndexPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login?redirectedFrom=/learn");
  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .maybeSingle();

  const progress = await getMyProgress();

  return (
    <div className="min-h-screen">
      <AppHeader email={user?.email} isAdmin={profile?.role === "admin"} />
      <main className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
          Training Modules
        </h1>
        <p className="prose-body mt-1">
          Work through them in order — each module builds on the one before it.
        </p>

        {/* Searchable knowledge base — find the module for a live problem fast */}
        <div className="mt-6">
          <KnowledgeSearch />
        </div>

        {/* Interactive SQ-6 guide */}
        <div className="mt-6">
          <BoardExplorer />
        </div>

        {/* Real-gear photo gallery */}
        <div className="mt-6">
          <GearGallery />
        </div>

        <h2 className="mb-3 mt-10 text-lg font-bold">All modules</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          {curriculum.map((m) => {
            const p = progress[m.slug];
            const done = p?.status === "completed";
            return (
              <Link
                key={m.slug}
                href={`/learn/${m.slug}`}
                className="card group p-5 transition-colors hover:border-brand-accent/40"
              >
                <div className="flex items-start justify-between">
                  <span className="grid h-11 w-11 place-items-center rounded-xl bg-brand-surface text-xl">
                    {m.icon}
                  </span>
                  {done ? (
                    <span className="rounded-full bg-brand-success/15 px-2.5 py-1 text-[10px] font-bold text-brand-success">
                      ✓ Complete
                    </span>
                  ) : p ? (
                    <span className="rounded-full bg-brand-accent/15 px-2.5 py-1 text-[10px] font-bold text-brand-accent">
                      In progress
                    </span>
                  ) : (
                    <span className="rounded-full bg-brand-surface px-2.5 py-1 text-[10px] font-bold text-brand-muted">
                      Not started
                    </span>
                  )}
                </div>
                <p className="mt-3 text-[11px] font-semibold uppercase tracking-wider text-brand-muted">
                  Module {m.order}
                </p>
                <h3 className="font-bold text-brand-text">{m.title}</h3>
                <p className="prose-body mt-1 text-sm">{m.subtitle}</p>
                <p className="mt-3 text-xs text-brand-muted">
                  ~{m.estMinutes} min · {m.quiz.length} question quiz
                </p>
              </Link>
            );
          })}
        </div>
      </main>
    </div>
  );
}

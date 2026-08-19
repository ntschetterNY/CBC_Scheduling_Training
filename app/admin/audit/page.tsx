import { redirect } from "next/navigation";
import { AppHeader } from "@/components/AppHeader";
import { PageHero } from "@/components/PageHero";
import { AuditLogViewer, type AuditRow } from "@/components/AuditLogViewer";
import { isSuperAdmin } from "@/lib/access";
import { createClient } from "@/lib/supabase/server";

export const metadata = { title: "Audit Log" };
export const dynamic = "force-dynamic";

export default async function AuditPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login?redirectedFrom=/admin/audit");

  // The audit log is super-admin only (RLS enforces the same).
  if (!isSuperAdmin(user.email)) redirect("/admin");

  const [{ data: events }, { data: profiles }] = await Promise.all([
    supabase
      .from("audit_log")
      .select("id, user_id, email, event, path, target, detail, duration_ms, created_at")
      .order("created_at", { ascending: false })
      .limit(500),
    supabase.from("profiles").select("id, full_name"),
  ]);

  const names: Record<string, string> = {};
  for (const p of profiles ?? []) {
    if (p.full_name) names[p.id] = p.full_name;
  }

  return (
    <div className="min-h-screen">
      <AppHeader email={user?.email} isAdmin />
      <PageHero
        width="6xl"
        backHref="/admin"
        backLabel="Team Progress"
        eyebrow="Admin"
        title="Audit Log"
        description={
          <>
            Who did what, where, and when — page views (with load time), clicks
            on buttons and links, and admin actions like approving users or
            changing roles. Shows the most recent 500 events.
          </>
        }
      />
      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        <AuditLogViewer rows={(events ?? []) as AuditRow[]} names={names} />
      </main>
    </div>
  );
}

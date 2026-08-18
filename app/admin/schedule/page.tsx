import { redirect } from "next/navigation";
import { AppHeader } from "@/components/AppHeader";
import { PageHero } from "@/components/PageHero";
import { ScheduleAdmin } from "@/components/ScheduleAdmin";
import { isSuperAdmin } from "@/lib/access";
import { isBreezeConfigured } from "@/lib/breeze";
import { createClient } from "@/lib/supabase/server";

export const metadata = { title: "Scheduling Admin" };

export default async function ScheduleAdminPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login?redirectedFrom=/admin/schedule");

  const { data: me } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .maybeSingle();
  if (me?.role !== "admin" && !isSuperAdmin(user.email)) redirect("/dashboard");

  const { data: teams } = await supabase
    .from("teams")
    .select("id, name, slug, active, sort_order")
    .order("sort_order");

  return (
    <div className="min-h-screen">
      <AppHeader email={user.email} isAdmin />

      <PageHero
        width="7xl"
        eyebrow="Admin"
        title="Scheduling"
        description="Manage rosters and roles, generate fair rotations, and (once email is wired up) send reminders and availability polls."
        backHref="/schedule"
        backLabel="View schedule"
      />

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
        <ScheduleAdmin teams={teams ?? []} breezeConfigured={isBreezeConfigured} />
      </main>
    </div>
  );
}

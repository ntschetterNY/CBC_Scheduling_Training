import { redirect } from "next/navigation";
import { AppHeader } from "@/components/AppHeader";
import { BlackoutManager } from "@/components/BlackoutManager";
import { PageHero } from "@/components/PageHero";
import { createClient } from "@/lib/supabase/server";

export const metadata = { title: "My Availability" };

export default async function AvailabilityPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login?redirectedFrom=/schedule/availability");

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .maybeSingle();

  // Find the roster entry linked to this login by email.
  const { data: person } = await supabase
    .from("people")
    .select("id, full_name")
    .ilike("email", user.email ?? "")
    .maybeSingle();

  return (
    <div className="min-h-screen">
      <AppHeader email={user.email} isAdmin={profile?.role === "admin"} />

      <PageHero
        eyebrow="Serve teams"
        title="My availability"
        description="Add the dates you're away and the scheduler will work around them. Ranges cover every service day between the first and last day, inclusive."
        backHref="/schedule"
        backLabel="Back to schedule"
      />

      <main className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
        {person ? (
          <BlackoutManager personId={person.id} />
        ) : (
          <div className="card p-6">
            <h2 className="section-title mb-2">We couldn't find your roster entry</h2>
            <p className="prose-body text-sm">
              Your login email ({user.email}) isn't linked to anyone on a serve
              team yet. Ask an admin to add your email to your roster entry on
              the scheduling admin page, then come back here.
            </p>
          </div>
        )}
      </main>
    </div>
  );
}

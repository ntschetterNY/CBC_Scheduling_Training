import { redirect } from "next/navigation";
import { AppHeader } from "@/components/AppHeader";
import { GearGallery } from "@/components/GearGallery";
import { PageHero } from "@/components/PageHero";
import { createClient } from "@/lib/supabase/server";

export const metadata = { title: "Our Gear" };

export default async function GearPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login?redirectedFrom=/gear");
  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .maybeSingle();

  return (
    <div className="min-h-screen">
      <AppHeader email={user?.email} isAdmin={profile?.role === "admin"} />
      <PageHero
        eyebrow="Sound Team · The hardware"
        title="Our Gear"
        description="Every piece of our sound system, grouped by where it lives — the booth, the rack room off the stage, and the stage itself. Get familiar with the hardware here before (or alongside) the training modules."
      />
      <main className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
        <GearGallery />
      </main>
    </div>
  );
}

import { redirect } from "next/navigation";
import { AppHeader } from "@/components/AppHeader";
import { PageHero } from "@/components/PageHero";
import { BreezeGatewayManager } from "@/components/BreezeGatewayManager";
import { isSuperAdmin } from "@/lib/access";
import { isBreezeConfigured } from "@/lib/breeze";
import { getBreezeGatewayState } from "@/lib/breeze-gateway";
import { createClient } from "@/lib/supabase/server";

export const metadata = { title: "API Access" };

/**
 * /admin/api-keys - super-admin control panel for the Breeze API gateway.
 *
 * Breeze API keys have no scoping: one key can read and write the whole
 * account, including giving records. This page is the app-side fix - a
 * permission matrix over every Breeze endpoint plus a master kill switch,
 * enforced in lib/breeze.ts before any request leaves the server.
 */
export default async function ApiKeysPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login?redirectedFrom=/admin/api-keys");
  if (!isSuperAdmin(user.email)) redirect("/admin");

  // Fails closed: a load error yields enabled=false and an empty permission
  // map, so the page renders everything as blocked.
  const { enabled, permissions } = await getBreezeGatewayState();

  const initialPermissions: Record<string, boolean> = {};
  for (const [endpointKey, allowed] of permissions) {
    initialPermissions[endpointKey] = allowed;
  }

  return (
    <div className="min-h-screen">
      <AppHeader email={user?.email} isAdmin />
      <PageHero
        width="5xl"
        backHref="/admin"
        backLabel="Team Progress"
        eyebrow="Admin · Super admin only"
        title="Breeze API Access"
        description={
          <>
            The Breeze API key can reach <strong>everything</strong> in the
            church account - people, events, forms, even giving records - with
            no permissions on Breeze&rsquo;s side. This matrix is the gate:
            every endpoint is blocked unless you allow it here, and the master
            switch cuts off all Breeze traffic at once.
          </>
        }
      />
      <main className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
        <BreezeGatewayManager
          configured={isBreezeConfigured}
          subdomain={process.env.BREEZE_SUBDOMAIN ?? null}
          initialEnabled={enabled}
          initialPermissions={initialPermissions}
        />
      </main>
    </div>
  );
}

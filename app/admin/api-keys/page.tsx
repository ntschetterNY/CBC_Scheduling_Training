import { redirect } from "next/navigation";
import { AppHeader } from "@/components/AppHeader";
import { PageHero } from "@/components/PageHero";
import { BreezeGatewayManager } from "@/components/BreezeGatewayManager";
import { isSuperAdmin } from "@/lib/access";
import { isBreezeConfigured } from "@/lib/breeze";
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

  const [{ data: settings }, { data: permissions }] = await Promise.all([
    supabase
      .from("breeze_gateway_settings")
      .select("enabled")
      .eq("id", 1)
      .maybeSingle(),
    supabase.from("breeze_endpoint_permissions").select("endpoint_key, allowed"),
  ]);

  const initialPermissions: Record<string, boolean> = {};
  for (const row of permissions ?? []) {
    initialPermissions[row.endpoint_key as string] = row.allowed === true;
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
          initialEnabled={settings?.enabled === true}
          initialPermissions={initialPermissions}
        />
      </main>
    </div>
  );
}

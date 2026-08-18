import { isSuperAdmin } from "@/lib/access";
import { createClient } from "@/lib/supabase/server";

/**
 * Resolve the signed-in user and whether they're a scheduling admin
 * (profiles.role === 'admin' or the super admin). Route handlers use this;
 * RLS enforces the same rule at the database layer.
 */
export async function getScheduleActor() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .maybeSingle();

  return {
    supabase,
    user,
    isAdmin: profile?.role === "admin" || isSuperAdmin(user.email),
  };
}

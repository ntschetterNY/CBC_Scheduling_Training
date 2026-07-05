import Link from "next/link";
import { redirect } from "next/navigation";
import { AppHeader } from "@/components/AppHeader";
import { UserDirectory, type DirUser } from "@/components/UserDirectory";
import { isSuperAdmin } from "@/lib/access";
import { createClient } from "@/lib/supabase/server";

export const metadata = { title: "Users & Admins" };

export default async function UsersPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login?redirectedFrom=/admin/users");

  // Seeding admins is super-admin only.
  if (!isSuperAdmin(user.email)) redirect("/admin");

  const { data: profiles } = await supabase
    .from("profiles")
    .select("id, full_name, role");

  const users = (profiles ?? []) as DirUser[];

  return (
    <div className="min-h-screen">
      <AppHeader email={user?.email} isAdmin />
      <main className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
        <Link
          href="/admin"
          className="text-xs font-medium text-brand-muted hover:text-brand-text"
        >
          ← Team Progress
        </Link>
        <h1 className="mt-3 text-2xl font-bold tracking-tight sm:text-3xl">
          Users &amp; Admins
        </h1>
        <p className="prose-body mt-1">
          Everyone on the team. Grant <strong>admin</strong> access to give
          someone the Team Progress view, or revoke it — all from here, no
          Supabase needed. Time Analytics stays limited to you (the super admin).
        </p>

        <div className="mt-6">
          <UserDirectory users={users} selfId={user.id} />
        </div>
      </main>
    </div>
  );
}

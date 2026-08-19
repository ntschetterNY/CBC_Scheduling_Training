import { redirect } from "next/navigation";
import { Logo } from "@/components/Logo";
import { isSuperAdmin } from "@/lib/access";
import { createClient } from "@/lib/supabase/server";

export const metadata = { title: "Awaiting approval" };

/**
 * Holding page for signed-in users whose account hasn't been approved yet.
 * The middleware sends every unapproved user here; once the super admin
 * approves them from /admin/users they get the full app.
 */
export default async function PendingPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  if (!isSuperAdmin(user.email)) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("approved")
      .eq("id", user.id)
      .maybeSingle();
    if (profile?.approved) redirect("/dashboard");
  } else {
    redirect("/dashboard");
  }

  return (
    <div className="grid min-h-screen place-items-center px-4">
      <div className="card w-full max-w-md p-8 text-center">
        <div className="mx-auto mb-6 flex justify-center">
          <Logo />
        </div>
        <p className="text-4xl" aria-hidden>
          ⏳
        </p>
        <h1 className="mt-4 text-xl font-bold text-brand-text">
          Your account is awaiting approval
        </h1>
        <p className="mt-3 text-sm text-brand-muted">
          Thanks for signing up! An administrator needs to approve your account
          before you can access the Training Center. You&rsquo;ll be able to
          sign in normally once that&rsquo;s done — no further action needed
          from you.
        </p>
        <p className="mt-2 text-xs text-brand-muted">
          Signed in as <strong>{user.email}</strong>
        </p>
        <form action="/auth/signout" method="post" className="mt-6">
          <button type="submit" className="btn-secondary w-full">
            Sign out
          </button>
        </form>
      </div>
    </div>
  );
}

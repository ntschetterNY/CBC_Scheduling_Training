import Link from "next/link";
import { redirect } from "next/navigation";
import { Logo } from "@/components/Logo";
import { AuthForm } from "@/components/AuthForm";
import { createClient } from "@/lib/supabase/server";

export const metadata = { title: "Sign in" };

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ redirectedFrom?: string }>;
}) {
  const { redirectedFrom } = await searchParams;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const redirectTo =
    redirectedFrom && redirectedFrom.startsWith("/")
      ? redirectedFrom
      : "/dashboard";

  // Already signed in — nothing more to do, go straight to the app.
  if (user) redirect(redirectTo);

  return (
    <div className="flex min-h-screen flex-col">
      <header className="border-b border-brand-border">
        <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-4 sm:px-6">
          <Link href="/">
            <Logo />
          </Link>
          <Link href="/" className="btn-ghost">
            ← Home
          </Link>
        </div>
      </header>

      <main className="flex flex-1 items-center justify-center px-4 py-10">
        <div className="w-full max-w-md">
          <div className="mb-6 text-center">
            <p className="eyebrow">CrossBridge Sound Team</p>
            <h1 className="mt-3 font-sans text-3xl font-light tracking-tight text-brand-text">
              Sound Tech Training
            </h1>
            <p className="mt-2 font-serif text-[15px] leading-relaxed text-brand-text/70">
              Sign in to continue your SQ-6 training and track your progress.
            </p>
          </div>
          <AuthForm redirectTo={redirectTo} />
        </div>
      </main>
    </div>
  );
}

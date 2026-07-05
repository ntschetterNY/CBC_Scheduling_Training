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

  if (user) redirect(redirectedFrom || "/dashboard");

  const redirectTo =
    redirectedFrom && redirectedFrom.startsWith("/")
      ? redirectedFrom
      : "/dashboard";

  return (
    <div className="flex min-h-screen flex-col">
      <header className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link href="/">
          <Logo />
        </Link>
        <Link href="/" className="btn-ghost">
          ← Home
        </Link>
      </header>

      <main className="flex flex-1 items-center justify-center px-4 py-10">
        <div className="w-full max-w-md">
          <div className="mb-6 text-center">
            <h1 className="text-2xl font-bold tracking-tight">
              Sound Tech Training
            </h1>
            <p className="prose-body mt-1 text-sm">
              Sign in to continue your SQ-6 training and track your progress.
            </p>
          </div>
          <AuthForm redirectTo={redirectTo} />
        </div>
      </main>
    </div>
  );
}

import Link from "next/link";
import { Logo } from "./Logo";
import { isSuperAdmin } from "@/lib/access";

/**
 * Header for authenticated app pages. Shows primary nav plus a sign-out form.
 */
export function AppHeader({
  email,
  isAdmin,
}: {
  email?: string | null;
  isAdmin?: boolean;
}) {
  const superAdmin = isSuperAdmin(email);
  return (
    <header className="sticky top-0 z-30 border-b border-brand-border bg-white/90 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <div className="flex items-center gap-4">
          <Link
            href="/dashboard"
            aria-label="CrossBridge Sound Training home"
            className="flex items-center gap-3"
          >
            <Logo />
            <span className="hidden border-l border-brand-border pl-3 font-sans text-xs font-semibold uppercase tracking-[0.18em] text-brand-accentDark sm:inline">
              Sound Training
            </span>
          </Link>
          <nav className="hidden items-center gap-1 md:flex">
            <Link href="/dashboard" className="btn-ghost">
              Dashboard
            </Link>
            <Link href="/learn" className="btn-ghost">
              Modules
            </Link>
            {(isAdmin || superAdmin) && (
              <Link href="/admin" className="btn-ghost">
                Team Progress
              </Link>
            )}
            {superAdmin && (
              <>
                <Link href="/admin/analytics" className="btn-ghost">
                  Time Analytics
                </Link>
                <Link href="/admin/users" className="btn-ghost">
                  Users
                </Link>
              </>
            )}
          </nav>
        </div>
        <div className="flex items-center gap-3">
          {email && (
            <span className="hidden text-xs text-brand-muted sm:inline">
              {email}
            </span>
          )}
          <form action="/auth/signout" method="post">
            <button type="submit" className="btn-secondary">
              Sign out
            </button>
          </form>
        </div>
      </div>
    </header>
  );
}

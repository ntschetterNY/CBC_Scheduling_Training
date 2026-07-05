import Link from "next/link";
import { Logo } from "./Logo";

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
  return (
    <header className="sticky top-0 z-30 border-b border-brand-border/70 bg-brand-bg/80 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <div className="flex items-center gap-6">
          <Link href="/dashboard" aria-label="CrossBridge Sound Training home">
            <Logo />
          </Link>
          <nav className="hidden items-center gap-1 md:flex">
            <Link href="/dashboard" className="btn-ghost">
              Dashboard
            </Link>
            <Link href="/learn" className="btn-ghost">
              Modules
            </Link>
            {isAdmin && (
              <Link href="/admin" className="btn-ghost">
                Team Progress
              </Link>
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

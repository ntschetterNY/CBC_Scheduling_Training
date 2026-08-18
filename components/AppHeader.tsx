import Link from "next/link";
import { Logo } from "./Logo";
import { NavMenu } from "./NavMenu";
import { ThemeToggle } from "./ThemeToggle";
import { isSuperAdmin } from "@/lib/access";

/**
 * Header for authenticated app pages. A few primary links stay inline on
 * large screens; the full site navigation (including all admin pages) lives
 * in the NavMenu dropdown, which is present at every viewport size.
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
    <header className="sticky top-0 z-30 border-b border-brand-border bg-brand-card/90 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6">
        <div className="flex min-w-0 items-center gap-6">
          <Link
            href="/"
            aria-label="CrossBridge Training Center home"
            className="flex shrink-0 items-center gap-3"
          >
            <Logo />
            <span className="hidden border-l border-brand-border pl-3 font-sans text-xs font-semibold uppercase tracking-[0.18em] text-brand-accentDark xl:inline">
              Training Center
            </span>
          </Link>
          <nav className="hidden items-center gap-2 lg:flex">
            <Link href="/dashboard" className="btn-ghost">
              Dashboard
            </Link>
            <Link href="/learn" className="btn-ghost">
              Modules
            </Link>
            <Link href="/schedule" className="btn-ghost">
              Schedule
            </Link>
            <Link href="/feature-requests" className="btn-ghost">
              Feedback
            </Link>
          </nav>
        </div>
        <div className="flex shrink-0 items-center gap-3">
          {email && (
            <span className="hidden max-w-[220px] truncate text-xs text-brand-muted 2xl:inline">
              {email}
            </span>
          )}
          <ThemeToggle />
          <NavMenu email={email} isAdmin={isAdmin} superAdmin={superAdmin} />
          <form action="/auth/signout" method="post" className="hidden sm:block">
            <button type="submit" className="btn-secondary">
              Sign out
            </button>
          </form>
        </div>
      </div>
    </header>
  );
}

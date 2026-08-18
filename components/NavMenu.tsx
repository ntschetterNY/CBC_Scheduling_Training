"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

type NavItem = { href: string; label: string };
type NavSection = { label: string | null; items: NavItem[] };

/**
 * Site-wide dropdown navigation. Visible at every viewport size (it's the
 * only nav on mobile) and holds every destination, grouped, so the header
 * bar can stay uncluttered no matter how many admin pages exist.
 */
export function NavMenu({
  email,
  isAdmin,
  superAdmin,
}: {
  email?: string | null;
  isAdmin?: boolean;
  superAdmin?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  // Close on outside click / Escape.
  useEffect(() => {
    if (!open) return;
    const onClick = (e: MouseEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  // Close when the route changes.
  useEffect(() => setOpen(false), [pathname]);

  const sections: NavSection[] = [
    {
      label: "Training",
      items: [
        { href: "/dashboard", label: "Dashboard" },
        { href: "/learn", label: "Sound Tech Modules" },
        { href: "/safety", label: "Safety & Security Modules" },
      ],
    },
    {
      label: "Serve Teams",
      items: [
        { href: "/schedule", label: "Serve Schedule" },
        { href: "/schedule/availability", label: "My Availability" },
      ],
    },
    {
      label: null,
      items: [{ href: "/feature-requests", label: "Feedback" }],
    },
  ];
  if (isAdmin || superAdmin) {
    sections.push({
      label: "Admin",
      items: [
        { href: "/admin", label: "Team Progress" },
        { href: "/admin/schedule", label: "Scheduling" },
        ...(superAdmin
          ? [
              { href: "/admin/analytics", label: "Time Analytics" },
              { href: "/admin/users", label: "Users" },
            ]
          : []),
      ],
    });
  }

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname === href;

  return (
    <div ref={rootRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-haspopup="menu"
        className="btn-secondary gap-2 px-4"
      >
        <span aria-hidden className="text-base leading-none">☰</span>
        Menu
      </button>

      {open && (
        <div
          role="menu"
          className="absolute right-0 top-full z-40 mt-2 w-72 overflow-hidden rounded-2xl
            border border-brand-border bg-white py-2 shadow-card"
        >
          {sections.map((section, i) => (
            <div
              key={i}
              className={i > 0 ? "mt-1 border-t border-brand-border/60 pt-2" : ""}
            >
              {section.label && (
                <p className="px-4 pb-1 pt-1.5 font-sans text-[10px] font-semibold uppercase tracking-[0.18em] text-brand-muted">
                  {section.label}
                </p>
              )}
              {section.items.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  role="menuitem"
                  className={`block px-4 py-2 font-sans text-sm transition-colors ${
                    isActive(item.href)
                      ? "bg-brand-surface font-semibold text-brand-accentDark"
                      : "text-brand-text hover:bg-brand-surface"
                  }`}
                >
                  {item.label}
                </Link>
              ))}
            </div>
          ))}

          {email && (
            <div className="mt-1 border-t border-brand-border/60 pt-1">
              <p className="px-4 pb-1 pt-1.5 font-sans text-xs text-brand-muted">
                Signed in as {email}
              </p>
              {/* Sign out lives here on small screens, where the header button is hidden. */}
              <form action="/auth/signout" method="post" className="sm:hidden">
                <button
                  type="submit"
                  className="block w-full px-4 py-2 text-left font-sans text-sm text-brand-text transition-colors hover:bg-brand-surface"
                >
                  Sign out
                </button>
              </form>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

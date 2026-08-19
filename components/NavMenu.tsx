"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

type NavItem = { href: string; label: string; icon: string };
type NavSection = { label: string | null; items: NavItem[] };

/**
 * Site-wide dropdown navigation. Visible at every viewport size (it's the
 * only nav on mobile) and holds every destination, grouped, so the header
 * bar can stay uncluttered no matter how many admin pages exist.
 *
 * On `sm+` it renders as a compact dropdown under the button; below `sm` it
 * becomes a full-width sheet pinned under the sticky header, with a backdrop,
 * 44px+ tap targets, its own scrolling, and a body scroll lock.
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

  // On phones, freeze the page behind the open sheet.
  useEffect(() => {
    if (!open || !window.matchMedia("(max-width: 639px)").matches) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  // Close when the route changes.
  useEffect(() => setOpen(false), [pathname]);

  const sections: NavSection[] = [
    {
      label: "Training",
      items: [
        { href: "/dashboard", label: "Dashboard", icon: "🏠" },
        { href: "/learn", label: "Sound Tech Modules", icon: "🎚️" },
        { href: "/safety", label: "Safety & Security Modules", icon: "🛡️" },
      ],
    },
    {
      label: "Serve Teams",
      items: [
        { href: "/schedule", label: "Serve Schedule", icon: "🗓️" },
        { href: "/schedule/availability", label: "My Availability", icon: "✈️" },
      ],
    },
    {
      label: null,
      items: [{ href: "/feature-requests", label: "Feedback", icon: "💬" }],
    },
  ];
  if (isAdmin || superAdmin) {
    sections.push({
      label: "Admin",
      items: [
        { href: "/admin", label: "Team Progress", icon: "📈" },
        { href: "/admin/schedule", label: "Scheduling", icon: "🔁" },
        ...(superAdmin
          ? [
              { href: "/admin/analytics", label: "Time Analytics", icon: "⏱️" },
              { href: "/admin/users", label: "Users", icon: "👥" },
              { href: "/admin/audit", label: "Audit Log", icon: "🔍" },
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
        <span aria-hidden className="text-base leading-none">
          {open ? "✕" : "☰"}
        </span>
        {open ? "Close" : "Menu"}
      </button>

      {open && (
        <>
          {/* Mobile backdrop: starts below the sticky header so the
              Menu/Close button stays reachable. */}
          <div
            aria-hidden
            onClick={() => setOpen(false)}
            className="fixed inset-x-0 bottom-0 top-16 z-40 bg-brand-teal/30 backdrop-blur-[2px] sm:hidden"
          />

          <div
            role="menu"
            className="fixed inset-x-3 top-[4.25rem] z-50 max-h-[calc(100dvh-5.25rem)]
              overflow-y-auto overscroll-contain rounded-2xl border border-brand-border
              bg-brand-card py-2 shadow-card
              sm:absolute sm:inset-x-auto sm:right-0 sm:top-full sm:mt-2 sm:max-h-none
              sm:w-72 sm:overflow-visible"
          >
            {sections.map((section, i) => (
              <div
                key={i}
                className={i > 0 ? "mt-1 border-t border-brand-border/60 pt-2" : ""}
              >
                {section.label && (
                  <p className="px-5 pb-1 pt-2 font-sans text-[10px] font-semibold uppercase tracking-[0.18em] text-brand-muted sm:px-4 sm:pt-1.5">
                    {section.label}
                  </p>
                )}
                {section.items.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    role="menuitem"
                    className={`flex items-center gap-3 px-5 py-3 font-sans text-base transition-colors
                      sm:px-4 sm:py-2 sm:text-sm ${
                        isActive(item.href)
                          ? "bg-brand-surface font-semibold text-brand-accentDark"
                          : "text-brand-text hover:bg-brand-surface"
                      }`}
                  >
                    <span aria-hidden className="w-5 text-center sm:hidden">
                      {item.icon}
                    </span>
                    {item.label}
                    {isActive(item.href) && (
                      <span aria-hidden className="ml-auto text-brand-accent">
                        •
                      </span>
                    )}
                  </Link>
                ))}
              </div>
            ))}

            {email && (
              <div className="mt-1 border-t border-brand-border/60 pt-1">
                <p className="truncate px-5 pb-1 pt-2 font-sans text-xs text-brand-muted sm:px-4 sm:pt-1.5">
                  Signed in as {email}
                </p>
                {/* Sign out lives here on small screens, where the header button is hidden. */}
                <form action="/auth/signout" method="post" className="sm:hidden">
                  <button
                    type="submit"
                    className="flex w-full items-center gap-3 px-5 py-3 text-left font-sans text-base text-brand-text transition-colors hover:bg-brand-surface"
                  >
                    <span aria-hidden className="w-5 text-center">👋</span>
                    Sign out
                  </button>
                </form>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}

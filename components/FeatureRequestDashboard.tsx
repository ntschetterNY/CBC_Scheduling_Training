"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { FeatureRequestForm } from "@/components/FeatureRequestForm";
import { FeatureRequestDetail } from "@/components/FeatureRequestDetail";
import {
  formatFrNumber,
  FR_SORTS,
  FR_TABS,
  PRIORITY_META,
  STATUS_META,
  TYPE_META,
  type FrSort,
  type FrStatus,
  type FrTab,
} from "@/lib/feature-requests";
import type { FeatureRequest } from "@/lib/github";

type DashData = {
  requests: FeatureRequest[];
  upvotes: Record<number, number>;
  myUpvotes: number[];
};

function timeAgo(iso: string): string {
  const days = Math.floor((Date.now() - new Date(iso).getTime()) / 86_400_000);
  if (days <= 0) return "today";
  if (days === 1) return "yesterday";
  if (days < 30) return `${days}d ago`;
  if (days < 365) return `${Math.floor(days / 30)}mo ago`;
  return `${Math.floor(days / 365)}y ago`;
}

export function FeatureRequestDashboard({
  initial,
  isAdmin,
  trackerConnected,
}: {
  initial: DashData;
  isAdmin: boolean;
  trackerConnected: boolean;
}) {
  const [requests, setRequests] = useState(initial.requests);
  const [upvotes, setUpvotes] = useState(initial.upvotes);
  const [myUpvotes, setMyUpvotes] = useState<Set<number>>(
    new Set(initial.myUpvotes)
  );
  const [tab, setTab] = useState<FrTab>("open");
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState<FrSort>("priority");
  const [selected, setSelected] = useState<number | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  // Deep link: /feature-requests?fr=12 opens that ticket's detail in-app, so
  // other pages can link straight to a request without leaving the app.
  const searchParams = useSearchParams();
  useEffect(() => {
    const raw = searchParams.get("fr");
    if (!raw) return;
    const n = Number.parseInt(raw, 10);
    if (Number.isInteger(n) && n > 0) setSelected(n);
  }, [searchParams]);

  async function refresh() {
    setRefreshing(true);
    try {
      const res = await fetch("/api/feature-requests", { cache: "no-store" });
      if (res.ok) {
        const json = (await res.json()) as DashData;
        setRequests(json.requests ?? []);
        setUpvotes(json.upvotes ?? {});
        setMyUpvotes(new Set(json.myUpvotes ?? []));
      }
    } finally {
      setRefreshing(false);
    }
  }

  async function toggleUpvote(n: number) {
    // Optimistic update, reconciled with the server response.
    const mine = myUpvotes.has(n);
    setMyUpvotes((prev) => {
      const next = new Set(prev);
      if (mine) next.delete(n);
      else next.add(n);
      return next;
    });
    setUpvotes((prev) => ({ ...prev, [n]: (prev[n] ?? 0) + (mine ? -1 : 1) }));
    try {
      const res = await fetch(`/api/feature-requests/${n}/upvote`, {
        method: "POST",
      });
      const json = await res.json().catch(() => ({}));
      if (res.ok) {
        setUpvotes((prev) => ({ ...prev, [n]: json.count ?? 0 }));
        setMyUpvotes((prev) => {
          const next = new Set(prev);
          if (json.upvoted) next.add(n);
          else next.delete(n);
          return next;
        });
      }
    } catch {
      // Leave the optimistic state; a manual refresh will reconcile.
    }
  }

  const counts = useMemo(() => {
    const c = { open: 0, pending: 0, implementation: 0, testing: 0, closed: 0 };
    for (const r of requests) {
      c[r.status] += 1;
      if (r.status !== "closed") c.open += 1;
    }
    return c;
  }, [requests]);

  const visible = useMemo(() => {
    const q = search.trim().toLowerCase();
    let list = requests.filter((r) => {
      if (tab === "open") return r.status !== "closed";
      if (tab === "all") return true;
      return r.status === tab;
    });
    if (q) {
      list = list.filter(
        (r) =>
          r.title.toLowerCase().includes(q) ||
          r.details.toLowerCase().includes(q) ||
          (r.requester ?? "").toLowerCase().includes(q) ||
          formatFrNumber(r.number).toLowerCase().includes(q)
      );
    }
    const statusRank: Record<FrStatus, number> = {
      pending: 0,
      implementation: 1,
      testing: 2,
      closed: 3,
    };
    const sorted = [...list];
    sorted.sort((a, b) => {
      switch (sort) {
        case "priority":
          return (
            PRIORITY_META[a.priority].rank - PRIORITY_META[b.priority].rank ||
            b.number - a.number
          );
        case "newest":
          return b.number - a.number;
        case "oldest":
          return a.number - b.number;
        case "upvotes":
          return (upvotes[b.number] ?? 0) - (upvotes[a.number] ?? 0);
        case "status":
          return statusRank[a.status] - statusRank[b.status] || b.number - a.number;
      }
    });
    return sorted;
  }, [requests, tab, search, sort, upvotes]);

  const selectedRequest =
    selected != null ? requests.find((r) => r.number === selected) ?? null : null;

  const statCards: { id: FrTab; label: string; n: number; dot: string }[] = [
    { id: "pending", label: "Pending", n: counts.pending, dot: STATUS_META.pending.dot },
    { id: "implementation", label: "Marked", n: counts.implementation, dot: STATUS_META.implementation.dot },
    { id: "testing", label: "Testing", n: counts.testing, dot: STATUS_META.testing.dot },
    { id: "closed", label: "Closed", n: counts.closed, dot: STATUS_META.closed.dot },
  ];

  return (
    <div>
      {/* Action row */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <button
          onClick={() => setShowForm((s) => !s)}
          className="btn-primary"
          disabled={!trackerConnected}
        >
          {showForm ? "Close form" : "+ File a request"}
        </button>
        <div className="flex items-center gap-2">
          <input
            className="input w-44 sm:w-56"
            placeholder="Search requests…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <select
            className="input w-auto"
            value={sort}
            onChange={(e) => setSort(e.target.value as FrSort)}
            aria-label="Sort"
          >
            {FR_SORTS.map((s) => (
              <option key={s.id} value={s.id}>
                {s.label}
              </option>
            ))}
          </select>
          <button
            onClick={refresh}
            className="btn-ghost"
            aria-label="Refresh"
            disabled={refreshing}
          >
            {refreshing ? "…" : "↻"}
          </button>
        </div>
      </div>

      {showForm && (
        <div className="mt-4">
          <FeatureRequestForm
            disabled={!trackerConnected}
            onFiled={() => {
              setShowForm(false);
              refresh();
            }}
          />
        </div>
      )}

      {/* Stat cards */}
      <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {statCards.map((s) => (
          <button
            key={s.id}
            onClick={() => setTab(s.id)}
            className={`card flex items-center justify-between p-4 text-left transition-colors ${
              tab === s.id ? "border-brand-accent/60" : "hover:border-brand-accent/30"
            }`}
          >
            <div>
              <p className="font-sans text-2xl font-semibold text-brand-text">
                {s.n}
              </p>
              <p className="mt-0.5 flex items-center gap-1.5 text-xs text-brand-muted">
                <span className={`h-2 w-2 rounded-full ${s.dot}`} />
                {s.label}
              </p>
            </div>
          </button>
        ))}
      </div>

      {/* Tabs */}
      <div className="mt-5 flex flex-wrap gap-1.5">
        {FR_TABS.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`rounded-full px-3.5 py-1.5 font-sans text-sm font-medium transition-colors ${
              tab === t.id
                ? "bg-brand-teal text-white"
                : "text-brand-muted hover:bg-brand-surface"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Cards */}
      <div className="mt-4 space-y-2.5">
        {visible.length === 0 ? (
          <div className="card p-8 text-center">
            <p className="text-3xl" aria-hidden>
              {tab === "closed" ? "📁" : "🎉"}
            </p>
            <p className="mt-2 font-semibold text-brand-text">
              Nothing here
            </p>
            <p className="mt-1 text-sm text-brand-muted">
              No requests match this view.
            </p>
          </div>
        ) : (
          visible.map((r) => (
            <TicketCard
              key={r.number}
              r={r}
              upvotes={upvotes[r.number] ?? 0}
              mine={myUpvotes.has(r.number)}
              onOpen={() => setSelected(r.number)}
              onUpvote={() => toggleUpvote(r.number)}
            />
          ))
        )}
      </div>

      {selectedRequest && (
        <FeatureRequestDetail
          request={selectedRequest}
          isAdmin={isAdmin}
          onClose={() => setSelected(null)}
          onChanged={refresh}
        />
      )}
    </div>
  );
}

function TicketCard({
  r,
  upvotes,
  mine,
  onOpen,
  onUpvote,
}: {
  r: FeatureRequest;
  upvotes: number;
  mine: boolean;
  onOpen: () => void;
  onUpvote: () => void;
}) {
  const sm = STATUS_META[r.status];
  const pm = PRIORITY_META[r.priority];
  return (
    <div
      role="button"
      tabIndex={0}
      onClick={onOpen}
      onKeyDown={(e) => (e.key === "Enter" ? onOpen() : null)}
      className="card group flex cursor-pointer items-start gap-3 p-4 transition-colors hover:border-brand-accent/50"
    >
      {/* Upvote pill */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          onUpvote();
        }}
        aria-label={mine ? "Remove upvote" : "Upvote"}
        className={`flex shrink-0 flex-col items-center rounded-lg border px-2.5 py-1.5 font-sans text-xs font-semibold transition-colors ${
          mine
            ? "border-brand-accent bg-brand-accent/10 text-brand-accentDark"
            : "border-brand-border text-brand-muted hover:border-brand-accent/50"
        }`}
      >
        <span aria-hidden>▲</span>
        <span>{upvotes}</span>
      </button>

      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <span className="font-mono text-[11px] font-bold text-brand-accentDark">
            {formatFrNumber(r.number)}
          </span>
          <span
            className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 font-sans text-[10px] font-bold uppercase tracking-wide ${sm.badge}`}
          >
            <span className={`h-1.5 w-1.5 rounded-full ${sm.dot}`} />
            {sm.short}
          </span>
          <span className="inline-flex items-center gap-1 text-[11px] text-brand-muted">
            <span className={`h-1.5 w-1.5 rounded-full ${pm.dot}`} />
            {r.priority}
          </span>
          <span className="text-[11px] text-brand-muted">
            {TYPE_META[r.type].glyph} {TYPE_META[r.type].label}
          </span>
        </div>
        <p className="mt-1 truncate font-sans text-[15px] font-medium text-brand-text">
          {r.title}
        </p>
        <p className="mt-0.5 text-xs text-brand-muted">
          {r.requester ?? r.author} · {timeAgo(r.createdAt)}
          {r.comments > 0 && <> · 💬 {r.comments}</>}
        </p>
      </div>

      <span className="mt-1 shrink-0 text-brand-muted transition-transform group-hover:translate-x-0.5 group-hover:text-brand-accent">
        →
      </span>
    </div>
  );
}

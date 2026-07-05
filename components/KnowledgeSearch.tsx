"use client";

/**
 * KnowledgeSearch — a searchable knowledge base over the whole curriculum.
 *
 * A tech on a Sunday morning can type a problem ("no sound", "buzz",
 * "blue mic static", "monitor jumps") and jump straight to the module and
 * lesson that answers it. Runs entirely client-side over the curriculum.
 */

import { useMemo, useState } from "react";
import Link from "next/link";
import { curriculum } from "@/lib/curriculum";

type Hit = {
  slug: string;
  order: number;
  title: string;
  icon: string;
  score: number;
  heading: string;
  snippet: string;
};

const STOP = new Set([
  "the", "a", "an", "is", "are", "to", "of", "and", "or", "in", "on", "for",
  "my", "how", "do", "i", "it", "with", "why", "what", "when", "not", "no",
  "cant", "can", "wont", "isnt", "there", "this", "that",
]);

function tokenize(s: string): string[] {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .filter((w) => w.length > 1 && !STOP.has(w));
}

/** Build a flat search corpus once. */
const CORPUS = curriculum.map((m) => {
  const fields = [
    { text: m.title, weight: 6, heading: m.title },
    { text: m.subtitle, weight: 4, heading: m.title },
    ...m.objectives.map((o) => ({ text: o, weight: 3, heading: "What you'll learn" })),
    ...m.sections.flatMap((s) => [
      { text: s.heading, weight: 5, heading: s.heading },
      { text: s.body, weight: 2, heading: s.heading },
      ...(s.tip ? [{ text: s.tip, weight: 3, heading: s.heading }] : []),
      ...(s.control ? [{ text: s.control, weight: 3, heading: s.heading }] : []),
    ]),
    ...m.quiz.map((q) => ({ text: q.question, weight: 2, heading: "Knowledge check" })),
  ];
  return {
    slug: m.slug,
    order: m.order,
    title: m.title,
    icon: m.icon,
    fields: fields.map((f) => ({ ...f, tokens: tokenize(f.text) })),
  };
});

function firstSentence(text: string, terms: string[]): string {
  // pick the sentence in `text` that best matches the query terms
  const sentences = text.split(/(?<=[.!?])\s+|\n+/).filter((s) => s.trim().length > 0);
  let best = sentences[0] ?? text;
  let bestScore = -1;
  for (const s of sentences) {
    const low = s.toLowerCase();
    const score = terms.reduce((acc, t) => acc + (low.includes(t) ? 1 : 0), 0);
    if (score > bestScore) {
      bestScore = score;
      best = s;
    }
  }
  const clean = best.trim().replace(/^[-\d.\s]+/, "");
  return clean.length > 180 ? clean.slice(0, 177).trimEnd() + "…" : clean;
}

const SUGGESTIONS = [
  "no sound from a mic",
  "buzz on stage",
  "feedback",
  "blue mic static",
  "monitor jumps with the house",
  "low battery",
  "recall the baseline",
  "which mic for a male singer",
  "stream has no audio",
];

export function KnowledgeSearch() {
  const [query, setQuery] = useState("");

  const hits = useMemo<Hit[]>(() => {
    const terms = tokenize(query);
    if (terms.length === 0) return [];

    const results: Hit[] = [];
    for (const m of CORPUS) {
      let score = 0;
      let bestField: { heading: string; text: string; weight: number } | null = null;
      let bestFieldScore = -1;

      for (const field of m.fields) {
        let fieldScore = 0;
        for (const term of terms) {
          for (const tok of field.tokens) {
            if (tok === term) fieldScore += field.weight;
            else if (tok.startsWith(term) || term.startsWith(tok)) fieldScore += field.weight * 0.5;
          }
        }
        if (fieldScore > 0) {
          score += fieldScore;
          if (fieldScore > bestFieldScore) {
            bestFieldScore = fieldScore;
            bestField = field;
          }
        }
      }

      if (score > 0 && bestField) {
        // pull a readable snippet from the matching section body
        const section = curriculum
          .find((c) => c.slug === m.slug)!
          .sections.find((s) => s.heading === bestField!.heading);
        const source = section?.body ?? bestField.text;
        results.push({
          slug: m.slug,
          order: m.order,
          title: m.title,
          icon: m.icon,
          score,
          heading: bestField.heading,
          snippet: firstSentence(source, terms),
        });
      }
    }
    return results.sort((a, b) => b.score - a.score).slice(0, 6);
  }, [query]);

  return (
    <div className="card overflow-hidden">
      <div className="border-b border-brand-border px-5 py-4">
        <h3 className="text-sm font-semibold text-brand-text">
          Knowledge Base — search a problem
        </h3>
        <p className="mt-0.5 text-xs text-brand-muted">
          Type what's happening and jump straight to the module that covers it.
        </p>
      </div>

      <div className="p-5">
        <div className="relative">
          <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-brand-muted">
            🔎
          </span>
          <input
            className="input pl-10"
            type="search"
            placeholder="e.g. “blue mic static” or “no sound from a mic”"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            aria-label="Search the training knowledge base"
          />
        </div>

        {query.trim().length === 0 ? (
          <div className="mt-4">
            <p className="text-xs font-semibold uppercase tracking-wider text-brand-muted">
              Common questions
            </p>
            <div className="mt-2 flex flex-wrap gap-2">
              {SUGGESTIONS.map((s) => (
                <button
                  key={s}
                  onClick={() => setQuery(s)}
                  className="rounded-full border border-brand-border bg-white px-3 py-1 text-xs font-medium text-brand-muted transition-colors hover:border-brand-accent/50 hover:text-brand-text"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        ) : hits.length === 0 ? (
          <p className="mt-4 text-sm text-brand-muted">
            No matches. Try different words — like “feedback”, “battery”, “scene”, or “monitor”.
          </p>
        ) : (
          <ul className="mt-4 space-y-2">
            {hits.map((h) => (
              <li key={h.slug}>
                <Link
                  href={`/learn/${h.slug}`}
                  className="group flex items-start gap-3 rounded-xl border border-brand-border bg-white p-3 transition-colors hover:border-brand-accent/50"
                >
                  <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-brand-surface text-lg">
                    {h.icon}
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-semibold uppercase tracking-wider text-brand-muted">
                        Module {h.order}
                      </span>
                      <span className="truncate text-sm font-bold text-brand-text">
                        {h.title}
                      </span>
                    </div>
                    <p className="text-xs font-semibold text-brand-accentDark">
                      {h.heading}
                    </p>
                    <p className="mt-0.5 text-xs text-brand-muted">{h.snippet}</p>
                  </div>
                  <span className="mt-1 text-brand-muted transition-transform group-hover:translate-x-0.5 group-hover:text-brand-accent">
                    →
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

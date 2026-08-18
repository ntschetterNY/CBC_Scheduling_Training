"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

/**
 * Screen-only controls for the day sheet: previous / next service date,
 * a free date picker for ad hoc lookups, and the print button. The print
 * button uses the browser's print dialog, which doubles as "Save as PDF"
 * everywhere, so the sheet needs no PDF library or server rendering.
 */
export function DaySheetControls({
  date,
  prevDate,
  nextDate,
}: {
  date: string;
  prevDate: string | null;
  nextDate: string | null;
}) {
  const router = useRouter();

  return (
    <div className="flex flex-wrap items-center gap-2 print:hidden">
      {prevDate ? (
        <Link href={`/schedule/day/${prevDate}`} className="btn-secondary">
          ← Previous
        </Link>
      ) : (
        <span className="btn-secondary opacity-40" aria-disabled>
          ← Previous
        </span>
      )}
      {nextDate ? (
        <Link href={`/schedule/day/${nextDate}`} className="btn-secondary">
          Next →
        </Link>
      ) : (
        <span className="btn-secondary opacity-40" aria-disabled>
          Next →
        </span>
      )}
      <input
        type="date"
        value={date}
        onChange={(e) => {
          if (e.target.value) router.push(`/schedule/day/${e.target.value}`);
        }}
        className="input w-auto"
        aria-label="Jump to date"
      />
      <button type="button" onClick={() => window.print()} className="btn-primary">
        Print / Save PDF
      </button>
    </div>
  );
}

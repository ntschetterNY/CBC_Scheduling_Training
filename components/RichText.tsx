/**
 * Minimal renderer for the lesson body text. Splits on blank lines into
 * blocks; within a block, consecutive "- " lines become a bullet list,
 * consecutive "1. " lines become a numbered list, and any other lines are
 * paragraphs — so an intro line followed by bullets renders correctly.
 * Keeps content authoring simple (plain strings in curriculum.ts).
 */

function Bullets({ lines }: { lines: string[] }) {
  return (
    <ul className="space-y-1.5 pl-1">
      {lines.map((l, j) => (
        <li key={j} className="flex gap-2.5 prose-body">
          <span className="mt-[9px] h-1.5 w-1.5 shrink-0 rounded-full bg-brand-accent" />
          <span>{l.replace(/^-\s+/, "")}</span>
        </li>
      ))}
    </ul>
  );
}

function Numbered({ lines }: { lines: string[] }) {
  return (
    <ol className="space-y-1.5">
      {lines.map((l, j) => {
        const m = l.match(/^(\d+)\.\s+(.*)$/);
        return (
          <li key={j} className="flex gap-3 prose-body">
            <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-brand-surface text-xs font-bold text-brand-accent">
              {m ? m[1] : j + 1}
            </span>
            <span className="pt-0.5">{m ? m[2] : l}</span>
          </li>
        );
      })}
    </ol>
  );
}

export function RichText({ text }: { text: string }) {
  const blocks = text.split("\n\n");
  return (
    <div className="space-y-3">
      {blocks.map((block, i) => {
        const lines = block.split("\n");

        // Markdown-style table: every line starts with "|".
        const isTable =
          lines.length >= 2 && lines.every((l) => l.trim().startsWith("|"));
        if (isTable) {
          const rows = lines.map((l) =>
            l
              .trim()
              .replace(/^\|/, "")
              .replace(/\|$/, "")
              .split("|")
              .map((c) => c.trim())
          );
          const isSep = (r: string[]) =>
            r.every((c) => /^:?-{2,}:?$/.test(c));
          let header: string[] | null = null;
          let bodyRows = rows;
          if (rows.length >= 2 && isSep(rows[1])) {
            header = rows[0];
            bodyRows = rows.slice(2);
          }
          return (
            <div
              key={i}
              className="overflow-x-auto rounded-xl border border-brand-border"
            >
              <table className="w-full border-collapse text-left text-sm">
                {header && (
                  <thead>
                    <tr className="bg-brand-surface">
                      {header.map((c, k) => (
                        <th
                          key={k}
                          className="whitespace-nowrap px-3 py-2 font-sans text-xs font-semibold uppercase tracking-wide text-brand-muted"
                        >
                          {c}
                        </th>
                      ))}
                    </tr>
                  </thead>
                )}
                <tbody>
                  {bodyRows.map((r, ri) => (
                    <tr
                      key={ri}
                      className="border-t border-brand-border/70 align-top"
                    >
                      {r.map((c, ci) => (
                        <td
                          key={ci}
                          className={`px-3 py-2 ${
                            ci === 0
                              ? "font-sans font-semibold text-brand-text"
                              : "text-brand-text/80"
                          }`}
                        >
                          {c || "—"}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          );
        }

        // Group the block's lines into runs: bullets, numbered items, or
        // plain paragraph lines. A block like "Intro:\n- a\n- b" renders as
        // a paragraph followed by a proper list instead of a run-on string.
        type Run = { kind: "ul" | "ol" | "p"; lines: string[] };
        const kindOf = (l: string): Run["kind"] =>
          l.trim().startsWith("- ") ? "ul" : /^\d+\.\s/.test(l.trim()) ? "ol" : "p";
        const runs: Run[] = [];
        for (const line of lines) {
          const kind = kindOf(line);
          const last = runs[runs.length - 1];
          if (last && last.kind === kind) last.lines.push(line.trim());
          else runs.push({ kind, lines: [line.trim()] });
        }
        return (
          <div key={i} className="space-y-3">
            {runs.map((run, ri) =>
              run.kind === "ul" ? (
                <Bullets key={ri} lines={run.lines} />
              ) : run.kind === "ol" ? (
                <Numbered key={ri} lines={run.lines} />
              ) : (
                <p key={ri} className="prose-body">
                  {run.lines.join(" ")}
                </p>
              )
            )}
          </div>
        );
      })}
    </div>
  );
}

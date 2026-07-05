/**
 * Minimal renderer for the lesson body text. Splits on blank lines into
 * paragraphs and renders lines beginning with "- " as a bullet list.
 * Keeps content authoring simple (plain strings in curriculum.ts).
 */
export function RichText({ text }: { text: string }) {
  const blocks = text.split("\n\n");
  return (
    <div className="space-y-3">
      {blocks.map((block, i) => {
        const lines = block.split("\n");
        const isList = lines.every((l) => l.trim().startsWith("- "));
        if (isList) {
          return (
            <ul key={i} className="space-y-1.5 pl-1">
              {lines.map((l, j) => (
                <li key={j} className="flex gap-2.5 prose-body">
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-accent" />
                  <span>{l.replace(/^-\s+/, "")}</span>
                </li>
              ))}
            </ul>
          );
        }
        // Numbered lists (lines like "1. ")
        const isNumbered = lines.every((l) => /^\d+\.\s/.test(l.trim()));
        if (isNumbered) {
          return (
            <ol key={i} className="space-y-1.5">
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
        return (
          <p key={i} className="prose-body">
            {block}
          </p>
        );
      })}
    </div>
  );
}

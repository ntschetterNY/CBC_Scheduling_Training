import { existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");

// The one seam the tests stub: the cookie-bound Supabase server client
// (needs a Next.js request context). Everything else under "@/" resolves to
// the real source so the gate logic under test is the production code.
const OVERRIDES = new Map([
  ["@/lib/supabase/server", path.join(ROOT, "tests/setup/supabase-server-stub.ts")],
]);

function withExtension(base) {
  for (const candidate of [base, `${base}.ts`, `${base}.tsx`, `${base}/index.ts`]) {
    if (existsSync(candidate)) return candidate;
  }
  return base;
}

export async function resolve(specifier, context, nextResolve) {
  const override = OVERRIDES.get(specifier);
  if (override) return nextResolve(pathToFileURL(override).href, context);
  // next exposes "next/server" via a root .js shim, not an exports entry.
  if (specifier === "next/server") return nextResolve("next/server.js", context);
  if (specifier.startsWith("@/")) {
    const file = withExtension(path.join(ROOT, specifier.slice(2)));
    return nextResolve(pathToFileURL(file).href, context);
  }
  return nextResolve(specifier, context);
}

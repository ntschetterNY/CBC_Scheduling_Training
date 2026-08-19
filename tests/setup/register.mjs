import { register } from "node:module";

// Route "@/..." imports (and the Supabase server-client stub swap) through
// the resolver in loader.mjs so lib modules load unmodified under node:test.
register("./loader.mjs", import.meta.url);

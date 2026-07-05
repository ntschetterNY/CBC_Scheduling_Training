import { createClient } from "@/lib/supabase/server";

export type ProgressRow = {
  module_slug: string;
  status: "in_progress" | "completed";
  quiz_score: number | null;
  quiz_total: number | null;
  completed_at: string | null;
};

/** Fetch the signed-in user's progress rows, keyed by module slug. */
export async function getMyProgress(): Promise<Record<string, ProgressRow>> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return {};

  const { data } = await supabase
    .from("module_progress")
    .select("module_slug,status,quiz_score,quiz_total,completed_at")
    .eq("user_id", user.id);

  const map: Record<string, ProgressRow> = {};
  for (const row of data ?? []) map[row.module_slug] = row as ProgressRow;
  return map;
}

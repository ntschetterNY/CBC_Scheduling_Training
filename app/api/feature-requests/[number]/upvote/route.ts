import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getActor } from "@/lib/fr-server";

function parseNumber(raw: string): number | null {
  const n = Number.parseInt(raw, 10);
  return Number.isInteger(n) && n > 0 ? n : null;
}

/**
 * POST — toggle the current user's upvote on a ticket. Returns the new count
 * and whether the caller is now upvoting it.
 */
export async function POST(
  _req: Request,
  { params }: { params: Promise<{ number: string }> }
) {
  const actor = await getActor();
  if (!actor) {
    return NextResponse.json(
      { error: "You must be signed in to upvote." },
      { status: 401 }
    );
  }
  const number = parseNumber((await params).number);
  if (!number) {
    return NextResponse.json({ error: "Bad ticket number." }, { status: 400 });
  }

  const supabase = await createClient();

  // Is there an existing vote by this user?
  const { data: existing } = await supabase
    .from("feature_request_upvotes")
    .select("issue_number")
    .eq("issue_number", number)
    .eq("user_id", actor.id)
    .maybeSingle();

  let upvoted: boolean;
  if (existing) {
    const { error } = await supabase
      .from("feature_request_upvotes")
      .delete()
      .eq("issue_number", number)
      .eq("user_id", actor.id);
    if (error) {
      return NextResponse.json({ error: "Could not remove your vote." }, { status: 502 });
    }
    upvoted = false;
  } else {
    const { error } = await supabase
      .from("feature_request_upvotes")
      .insert({ issue_number: number, user_id: actor.id });
    if (error) {
      return NextResponse.json({ error: "Could not record your vote." }, { status: 502 });
    }
    upvoted = true;
  }

  const { count } = await supabase
    .from("feature_request_upvotes")
    .select("*", { count: "exact", head: true })
    .eq("issue_number", number);

  return NextResponse.json({ upvoted, count: count ?? 0 });
}

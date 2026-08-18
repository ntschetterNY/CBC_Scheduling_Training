import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

/**
 * /schedule/day lands on the most relevant service date: the next upcoming
 * one, falling back to the most recent past one, then to today.
 */
export default async function DayIndexPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login?redirectedFrom=/schedule/day");

  const today = new Date().toISOString().slice(0, 10);

  const [{ data: upcoming }, { data: recent }] = await Promise.all([
    supabase
      .from("assignments")
      .select("service_date")
      .gte("service_date", today)
      .order("service_date")
      .limit(1),
    supabase
      .from("assignments")
      .select("service_date")
      .lt("service_date", today)
      .order("service_date", { ascending: false })
      .limit(1),
  ]);

  const date = upcoming?.[0]?.service_date ?? recent?.[0]?.service_date ?? today;
  redirect(`/schedule/day/${date}`);
}

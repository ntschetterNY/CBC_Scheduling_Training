import { NextResponse } from "next/server";
import {
  buildPollEmail,
  buildReminderEmail,
  isEmailConfigured,
  sendEmail,
} from "@/lib/email";
import { getScheduleActor } from "@/lib/scheduling/server";

/**
 * POST /api/schedule/notify — send reminder or availability-poll emails for
 * a team's upcoming assignments.
 *
 * Body: { teamId: string, kind: "reminder" | "availability_poll", weeks?: number }
 *
 * Works today even though Resend isn't configured yet: sends are skipped
 * (and logged as skipped_unconfigured) so the flow can be exercised
 * end-to-end, and it starts delivering as soon as RESEND_API_KEY +
 * SCHEDULE_FROM_EMAIL are set. Polls create a tokenized confirmation row per
 * assignment; the emailed link answers through /schedule/confirm without a
 * login.
 */
export async function POST(req: Request) {
  const actor = await getScheduleActor();
  if (!actor) return NextResponse.json({ error: "Not signed in." }, { status: 401 });
  if (!actor.isAdmin) return NextResponse.json({ error: "Admins only." }, { status: 403 });
  const { supabase } = actor;

  let body: { teamId?: string; kind?: string; weeks?: number };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }
  const { teamId } = body;
  const kind = body.kind === "reminder" ? "reminder" : "availability_poll";
  if (!teamId) return NextResponse.json({ error: "teamId is required." }, { status: 400 });
  const weeks = Math.min(Math.max(Math.trunc(body.weeks ?? 2), 1), 12);

  const today = new Date().toISOString().slice(0, 10);
  const until = new Date();
  until.setUTCDate(until.getUTCDate() + weeks * 7);

  const { data: assignments, error } = await supabase
    .from("assignments")
    .select(
      "id, service_date, status, people!inner(id, full_name, email), schedule_roles!inner(name), teams!inner(name)"
    )
    .eq("team_id", teamId)
    .gte("service_date", today)
    .lte("service_date", until.toISOString().slice(0, 10))
    .order("service_date");
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  let sent = 0;
  let skipped = 0;
  let errors = 0;
  let noEmail = 0;

  for (const a of assignments ?? []) {
    const person = a.people as unknown as { full_name: string; email: string | null };
    const roleName = (a.schedule_roles as unknown as { name: string }).name;
    const teamName = (a.teams as unknown as { name: string }).name;

    if (!person.email) {
      noEmail++;
      continue;
    }

    let subject: string;
    let html: string;
    if (kind === "availability_poll") {
      // Skip people who already answered this assignment's poll.
      const { data: existing } = await supabase
        .from("assignment_confirmations")
        .select("id, response")
        .eq("assignment_id", a.id)
        .not("response", "is", null)
        .limit(1);
      if (existing && existing.length > 0) continue;

      const { data: conf, error: confErr } = await supabase
        .from("assignment_confirmations")
        .insert({ assignment_id: a.id, sent_at: new Date().toISOString() })
        .select("token")
        .single();
      if (confErr || !conf) {
        errors++;
        continue;
      }
      ({ subject, html } = buildPollEmail({
        personName: person.full_name,
        roleName,
        teamName,
        serviceDate: a.service_date,
        token: conf.token,
      }));
    } else {
      ({ subject, html } = buildReminderEmail({
        personName: person.full_name,
        roleName,
        teamName,
        serviceDate: a.service_date,
      }));
    }

    const result = await sendEmail({ to: person.email, subject, html });
    if (result.ok) sent++;
    else if (result.skipped) skipped++;
    else errors++;

    await supabase.from("email_log").insert({
      kind,
      to_email: person.email,
      assignment_id: a.id,
      status: result.ok ? "sent" : result.skipped ? "skipped_unconfigured" : "error",
      detail: result.error ?? null,
    });
  }

  return NextResponse.json({
    kind,
    emailConfigured: isEmailConfigured,
    sent,
    skipped,
    errors,
    noEmail,
  });
}

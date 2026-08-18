/**
 * Email sending via Resend — prepped but dormant until DNS is verified.
 *
 * Configure by setting (e.g. `vercel env add`):
 *   RESEND_API_KEY       from https://resend.com/api-keys
 *   SCHEDULE_FROM_EMAIL  e.g. "CrossBridge Scheduling <scheduling@crossbridgechurch.org>"
 *                        (the domain must be verified in Resend first)
 *   NEXT_PUBLIC_APP_URL  e.g. https://training.crossbridgechurch.org — used to
 *                        build links in emails
 *
 * Until those are set, every send is a graceful no-op that reports
 * `skipped: true`, so the notify endpoints can be exercised end-to-end today
 * and simply start delivering once DNS is ready. Uses Resend's REST API via
 * fetch — no SDK dependency.
 */

export const isEmailConfigured = Boolean(
  process.env.RESEND_API_KEY && process.env.SCHEDULE_FROM_EMAIL
);

export function appBaseUrl(): string {
  return (
    process.env.NEXT_PUBLIC_APP_URL ||
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000")
  );
}

export interface SendResult {
  ok: boolean;
  skipped: boolean;
  error?: string;
}

export async function sendEmail({
  to,
  subject,
  html,
}: {
  to: string;
  subject: string;
  html: string;
}): Promise<SendResult> {
  if (!isEmailConfigured) {
    console.log(`[email] skipped (Resend not configured): "${subject}" -> ${to}`);
    return { ok: false, skipped: true };
  }
  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: process.env.SCHEDULE_FROM_EMAIL,
        to: [to],
        subject,
        html,
      }),
    });
    if (!res.ok) {
      const detail = await res.text();
      return { ok: false, skipped: false, error: `Resend ${res.status}: ${detail.slice(0, 300)}` };
    }
    return { ok: true, skipped: false };
  } catch (err) {
    return { ok: false, skipped: false, error: String(err) };
  }
}

/* ------------------------------------------------------------------ */
/* Templates                                                          */
/* ------------------------------------------------------------------ */

const wrap = (body: string) => `
  <div style="font-family: Georgia, serif; color: #232b2e; max-width: 560px; margin: 0 auto; padding: 24px;">
    <p style="font-family: 'Helvetica Neue', Arial, sans-serif; font-size: 11px; letter-spacing: 0.18em; text-transform: uppercase; color: #8a6d2f; margin: 0 0 16px;">
      CrossBridge Serve Teams
    </p>
    ${body}
    <p style="font-size: 12px; color: #7a8489; margin-top: 32px;">
      Need to change your availability? Sign in and add blackout dates at
      <a href="${appBaseUrl()}/schedule/availability" style="color: #1e5162;">${appBaseUrl()}/schedule/availability</a>.
    </p>
  </div>`;

const prettyDate = (iso: string) =>
  new Date(iso + "T00:00:00").toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });

/** Upcoming-assignment reminder. */
export function buildReminderEmail({
  personName,
  roleName,
  teamName,
  serviceDate,
}: {
  personName: string;
  roleName: string;
  teamName: string;
  serviceDate: string;
}): { subject: string; html: string } {
  return {
    subject: `Reminder: ${roleName} this ${prettyDate(serviceDate)}`,
    html: wrap(`
      <p>Hi ${personName},</p>
      <p>A quick reminder that you're scheduled as <strong>${roleName}</strong>
      (${teamName}) on <strong>${prettyDate(serviceDate)}</strong>.</p>
      <p>Thank you for serving!</p>`),
  };
}

/** Availability poll — asks the person to confirm or decline via token link. */
export function buildPollEmail({
  personName,
  roleName,
  teamName,
  serviceDate,
  token,
}: {
  personName: string;
  roleName: string;
  teamName: string;
  serviceDate: string;
  token: string;
}): { subject: string; html: string } {
  const url = `${appBaseUrl()}/schedule/confirm?token=${token}`;
  return {
    subject: `Are you available? ${roleName} on ${prettyDate(serviceDate)}`,
    html: wrap(`
      <p>Hi ${personName},</p>
      <p>You're scheduled as <strong>${roleName}</strong> (${teamName}) on
      <strong>${prettyDate(serviceDate)}</strong>. Can you serve that day?</p>
      <p style="margin: 24px 0;">
        <a href="${url}&response=yes"
           style="background: #b08a2e; color: #ffffff; padding: 10px 22px; border-radius: 999px; text-decoration: none; font-family: 'Helvetica Neue', Arial, sans-serif; font-size: 14px; font-weight: 600;">
          Yes, I'm available
        </a>
        &nbsp;&nbsp;
        <a href="${url}&response=no"
           style="border: 1px solid #cfd6d5; color: #232b2e; padding: 10px 22px; border-radius: 999px; text-decoration: none; font-family: 'Helvetica Neue', Arial, sans-serif; font-size: 14px; font-weight: 600;">
          No, I need a sub
        </a>
      </p>
      <p style="font-size: 13px; color: #7a8489;">Or open
      <a href="${url}" style="color: #1e5162;">this link</a> to respond.</p>`),
  };
}

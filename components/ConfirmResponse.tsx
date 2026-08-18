"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

type Details = {
  person_name: string | null;
  role_name: string;
  team_name: string;
  service_date: string;
  response: string | null;
  responded_at: string | null;
};

const prettyDate = (iso: string) =>
  new Date(iso + "T00:00:00").toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });

export function ConfirmResponse() {
  const params = useSearchParams();
  const token = params.get("token");
  const presetResponse = params.get("response"); // yes | no from the email buttons
  const supabase = createClient();

  const [details, setDetails] = useState<Details | null>(null);
  const [state, setState] = useState<"loading" | "ready" | "done" | "invalid" | "error">(
    "loading"
  );
  const [answer, setAnswer] = useState<string | null>(null);

  const respond = useCallback(
    async (response: "yes" | "no") => {
      if (!token) return;
      const { data, error } = await supabase.rpc("respond_to_confirmation", {
        p_token: token,
        p_response: response,
      });
      if (error) setState("error");
      else if (!data) setState("invalid");
      else {
        setAnswer(response);
        setState("done");
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [token]
  );

  useEffect(() => {
    if (!token) {
      setState("invalid");
      return;
    }
    (async () => {
      const { data, error } = await supabase.rpc("confirmation_details", {
        p_token: token,
      });
      const row = Array.isArray(data) ? (data[0] as Details | undefined) : undefined;
      if (error) return setState("error");
      if (!row) return setState("invalid");
      setDetails(row);
      if (row.response) {
        setAnswer(row.response);
        setState("done");
      } else if (presetResponse === "yes" || presetResponse === "no") {
        await respond(presetResponse);
      } else {
        setState("ready");
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  return (
    <div className="card w-full max-w-md p-8 text-center">
      <p className="eyebrow mb-3">CrossBridge Serve Teams</p>

      {state === "loading" && <p className="prose-body">Looking that up…</p>}

      {state === "invalid" && (
        <>
          <h1 className="section-title mb-2">Link not found</h1>
          <p className="prose-body text-sm">
            This confirmation link is invalid or has been replaced by a newer
            one. Check your latest email, or contact your team lead.
          </p>
        </>
      )}

      {state === "error" && (
        <>
          <h1 className="section-title mb-2">Something went wrong</h1>
          <p className="prose-body text-sm">
            We couldn't record your response. Please try again in a moment.
          </p>
        </>
      )}

      {details && (state === "ready" || state === "done") && (
        <>
          <h1 className="section-title mb-1">
            {details.role_name}
          </h1>
          <p className="prose-body mb-6 text-sm">
            {details.team_name} · {prettyDate(details.service_date)}
            {details.person_name && <> · {details.person_name}</>}
          </p>

          {state === "ready" ? (
            <>
              <p className="prose-body mb-4 text-sm">Can you serve that day?</p>
              <div className="flex justify-center gap-3">
                <button onClick={() => void respond("yes")} className="btn-primary">
                  Yes, I'm available
                </button>
                <button onClick={() => void respond("no")} className="btn-secondary">
                  No, I need a sub
                </button>
              </div>
            </>
          ) : (
            <p className="prose-body text-sm">
              {answer === "yes" ? (
                <>
                  <span className="font-semibold text-brand-success">
                    You're confirmed.
                  </span>{" "}
                  Thanks for serving!
                </>
              ) : (
                <>
                  <span className="font-semibold text-red-600">
                    Marked unavailable.
                  </span>{" "}
                  Your team lead will arrange a substitute.
                </>
              )}
            </p>
          )}
        </>
      )}

      <p className="mt-8 font-sans text-xs text-brand-muted">
        <Link href="/schedule" className="hover:text-brand-accentDark">
          View the full schedule →
        </Link>
      </p>
    </div>
  );
}

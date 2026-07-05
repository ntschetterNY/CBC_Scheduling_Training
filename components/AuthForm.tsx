"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

type Mode = "signin" | "signup";
// credentials -> (enroll | challenge) -> done. "loading" is the brief decide
// window when we arrive already signed in and are figuring out which is next.
type Step = "credentials" | "loading" | "enroll" | "challenge";

export function AuthForm({
  redirectTo = "/dashboard",
  mfaPending = false,
}: {
  redirectTo?: string;
  mfaPending?: boolean;
}) {
  const router = useRouter();
  const supabase = useMemo(() => createClient(), []);

  const [step, setStep] = useState<Step>(mfaPending ? "loading" : "credentials");
  const [mode, setMode] = useState<Mode>("signin");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [code, setCode] = useState("");
  const [factorId, setFactorId] = useState<string | null>(null);
  const [qr, setQr] = useState<string | null>(null);
  const [secret, setSecret] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  const configured =
    !!process.env.NEXT_PUBLIC_SUPABASE_URL &&
    !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  // Arrived already signed in (e.g. bounced here by middleware to finish MFA):
  // decide whether to enroll a first authenticator or challenge an existing one.
  useEffect(() => {
    if (mfaPending) routeAfterAuth();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mfaPending]);

  function errMsg(err: unknown) {
    return err instanceof Error ? err.message : "Something went wrong.";
  }

  function finish() {
    router.push(redirectTo);
    router.refresh();
  }

  /** After a password sign-in (or on an MFA-pending visit) pick the next step. */
  async function routeAfterAuth() {
    setError(null);
    try {
      const { data: aal, error: aalErr } =
        await supabase.auth.mfa.getAuthenticatorAssuranceLevel();
      if (aalErr) throw aalErr;
      if (aal?.currentLevel === "aal2") {
        finish();
        return;
      }

      const { data: factors, error: fErr } =
        await supabase.auth.mfa.listFactors();
      if (fErr) throw fErr;

      const verified = factors?.totp?.find((f) => f.status === "verified");
      if (verified) {
        setFactorId(verified.id);
        setCode("");
        setStep("challenge");
      } else {
        await beginEnroll();
      }
    } catch (err) {
      setError(errMsg(err));
      setStep("credentials");
    }
  }

  /** Create a fresh TOTP factor and show its QR code for scanning. */
  async function beginEnroll() {
    // Drop any half-finished factors so a re-attempt doesn't collide.
    const { data: existing } = await supabase.auth.mfa.listFactors();
    for (const f of existing?.all ?? []) {
      if (f.status === "unverified") {
        await supabase.auth.mfa.unenroll({ factorId: f.id });
      }
    }

    const { data, error } = await supabase.auth.mfa.enroll({
      factorType: "totp",
      friendlyName: "Authenticator",
    });
    if (error) throw error;

    setFactorId(data.id);
    setQr(data.totp.qr_code);
    setSecret(data.totp.secret);
    setCode("");
    setStep("enroll");
  }

  async function handleCredentials(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setNotice(null);
    setLoading(true);
    try {
      if (mode === "signup") {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: { data: { full_name: fullName } },
        });
        if (error) throw error;

        // With email confirmation off, signUp returns a live session and we go
        // straight to authenticator setup. Otherwise, point them at sign-in.
        if (data.session) {
          setStep("loading");
          await routeAfterAuth();
          return;
        }
        setNotice(
          "Account created. Sign in with your email and password to set up your authenticator."
        );
        setPassword("");
        setMode("signin");
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
        setStep("loading");
        await routeAfterAuth();
        return;
      }
    } catch (err) {
      setError(errMsg(err));
    } finally {
      setLoading(false);
    }
  }

  async function handleCode(e: React.FormEvent) {
    e.preventDefault();
    if (!factorId) return;
    setError(null);
    setLoading(true);
    try {
      const { error } = await supabase.auth.mfa.challengeAndVerify({
        factorId,
        code: code.trim(),
      });
      if (error) throw error;
      finish();
    } catch (err) {
      setError(errMsg(err));
      setCode("");
    } finally {
      setLoading(false);
    }
  }

  /** Bail out of an MFA step (wrong account, etc.) back to a clean sign-in. */
  async function handleCancel() {
    setLoading(true);
    try {
      await supabase.auth.signOut();
    } catch {
      // ignore — we're resetting the UI regardless
    }
    setPassword("");
    setCode("");
    setFactorId(null);
    setQr(null);
    setSecret(null);
    setError(null);
    setNotice(null);
    setStep("credentials");
    setLoading(false);
  }

  const codeField = (
    <div>
      <label className="mb-1.5 block text-sm font-medium text-brand-text">
        6-digit code
      </label>
      <input
        className="input text-center text-lg tracking-[0.4em]"
        inputMode="numeric"
        autoComplete="one-time-code"
        pattern="[0-9]*"
        maxLength={6}
        required
        autoFocus
        value={code}
        onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
        placeholder="000000"
      />
    </div>
  );

  const alerts = (
    <>
      {error && (
        <p className="rounded-lg bg-brand-danger/10 px-3 py-2 text-sm text-brand-danger">
          {error}
        </p>
      )}
      {notice && (
        <p className="rounded-lg bg-brand-success/10 px-3 py-2 text-sm text-brand-success">
          {notice}
        </p>
      )}
    </>
  );

  return (
    <div className="card p-6 sm:p-8">
      {!configured && (
        <div className="mb-5 rounded-lg border border-brand-danger/40 bg-brand-danger/10 p-3 text-xs text-brand-text/90">
          <strong>Supabase isn’t configured yet.</strong> Add{" "}
          <code>NEXT_PUBLIC_SUPABASE_URL</code> and{" "}
          <code>NEXT_PUBLIC_SUPABASE_ANON_KEY</code> to your environment
          (see <code>README.md</code>) to enable sign-in.
        </div>
      )}

      {step === "loading" && (
        <p className="py-8 text-center text-sm text-brand-muted">
          Checking your security setup…
        </p>
      )}

      {step === "credentials" && (
        <>
          <div className="mb-6 flex rounded-lg border border-brand-border bg-brand-surface p-1 text-sm">
            {[
              { id: "signin", label: "Sign in" },
              { id: "signup", label: "Create account" },
            ].map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => {
                  setMode(t.id as Mode);
                  setError(null);
                  setNotice(null);
                }}
                className={`flex-1 rounded-md px-3 py-2 font-medium transition-colors ${
                  mode === t.id
                    ? "bg-brand-accent text-brand-bg"
                    : "text-brand-muted hover:text-brand-text"
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>

          <form onSubmit={handleCredentials} className="space-y-4">
            {mode === "signup" && (
              <div>
                <label className="mb-1.5 block text-sm font-medium text-brand-text">
                  Full name
                </label>
                <input
                  className="input"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Jordan Tech"
                  autoComplete="name"
                />
              </div>
            )}

            <div>
              <label className="mb-1.5 block text-sm font-medium text-brand-text">
                Email
              </label>
              <input
                className="input"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@crossbridge.church"
                autoComplete="email"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-brand-text">
                Password
              </label>
              <input
                className="input"
                type="password"
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                autoComplete={
                  mode === "signup" ? "new-password" : "current-password"
                }
              />
            </div>

            {alerts}

            <button
              type="submit"
              className="btn-primary w-full py-3"
              disabled={loading || !configured}
            >
              {loading
                ? "Please wait…"
                : mode === "signup"
                  ? "Create account"
                  : "Sign in"}
            </button>
          </form>

          <p className="mt-4 text-center text-xs text-brand-muted">
            Protected with an authenticator app. You’ll set up a 6-digit code
            after your first sign-in.
          </p>
        </>
      )}

      {step === "enroll" && (
        <>
          <div className="mb-5">
            <h2 className="font-sans text-lg font-semibold text-brand-text">
              Set up your authenticator
            </h2>
            <p className="mt-1 text-sm text-brand-muted">
              Scan this code with{" "}
              <span className="font-medium text-brand-text">
                Microsoft Authenticator
              </span>{" "}
              (or Google Authenticator, Authy, 1Password…), then enter the
              6-digit code it shows.
            </p>
          </div>

          <ol className="mb-5 space-y-1.5 text-sm text-brand-text/80">
            <li>1. Open your authenticator app.</li>
            <li>
              2. Tap <span className="font-medium">Add account → Scan a QR
              code</span>.
            </li>
            <li>3. Scan the code below and enter the 6 digits shown.</li>
          </ol>

          {qr && (
            <div className="mb-4 flex justify-center">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={qr}
                alt="Authenticator setup QR code"
                width={200}
                height={200}
                className="rounded-lg border border-brand-border bg-white p-2"
              />
            </div>
          )}

          {secret && (
            <p className="mb-5 text-center text-xs text-brand-muted">
              Can’t scan? Enter this key manually:
              <br />
              <code className="mt-1 inline-block break-all rounded bg-brand-surface px-2 py-1 font-mono text-[11px] tracking-wider text-brand-text">
                {secret}
              </code>
            </p>
          )}

          <form onSubmit={handleCode} className="space-y-4">
            {codeField}
            {alerts}
            <button
              type="submit"
              className="btn-primary w-full py-3"
              disabled={loading || code.length < 6}
            >
              {loading ? "Verifying…" : "Verify & finish setup"}
            </button>
          </form>

          <button
            type="button"
            onClick={handleCancel}
            className="mt-4 w-full text-center text-xs text-brand-muted underline-offset-2 hover:text-brand-text hover:underline"
          >
            Cancel and sign out
          </button>
        </>
      )}

      {step === "challenge" && (
        <>
          <div className="mb-5">
            <h2 className="font-sans text-lg font-semibold text-brand-text">
              Enter your code
            </h2>
            <p className="mt-1 text-sm text-brand-muted">
              Open your authenticator app and enter the current 6-digit code
              for CrossBridge Sound Training.
            </p>
          </div>

          <form onSubmit={handleCode} className="space-y-4">
            {codeField}
            {alerts}
            <button
              type="submit"
              className="btn-primary w-full py-3"
              disabled={loading || code.length < 6}
            >
              {loading ? "Verifying…" : "Verify"}
            </button>
          </form>

          <button
            type="button"
            onClick={handleCancel}
            className="mt-4 w-full text-center text-xs text-brand-muted underline-offset-2 hover:text-brand-text hover:underline"
          >
            Cancel and sign out
          </button>
        </>
      )}
    </div>
  );
}

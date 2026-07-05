"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

type Mode = "signin" | "signup";

export function AuthForm({
  redirectTo = "/dashboard",
  authError = false,
}: {
  redirectTo?: string;
  authError?: boolean;
}) {
  const router = useRouter();
  const supabase = useMemo(() => createClient(), []);

  const [mode, setMode] = useState<Mode>("signin");
  const [showPassword, setShowPassword] = useState(false);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(
    authError
      ? "Microsoft sign-in didn’t complete. Please try again."
      : null
  );
  const [notice, setNotice] = useState<string | null>(null);

  const configured =
    !!process.env.NEXT_PUBLIC_SUPABASE_URL &&
    !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  async function handleMicrosoft() {
    setError(null);
    setNotice(null);
    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "azure",
        options: {
          redirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(
            redirectTo
          )}`,
          scopes: "openid profile email",
        },
      });
      if (error) throw error;
      // On success the browser is redirected to Microsoft; keep the spinner.
    } catch (err: unknown) {
      setError(
        err instanceof Error ? err.message : "Couldn’t start Microsoft sign-in."
      );
      setLoading(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
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

        if (data.session) {
          router.push(redirectTo);
          router.refresh();
          return;
        }

        setNotice(
          "Account created. You can sign in now with your email and password."
        );
        setPassword("");
        setMode("signin");
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
        router.push(redirectTo);
        router.refresh();
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

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

      {/* Primary, email-free path: Microsoft SSO (identity + MFA handled by
          Microsoft, so Supabase never sends an email). */}
      <button
        type="button"
        onClick={handleMicrosoft}
        disabled={loading || !configured}
        className="btn-secondary flex w-full items-center justify-center gap-2.5 py-3"
      >
        <svg width="18" height="18" viewBox="0 0 21 21" aria-hidden>
          <rect x="1" y="1" width="9" height="9" fill="#f25022" />
          <rect x="11" y="1" width="9" height="9" fill="#7fba00" />
          <rect x="1" y="11" width="9" height="9" fill="#00a4ef" />
          <rect x="11" y="11" width="9" height="9" fill="#ffb900" />
        </svg>
        Continue with Microsoft
      </button>

      {error && (
        <p className="mt-4 rounded-lg bg-brand-danger/10 px-3 py-2 text-sm text-brand-danger">
          {error}
        </p>
      )}
      {notice && (
        <p className="mt-4 rounded-lg bg-brand-success/10 px-3 py-2 text-sm text-brand-success">
          {notice}
        </p>
      )}

      {!showPassword ? (
        <button
          type="button"
          onClick={() => {
            setShowPassword(true);
            setError(null);
            setNotice(null);
          }}
          className="mt-4 w-full text-center text-xs text-brand-muted underline-offset-2 hover:text-brand-text hover:underline"
        >
          Use an email &amp; password instead →
        </button>
      ) : (
        <>
          <div className="my-6 flex items-center gap-3 text-xs uppercase tracking-wider text-brand-muted">
            <span className="h-px flex-1 bg-brand-border" />
            or use email &amp; password
            <span className="h-px flex-1 bg-brand-border" />
          </div>

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

          <form onSubmit={handleSubmit} className="space-y-4">
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
        </>
      )}
    </div>
  );
}

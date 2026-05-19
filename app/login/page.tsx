"use client";

import { useState, FormEvent, Suspense } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

const ERROR_MESSAGES: Record<string, string> = {
  CredentialsSignin: "Invalid email or password",
  SessionRequired: "Please sign in to continue",
};

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const errorParam = searchParams.get("error");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [resendLoading, setResendLoading] = useState(false);
  const [resendSuccess, setResendSuccess] = useState(false);

  const queryError =
    errorParam === "unverified"
      ? "Please verify your email before signing in."
      : errorParam
        ? ERROR_MESSAGES[errorParam] ?? errorParam
        : "";

  const isUnverified = error === "unverified" || errorParam === "unverified";

  async function handleResendVerification() {
    if (!email) {
      setError("Please enter your email address first");
      return;
    }
    setResendLoading(true);
    setResendSuccess(false);
    setError("");
    try {
      const res = await fetch("/api/auth/resend-verification", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (res.ok) {
        setResendSuccess(true);
      } else {
        const data = await res.json();
        setError(data.message || "Failed to resend verification email.");
      }
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setResendLoading(false);
    }
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Invalid email or password");
      return;
    }

    setLoading(true);

    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        if (result.error === "unverified") {
          setError("unverified");
        } else if (result.error.includes("Too many login attempts")) {
          setError(result.error);
        } else {
          setError("Invalid email or password");
        }
      } else {
        router.push("/dashboard");
      }
    } catch {
      setError("Invalid email or password");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-6">
      <div className="card">
        <h1 className="card-heading">Welcome back</h1>
        <p className="card-subtext">Sign in to your account.</p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-5" noValidate>
          <div>
            <label htmlFor="email" className="field-label">Email</label>
            <input
              id="email"
              type="email"
              placeholder="jane@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              className="input-field"
            />
          </div>

          <div>
            <label htmlFor="password" className="field-label">Password</label>
            <input
              id="password"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              className="input-field"
            />
          </div>

          <div className="flex justify-end">
            <Link href="/forgot-password" className="link-underline">
              Forgot password?
            </Link>
          </div>

          {resendSuccess && (
            <div className="rounded-lg bg-emerald-500/10 px-4 py-3">
              <p className="text-sm text-emerald-400 text-center">
                A new verification link has been sent to your email.
              </p>
            </div>
          )}

          {(error || queryError) && !resendSuccess && (
            <div className="rounded-lg bg-red-500/10 px-4 py-3">
              {isUnverified ? (
                <div className="text-center">
                  <p className="text-sm text-red-400">
                    Your email is unverified. Please verify it before signing in.
                  </p>
                  {email ? (
                    <button
                      type="button"
                      onClick={handleResendVerification}
                      disabled={resendLoading}
                      className="mt-2 inline-flex items-center gap-1.5 text-xs font-semibold text-accent underline hover:text-accent-hover disabled:opacity-50"
                    >
                      {resendLoading ? "Resending..." : "Resend verification link"}
                    </button>
                  ) : (
                    <p className="mt-1 text-xs text-slate-400">
                      Enter your email above to resend the verification link.
                    </p>
                  )}
                </div>
              ) : (
                <p className="text-sm text-red-400">
                  {queryError || error}
                </p>
              )}
            </div>
          )}

          <button type="submit" disabled={loading} className="btn-primary">
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Signing in...
              </span>
            ) : (
              "Sign in"
            )}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-500">
          Don&apos;t have an account?{" "}
          <Link href="/signup" className="font-medium text-accent underline underline-offset-2 hover:text-accent-hover">
            Create one
          </Link>
        </p>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  );
}

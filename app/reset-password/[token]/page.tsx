"use client";

import { useParams, useRouter } from "next/navigation";
import { useState, FormEvent } from "react";
import PasswordStrength from "@/components/PasswordStrength";

function getPasswordError(password: string): string | undefined {
  if (!password) return "Password is required";
  if (password.length < 8) return "At least 8 characters";
  if (!/[A-Z]/.test(password)) return "Must include an uppercase letter";
  if (!/[0-9]/.test(password)) return "Must include a number";
  if (!/[^a-zA-Z0-9]/.test(password)) return "Must include a special character";
  return undefined;
}

export default function ResetPasswordPage() {
  const params = useParams();
  const router = useRouter();
  const token = params.token as string;

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<{ password?: string; confirmPassword?: string }>({});

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");

    const pwErr = getPasswordError(password);
    const confirmErr =
      confirmPassword
        ? password !== confirmPassword
          ? "Passwords do not match"
          : undefined
        : "Please confirm your password";

    setFieldErrors({ password: pwErr, confirmPassword: confirmErr });
    if (pwErr || confirmErr) return;

    setLoading(true);

    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password, confirmPassword }),
      });
      const data = await res.json();

      if (res.ok) {
        setSuccess(true);
        setTimeout(() => router.push("/login"), 2500);
      } else {
        setError(data.message);
      }
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  if (success) {
    return (
      <div className="flex min-h-screen items-center justify-center px-6">
        <div className="card text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500/10">
            <svg className="h-6 w-6 text-emerald-400" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="card-heading">Password reset</h2>
          <p className="card-subtext mt-3">
            Your password has been updated. Redirecting to sign in...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-6 py-12">
      <div className="card">
        <h1 className="card-heading">Reset your password</h1>
        <p className="card-subtext">Choose a new password for your account.</p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-5" noValidate>
          <div>
            <label htmlFor="password" className="field-label">New Password</label>
            <input
              id="password"
              type="password"
              placeholder="Enter a strong password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setFieldErrors((prev) => ({ ...prev, password: undefined }));
              }}
              className={`input-field ${fieldErrors.password ? "input-error" : ""}`}
            />
            <PasswordStrength password={password} />
            {fieldErrors.password && <p className="field-error">{fieldErrors.password}</p>}
          </div>

          <div>
            <label htmlFor="confirmPassword" className="field-label">Confirm New Password</label>
            <input
              id="confirmPassword"
              type="password"
              placeholder="Re-enter your password"
              value={confirmPassword}
              onChange={(e) => {
                setConfirmPassword(e.target.value);
                setFieldErrors((prev) => ({ ...prev, confirmPassword: undefined }));
              }}
              className={`input-field ${fieldErrors.confirmPassword ? "input-error" : ""}`}
            />
            {fieldErrors.confirmPassword && <p className="field-error">{fieldErrors.confirmPassword}</p>}
          </div>

          {error && (
            <div className="rounded-lg bg-red-500/10 px-4 py-3">
              <p className="text-sm text-red-400">{error}</p>
            </div>
          )}

          <button type="submit" disabled={loading} className="btn-primary">
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Resetting...
              </span>
            ) : (
              "Reset password"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}

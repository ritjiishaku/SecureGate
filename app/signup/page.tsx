"use client";

import { useState, FormEvent } from "react";
import Link from "next/link";
import PasswordStrength from "@/components/PasswordStrength";

interface FieldErrors {
  name?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
}

function validateField(field: string, value: string, allValues: { name: string; email: string; password: string; confirmPassword: string }): string | undefined {
  switch (field) {
    case "name":
      if (!value) return "Name is required";
      if (value.length < 2) return "Name must be at least 2 characters";
      return undefined;
    case "email":
      if (!value) return "Email is required";
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return "Enter a valid email address";
      return undefined;
    case "password":
      if (!value) return "Password is required";
      if (value.length < 8) return "At least 8 characters";
      if (!/[A-Z]/.test(value)) return "Must include an uppercase letter";
      if (!/[0-9]/.test(value)) return "Must include a number";
      if (!/[^a-zA-Z0-9]/.test(value)) return "Must include a special character";
      return undefined;
    case "confirmPassword":
      if (!value) return "Please confirm your password";
      if (value !== allValues.password) return "Passwords do not match";
      return undefined;
    default:
      return undefined;
  }
}

export default function SignupPage() {
  const [form, setForm] = useState({ name: "", email: "", password: "", confirmPassword: "" });
  const [errors, setErrors] = useState<FieldErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState("");
  const [success, setSuccess] = useState(false);

  function handleChange(field: string, value: string) {
    const next = { ...form, [field]: value };
    setForm(next);
    if (touched[field]) {
      const err = validateField(field, value, next);
      setErrors((prev) => ({ ...prev, [field]: err }));
    }
  }

  function handleBlur(field: string) {
    setTouched((prev) => ({ ...prev, [field]: true }));
    const err = validateField(field, form[field as keyof typeof form], form);
    setErrors((prev) => ({ ...prev, [field]: err }));
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setApiError("");

    const allErrors: FieldErrors = {};
    for (const field of ["name", "email", "password", "confirmPassword"] as const) {
      allErrors[field] = validateField(field, form[field], form);
    }
    setErrors(allErrors);
    setTouched({ name: true, email: true, password: true, confirmPassword: true });

    if (Object.values(allErrors).some(Boolean)) return;

    setLoading(true);
    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          password: form.password,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setSuccess(true);
      } else {
        setApiError(data.message);
      }
    } catch {
      setApiError("Something went wrong. Please try again.");
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
              <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 9v.906a2.25 2.25 0 01-1.183 1.981l-6.478 3.488M2.25 9v.906a2.25 2.25 0 001.183 1.981l6.478 3.488m8.839 2.51l-4.66-2.51m0 0l-1.023-.55a2.25 2.25 0 00-2.134 0l-1.022.55m0 0l-4.661 2.51m16.5 1.615a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V8.844a2.25 2.25 0 011.183-1.981l7.5-4.039a2.25 2.25 0 012.134 0l7.5 4.039a2.25 2.25 0 011.183 1.98V19.5z" />
            </svg>
          </div>
          <h2 className="card-heading">Check your email</h2>
          <p className="card-subtext mt-3">
            We sent a verification link to <span className="text-slate-200">{form.email}</span>.
            Click the link to activate your account.
          </p>
          <Link href="/login" className="link-underline mt-6 inline-block">
            Go to sign in
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-6 py-12">
      <div className="card">
        <h1 className="card-heading">Create an account</h1>
        <p className="card-subtext">Get started with SecureGate.</p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-5" noValidate>
          <div>
            <label htmlFor="name" className="field-label">Full Name</label>
            <input
              id="name"
              type="text"
              placeholder="Jane Doe"
              value={form.name}
              onChange={(e) => handleChange("name", e.target.value)}
              onBlur={() => handleBlur("name")}
              className={`input-field ${touched.name && errors.name ? "input-error" : ""}`}
            />
            {touched.name && errors.name && <p className="field-error">{errors.name}</p>}
          </div>

          <div>
            <label htmlFor="email" className="field-label">Email</label>
            <input
              id="email"
              type="email"
              placeholder="jane@example.com"
              value={form.email}
              onChange={(e) => handleChange("email", e.target.value)}
              onBlur={() => handleBlur("email")}
              className={`input-field ${touched.email && errors.email ? "input-error" : ""}`}
            />
            {touched.email && errors.email && <p className="field-error">{errors.email}</p>}
          </div>

          <div>
            <label htmlFor="password" className="field-label">Password</label>
            <input
              id="password"
              type="password"
              placeholder="Create a strong password"
              value={form.password}
              onChange={(e) => handleChange("password", e.target.value)}
              onBlur={() => handleBlur("password")}
              className={`input-field ${touched.password && errors.password ? "input-error" : ""}`}
            />
            <PasswordStrength password={form.password} />
            {touched.password && errors.password && <p className="field-error">{errors.password}</p>}
          </div>

          <div>
            <label htmlFor="confirmPassword" className="field-label">Confirm Password</label>
            <input
              id="confirmPassword"
              type="password"
              placeholder="Re-enter your password"
              value={form.confirmPassword}
              onChange={(e) => handleChange("confirmPassword", e.target.value)}
              onBlur={() => handleBlur("confirmPassword")}
              className={`input-field ${touched.confirmPassword && errors.confirmPassword ? "input-error" : ""}`}
            />
            {touched.confirmPassword && errors.confirmPassword && <p className="field-error">{errors.confirmPassword}</p>}
          </div>

          {apiError && (
            <div className="rounded-lg bg-red-500/10 px-4 py-3">
              <p className="text-sm text-red-400">{apiError}</p>
            </div>
          )}

          <button type="submit" disabled={loading} className="btn-primary">
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Creating account...
              </span>
            ) : (
              "Create account"
            )}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-500">
          Already have an account?{" "}
          <Link href="/login" className="font-medium text-accent underline underline-offset-2 hover:text-accent-hover">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}

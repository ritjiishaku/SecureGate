"use client";

import { useParams, useRouter } from "next/navigation";
import { useState, FormEvent } from "react";

const requirements = [
  { label: "At least 8 characters", test: (s: string) => s.length >= 8 },
  { label: "One uppercase letter", test: (s: string) => /[A-Z]/.test(s) },
  { label: "One number", test: (s: string) => /[0-9]/.test(s) },
  { label: "One special character", test: (s: string) => /[^a-zA-Z0-9]/.test(s) },
];

export default function ResetPasswordPage() {
  const params = useParams();
  const router = useRouter();
  const token = params.token as string;

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");

    const res = await fetch("/api/auth/reset-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token, password, confirmPassword }),
    });

    const data = await res.json();

    if (res.ok) {
      setSuccess(true);
      setTimeout(() => router.push("/login"), 2000);
    } else {
      setError(data.message);
    }
  }

  return (
    <div style={container}>
      <div style={card}>
        <h1 style={heading}>Reset your password</h1>

        {success ? (
          <>
            <p style={text}>
              Password reset successfully. Redirecting to sign in...
            </p>
          </>
        ) : (
          <form onSubmit={handleSubmit}>
            <input
              type="password"
              placeholder="New password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setError("");
              }}
              required
              style={input}
            />

            <div style={requirementsContainer}>
              {requirements.map((req) => (
                <div key={req.label} style={requirementRow}>
                  <span style={requirementIcon(req.test(password))}>
                    {req.test(password) ? "\u2713" : "\u25CB"}
                  </span>
                  <span
                    style={
                      req.test(password)
                        ? requirementMet
                        : requirementUnmet
                    }
                  >
                    {req.label}
                  </span>
                </div>
              ))}
              <div style={requirementRow}>
                <span
                  style={requirementIcon(
                    password.length > 0 && password === confirmPassword,
                  )}
                >
                  {password.length > 0 && password === confirmPassword
                    ? "\u2713"
                    : "\u25CB"}
                </span>
                <span
                  style={
                    password.length > 0 && password === confirmPassword
                      ? requirementMet
                      : requirementUnmet
                  }
                >
                  Passwords match
                </span>
              </div>
            </div>

            <input
              type="password"
              placeholder="Confirm new password"
              value={confirmPassword}
              onChange={(e) => {
                setConfirmPassword(e.target.value);
                setError("");
              }}
              required
              style={input}
            />

            {error && <p style={errorText}>{error}</p>}

            <button type="submit" style={button}>
              Reset password
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

const container: React.CSSProperties = {
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  minHeight: "100vh",
  backgroundColor: "#f9fafb",
  padding: "24px",
};

const card: React.CSSProperties = {
  backgroundColor: "#ffffff",
  border: "1px solid #e5e7eb",
  borderRadius: "8px",
  padding: "40px",
  maxWidth: "440px",
  width: "100%",
};

const heading: React.CSSProperties = {
  fontSize: "24px",
  fontWeight: "600",
  color: "#111827",
  margin: "0 0 24px",
};

const text: React.CSSProperties = {
  fontSize: "16px",
  color: "#374151",
  margin: "0 0 24px",
  lineHeight: "24px",
};

const input: React.CSSProperties = {
  display: "block",
  width: "100%",
  padding: "10px 14px",
  fontSize: "16px",
  borderRadius: "6px",
  border: "1px solid #d1d5db",
  marginBottom: "16px",
  boxSizing: "border-box",
};

const requirementsContainer: React.CSSProperties = {
  marginBottom: "16px",
};

const requirementRow: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: "8px",
  marginBottom: "4px",
};

function requirementIcon(met: boolean): React.CSSProperties {
  return {
    color: met ? "#16a34a" : "#9ca3af",
    fontSize: "14px",
    width: "16px",
  };
}

const requirementMet: React.CSSProperties = {
  fontSize: "14px",
  color: "#16a34a",
};

const requirementUnmet: React.CSSProperties = {
  fontSize: "14px",
  color: "#6b7280",
};

const errorText: React.CSSProperties = {
  fontSize: "14px",
  color: "#dc2626",
  margin: "0 0 16px",
};

const button: React.CSSProperties = {
  display: "block",
  width: "100%",
  backgroundColor: "#111827",
  color: "#ffffff",
  padding: "12px 24px",
  borderRadius: "6px",
  fontSize: "16px",
  fontWeight: "600",
  border: "none",
  cursor: "pointer",
};

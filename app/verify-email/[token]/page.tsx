"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

type Status = "loading" | "success" | "error";

export default function VerifyEmailPage() {
  const params = useParams();
  const token = params.token as string;

  const [status, setStatus] = useState<Status>("loading");
  const [message, setMessage] = useState("");
  const [email, setEmail] = useState("");
  const [resendEmail, setResendEmail] = useState("");
  const [resendSent, setResendSent] = useState(false);

  useEffect(() => {
    async function verify() {
      try {
        const res = await fetch(
          `/api/auth/verify-email?token=${encodeURIComponent(token)}`,
        );
        const data = await res.json();

        if (res.ok) {
          setStatus("success");
          setMessage(data.message);
        } else {
          setStatus("error");
          setMessage(data.message);
          if (data.email) {
            setEmail(data.email);
            setResendEmail(data.email);
          }
        }
      } catch {
        setStatus("error");
        setMessage("Something went wrong. Please try again.");
      }
    }

    if (token) {
      verify();
    }
  }, [token]);

  async function handleResend() {
    if (!resendEmail) return;

    try {
      await fetch("/api/auth/resend-verification", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: resendEmail }),
      });
      setResendSent(true);
    } catch {
      setMessage("Failed to resend. Please try again.");
    }
  }

  return (
    <div style={container}>
      <div style={card}>
        {status === "loading" && (
          <>
            <h1 style={heading}>Verifying your email...</h1>
            <p style={text}>Please wait while we verify your email address.</p>
          </>
        )}

        {status === "success" && (
          <>
            <h1 style={heading}>Email verified</h1>
            <p style={text}>{message}</p>
            <a href="/login" style={button}>
              Sign in
            </a>
          </>
        )}

        {status === "error" && (
          <>
            <h1 style={heading}>Verification failed</h1>
            <p style={text}>{message}</p>

            {!resendSent ? (
              <div>
                {!email && (
                  <input
                    type="email"
                    placeholder="Enter your email"
                    value={resendEmail}
                    onChange={(e) => setResendEmail(e.target.value)}
                    style={input}
                  />
                )}
                <button
                  onClick={handleResend}
                  disabled={!resendEmail}
                  style={{
                    ...button,
                    opacity: resendEmail ? 1 : 0.5,
                    cursor: resendEmail ? "pointer" : "not-allowed",
                  }}
                >
                  Resend verification email
                </button>
              </div>
            ) : (
              <p style={text}>
                If this email is registered and unverified, a new verification
                link has been sent.
              </p>
            )}
          </>
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
  textAlign: "center",
};

const heading: React.CSSProperties = {
  fontSize: "24px",
  fontWeight: "600",
  color: "#111827",
  margin: "0 0 16px",
};

const text: React.CSSProperties = {
  fontSize: "16px",
  color: "#374151",
  margin: "0 0 24px",
  lineHeight: "24px",
};

const button: React.CSSProperties = {
  display: "inline-block",
  backgroundColor: "#111827",
  color: "#ffffff",
  padding: "12px 24px",
  borderRadius: "6px",
  fontSize: "16px",
  fontWeight: "600",
  textDecoration: "none",
  border: "none",
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

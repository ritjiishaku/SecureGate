"use client";

import { useState, FormEvent } from "react";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setMessage("");

    const res = await fetch("/api/auth/forgot-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });

    const data = await res.json();
    setMessage(data.message);
    setSubmitted(true);
  }

  return (
    <div style={container}>
      <div style={card}>
        <h1 style={heading}>Forgot your password?</h1>
        <p style={text}>
          Enter your email address and we will send you a link to reset your
          password.
        </p>

        {!submitted ? (
          <form onSubmit={handleSubmit}>
            <input
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={input}
            />
            <button type="submit" style={button}>
              Send reset link
            </button>
          </form>
        ) : (
          <p style={text}>{message}</p>
        )}

        <p style={{ ...text, marginTop: "24px", fontSize: "14px" }}>
          <a href="/login" style={link}>
            Back to sign in
          </a>
        </p>
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
  margin: "0 0 8px",
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

const link: React.CSSProperties = {
  color: "#111827",
  textDecoration: "underline",
};

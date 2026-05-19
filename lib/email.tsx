import { Resend } from "resend";
import VerificationEmail from "@/emails/VerificationEmail";
import PasswordResetEmail from "@/emails/PasswordResetEmail";

const resend = new Resend(process.env.RESEND_API_KEY ?? "re_placeholder");
const fromAddress = process.env.EMAIL_FROM ?? "onboarding@resend.dev";

export async function sendVerificationEmail(
  email: string,
  name: string,
  token: string,
) {
  const verificationUrl = `${process.env.NEXTAUTH_URL}/verify-email/${token}`;

  try {
    await resend.emails.send({
      from: fromAddress,
      to: email,
      subject: "Verify your email address",
      react: <VerificationEmail name={name} verificationUrl={verificationUrl} />,
    });
  } catch (error) {
    console.error("Failed to send verification email:", error);
  }
}

export async function sendPasswordResetEmail(
  email: string,
  name: string,
  token: string,
) {
  const resetUrl = `${process.env.NEXTAUTH_URL}/reset-password/${token}`;

  try {
    await resend.emails.send({
      from: fromAddress,
      to: email,
      subject: "Reset your password",
      react: <PasswordResetEmail name={name} resetUrl={resetUrl} />,
    });
  } catch (error) {
    console.error("Failed to send password reset email:", error);
  }
}

export async function sendDuplicateSignupEmail(
  email: string,
  name: string,
) {
  try {
    await resend.emails.send({
      from: fromAddress,
      to: email,
      subject: "SecureGate Sign Up Attempt",
      html: `<div style="font-family: sans-serif; max-width: 480px; margin: 0 auto; padding: 20px; border: 1px solid #e5e7eb; border-radius: 8px;">
        <h2 style="color: #111827; font-size: 20px; font-weight: 600;">Sign up attempt notified</h2>
        <p style="color: #374151; font-size: 16px; line-height: 24px;">Hi ${name},</p>
        <p style="color: #374151; font-size: 16px; line-height: 24px;">Someone recently tried to sign up for a SecureGate account with your email address. Since you already have an account, this sign-up attempt has been blocked to protect your details.</p>
        <p style="color: #374151; font-size: 16px; line-height: 24px;">If this was you, you can safely ignore this or sign in using your existing credentials. If you forgot your password, you can request a password reset.</p>
        <hr style="border: 0; border-top: 1px solid #e5e7eb; margin: 20px 0;" />
        <p style="color: #6b7280; font-size: 14px;">SecureGate</p>
      </div>`,
    });
  } catch (error) {
    console.error("Failed to send duplicate signup email:", error);
  }
}

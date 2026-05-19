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

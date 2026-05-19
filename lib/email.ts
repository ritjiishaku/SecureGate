export async function sendVerificationEmail(email: string, token: string) {
  const verificationUrl = `${process.env.NEXTAUTH_URL}/verify-email?token=${token}`;

  console.log(
    `[EMAIL PLACEHOLDER] To: ${email} — Verify: ${verificationUrl}`,
  );
}

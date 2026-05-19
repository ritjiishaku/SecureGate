import { NextResponse } from "next/server";
import crypto from "crypto";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { sendPasswordResetEmail } from "@/lib/email";
import { forgotPasswordRatelimit } from "@/lib/ratelimit";

function getIpFromRequest(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) {
    return forwarded.split(",")[0].trim();
  }
  const realIp = request.headers.get("x-real-ip");
  if (realIp) {
    return realIp;
  }
  return "127.0.0.1";
}

const forgotPasswordSchema = z.object({
  email: z.string().email(),
});

export async function POST(request: Request) {
  try {
    const ip = getIpFromRequest(request);
    const { success } = await forgotPasswordRatelimit.limit(ip);

    if (!success) {
      return NextResponse.json(
        { message: "Too many requests. Please wait before trying again." },
        { status: 429 },
      );
    }

    const body = await request.json();

    const parsed = forgotPasswordSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { message: "Invalid input" },
        { status: 422 },
      );
    }

    const { email } = parsed.data;

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (user) {
      await prisma.passwordResetToken.deleteMany({
        where: { email },
      });

      const resetToken = crypto.randomBytes(32).toString("hex");

      await prisma.passwordResetToken.create({
        data: {
          email,
          token: resetToken,
          expires: new Date(Date.now() + 60 * 60 * 1000),
        },
      });

      await sendPasswordResetEmail(
        email,
        user.name ?? "User",
        resetToken,
      );
    }

    return NextResponse.json(
      {
        message:
          "If an account with that email exists, a password reset link has been sent.",
      },
      { status: 200 },
    );
  } catch {
    return NextResponse.json(
      { message: "Something went wrong" },
      { status: 500 },
    );
  }
}

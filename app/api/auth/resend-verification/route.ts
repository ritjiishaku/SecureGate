import { NextResponse } from "next/server";
import crypto from "crypto";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { sendVerificationEmail } from "@/lib/email";

const resendSchema = z.object({
  email: z.string().email(),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const parsed = resendSchema.safeParse(body);

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

    if (!user || user.emailVerified) {
      return NextResponse.json(
        {
          message:
            "If this email is registered and unverified, a new verification link has been sent.",
        },
        { status: 200 },
      );
    }

    await prisma.verificationToken.deleteMany({
      where: { identifier: email },
    });

    const verificationToken = crypto.randomBytes(32).toString("hex");

    await prisma.verificationToken.create({
      data: {
        identifier: email,
        token: verificationToken,
        expires: new Date(Date.now() + 15 * 60 * 1000),
      },
    });

    await sendVerificationEmail(email, user.name ?? "User", verificationToken);

    return NextResponse.json(
      {
        message:
          "If this email is registered and unverified, a new verification link has been sent.",
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

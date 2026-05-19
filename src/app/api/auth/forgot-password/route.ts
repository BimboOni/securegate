import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { forgotPasswordSchema } from "@/lib/validations/auth";
import { generatePasswordResetToken, sendPasswordResetEmail } from "@/lib/mail";
import { isRateLimited } from "@/lib/rate-limit";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const ip = req.headers.get("x-forwarded-for") || "127.0.0.1";
    const limited = await isRateLimited(ip, "/api/auth/forgot-password");
    if (limited) {
      return NextResponse.json(
        { error: "Too many requests. Please try again later." },
        { status: 429 }
      );
    }

    const body = await req.json();

    const result = forgotPasswordSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json({ error: "Invalid request" }, { status: 400 });
    }

    const { email } = result.data;

    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      try {
        const passwordResetToken = await generatePasswordResetToken(email);
        await sendPasswordResetEmail(email, passwordResetToken.token);
      } catch (emailError) {
        console.warn("Password reset email failed:", emailError);
      }
    }

    return NextResponse.json(
      { message: "If that email is in our system, we have sent a password reset link." },
      { status: 200 }
    );
  } catch (error) {
    console.error("Forgot password error:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred" },
      { status: 500 }
    );
  }
}

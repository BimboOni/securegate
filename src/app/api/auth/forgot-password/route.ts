import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { forgotPasswordSchema } from "@/lib/validations/auth";
import { generatePasswordResetToken, sendPasswordResetEmail } from "@/lib/mail";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const body = await req.json();

    // 1. Validate the input (Murphy's Law: Don't trust client inputs)
    const result = forgotPasswordSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        { error: "Invalid email address", details: result.error.issues },
        { status: 400 }
      );
    }

    const { email } = result.data;

    // 2. Check if user exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      // 3. Trigger token generation and dispatch email inside a defensive block
      try {
        const passwordResetToken = await generatePasswordResetToken(email);
        await sendPasswordResetEmail(email, passwordResetToken.token);
      } catch (emailError) {
        console.error("Failed to send reset email:", emailError);
        // We log the error but still proceed to return the generic success message below
        // so as not to break Postel's Law.
      }
    }

    // 4. Postel's Law / Privacy: Always return a successful 200 message regardless of whether
    // the email exists. This prevents attackers from enumerating valid email addresses in the system.
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

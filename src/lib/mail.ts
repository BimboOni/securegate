import { Resend } from "resend";
import crypto from "crypto";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const resend = new Resend(process.env.RESEND_API_KEY);

export async function generateVerificationToken(email: string) {
  const token = crypto.randomBytes(32).toString("hex");
  // Expiration of exactly 24 hours from now
  const expires = new Date(new Date().getTime() + 24 * 60 * 60 * 1000);

  // Delete previously issued tokens for this email to keep DB tidy
  await prisma.verificationToken.deleteMany({
    where: { identifier: email }
  });

  const verificationToken = await prisma.verificationToken.create({
    data: {
      identifier: email,
      token,
      expires
    }
  });

  return verificationToken;
}

export async function sendVerificationEmail(email: string, token: string) {
  const confirmLink = `${process.env.NEXTAUTH_URL}/api/auth/verify?token=${token}`;

  await resend.emails.send({
    from: "onboarding@resend.dev", // Note: Replace with actual domain in production
    to: email,
    subject: "Confirm your email - SecureGate",
    html: `<p>Click <a href="${confirmLink}">here</a> to verify your email.</p>`
  });
}

export async function generatePasswordResetToken(email: string) {
  const token = crypto.randomBytes(32).toString("hex");
  // Expiration of exactly 1 hour from now
  const expires = new Date(new Date().getTime() + 1 * 60 * 60 * 1000);

  // Delete previously issued reset tokens for this email
  await prisma.passwordResetToken.deleteMany({
    where: { email }
  });

  const passwordResetToken = await prisma.passwordResetToken.create({
    data: {
      email,
      token,
      expires
    }
  });

  return passwordResetToken;
}

export async function sendPasswordResetEmail(email: string, token: string) {
  const resetLink = `${process.env.NEXTAUTH_URL}/reset-password?token=${token}`;

  await resend.emails.send({
    from: "onboarding@resend.dev", // Note: Replace with actual domain in production
    to: email,
    subject: "Reset your password - SecureGate",
    html: `<p>Click <a href="${resetLink}">here</a> to reset your password.</p>`
  });
}


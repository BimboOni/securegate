import { Resend } from "resend";
import crypto from "crypto";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const resend = new Resend(process.env.RESEND_API_KEY);

export async function generateVerificationToken(email: string) {
  const token = crypto.randomBytes(32).toString("hex");
  // Expiration of exactly 15 minutes from now
  const expires = new Date(new Date().getTime() + 15 * 60 * 1000);

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
  const baseUrl = process.env.NEXTAUTH_URL || (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000');
  const confirmLink = `${baseUrl}/api/auth/verify?token=${token}`;

  console.log('=== 🔐 SECUREAUTH SYSTEM DIAGNOSTIC TOKENS ===');
  console.log('Target Email Auth Path:', email);
  console.log('Active Verification/Reset Link:', confirmLink);
  console.log('==============================================');

  const { error } = await resend.emails.send({
    from: "onboarding@resend.dev", // Note: Replace with actual domain in production
    to: email,
    subject: "Confirm your email - SecureGate",
    html: `<p>Click <a href="${confirmLink}">here</a> to verify your email.</p>`
  });

  if (error) {
    console.error('❌ [RESEND API FAILURE DETECTED]:', error);
    return { success: false, error };
  }
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
  const baseUrl = process.env.NEXTAUTH_URL || (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000');
  const resetLink = `${baseUrl}/auth/reset-password?token=${token}`;

  console.log('=== 🔐 SECUREAUTH SYSTEM DIAGNOSTIC TOKENS ===');
  console.log('Target Email Auth Path:', email);
  console.log('Active Verification/Reset Link:', resetLink);
  console.log('==============================================');

  const { error } = await resend.emails.send({
    from: "onboarding@resend.dev", // Note: Replace with actual domain in production
    to: email,
    subject: "Reset your password - SecureGate",
    html: `<p>Click <a href="${resetLink}">here</a> to reset your password.</p>`
  });

  if (error) {
    console.error('❌ [RESEND API FAILURE DETECTED]:', error);
    return { success: false, error };
  }
}

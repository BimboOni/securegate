import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { PrismaClient } from "@prisma/client";
import { signUpSchema } from "@/lib/validations/auth";
import { isRateLimited } from "@/lib/rate-limit";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    // 1. Extract the IP Address from request headers (Vercel provides 'x-forwarded-for')
    const ip = req.headers.get("x-forwarded-for") || "127.0.0.1";

    // 2. Execute the Rate Limiting Check
    const limited = await isRateLimited(ip, "/api/auth/signup");
    if (limited) {
      return NextResponse.json(
        { error: "Too many registration attempts. Please try again in a minute." },
        { status: 429 } // HTTP 429 Too Many Requests
      );
    }

    const body = await req.json();

    // [The rest of your existing signup validation and creation logic sits safely right here...]
    const result = signUpSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json({ error: "Invalid input data" }, { status: 400 });
    }

    const { email, password, name } = result.data;
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return NextResponse.json({ error: "Email is already registered" }, { status: 409 });
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    const user = await prisma.user.create({
      data: { email, name, password: hashedPassword },
    });

    return NextResponse.json({ message: "User registered successfully", userId: user.id }, { status: 201 });

  } catch (error) {
    console.error("Signup error:", error);
    return NextResponse.json({ error: "An unexpected error occurred" }, { status: 500 });
  }
}
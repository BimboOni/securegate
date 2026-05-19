import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { PrismaClient } from "@prisma/client";
import { signUpSchema } from "@/lib/validations/auth";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const body = await req.json();

    // 1. Server-side Validation (Murphy's Law: Never trust client-side data)
    const result = signUpSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        { error: "Invalid input data", details: result.error.errors }, 
        { status: 400 }
      );
    }

    const { email, password, name } = result.data;

    // 2. Check for existing user
    // Postel's Law / Privacy: Provide a clean, un-leaked error status
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "Email is already registered" }, 
        { status: 409 }
      );
    }

    // 3. Hash password (Security Standard: bcrypt with 12 salt rounds)
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // 4. Save user to DB
    const user = await prisma.user.create({
      data: {
        email,
        name,
        password: hashedPassword,
      },
    });

    return NextResponse.json(
      { message: "User registered successfully", userId: user.id }, 
      { status: 201 }
    );
  } catch (error) {
    // Return generic error without leaking stack traces
    console.error("Signup error:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred during registration" }, 
      { status: 500 }
    );
  }
}

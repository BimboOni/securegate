import NextAuth from "next-auth";
import { authOptions } from "@/lib/auth";
import { isRateLimited } from "@/lib/rate-limit";
import { NextResponse } from "next/server";

const handler = NextAuth(authOptions);

export { handler as GET };

export async function POST(
  req: Request,
  context: { params: Record<string, string | string[]> }
) {
  const ip = req.headers.get("x-forwarded-for") || "127.0.0.1";
  const limited = await isRateLimited(ip, "/api/auth/login");
  if (limited) {
    return NextResponse.json(
      { error: "RateLimitExceeded", status: 429, ok: false, url: null },
      { status: 429 }
    );
  }
  return handler(req, context);
}

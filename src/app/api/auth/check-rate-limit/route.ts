import { NextResponse } from "next/server";
import { isRateLimited } from "@/lib/rate-limit";

export async function POST(req: Request) {
  const ip = req.headers.get("x-forwarded-for") || "127.0.0.1";
  const limited = await isRateLimited(ip, "/api/auth/login");
  if (limited) {
    return NextResponse.json({ limited: true }, { status: 429 });
  }
  return NextResponse.json({ limited: false }, { status: 200 });
}

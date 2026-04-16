import { NextResponse } from "next/server";
import { clearAuthCookies } from "@/lib/auth/cookies";

export function POST() {
  const response = NextResponse.json({ ok: true });
  clearAuthCookies(response);
  return response;
}

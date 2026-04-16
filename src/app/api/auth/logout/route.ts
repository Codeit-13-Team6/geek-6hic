import { NextResponse } from "next/server";
import { clearAuthCookies, clearUserDisplayCookie } from "@/auth/cookies";

export function POST() {
  const response = NextResponse.json({ ok: true });
  clearAuthCookies(response);
  clearUserDisplayCookie(response);
  return response;
}

import { NextResponse } from "next/server";

const ACCESS_TOKEN_MAX_AGE = 60 * 15;
const REFRESH_TOKEN_MAX_AGE = 60 * 60 * 24 * 7;

export async function POST(request: Request) {
  const { accessToken, refreshToken } = await request.json();

  if (!accessToken || !refreshToken) {
    return NextResponse.json({ message: "토큰이 없습니다." }, { status: 400 });
  }

  const response = NextResponse.json({ ok: true });

  response.cookies.set("accessToken", accessToken, {
    httpOnly: true,
    path: "/",
    sameSite: "strict",
    secure: process.env.NODE_ENV === "production",
    maxAge: ACCESS_TOKEN_MAX_AGE,
  });

  response.cookies.set("refreshToken", refreshToken, {
    httpOnly: true,
    path: "/",
    sameSite: "strict",
    secure: process.env.NODE_ENV === "production",
    maxAge: REFRESH_TOKEN_MAX_AGE,
  });

  return response;
}

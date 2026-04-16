import { NextResponse } from "next/server";
import { createAuthSuccessResponse } from "@/lib/auth/authResponse";

// 토큰을 받아서 httpOnly 쿠키에 바인딩하는 엔드포인트
// 소셜 로그인 콜백에서 사용
export async function POST(request: Request) {
  const { accessToken, refreshToken } = await request.json();

  if (!accessToken || !refreshToken) {
    return NextResponse.json({ message: "토큰이 없습니다." }, { status: 400 });
  }

  return createAuthSuccessResponse({ accessToken, refreshToken });
}

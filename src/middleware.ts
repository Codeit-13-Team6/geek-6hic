import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import axios from "axios";

// 쿠키 만료 시간 (초 단위)
const ACCESS_TOKEN_MAX_AGE = 60 * 15;
const REFRESH_TOKEN_MAX_AGE = 60 * 60 * 24 * 7;

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // ** API 요청(/api/...)은 미들웨어가 간섭하지 않음
  // ** API 응답(401)은 axios 인터셉터가 처리하도록함
  if (pathname.startsWith("/api")) {
    return NextResponse.next();
  }

  // 쿠키에서 토큰 조회
  const accessToken = request.cookies.get("accessToken")?.value;
  const refreshToken = request.cookies.get("refreshToken")?.value;

  // 1. 액세스 토큰이 있으면 일단 통과 (유효성 검증은 API 레이어의 Axios가 담당)
  if (accessToken) {
    return NextResponse.next();
  }

  // 2. 액세스 토큰이 없는데 리프레시 토큰도 없다면? 바로 로그인행
  if (!refreshToken) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // 3. 액세스 토큰이 없지만 리프레시 토큰은 있는 경우 -> 토큰 갱신 시도 (라우팅 가드)
  try {
    const { data } = await axios.post(
      `${process.env.NEXT_PUBLIC_API_URL}/auth/refresh`,
      { refreshToken },
    );

    const response = NextResponse.next();

    // 새 토큰 쿠키 세팅
    if (data.accessToken) {
      response.cookies.set("accessToken", data.accessToken, {
        httpOnly: true,
        path: "/",
        sameSite: "strict",
        secure: process.env.NODE_ENV === "production",
        maxAge: ACCESS_TOKEN_MAX_AGE,
      });
    }

    if (data.refreshToken) {
      response.cookies.set("refreshToken", data.refreshToken, {
        httpOnly: true,
        path: "/",
        sameSite: "strict",
        secure: process.env.NODE_ENV === "production",
        maxAge: REFRESH_TOKEN_MAX_AGE,
      });
    }

    return response;
  } catch (error) {
    // 갱신 실패 시 (리프레시 토큰 만료 등) 로그인 페이지로
    console.error("Middleware refresh error:", error);
    return NextResponse.redirect(new URL("/login", request.url));
  }
}

// 보호할 경로 설정 (matcher 활용으로 코드 내 protectedPaths 배열 생략 가능)
export const config = {
  matcher: [
    "/lounge/:path*",
    "/meetings/:path*",
    "/users/:path*",
    "/my-meetings/:path*",
    "/ranking/:path*",
  ],
};

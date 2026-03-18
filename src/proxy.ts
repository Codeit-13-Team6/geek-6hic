import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// 토큰 만료 시간 상수
const ACCESS_TOKEN_MAX_AGE = 60 * 15; // 15분
const REFRESH_TOKEN_MAX_AGE = 60 * 60 * 24 * 7;

// 보호 경로 목록
const protectedPaths = [
  "/lounge",
  "/meetings",
  "/users",
  "/my-meetings",
  "/ranking",
];

// 로그인 리다이렉트 처리
function redirectToLogin(request: NextRequest) {
  return NextResponse.redirect(new URL("/login", request.url));
}

// 보호 경로 확인
function isProtectedPath(pathname: string) {
  return protectedPaths.some((path) => pathname.startsWith(path));
}

// JWT payload 디코딩
function decodeJwtPayload(token: string) {
  const [, payload] = token.split(".");
  if (!payload) return null;

  try {
    // base64url 형식 보정
    const normalized = payload.replace(/-/g, "+").replace(/_/g, "/");
    const padded = normalized.padEnd(
      normalized.length + ((4 - (normalized.length % 4)) % 4),
      "=",
    );

    return JSON.parse(atob(padded)) as { exp?: number };
  } catch {
    return null;
  }
}

// 토큰 만료 여부 확인
function isTokenExpired(token: string) {
  const payload = decodeJwtPayload(token);

  if (!payload?.exp) {
    return true;
  }

  return payload.exp <= Math.floor(Date.now() / 1000);
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 공개 경로 통과
  if (!isProtectedPath(pathname)) {
    return NextResponse.next();
  }

  // 쿠키 토큰 조회
  const accessToken = request.cookies.get("accessToken")?.value;
  const refreshToken = request.cookies.get("refreshToken")?.value;

  // 유효한 액세스 토큰 통과
  if (accessToken && !isTokenExpired(accessToken)) {
    return NextResponse.next();
  }

  // 리프레시 토큰 부재 처리
  if (!refreshToken) {
    return redirectToLogin(request);
  }

  try {
    // 토큰 재발급 요청
    const refreshResponse = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/auth/refresh`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ refreshToken }),
      },
    );

    // 재발급 실패 처리
    if (!refreshResponse.ok) {
      return redirectToLogin(request);
    }

    // 재발급 응답 파싱
    const data = (await refreshResponse.json()) as {
      accessToken?: string;
      refreshToken?: string;
    };

    // 액세스 토큰 검증
    if (!data.accessToken) {
      return redirectToLogin(request);
    }

    // 응답 객체 생성
    const response = NextResponse.next();

    // 액세스 토큰 쿠키 갱신
    response.cookies.set("accessToken", data.accessToken, {
      httpOnly: true,
      path: "/",
      sameSite: "strict",
      secure: process.env.NODE_ENV === "production",
      maxAge: ACCESS_TOKEN_MAX_AGE,
    });

    // 리프레시 토큰 쿠키 갱신
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
  } catch {
    // 예외 상황 처리
    return redirectToLogin(request);
  }
}

// 프록시 적용 경로 설정
export const config = {
  matcher: [
    "/lounge/:path*",
    "/meetings/:path*",
    "/users/:path*",
    "/my-meetings/:path*",
    "/ranking/:path*",
  ],
};

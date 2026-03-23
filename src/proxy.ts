import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import axios from "axios";

// 쿠키 만료 시간 (초 단위)
const ACCESS_TOKEN_MAX_AGE = 60 * 15;
const REFRESH_TOKEN_MAX_AGE = 60 * 60 * 24 * 7;

// [병수]:
// 1. accessToken 이 있으면 혹은 login 페이지면 -> 그냥 통과
// 2. accessToken이 없고, refreshToken이 있으면 -> 재발급
// 3. 둘 다 없으면 로그인 페이지 이동

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  console.log({ pathname });
  if (pathname === "/login") {
    console.log("?");
    return NextResponse.next();
  }

  // ** API 요청(/api/...)은 프록시(미들웨어)가 간섭하지 않음
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
    // 멘토님 조언대로 axios 사용 (단, 절대 경로 필요)
    console.log({ refreshToken });
    const { data } = await axios.post(
      `${process.env.NEXT_PUBLIC_API_URL}/auth/refresh`,
      { refreshToken },
    );
    // [병수]: route handler 요청 중에 accessToken이 없다면?
    // 클라이언트 -> route handler 전에 proxy 동작 -> 지금 쿠키가 있나? -> 쿠키를 재발급
    // route handler -> 코드잇 백엔드 -> route handler -> 클라이언트

    // 클라이언트 -> 쿠키 재발급 완료 후 route handler에도 쿠키가 담아졌으면 좋겠다. -> route handler -> 코드잇 백엔드 -> route handler -> 클라이언트
    // 4. 요청 중인 Route Handler 에서 읽을 수 있도록 request 에도 쿠키를 세팅

    const response = NextResponse.next();

    // 새 토큰 쿠키 세팅
    if (data.accessToken) {
      // 기존 요청에 쿠키를 넣어 보낸다.
      // request.cookies.set("accessToken", data.accessToken); // 유저 정보 조회 -> 401 에러
      // 응답 시에 쿠키를 세팅한다.
      response.cookies.set("accessToken", data.accessToken, {
        httpOnly: true,
        path: "/",
        sameSite: "strict",
        secure: process.env.NODE_ENV === "production",
        maxAge: ACCESS_TOKEN_MAX_AGE,
      });
    }

    if (data.refreshToken) {
      // 기존 요청에 쿠키를 넣어 보낸다.
      // request.cookies.set("refreshToken", data.refreshToken);
      // 응답 시에 쿠키를 세팅한다.
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
    // "/api/:path*", // API 요청은 인터셉터에서 처리하므로 프록시 미들웨어는 통과
    "/lounge/:path*",
    "/meetings/:path*",
    "/users/:path*",
    "/my-meetings/:path*",
    "/ranking/:path*",
  ],
};

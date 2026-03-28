import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import axios from "axios";

import { setAuthCookies } from "@/lib/authCookies";

// JWT payload의 exp 클레임을 읽어 토큰 만료 시간만 확인
function isTokenExpired(token: string): boolean {
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    return payload.exp * 1000 < Date.now();
  } catch {
    return true;
  }
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // auth 관련 API는 인증 불필요 (refresh 무한루프 방지 포함)
  if (pathname.startsWith("/api/auth")) {
    return NextResponse.next();
  }

  // 쿠키에서 토큰 조회
  const accessToken = request.cookies.get("accessToken")?.value;
  const refreshToken = request.cookies.get("refreshToken")?.value;

  const isApiRequest = pathname.startsWith("/api");

  // 토큰이 하나도 없는 경우
  if (!accessToken && !refreshToken) {
    // 페이지 요청: 로그인 페이지로 리다이렉트
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // 액세스 토큰이 있고 만료되지 않았으면 통과
  if (accessToken && !isTokenExpired(accessToken)) {
    return NextResponse.next();
  }

  // 리프레시 토큰도 만료된 경우 → 갱신 시도 없이 바로 처리
  if (!refreshToken || isTokenExpired(refreshToken)) {
    if (isApiRequest) return NextResponse.next();
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // 액세스 토큰이 없지만 리프레시 토큰은 살아있는 경우 -> 토큰 갱신 시도
  try {
    const { data } = await axios.post(
      `${process.env.NEXT_PUBLIC_API_URL}/auth/refresh`,
      { refreshToken },
    );

    const requestHeaders = new Headers(request.headers);

    if (data.accessToken && isApiRequest) {
      // 사실상 이 프로젝트에서는 existingCookies 안에 리프레쉬 토큰이 들어있다고 생각하면 됨
      // 리프레쉬 토큰은 유지하고 엑세스토큰은 교체하는것
      // 요청 헤더에 새로운 쿠키를 집어넣기
      const existingCookies = requestHeaders.get("cookie") || "";
      requestHeaders.set(
        "cookie",
        `${existingCookies}; accessToken=${data.accessToken}`,
      );
    }

    // 이번 요청 헤더에 새로운 토큰 집어넣어서 실행 ,
    // 이렇게 안하면 특정 api 는  401 한번 떨어진 후 재시도 해서 호출 성공하는 형식
    // 이미 proxy 단으로 시점이 넘어온 상태라 브라우저에 쿠키를 새로 세팅한것만으론 401 해결 힘든듯
    const response = NextResponse.next({
      request: { headers: requestHeaders },
    });

    // 브라우저에 토큰 저장시켜서 다음 요청부턴 이거 사용하게함
    setAuthCookies(response, data);

    return response;
  } catch {
    // if (!isApiRequest) {
    //   // 페이지 요청이면 로그인으로 혹시몰라서 추가한 로직 쓰일일 거의 없음
    //   return NextResponse.redirect(new URL("/login", request.url));
    // }
    // 레이스 컨디션으로 refresh 실패한 경우 → 통과 (slug에서 401 처리)
    return NextResponse.next();
  }
}

// 보호할 경로 설정
// /api/:path* 추가로 api 호출도 프록시 ts 거치게 됨
export const config = {
  matcher: [
    "/api/:path*",
    "/lounge/:path*",
    "/meetings/:path*",
    "/users/:path*",
    "/my-meetings/:path*",
    "/ranking/:path*",
  ],
};

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// 기존 코드는 proxy.legacy.bak 참고

// 토큰 존재 여부만 확인하는 쪽으로 변경
export async function proxy(request: NextRequest) {
  // 루트 접근 시 /meetings 로 리다이렉트
  if (request.nextUrl.pathname === "/") {
    return NextResponse.redirect(new URL("/meetings", request.url));
  }

  const refreshToken = request.cookies.get("refreshToken")?.value;

  // 리프레쉬 만료 혹은 없는 상태는 그냥 login
  if (!refreshToken) {
    const returnUrl = request.nextUrl.pathname + request.nextUrl.search;
    return NextResponse.redirect(
      new URL(`/login?returnUrl=${encodeURIComponent(returnUrl)}`, request.url),
    );
  }

  // 어차피 엑세스 토큰 있는지 없는지 중요하지않음 결국 리프레쉬 해야하는 상황이기 떄문에 바로 패스
  return NextResponse.next();
}

// 보호할 경로 설정
export const config = {
  matcher: [
    "/",
    // "/api/:path*", api 호출에 관련된건 proxy 에서 처리하지않음
    "/users/:path*",
    "/my-meetings/:path*",
    "/ranking/:path*",
  ],
};

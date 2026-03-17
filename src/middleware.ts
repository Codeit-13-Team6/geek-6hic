import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  // 1. 쿠키에서 토큰을 꺼내봅니다.
  const token = request.cookies.get("accessToken")?.value;

  // 2. 만약 토큰이 없는데 보호된 페이지로 가려고 한다면?
  const protectedPaths = ["/mypage", "/lounge", "/meeting", "/users"];
  const isProtected = protectedPaths.some((path) =>
    request.nextUrl.pathname.startsWith(path),
  );

  if (!token && isProtected) {
    // 3. 로그인 페이지로 튕겨냅니다.
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // 토큰이 있거나, 공개된 페이지라면 그대로 통과!
  return NextResponse.next();
}

// 이 미들웨어가 작동할 주소들 (불필요한 곳은 검사 안 함)
export const config = {
  matcher: [
    "/mypage/:path*",
    "/lounge/:path*",
    "/meeting/:path*",
    "/users/:path*",
    "/dashboard/:path*",
  ],
};

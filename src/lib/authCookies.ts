import { NextResponse } from "next/server";

// 사실상 server-only 상태이긴한데 그냥 next 에서 알아서 관리해주는걸로 두기,,,,
export const ACCESS_TOKEN_MAX_AGE = 60 * 15; // 15분
export const REFRESH_TOKEN_MAX_AGE = 60 * 60 * 24 * 7; // 7일
const USER_DISPLAY_MAX_AGE = 60 * 60 * 24 * 7; // 7일

const COOKIE_OPTIONS = {
  httpOnly: true,
  path: "/",
  sameSite: "strict" as const,
  secure: process.env.NODE_ENV === "production",
};

// NextResponse에 accessToken, refreshToken 쿠키를 세팅하는 유틸
export function setAuthCookies(
  response: NextResponse,
  tokens: { accessToken?: string; refreshToken?: string },
) {
  if (tokens.accessToken) {
    response.cookies.set("accessToken", tokens.accessToken, {
      ...COOKIE_OPTIONS,
      maxAge: ACCESS_TOKEN_MAX_AGE,
    });
  }

  if (tokens.refreshToken) {
    response.cookies.set("refreshToken", tokens.refreshToken, {
      ...COOKIE_OPTIONS,
      maxAge: REFRESH_TOKEN_MAX_AGE,
    });
  }
}

// NextResponse에 httpOnly user_display 쿠키를 세팅하는 유틸
export function setUserDisplayCookie(
  response: NextResponse,
  user: {
    id: number;
    name: string;
    image: string | null;
    email: string;
    companyName: string;
  },
) {
  response.cookies.set(
    "user_display",
    JSON.stringify({
      id: user.id,
      name: user.name,
      image: user.image,
      email: user.email,
      companyName: user.companyName,
    }),
    { ...COOKIE_OPTIONS, maxAge: USER_DISPLAY_MAX_AGE },
  );
}

// user_display 쿠키를 만료 처리하는 유틸
export function clearUserDisplayCookie(response: NextResponse) {
  response.cookies.set("user_display", "", {
    ...COOKIE_OPTIONS,
    expires: new Date(0),
  });
}

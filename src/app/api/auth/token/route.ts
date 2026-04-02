import axios from "axios";
import { NextResponse } from "next/server";
import type { User } from "@/types";
import {
  setAuthCookies,
  setUserDisplayCookie,
} from "@/lib/authCookies";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

// 토큰을 받아서 httpOnly 쿠키에 바인딩하는 엔드포인트
// 소셜 로그인 콜백에서 사용
export async function POST(request: Request) {
  const { accessToken, refreshToken } = await request.json();

  if (!accessToken || !refreshToken) {
    return NextResponse.json({ message: "토큰이 없습니다." }, { status: 400 });
  }

  // 백엔드 /users/me 호출하여 유저 데이터 조회
  const { data: meData } = await axios.get<User>(
    `${API_BASE_URL}/users/me`,
    { headers: { Authorization: `Bearer ${accessToken}` } },
  );

  const response = NextResponse.json({ ok: true, user: meData });
  setAuthCookies(response, { accessToken, refreshToken });
  setUserDisplayCookie(response, meData);

  return response;
}

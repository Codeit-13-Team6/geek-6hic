import axios from "axios";
import { NextResponse } from "next/server";
import type { LoginFormValues, OAuthLoginResult, User } from "@/shared/types";
import { setAuthCookies, setUserDisplayCookie } from "@/infra/auth/cookies";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export async function POST(request: Request) {
  const body = (await request.json()) as LoginFormValues;

  try {
    const { data: loginData } = await axios.post<OAuthLoginResult>(
      `${API_BASE_URL}/auth/login`,
      body,
      { headers: { "Content-Type": "application/json" } },
    );

    // 백엔드 /users/me 호출하여 정확한 유저 데이터 조회
    const { data: meData } = await axios.get<User>(`${API_BASE_URL}/users/me`, {
      headers: { Authorization: `Bearer ${loginData.accessToken}` },
    });

    const response = NextResponse.json({ ok: true, user: meData });

    setAuthCookies(response, {
      accessToken: loginData.accessToken,
      refreshToken: loginData.refreshToken,
    });

    setUserDisplayCookie(response, meData);

    return response;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return NextResponse.json(
        error.response?.data ?? { message: "로그인 실패" },
        { status: error.response?.status ?? 500 },
      );
    }
    return NextResponse.json({ message: "로그인 실패" }, { status: 500 });
  }
}

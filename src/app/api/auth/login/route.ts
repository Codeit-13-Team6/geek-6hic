import axios from "axios";
import { NextResponse } from "next/server";
import type { User } from "@/types/index";
import { setAuthCookies } from "@/lib/auth-cookies";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

interface LoginRequestBody {
  email: string;
  password: string;
}

interface LoginResponseBody {
  user: User;
  accessToken: string;
  refreshToken: string;
}

export async function POST(request: Request) {
  const body = (await request.json()) as LoginRequestBody;

  try {
    const { data: loginData } = await axios.post<LoginResponseBody>(
      `${API_BASE_URL}/auth/login`,
      body,
      { headers: { "Content-Type": "application/json" } },
    );

    const response = NextResponse.json({ ok: true, user: loginData.user });

    setAuthCookies(response, {
      accessToken: loginData.accessToken,
      refreshToken: loginData.refreshToken,
    });

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

import axios from "axios";
import { NextResponse } from "next/server";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

const ACCESS_TOKEN_MAX_AGE = 60 * 15;
const REFRESH_TOKEN_MAX_AGE = 60 * 60 * 24 * 7;

interface LoginRequestBody {
  email: string;
  password: string;
}

interface LoginResponseBody {
  accessToken: string;
  refreshToken: string;
}

export async function POST(request: Request) {
  const body = (await request.json()) as LoginRequestBody;
  try {
    const { data: loginData } = await axios.post<LoginResponseBody>(
      `${API_BASE_URL}/auth/login`,
      body,
      {
        headers: {
          "Content-Type": "application/json",
        },
      },
    );
    const response = NextResponse.json({
      ok: true,
    });

    response.cookies.set("accessToken", loginData.accessToken, {
      httpOnly: true,
      path: "/",
      sameSite: "strict",
      secure: process.env.NODE_ENV === "production",
      maxAge: ACCESS_TOKEN_MAX_AGE,
    });
    response.cookies.set("refreshToken", loginData.refreshToken, {
      httpOnly: true,
      path: "/",
      sameSite: "strict",
      secure: process.env.NODE_ENV === "production",
      maxAge: REFRESH_TOKEN_MAX_AGE,
    });

    return response;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return NextResponse.json(
        error.response?.data ?? { message: "로그인 실패" },
        {
          status: error.response?.status ?? 500,
        },
      );
    }

    return NextResponse.json({ message: "로그인 실패" }, { status: 500 });
  }
}

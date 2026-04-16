import axios from "axios";
import { NextResponse } from "next/server";
import type { LoginFormValues, OAuthLoginResult } from "@/types";
import { createAuthSuccessResponse } from "@/lib/auth/authResponse";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export async function POST(request: Request) {
  const body = (await request.json()) as LoginFormValues;

  try {
    const { data: loginData } = await axios.post<OAuthLoginResult>(
      `${API_BASE_URL}/auth/login`,
      body,
      { headers: { "Content-Type": "application/json" } },
    );

    return await createAuthSuccessResponse({
      accessToken: loginData.accessToken,
      refreshToken: loginData.refreshToken,
    });
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

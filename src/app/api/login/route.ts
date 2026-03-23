//중간 서버
import axios from "axios";
import { NextResponse } from "next/server";
import type { User } from "@/types/index";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

const ACCESS_TOKEN_MAX_AGE = 60 * 15; //15분
const REFRESH_TOKEN_MAX_AGE = 60 * 60 * 24 * 7; //7일

interface LoginRequestBody {
  email: string;
  password: string;
}

interface LoginResponseBody {
  user: User; // 유저정보 타입 넣기
  accessToken: string;
  refreshToken: string;
}

export async function POST(request: Request) {
  const body = (await request.json()) as LoginRequestBody;

  try {
    //BFF가 실제 백엔드 로그인 API를 호출
    const { data: loginData } = await axios.post<LoginResponseBody>(
      `${API_BASE_URL}/auth/login`,
      body,
      {
        headers: {
          "Content-Type": "application/json",
        },
      },
    );

    console.log({ loginData });

    //로그인 성공 시, 응답 토큰을 쿠키에 저장하여 클라이언트로 전달
    //쿠키 설정: httpOnly, secure, sameSite 등 보안 옵션 적용
    //NextResponse를 사용하여 쿠키 설정과 함께 JSON 응답 반환
    // 로그인 성공시 성공했다는 응답 생성 로직
    const response = NextResponse.json({
      ok: true,
      user: loginData.user, // 유저정보 받아오기
    });

    // 액세스 토큰 쿠키 저장 로직
    response.cookies.set("accessToken", loginData.accessToken, {
      httpOnly: true,
      path: "/",
      sameSite: "strict",
      secure: process.env.NODE_ENV === "production",
      maxAge: ACCESS_TOKEN_MAX_AGE,
    });

    // 리프레시 토큰 쿠키 저장 로직
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
      // 백엔드 에러 응답 전달 로직
      return NextResponse.json(
        error.response?.data ?? { message: "로그인 실패" },
        {
          status: error.response?.status ?? 500,
        },
      );
    }

    // 예외 상황 기본 실패 응답 로직
    return NextResponse.json({ message: "로그인 실패" }, { status: 500 });
  }
}

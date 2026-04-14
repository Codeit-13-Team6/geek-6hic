import axios from "axios";
import { NextResponse } from "next/server";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;
const KAKAO_CLIENT_ID = process.env.NEXT_PUBLIC_KAKAO_CLIENT_ID;
const KAKAO_CLIENT_SECRET = process.env.KAKAO_CLIENT_SECRET;

type OAuthLoginResult = {
  user: {
    id: number;
    teamId: string;
    email: string;
    name: string;
    companyName: string;
    image: string | null;
    createdAt: string;
    updatedAt: string;
  };
  accessToken: string;
  refreshToken: string;
};

export async function POST(request: Request) {
  const { code } = (await request.json()) as { code?: string };

  if (!code) {
    return NextResponse.json({ message: "인가 코드가 없습니다." }, { status: 400 });
  }

  if (!API_BASE_URL || !KAKAO_CLIENT_ID) {
    return NextResponse.json(
      { message: "카카오 로그인 설정이 올바르지 않습니다." },
      { status: 500 },
    );
  }

  const redirectUri = `${new URL(request.url).origin}/oauth/kakao`;
  const tokenParams = new URLSearchParams({
    grant_type: "authorization_code",
    client_id: KAKAO_CLIENT_ID,
    code,
    redirect_uri: redirectUri,
  });

  if (KAKAO_CLIENT_SECRET) {
    tokenParams.set("client_secret", KAKAO_CLIENT_SECRET);
  }

  try {
    const { data: tokenData } = await axios.post<{
      access_token?: string;
    }>("https://kauth.kakao.com/oauth/token", tokenParams, {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded;charset=utf-8",
      },
    });

    if (!tokenData.access_token) {
      return NextResponse.json(
        { message: "카카오 access token이 없습니다." },
        { status: 500 },
      );
    }

    const { data: oauthData } = await axios.post<OAuthLoginResult>(
      `${API_BASE_URL}/oauth/kakao`,
      { token: tokenData.access_token },
      {
        headers: {
          "Content-Type": "application/json",
        },
      },
    );

    return NextResponse.json(oauthData);
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return NextResponse.json(
        error.response?.data ?? { message: "카카오 로그인 처리에 실패했습니다." },
        { status: error.response?.status ?? 500 },
      );
    }

    return NextResponse.json(
      { message: "카카오 로그인 처리에 실패했습니다." },
      { status: 500 },
    );
  }
}

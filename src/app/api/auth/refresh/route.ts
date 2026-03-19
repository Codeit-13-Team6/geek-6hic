import axios from "axios";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST() {
  const cookieStore = await cookies();
  const refreshToken = cookieStore.get("refreshToken")?.value;

  if (!refreshToken) {
    return NextResponse.json({ message: "No refresh token" }, { status: 401 });
  }

  try {
    const { data } = await axios.post(
      `${process.env.NEXT_PUBLIC_API_URL}/auth/refresh`,
      {
        refreshToken,
      },
    );

    const response = NextResponse.json({ ok: true });

    // 새 액세스 토큰을 쿠키에 굽기
    response.cookies.set("accessToken", data.accessToken, {
      httpOnly: true,
      path: "/",
      sameSite: "strict",
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 15, // 15분
    });

    return response;
  } catch (error) {
    return NextResponse.json({ message: "Refresh failed" }, { status: 401 });
  }
}

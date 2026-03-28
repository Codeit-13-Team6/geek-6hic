import axios from "axios";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { setAuthCookies } from "@/lib/authCookies";

// 클라이언트 인터셉터에서 호출하는 토큰 갱신 엔드포인트
// refreshToken 쿠키를 읽어 백엔드에 갱신 요청 → 새 토큰을 쿠키에 저장
// 추후 수정 예정
export async function POST() {
  const cookieStore = await cookies();
  const refreshToken = cookieStore.get("refreshToken")?.value;

  if (!refreshToken) {
    return NextResponse.json(
      { message: "리프레시 토큰이 없습니다." },
      { status: 401 },
    );
  }

  try {
    const { data } = await axios.post(
      `${process.env.NEXT_PUBLIC_API_URL}/auth/refresh`,
      { refreshToken },
    );

    const response = NextResponse.json({ ok: true });
    setAuthCookies(response, {
      accessToken: data.accessToken,
      refreshToken: data.refreshToken,
    });

    return response;
  } catch {
    // 갱신 실패 → 쿠키 삭제
    const response = NextResponse.json(
      { message: "토큰 갱신에 실패했습니다." },
      { status: 401 },
    );
    response.cookies.delete("accessToken");
    response.cookies.delete("refreshToken");
    return response;
  }
}

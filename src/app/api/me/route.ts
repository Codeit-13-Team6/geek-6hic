import axios from 'axios';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

// 유저정보 조회를 위해 쿠키에서 토큰 GET
export async function GET() {
  // 쿠키들어올때 까지 대기 후 토큰 get
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("accessToken")?.value;

  // accessToken 없으면 로그인 안 된 상태니까 서버에 보내기전에 종료
  if (!accessToken) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }

  try {
    const { data } = await axios.get(`${API_BASE_URL}/users/me`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    return NextResponse.json({ ok: true, user: data });
  } catch {
    return NextResponse.json({ ok: false }, { status: 401 });
  }
}
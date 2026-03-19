import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function POST() {
  const cookieStore = await cookies();

  cookieStore.set('accessToken', '', {
    expires: new Date(0), // 쿠키날짜 즉시만료
    path: '/', // 모든페이지에 적용
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
  });

  cookieStore.set('refreshToken', '', {
    expires: new Date(0), // 쿠키날짜 즉시만료
    path: '/', // 모든페이지에 적용
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
  });

  return NextResponse.json({ ok: true });
}
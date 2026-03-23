import { cookies } from 'next/headers';

// token 유무 확인해서 memberProvider에 내려주는 역할
export async function getIsAuthenticated() {
  const cookieStore = await cookies();

  const hasAccessToken = Boolean(cookieStore.get('accessToken')?.value);
  const hasRefreshToken = Boolean(cookieStore.get('refreshToken')?.value);

  return hasAccessToken || hasRefreshToken;
}
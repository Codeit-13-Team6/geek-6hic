import { cookies } from "next/headers";

// 비로그인 유저 401 에러 방지 코드 ,
// 서버에서 쿠키 보유 여부 확인 한 후 보유하지않았으면 패치미 막는 역할
export async function getIsAuthenticated() {
  const cookieStore = await cookies();

  const hasAccessToken = Boolean(cookieStore.get("accessToken")?.value);
  const hasRefreshToken = Boolean(cookieStore.get("refreshToken")?.value);

  return hasAccessToken && hasRefreshToken;
}

import { getRefresh } from "@/api/auth";

export async function fetchWithAuth<T>(
  fetcher: (token: string) => Promise<T>
): Promise<T> {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("토큰 없음");

  try {
    return await fetcher(token);
  } catch {
    const refresh = localStorage.getItem("refresh");
    if (!refresh) throw new Error("리프레시 토큰 없음");

    const { accessToken, refreshToken } = await getRefresh(refresh);
    localStorage.setItem("token", accessToken);
    localStorage.setItem("refresh", refreshToken);
    return await fetcher(accessToken);
  }
}

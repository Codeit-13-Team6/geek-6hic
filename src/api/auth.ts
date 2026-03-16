
const BASE_URL = process.env.NEXT_PUBLIC_API_URL;


export async function getRefresh(refreshToken: string): Promise<{ accessToken: string; refreshToken: string }> {
  const res = await fetch(`${BASE_URL}/auth/refresh`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ refreshToken }),
  });
  if (!res.ok) throw new Error("토큰 갱신 실패");
  return res.json();
}
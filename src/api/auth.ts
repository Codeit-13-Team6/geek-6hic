import axios from "axios";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export async function getRefresh(
  refreshToken: string
): Promise<{ accessToken: string; refreshToken: string }> {
  const { data } = await axios.post(`${BASE_URL}/auth/refresh`, {
    refreshToken,
  });
  return data;
}

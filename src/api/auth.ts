import axios from "axios";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export async function getRefresh(
  refreshToken: string,
): Promise<{ accessToken: string; refreshToken: string }> {
  const { data } = await axios.post(`${BASE_URL}/auth/refresh`, {
    refreshToken,
  });
  return data;
}

export interface LoginResult {
  ok: boolean;
}

export async function loginUser(data: {
  email: string;
  password: string;
}): Promise<LoginResult> {
  const res = await axios.post("/api/login", data, {
    withCredentials: true,
  });
  return res.data;
}

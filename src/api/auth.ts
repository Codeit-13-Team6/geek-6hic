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

// 로그인 응답 타입 정의
export interface LoginResult {
  ok: boolean;
}

// 클라이언트 로그인 BFF 호출 함수
export async function loginUser(data: {
  email: string;
  password: string;
}): Promise<LoginResult> {
  //중간서버 로그인 API 호출
  const res = await axios.post("/api/login", data, {
    withCredentials: true,
  });
  return res.data;
}

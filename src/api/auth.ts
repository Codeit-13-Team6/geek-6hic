import axios from "axios";
import type { User } from "@/types/user";
import axiosInstance from "@/lib/axios";

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
  user?: User; // 유저 데이터 있을 때 타입정의
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

// 클라이언트 유저 BFF 호출 함수
export async function fetchMe(): Promise<User | null> {
  try {
    // ** 이제 /api/users/me 라는 물리적 파일은 없음
    // ** -> axiosInstance를 통해 baseURL: "/api" 설정 + withCredentials: true 자동으로 됨
    // ** 이 다음에 slug 프록시가 /api/users/me 요청을 받아서 백엔드로 전달
    const res = await axiosInstance.get("/users/me");

    return res.data;
  } catch {
    return null;
  }
}

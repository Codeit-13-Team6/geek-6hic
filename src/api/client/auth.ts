import axios from "axios";
import type { User } from "@/types";
import type { SignUpFormValues } from "@/types";
import axiosInstance from "@/lib/clientFetcher";

// 로그인 응답 타입 정의
export interface LoginResult {
  ok: boolean;
  user?: User;
}

export interface SignUpResult {
  ok: boolean;
}

// 클라이언트 로그인 BFF 호출 함수
export async function loginUser(data: {
  email: string;
  password: string;
}): Promise<LoginResult> {
  const res = await axiosInstance.post("/auth/login", data);
  return res.data;
}

// 클라이언트 회원가입 BFF 호출 함수
export async function signupUser(
  data: SignUpFormValues,
): Promise<SignUpResult> {
  const payload = {
    name: data.name,
    email: data.email,
    password: data.password,
    companyName: data.introduce,
  };

  const res = await axiosInstance.post("/api/auth/signup", payload, {
    withCredentials: true,
  });

  return res.data;
}

// 클라이언트 유저 BFF 호출 함수
export async function getUserData(): Promise<User | null> {
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

import axios from "axios";
import type { User } from "@/shared/types";
import type {
  LoginResult,
  OAuthLoginResult,
  OAuthTokenPair,
  SignUpFormValues,
  SignUpResult,
} from "@/shared/types";
import axiosInstance from "@/infra/auth/fetcher.client";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

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

  const res = await axiosInstance.post("/auth/signup", payload, {
    withCredentials: true,
  });

  return res.data;
}

export async function loginWithGoogleToken(
  token: string,
): Promise<OAuthLoginResult> {
  if (!API_BASE_URL) {
    throw new Error("missing_api_url");
  }

  const res = await axios.post<OAuthLoginResult>(`${API_BASE_URL}/oauth/google`, {
    token,
  });

  return res.data;
}

export async function bindAuthTokens(tokens: OAuthTokenPair): Promise<LoginResult> {
  const res = await axiosInstance.post("/auth/token", tokens);
  return res.data;
}

export async function loginWithKakaoCode(
  code: string,
): Promise<OAuthLoginResult> {
  const res = await axiosInstance.post<OAuthLoginResult>("/oauth/kakao", {
    code,
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

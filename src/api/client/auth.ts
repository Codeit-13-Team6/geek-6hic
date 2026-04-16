import axios from "axios";
import type {
  LoginResult,
  OAuthLoginResult,
  OAuthTokenPair,
  SignUpFormValues,
  SignUpResult,
} from "@/types";
import axiosInstance from "@/lib/auth/fetcher.client";

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

export async function logoutUser(): Promise<{ ok: boolean }> {
  const res = await axiosInstance.post<{ ok: boolean }>(
    "/auth/logout",
    {},
    { withCredentials: true },
  );
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

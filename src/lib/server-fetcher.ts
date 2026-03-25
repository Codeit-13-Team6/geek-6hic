import axios, { AxiosError, AxiosRequestConfig, InternalAxiosRequestConfig } from "axios";
import { cookies } from "next/headers";
import {
  ACCESS_TOKEN_MAX_AGE,
  REFRESH_TOKEN_MAX_AGE,
} from "@/lib/auth-cookies";
import { redirect } from "next/navigation";

interface TokenPair {
  accessToken: string;
  refreshToken: string;
}

interface RefreshFailedResponse {
  message: string;
  code: string;
}

interface RefreshFailedError extends Error {
  response: {
    status: number;
    data: RefreshFailedResponse;
  };
}

interface RetryableRequestConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

const serverAxios = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true,
});

// 유저별 refresh queue: refreshToken을 키로 사용하여 유저별로 분리
// 동일 유저의 동시 요청은 같은 Promise를 공유, 다른 유저끼리는 독립
const refreshMap = new Map<string, Promise<TokenPair | null>>();


const COOKIE_OPTIONS = {
  httpOnly: true,
  path: "/",
  sameSite: "strict" as const,
  secure: process.env.NODE_ENV === "production",
};


// refresh 성공 시 새 토큰을 저장 (slug에서 응답에 Set-Cookie 붙이기 위함)
let lastRefreshedTokens: TokenPair | null = null;

// refresh 후 저장된 토큰을 꺼내고 초기화 (slug에서 호출)
// function consumeRefreshedTokens() {
//   const tokens = lastRefreshedTokens;
//   lastRefreshedTokens = null;
//   return tokens;
// }

// 리프레시 토큰으로 새 액세스 토큰을 발급받는 함수 (유저별 queue 패턴)
// refreshToken을 키로 사용하여 같은 유저의 동시 요청만 Promise를 공유
function createRefreshFailedError(): RefreshFailedError {
  const error = new Error("REFRESH_FAILED") as RefreshFailedError;
  error.response = {
    status: 401,
    data: { message: "Unauthorized", code: "REFRESH_FAILED" },
  };
  return error;
}

const refreshAccessToken = async (requestUrl: string): Promise<TokenPair | null> => {
  const cookieStore = await cookies();
  const refreshToken = cookieStore.get("refreshToken")?.value;

  if (!refreshToken) return null;

  // 이미 해당 유저의 refresh가 진행 중이면 같은 Promise 반환
  if (refreshMap.has(refreshToken)) {
    console.log(
      `[server-fetcher] refresh 대기열 참여 (queue 재사용): ${requestUrl}`,
    );
    return refreshMap.get(refreshToken)!;
  }

  console.log(`[server-fetcher] refresh 최초 호출 (queue 생성): ${requestUrl}`);

  const promise = (async () => {
    try {
      // interceptor 무한루프 방지: 별도 axios 인스턴스 사용
      // 리프레쉬 토큰이 존재하지만 만료되었다면 여기서 catch 로 떨어짐
      const { data } = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/refresh`,
        { refreshToken },
      );
      console.log(`[server-fetcher] refresh 성공: ${requestUrl}`);

      // slug에서 응답에 Set-Cookie 붙이기 위해 저장
      lastRefreshedTokens = { accessToken: data.accessToken, refreshToken: data.refreshToken };

      // cookies() API로 서버 쿠키 갱신
      cookieStore.set("accessToken", data.accessToken, {
        ...COOKIE_OPTIONS,
        maxAge: ACCESS_TOKEN_MAX_AGE,
      });
      cookieStore.set("refreshToken", data.refreshToken, {
        ...COOKIE_OPTIONS,
        maxAge: REFRESH_TOKEN_MAX_AGE,
      });

      return data;
    } catch {
      console.log(`[server-fetcher] refresh 실패: ${requestUrl}`);
      return null;
    } finally {
      refreshMap.delete(refreshToken);
    }
  })();

  refreshMap.set(refreshToken, promise);
  return promise;
};

// request interceptor: 매 요청마다 accessToken을 Authorization 헤더에 자동 세팅
// accessToken 없으면 미리 refresh 시도, refreshToken도 없으면 즉시 차단
// 리퀘스트에서는 토큰 만료 상태는 확인 불가능하고 토큰 유무에 대해서만 판단하고 처리
// 토큰이 단순히 없는 경우에 먼저 리퀘스트로 토큰 재발급 하고 요청 대기시킨후 재발급한 토큰으로 진행
// 여러개 요청날라오는건 refreshAccessToken 의 map 으로 제어
serverAxios.interceptors.request.use(async (config) => {
  const cookieStore = await cookies();
  let accessToken = cookieStore.get("accessToken")?.value;
  const refreshToken = cookieStore.get("refreshToken")?.value;
  console.log(refreshToken, ' 리퀘스트 완전 처음 ');


  // refreshToken도 없으면 요청 보내지 않고 즉시 차단
  if (!refreshToken) {
    return Promise.reject(createRefreshFailedError());
  }

  if (!accessToken) {
    // accessToken만 없으면 미리 refresh 시도
    const refreshed = await refreshAccessToken(config.url ?? "");

    if (!refreshed) {
      // refresh 시도했는데도 accessToken 못 받으면 차단
      return Promise.reject(createRefreshFailedError());
    }
    accessToken = refreshed.accessToken;
  }

  config.headers.Authorization = `Bearer ${accessToken}`;
  console.log( " 리퀘스트 끝까지 내려옴  ");

  return config;
});

// response interceptor: 401 시 refresh 후 재시도
// 여기에서는 토큰이 만료된경우를 처리
// response 의 에러만  핸들링함
serverAxios.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as RetryableRequestConfig | undefined;

    console.log("인터셉터 레스폰스 처음 ");
    // 백엔드에서 떨어지는 401 을 제외한 다른 에러들은 config 가 없는 상태라 그냥 바로 떨어뜨려줌
    // config 없는 에러 = 직접 만든 REFRESH_FAILED 에러
    // config 있는 에러 = 백엔드에서 떨어지는 에러 = 403, 404, 500 등
    if (!originalRequest) {
      return Promise.reject(error);
    }

    // 401이고 아직 재시도하지 않은 요청만 처리
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      const refreshed = await refreshAccessToken(originalRequest.url ?? "");

      if (!refreshed) {
        return Promise.reject(createRefreshFailedError());
      }

      // 새 토큰으로 원래 요청 재시도
      originalRequest.headers.Authorization = `Bearer ${refreshed.accessToken}`;
      return serverAxios(originalRequest);
    }

    console.log("인터셉터 레스폰스 마지막 ");

    return Promise.reject(error);
  },
);



// 서버 컴포넌트 전용 리프레쉬 토큰 없거나 만료되었을때 저절로 redirect 처리하기 위해 래퍼로 감싸둠
async function serverFetch<T = unknown>(config: AxiosRequestConfig<T>) {
  try {
    return await serverAxios(config);
  } catch (err) {
    const error = err as RefreshFailedError;
    if (error.response?.data?.code === "REFRESH_FAILED") {
      redirect("/login");
    }
    throw err;
  }
}


// serverAxios 는 서버단에서 사용
// serverFetch 는 서버컴포넌트용

export { serverAxios, serverFetch };

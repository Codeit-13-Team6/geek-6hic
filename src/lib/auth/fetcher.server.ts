import axios, {
  AxiosError,
  AxiosRequestConfig,
  InternalAxiosRequestConfig,
} from "axios";
import {
  ACCESS_TOKEN_MAX_AGE,
  COOKIE_OPTIONS,
  REFRESH_TOKEN_MAX_AGE,
} from "@/lib/auth/cookies";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";

export interface TokenPair {
  accessToken: string;
  refreshToken: string | null;
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
  _refreshedTokens?: TokenPair;
  _deferredCookieCommit?: boolean;
}

interface AuthMetaCarrier {
  _refreshedTokens?: TokenPair;
  _deferredCookieCommit?: boolean;
}

interface RefreshResult {
  tokenPair: TokenPair | null;
  deferredCookieCommit: boolean;
}

type DeferredCommitMode = "redirect" | "bubble";

interface ServerFetchOptions {
  deferredCommitMode?: DeferredCommitMode;
  syncPath?: string;
}

export interface DeferredAuthCommitContext {
  refreshedTokens?: TokenPair;
}

const COOKIE_WRITE_FORBIDDEN_MESSAGE =
  "Cookies can only be modified in a Server Action or Route Handler";
const TEST_COOKIE_WRITE_FORBIDDEN_MESSAGE = "set-cookie-not-available";

// 모듈 떨어지는거 테스팅
// const MODULE_INSTANCE_ID = Math.random().toString(36).slice(2, 8);

// 그냥 serverAxios ,,,
const serverAxios = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true,
});

// 유저별 refresh map refreshToken을 키로 사용하여 유저별로 분리 -> 리프레쉬 키를 사용했었으나 토큰 로테이션 문제로 유저 고유의 값을 사용하기 위해 id 로 전환
// 동일 유저의 동시 요청은 같은 Promise를 공유, 다른 유저끼리는 독립

// Next.js가 SSR과 Route Handler를 별도 모듈 컨텍스트에서 실행
// 모듈 레벨 변수 대신 globalThis에 저장하여 프로세스 내 공유

// 첫 요청을 할 떄 프로미스를 생성, 이후에 들어오는 요청들은 프로미스 해결될때까지 대기
// resolve 되면 값들 처리하는 형식으로 진행

// vercel 배포환경에서 문제생길수있다는 이야기는 있는데 일단은 ,,, 진행
const globalStore = globalThis as typeof globalThis & {
  __refreshMap?: Map<string, Promise<TokenPair | null>>;
};

if (!globalStore.__refreshMap) globalStore.__refreshMap = new Map();

const refreshMap = globalStore.__refreshMap;

// refreshToken의 payload에서 userId(sub)를 추출
function getUserIdFromToken(token: string): string {
  const payload = JSON.parse(
    Buffer.from(token.split(".")[1], "base64").toString(),
  );
  return String(payload.sub);
}

// 리프레쉬토큰으로 인한 에러처리
function createRefreshFailedError(): RefreshFailedError {
  const error = new Error("REFRESH_FAILED") as RefreshFailedError;
  error.response = {
    status: 401,
    data: { message: "Unauthorized", code: "REFRESH_FAILED" },
  };
  return error;
}

// 브라우저에 쿠키를 세팅하는 공통 함수
// refreshAccessToken 내부에서 캐시/queue 결과를 반환할 때 매번 호출
async function setTokenCookies(tokens: TokenPair) {
  const cookieStore = await cookies();
  cookieStore.set("accessToken", tokens.accessToken, {
    ...COOKIE_OPTIONS,
    maxAge: ACCESS_TOKEN_MAX_AGE,
  });

  // 백엔드에서 rotaion token 적용중, 유예기간동안 허용된 요청들엔 리프레쉬 토큰이 null 이 떨어지게 해둬서 null 은 가드
  if (tokens.refreshToken !== null) {
    cookieStore.set("refreshToken", tokens.refreshToken, {
      ...COOKIE_OPTIONS,
      maxAge: REFRESH_TOKEN_MAX_AGE,
    });
  }
}

function collectDeferredAuthTokens(
  context: DeferredAuthCommitContext | undefined,
  carrier?: AuthMetaCarrier,
) {
  if (!context) {
    return;
  }
  if (!carrier?._deferredCookieCommit || !carrier._refreshedTokens) {
    return;
  }
  context.refreshedTokens = carrier._refreshedTokens;
}

function isDeferredCookieCommitError(err: unknown): boolean {
  if (!(err instanceof Error)) {
    return false;
  }
  return (
    err.message.includes(COOKIE_WRITE_FORBIDDEN_MESSAGE) ||
    err.message.includes(TEST_COOKIE_WRITE_FORBIDDEN_MESSAGE)
  );
}

async function setTokenCookiesOrMarkDeferred(tokens: TokenPair) {
  try {
    await setTokenCookies(tokens);
    return { deferredCookieCommit: false };
  } catch (err) {
    if (isDeferredCookieCommitError(err)) {
      return { deferredCookieCommit: true };
    }
    throw err;
  }
}

// 리프레시 토큰으로 새 액세스 토큰을 발급받는 함수
// 리턴값은 tokenPair  또는 null ( 보통은 리프레쉬 토큰이 만료되었을때 )
const refreshAccessToken = async (
  userId: string,
  requestUrl: string,
  forceRefresh = false,
): Promise<RefreshResult> => {
  // 리프레쉬 맵에 유저아이디가 있을때  토큰 캐시처리 로직
  if (refreshMap.has(userId)) {
    // 포스리프레쉬가 아닐떄 , 포스리프레쉬는 강제로 리프레쉬해버리니까 아래 로직이 필요없음
    if (!forceRefresh) {
      // 캐시 또는 진행 중인 refresh가 있으면 그대로 재사용
      // 캐시 히트 시에도 현재 요청의 응답에 쿠키를 세팅해야 브라우저에 전달됨

      const cachedTokenPair = await refreshMap.get(userId)!;
      if (cachedTokenPair) {
        const { deferredCookieCommit } =
          await setTokenCookiesOrMarkDeferred(cachedTokenPair);
        return {
          tokenPair: cachedTokenPair,
          deferredCookieCommit,
        };
      }
      return { tokenPair: null, deferredCookieCommit: false };
    }

    //   [Promise 생성] ─────── [resolve] ──────────────────── [401로 forceRefresh delete]
    //      │                    │                                    │
    // ├── 요청A: 생성       │                                    │
    // ├── 요청B: 합류(대기)  │                                    │
    // ├── 요청C: 합류(대기)  │                                    │
    // │                A,B,C 토큰 받음                            │
    // │                    │                                    │
    // ├── 요청D: 캐시 히트   │                                    │
    // ├── 요청E: 캐시 히트   │                                    │
    // │              (페이지 이동해도 캐시 유지)                     │
    // ├── 요청F: 캐시 히트   │                                    │
    // │                    │         (15분 후 accessToken 만료)   │
    // ├── 요청G: 캐시 히트 → 만료된 토큰으로 API → 401 → delete    │
    // │                                                         │
    // ├── 요청G: 새로 생성 (forceRefresh)

    // forceRefresh true case = 캐시된 토큰이 401 떨어진 상황,
    // 이미 다른 forceRefresh가 진행 중이면 그 Promise에 합류 (중복 refresh 방지)
    // 아직 resolve된 캐시라면 삭제 후 새로 생성
    const existing = refreshMap.get(userId)!;

    // 어떤 녀석이 resolve 가 떨어졌는지 확인하는 로직
    // true , 맵 안에 결과값만 있는 상태이고
    // false , 맵 promise 가 pending 인 상태
    const isSettled = await Promise.race([
      existing.then(() => true),
      Promise.resolve(false),
    ]);

    if (!isSettled) {
      // 아직 진행 중인 refresh가 있음 → 완료될 때까지 대기
      // 합류하면 rotation으로 무효한 토큰을 받을 수 있으므로 대기 후 새로 refresh

      await existing;

      // 대기 사이에 다른 forceRefresh가 이미 새 refresh를 만들었을 수 있음
      // 새 entry가 있으면 그걸 재사용 (중복 refresh 방지)
      const current = refreshMap.get(userId);
      if (current && current !== existing) {
        const result = await current;
        if (result) {
          const { deferredCookieCommit } =
            await setTokenCookiesOrMarkDeferred(result);
          return { tokenPair: result, deferredCookieCommit };
        }
        return { tokenPair: null, deferredCookieCommit: false };
      }

      refreshMap.delete(userId);
      // 아래에서 새 Promise 생성으로 진행
    }

    // settled(캐시) → 삭제 후 새로 생성
    // true 가 떨어져서 맵 안에는 결과값만 있는 상태인데 이 함수가 실행되었다는것은
    // 맵 안의 결과값이 만료된 토큰이라는 의미 그럼 맵을 한번 정리함

    refreshMap.delete(userId);
  } // if fine.

  // await 전에 즉시 map에 등록하여 동시 진입 방지
  const promise = (async () => {
    try {
      const cookieStore = await cookies();
      const refreshToken = cookieStore.get("refreshToken")?.value;

      // 리프레쉬 토큰 없으면 유저 맵 초기화해주고 null 떨어뜨려서 함수 종료함
      // 이상황에서 보통 없을일 없긴한데 가드역할
      // null 떨어뜨리면 인터셉터에서 에러 처리해줌
      if (!refreshToken) {
        refreshMap.delete(userId);
        return null;
      }

      // interceptor 무한루프 방지를 위해 서버액션 안쓰고 별도 axios 인스턴스 사용
      // 리프레쉬 토큰이 존재하지만 만료되었다면 여기서 catch 로 떨어짐
      const { data } = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/refresh`,
        { refreshToken },
      );

      return data as TokenPair;
    } catch {
      // 리프레쉬 api 에서 실패난거라 리프레쉬 토큰 자체가 만료된것
      refreshMap.delete(userId);
      return null;
    }
  })();

  refreshMap.set(userId, promise); // await 없이 즉시 등록
  const tokenPair = await promise;

  if (!tokenPair) {
    return { tokenPair: null, deferredCookieCommit: false };
  }

  const { deferredCookieCommit } =
    await setTokenCookiesOrMarkDeferred(tokenPair);
  return { tokenPair, deferredCookieCommit };
};

// 인증 없이 요청 가능한 경로 (정규식으로 정확히 매칭)
const PUBLIC_PATH_PATTERNS = [
  /\/posts$/, // /posts (exact)
  /\/posts\?/, // /posts?cursor=...
  /\/posts\/\d+$/, // /posts/123 (상세)
  /\/posts\/\d+\?/, // /posts/123?...
  /\/posts\/\d+\/comments/, // /posts/123/comments (조회)
  /\/meetings$/, // /meetings (exact)
  /\/meetings\?/, // /meetings?...
  /\/meetings\/\d+$/, // /meetings/132 (상세)
  /\/meetings\/\d+\?/, // /meetings/132?...
  /\/meetings\/\d+\/participants/, // /meetings/132/participants
  /\/api\/hot/, // /api/hot
  /\/meeting-types$/, // /meeting-types
];

const isPublicPath = (url?: string) => {
  if (!url) return false;
  try {
    const { pathname, search } = new URL(url);
    const full = pathname + search;
    return PUBLIC_PATH_PATTERNS.some((pattern) => pattern.test(full));
  } catch {
    return PUBLIC_PATH_PATTERNS.some((pattern) => pattern.test(url));
  }
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

  // refreshToken도 없으면 요청 보내지 않고 즉시 차단 (공개 경로는 제외)
  if (!refreshToken) {
    if (isPublicPath(config.url)) {
      return config;
    }
    return Promise.reject(createRefreshFailedError());
  }
  if (!accessToken) {
    // accessToken만 없으면 미리 refresh 시도
    const userId = getUserIdFromToken(refreshToken);
    const refreshed = await refreshAccessToken(userId, config.url ?? "");

    if (!refreshed.tokenPair) {
      // refresh 시도했는데도 accessToken 못 받으면 차단
      return Promise.reject(createRefreshFailedError());
    }
    accessToken = refreshed.tokenPair.accessToken;

    if (refreshed.deferredCookieCommit) {
      config._refreshedTokens = refreshed.tokenPair;
      config._deferredCookieCommit = true;
    }
  }

  config.headers.Authorization = `Bearer ${accessToken}`;

  return config;
});

// response interceptor: 401 시 refresh 후 재시도
// 여기에서는 토큰이 만료된경우를 처리
// response 의 에러만  핸들링함
serverAxios.interceptors.response.use(
  (response) => {
    if (response.config._deferredCookieCommit && response.config._refreshedTokens) {
      response._deferredCookieCommit = true;
      response._refreshedTokens = response.config._refreshedTokens;
    }
    return response;
  },
  async (error: AxiosError) => {
    const originalRequest = error.config as RetryableRequestConfig | undefined;

    // config 없는 에러 = 직접 만든 REFRESH_FAILED 에러
    // config 있는 에러 = 백엔드에서 떨어지는 에러 = 403, 404, 500 등
    if (!originalRequest) {
      // if 에서 config 있는지 확인하고 바로 떨어뜨리기
      return Promise.reject(error);
    }

    // 401이고 아직 재시도하지 않은 요청만 처리
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      const cookieStore = await cookies();
      const refreshToken = cookieStore.get("refreshToken")?.value;

      // 요청인터셉터에서 거르긴했는데 혹시몰라서 남겨둠
      if (!refreshToken) {
        return Promise.reject(createRefreshFailedError());
      }

      const userId = getUserIdFromToken(refreshToken);
      // 401 = 캐시된 accessToken이 만료됨 → forceRefresh로 캐시 무효화 + 새로 refresh
      const refreshed = await refreshAccessToken(
        userId,
        originalRequest.url ?? "",
        true,
      );

      // 리프레쉬 요청이 실패했다는건 리프레쉬 토큰도 만료되었다는것 에러처리
      if (!refreshed.tokenPair) {
        return Promise.reject(createRefreshFailedError());
      }

      // 새 토큰으로 원래 요청 재시도
      originalRequest.headers.Authorization =
        `Bearer ${refreshed.tokenPair.accessToken}`;

      if (refreshed.deferredCookieCommit) {
        originalRequest._deferredCookieCommit = true;
        originalRequest._refreshedTokens = refreshed.tokenPair;
      } else {
        delete originalRequest._deferredCookieCommit;
        delete originalRequest._refreshedTokens;
      }

      const retryResponse = await serverAxios(originalRequest);
      if (refreshed.deferredCookieCommit) {
        retryResponse._deferredCookieCommit = true;
        retryResponse._refreshedTokens = refreshed.tokenPair;
      }
      return retryResponse;
    }

    return Promise.reject(error);
  },
);

// 서버 컴포넌트 전용 리프레쉬 토큰 없거나 만료되었을때 저절로 redirect 처리하기 위해 래퍼로 감싸둠
async function serverFetch<T = unknown>(
  config: AxiosRequestConfig<T>,
  options: ServerFetchOptions = {},
) {
  const {
    deferredCommitMode = "redirect",
    syncPath = "/api/auth/sync",
  } = options;

  try {
    const response = await serverAxios(config);

    if (response._deferredCookieCommit && response._refreshedTokens) {
      if (deferredCommitMode === "bubble") {
        return response;
      }
      redirect(syncPath);
    }

    return response;
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

export {
  serverAxios,
  serverFetch,
  isPublicPath,
  getUserIdFromToken,
  collectDeferredAuthTokens,
};

import axios from "axios";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// 실제 백엔드 서버 주소
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;
const ACCESS_TOKEN_MAX_AGE = 60 * 15;
const REFRESH_TOKEN_MAX_AGE = 60 * 60 * 24 * 7;

interface RouteParams {
  params: Promise<{ slug: string[] }>;
}

interface RouteRule {
  pattern: RegExp;
  methods: NextRequest["method"][];
  requiresAuth: boolean;
}

interface RefreshResponse {
  accessToken: string;
  refreshToken: string;
}

interface ProxyRequestConfig {
  method: NextRequest["method"];
  url: string;
  headers: Record<string, string>;
  data: unknown;
}

const PROXY_ROUTE_RULES: RouteRule[] = [
  {
    pattern: /^\/meetings$/,
    methods: ["GET", "POST"],
    requiresAuth: true,
  },
  {
    pattern: /^\/meetings\/my$/,
    methods: ["GET"],
    requiresAuth: true,
  },
  {
    pattern: /^\/meetings\/\d+\/favorites$/,
    methods: ["POST", "DELETE"],
    requiresAuth: true,
  },
  {
    pattern: /^\/favorites$/,
    methods: ["GET"],
    requiresAuth: true,
  },
  {
    pattern: /^\/meeting-types$/,
    methods: ["POST"],
    requiresAuth: true,
  },
  {
    pattern: /^\/posts$/,
    methods: ["GET", "POST"],
    requiresAuth: true,
  },
  {
    pattern: /^\/reviews$/,
    methods: ["GET"],
    requiresAuth: true,
  },
  {
    pattern: /^\/users\/me$/,
    methods: ["GET", "PATCH"],
    requiresAuth: true,
  },
];

function buildRequestConfig(
  request: NextRequest,
  targetUrl: string,
  body: unknown,
  accessToken?: string,
): ProxyRequestConfig {
  const requestConfig: ProxyRequestConfig = {
    method: request.method,
    url: targetUrl,
    headers: {
      "Content-Type": "application/json",
    },
    data: body,
  };

  if (accessToken) {
    requestConfig.headers.Authorization = `Bearer ${accessToken}`;
  }

  return requestConfig;
}

function applyAuthCookies(response: NextResponse, tokens: RefreshResponse) {
  if (tokens.accessToken) {
    response.cookies.set("accessToken", tokens.accessToken, {
      httpOnly: true,
      path: "/",
      sameSite: "strict",
      secure: process.env.NODE_ENV === "production",
      maxAge: ACCESS_TOKEN_MAX_AGE,
    });
  }

  if (tokens.refreshToken) {
    response.cookies.set("refreshToken", tokens.refreshToken, {
      httpOnly: true,
      path: "/",
      sameSite: "strict",
      secure: process.env.NODE_ENV === "production",
      maxAge: REFRESH_TOKEN_MAX_AGE,
    });
  }
}

async function refreshAccessToken(refreshToken: string) {
  const { data } = await axios.post<RefreshResponse>(
    `${API_BASE_URL}/auth/refresh`,
    { refreshToken },
  );

  return data;
}

function getErrorResponse(error: unknown) {
  if (axios.isAxiosError(error)) {
    return error.response;
  }

  return undefined;
}

function getErrorMessage(error: unknown) {
  if (axios.isAxiosError(error)) {
    return error.message;
  }

  if (error instanceof Error) {
    return error.message;
  }

  return "Unknown error";
}

function getRouteRule(targetPath: string) {
  return PROXY_ROUTE_RULES.find((routeRule) =>
    routeRule.pattern.test(targetPath),
  );
}

// GET, POST 등 모든 요청을 하나로 처리하는 통합 핸들러
async function handleProxy(request: NextRequest, { params }: RouteParams) {
  // 1. 서버 전용 쿠키 저장소에서 액세스 토큰 읽기 (HttpOnly 쿠키라 서버에서만 가능)
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("accessToken")?.value;
  const refreshToken = cookieStore.get("refreshToken")?.value;

  // 2. Next.js 15 규칙에 따라 비동기 파라미터(slug) 풀기
  const resolvedParams = await params;
  const slug = resolvedParams.slug; // 예: ['users', 'me']

  if (!slug) {
    return NextResponse.json({ message: "Invalid Path" }, { status: 400 });
  }

  // 3. 실제 백엔드로 보낼 최종 주소 조립 (쿼리 스트링 포함)
  // 예: /api/users/me -> https://백엔드주소/users/me
  const targetPath = `/${slug.join("/")}`;
  const routeRule = getRouteRule(targetPath);
  const targetUrl = `${API_BASE_URL}${targetPath}${request.nextUrl.search}`;

  if (!routeRule) {
    return NextResponse.json(
      { message: "Unsupported API path" },
      { status: 404 },
    );
  }

  if (!routeRule.methods.includes(request.method)) {
    return NextResponse.json(
      { message: "Method Not Allowed" },
      { status: 405 },
    );
  }

  // TODO: 재인증 전에 막히기 때문에 삭제 필요
  // if (routeRule.requiresAuth && !accessToken) {
  //   return NextResponse.json(
  //     { message: "Access token is required" },
  //     { status: 401 },
  //   );
  // }

  // 4. 요청 본문(Body) 데이터 읽기 (POST, PUT 등일 때만)
  let body = null;
  if (["POST", "PUT", "PATCH"].includes(request.method)) {
    try {
      body = await request.json();
    } catch {
      body = null; // 바디가 비어있어도 에러 안 나게 방어
    }
  }

  // 5. 백엔드에 보낼 '진짜' 요청 설정
  const requestConfig = buildRequestConfig(
    request,
    targetUrl,
    body,
    routeRule.requiresAuth ? accessToken : undefined,
  );

  try {
    // 7. BFF 서버가 백엔드에 대신 요청을 보냄 (Proxying)
    const { data, status } = await axios(requestConfig);

    // 8. 백엔드에서 받은 데이터와 상태 코드를 브라우저에 그대로 전달
    return NextResponse.json(data, { status });
  } catch (error: unknown) {
    const errorResponse = getErrorResponse(error);
    console.log("에러니 - 1");
    // TODO: refreshToken으로 accessToken 재발급 후 재요청
    if (errorResponse?.status === 401 && refreshToken) {
      console.log("에러니 - 2");
      try {
        const newTokenData = await refreshAccessToken(refreshToken);
        // 기존 API 재호출
        const requestConfig = buildRequestConfig(
          request,
          targetUrl,
          body,
          routeRule.requiresAuth ? newTokenData.accessToken : undefined,
        );

        const { data, status } = await axios(requestConfig);

        const response = NextResponse.json(data, { status });

        applyAuthCookies(response, newTokenData);

        return response;
      } catch (error: unknown) {
        return NextResponse.json(errorResponse.data, {
          status: errorResponse.status,
        });
      }
    }

    // 백엔드 통신 실패 시 로그를 남기고 에러 정보를 클라이언트에 토스
    console.error(
      "BFF Proxy Error:",
      errorResponse?.data || getErrorMessage(error),
    );
    return NextResponse.json(
      errorResponse?.data ?? { message: "Internal Server Error" },
      { status: errorResponse?.status ?? 500 },
    );
  }
}

// 모든 HTTP 메서드에 대해 이 핸들러가 작동하도록 내보내기
export const GET = handleProxy;
export const POST = handleProxy;
export const PUT = handleProxy;
export const PATCH = handleProxy;
export const DELETE = handleProxy;

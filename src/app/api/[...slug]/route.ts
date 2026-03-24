import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import serverAxios from "@/lib/server-fetcher";
import { setAuthCookies } from "@/lib/auth-cookies";

// 디버깅용: 모듈 레벨 변수 (요청 간 스코프 공유 여부 테스트)
let requestCount = 0;

// 모듈 레벨 refresh queue: 동시 요청 시 refresh를 1번만 호출
let refreshPromise: Promise<{ accessToken: string; refreshToken: string } | null> | null = null;
// 디버깅용: 대기열에 참여한 요청 URL 목록
let refreshQueue: string[] = [];

// slug: /api/users/me 요청 시 ['users', 'me'] 배열로 들어옴
interface RouteParams {
  params: Promise<{ slug: string[] }>;
}

interface RouteRule {
  pattern: RegExp;
  methods: NextRequest["method"][];
  requiresAuth: boolean;
}

// 백엔드로 프록시할 라우트 화이트리스트
// 여기 없는 경로는 404로 차단 (등록된 경로만 백엔드로 통과)
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
  {
    pattern: /^\/images$/,
    methods: ["POST"],
    requiresAuth: true,
  },
  {
    pattern: /^\/posts\/\d+$/,
    methods: ["GET"],
    requiresAuth: true,
  },
  {
    pattern: /^\/ranking$/,
    methods: ["GET"],
    requiresAuth: true,
  },
  {
    pattern: /^\/posts\/\d+\/like$/,
    methods: ["POST", "DELETE"],
    requiresAuth: true,
  },
];

// GET, POST 등 모든 요청을 하나로 처리하는 통합 핸들러
async function handleProxy(request: NextRequest, { params }: RouteParams) {
  requestCount++;
  // console.log(`[slug] requestCount: ${requestCount}, url: ${request.url}`);

  //  서버 전용 쿠키 저장소에서 액세스 토큰 읽기 (HttpOnly 쿠키라 서버에서만 가능)
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("accessToken")?.value;

  // const { data } = await axiosInstance.get("/meetings/my");
  // 내가 이러한 코드를 호출했다면 slug 안에는 // 예: ['meetings', 'my'] 가 들어가는 것
  const resolvedParams = await params;
  const slug = resolvedParams.slug;

  // [[...slug]] 에서 필요한 코드
  // if (!slug) {
  //   return NextResponse.json({ message: "Invalid Path" }, { status: 400 });
  // }


  //  실제 백엔드로 보낼 최종 주소 조립 (쿼리 스트링 포함)
  // 예: /api/users/me -> https://백엔드주소/users/me
  const targetPath = `/${slug.join("/")}`;
  // server-fetcher에 baseURL이 설정되어 있으므로 path + query만 조합
  const targetUrl = `${targetPath}${request.nextUrl.search}`;

  //  PROXY_ROUTE_RULES 화이트리스트 검사: 등록되지 않은 경로는 404 차단
  const matchedRule = PROXY_ROUTE_RULES.find((rule) =>
    rule.pattern.test(targetPath),
  );

  if (!matchedRule) {
    return NextResponse.json({ message: "Not Found" }, { status: 404 });
  }

  // 허용되지 않은 메서드면 405 반환 (백엔드 요청 없이 차단)
  if (!matchedRule.methods.includes(request.method)) {
    return NextResponse.json(
      { message: "Method Not Allowed" },
      { status: 405 },
    );
  }

  // 요청 본문 body 가 있는경우 데이터 읽기 (POST, PUT 등일 때만)
  let body = null;
  if (["POST", "PUT", "PATCH"].includes(request.method)) {
    try {
      body = await request.json();
    } catch (e) {
      body = null; // 바디가 비어있어도 에러 안 나게 방어
    }
  }

  // 백엔드 요청을 실행하는 함수 (토큰을 인자로 받아 재사용)
  const callBackend = async (token: string | undefined) => {
    const requestConfig: any = {
      method: request.method,
      url: targetUrl,
      headers: {
        "Content-Type": "application/json",
      },
      data: body,
    };

    if (token) {
      requestConfig.headers.Authorization = `Bearer ${token}`;
    }

    return serverAxios(requestConfig);
  };

  // 리프레시 토큰으로 새 액세스 토큰을 발급받는 함수 (queue 패턴)
  // 동시에 여러 요청이 refresh를 호출해도 실제 API 호출은 1번만 실행
  const refreshAccessToken = async () => {
    const requestUrl = request.url;
    refreshQueue.push(requestUrl);

    // 이미 refresh 진행 중이면 같은 Promise를 반환 (중복 호출 방지)
    if (refreshPromise) {
      console.log(`[slug] refresh 대기열 참여 (queue 재사용): ${requestUrl}`);
      console.log(`[slug] 현재 대기열:`, refreshQueue);
      return refreshPromise;
    }

    console.log(`[slug] refresh 최초 호출 (queue 생성): ${requestUrl}`);
    console.log(`[slug] 현재 대기열:`, refreshQueue);
    refreshPromise = (async () => {
      const cookieStore = await cookies();
      const refreshToken = cookieStore.get("refreshToken")?.value;

      if (!refreshToken) return null;

      try {
        const { data } = await serverAxios.post("/auth/refresh", {
          refreshToken,
        });
        console.log(`[slug] refresh 성공, 대기열 처리 완료:`, refreshQueue);
        return data; // { accessToken, refreshToken }
      } catch {
        console.log(`[slug] refresh 실패, 대기열 폐기:`, refreshQueue);
        return null;
      } finally {
        refreshPromise = null;
        refreshQueue = []; // 대기열 초기화
      }
    })();

    return refreshPromise;
  };

  try {
    // 1. 액세스 토큰이 없으면 바로 refresh 시도
    if (matchedRule.requiresAuth && !accessToken) {
      const refreshed = await refreshAccessToken();

      if (!refreshed) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
      }

      const { data, status } = await callBackend(refreshed.accessToken);
      const response = NextResponse.json(data, { status });
      setAuthCookies(response, refreshed);
      return response;
    }

    // 2. 액세스 토큰이 있으면 그대로 요청
    const { data, status } = await callBackend(accessToken);
    return NextResponse.json(data, { status });
  } catch (error: any) {
    // 3. 백엔드가 401을 반환한 경우 (토큰 만료) → refresh 후 재시도
    if (error.response?.status === 401 && matchedRule.requiresAuth) {
      const refreshed = await refreshAccessToken();

      if (!refreshed) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
      }

      try {
        const { data, status } = await callBackend(refreshed.accessToken);
        const response = NextResponse.json(data, { status });
        setAuthCookies(response, refreshed);
        return response;
      } catch (retryError: any) {
        console.error("BFF Proxy Retry Error:", retryError.response?.data || retryError.message);
        return NextResponse.json(
          retryError.response?.data ?? { message: "Internal Server Error" },
          { status: retryError.response?.status ?? 500 },
        );
      }
    }

    console.error("BFF Proxy Error:", error.response?.data || error.message);
    return NextResponse.json(
      error.response?.data ?? { message: "Internal Server Error" },
      { status: error.response?.status ?? 500 },
    );
  }
}

// GET, POST, PUT, PATCH, DELETE 모두 동일한 핸들러로 처리
// 메서드 구분은 PROXY_ROUTE_RULES와 백엔드에서 담당
export const GET = handleProxy;
export const POST = handleProxy;
export const PUT = handleProxy;
export const PATCH = handleProxy;
export const DELETE = handleProxy;

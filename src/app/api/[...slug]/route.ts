import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { serverAxios } from "@/lib/server-fetcher";

interface AxiosErrorLike {
  response?: {
    data?: { code?: string; [key: string]: unknown };
    status?: number;
  };
  message: string;
}

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
    pattern: /^\/meetings\/joined$/,
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
    pattern: /^\/notifications$/,
    methods: ["GET", "DELETE"],
    requiresAuth: true,
  },
  {
    pattern: /^\/notifications\/read-all$/,
    methods: ["PUT"],
    requiresAuth: true,
  },
  {
    pattern: /^\/notifications\/\d+\/read$/,
    methods: ["PUT"],
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
    methods: ["GET", "POST", "PATCH", "DELETE"],
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
  {
    pattern: /^\/posts\/\d+\/comments$/,
    methods: ["GET", "POST"],
    requiresAuth: true,
  },
  {
    pattern: /^\/posts\/\d+\/comments\/\d+$/,
    methods: ["PATCH", "DELETE"],
    requiresAuth: true,
  },
  {
    pattern: /^\/meetings\/\d+$/,
    methods: ["GET", "PATCH", "DELETE"],
    requiresAuth: true,
  },
  {
    pattern: /^\/meetings\/\d+\/participants$/,
    methods: ["GET"],
    requiresAuth: true,
  },
  {
    pattern: /^\/meetings\/\d+\/join$/,
    methods: ["POST", "DELETE"],
    requiresAuth: true,
  },
  {
    pattern: /^\/og$/,
    methods: ["GET"],
    requiresAuth: false,
  },
];

// GET, POST 등 모든 요청을 하나로 처리하는 통합 핸들러
// 토큰 세팅 + refresh + 재시도는 server-fetcher interceptor가 자동 처리
async function handleProxy(request: NextRequest, { params }: RouteParams) {
  const resolvedParams = await params;
  const slug = resolvedParams.slug;

  //  실제 백엔드로 보낼 최종 주소 조립 (쿼리 스트링 포함)
  // 예: /api/users/me -> https://백엔드주소/users/me
  const targetPath = `/${slug.join("/")}`;
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
      body = null;
    }
  }

  try {
    const axiosOptions: any = {
      method: request.method,
      url: targetUrl,
      headers: { "Content-Type": "application/json" },
      data: body,
    };

    // 타겟이 /og 라면 baseURL을 강제로 최상단 루트로 덮어씌움
    if (targetPath === "/og") {
      axiosOptions.baseURL = "https://together-dallaem-api.vercel.app";
    }

    // server-fetcher interceptor가 토큰 세팅 + 401 시 refresh 자동 처리
    const { data, status } = await serverAxios(axiosOptions);
    console.log(" slug 페이지 트라이문 ");

    const response = NextResponse.json(data, { status });

    return response;
  } catch (err) {
    const error = err as AxiosErrorLike;
    // REFRESH_FAILED: 리프레시 토큰 만료 → 클라이언트에서 로그인 페이지로 처리
    console.log("slug catch ");
    if (error.response?.data?.code === "REFRESH_FAILED") {
      return NextResponse.json(
        { message: "Unauthorized", code: "REFRESH_FAILED" },
        { status: 401 },
      );
    }

    // 백엔드에서  떨어지는 다른 에러
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

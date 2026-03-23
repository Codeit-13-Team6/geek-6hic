import axios from "axios";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// 실제 백엔드 서버 주소
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

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
];

// GET, POST 등 모든 요청을 하나로 처리하는 통합 핸들러
async function handleProxy(request: NextRequest, { params }: RouteParams) {
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
  const targetUrl = `${API_BASE_URL}${targetPath}${request.nextUrl.search}`;

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

  // 인증이 필요한 라우트인데 액세스 토큰이 없으면 401 반환
  if (matchedRule.requiresAuth && !accessToken) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  // 요청 본문(Body) 데이터 읽기 (POST, PUT 등일 때만)
  let body = null;
  if (["POST", "PUT", "PATCH"].includes(request.method)) {
    try {
      body = await request.json();
    } catch (e) {
      body = null; // 바디가 비어있어도 에러 안 나게 방어
    }
  }

  // 백엔드에 보낼 요청 설정 조립
  // 클라이언트 요청의 method, url, body를 그대로 백엔드로 전달
  const requestConfig: any = {
    method: request.method,
    url: targetUrl,
    headers: {
      "Content-Type": "application/json",
    },
    data: body,
  };

  // 토큰 바인딩
  if (accessToken) {
    requestConfig.headers.Authorization = `Bearer ${accessToken}`;
  }

  try {
    //  BFF 서버가 백엔드에 대신 요청을 보냄 (Proxying)
    const { data, status } = await axios(requestConfig);

    //  백엔드에서 받은 데이터와 상태 코드를 브라우저에 그대로 전달
    return NextResponse.json(data, { status });
  } catch (error: any) {
    // 백엔드 통신 실패 시 로그를 남기고 에러 정보를 클라이언트에 토스
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

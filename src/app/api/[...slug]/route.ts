import axios from "axios";
import { axiosCodeitInstance } from "@/lib/axios";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// 실제 백엔드 서버 주소
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

interface RouteParams {
  params: Promise<{ slug: string[] }>;
}

// GET, POST 등 모든 요청을 하나로 처리하는 통합 핸들러
async function handleProxy(request: NextRequest, { params }: RouteParams) {
  // 1. 서버 전용 쿠키 저장소에서 액세스 토큰 읽기 (HttpOnly 쿠키라 서버에서만 가능)
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("accessToken")?.value;

  // 2. Next.js 15 규칙에 따라 비동기 파라미터(slug) 풀기
  const resolvedParams = await params;
  const slug = resolvedParams.slug; // 예: ['users', 'me']

  if (!slug) {
    return NextResponse.json({ message: "Invalid Path" }, { status: 400 });
  }

  // 3. 실제 백엔드로 보낼 최종 주소 조립 (쿼리 스트링 포함)
  // 예: /api/users/me -> https://백엔드주소/users/me
  const targetPath = `/${slug.join("/")}`;
  const targetUrl = `${API_BASE_URL}${targetPath}${request.nextUrl.search}`;

  // 4. 요청 본문(Body) 데이터 읽기 (POST, PUT 등일 때만)
  let body = null;
  if (["POST", "PUT", "PATCH"].includes(request.method)) {
    try {
      body = await request.json();
    } catch (e) {
      body = null; // 바디가 비어있어도 에러 안 나게 방어
    }
  }

  // 5. 백엔드에 보낼 '진짜' 요청 설정
  const requestConfig: any = {
    method: request.method,
    url: targetUrl,
    headers: {
      "Content-Type": "application/json",
    },
    data: body,
  };

  // 6. 핵심: 쿠키에서 꺼낸 토큰을 백엔드가 이해하는 'Authorization 헤더'로 변환 주입!
  if (accessToken) {
    requestConfig.headers.Authorization = `Bearer ${accessToken}`;
  }

  try {
    // 7. BFF 서버가 백엔드에 대신 요청을 보냄 (Proxying)
    const { data, status } = await axiosCodeitInstance(requestConfig);

    // 8. 백엔드에서 받은 데이터와 상태 코드를 브라우저에 그대로 전달 -> accesstoken
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

// 모든 HTTP 메서드에 대해 이 핸들러가 작동하도록 내보내기
export const GET = handleProxy;
export const POST = handleProxy;
export const PUT = handleProxy;
export const PATCH = handleProxy;
export const DELETE = handleProxy;

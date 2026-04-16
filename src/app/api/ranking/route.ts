import { NextResponse } from "next/server";
import { getRankingBFF } from "@/bff/ranking";
import { applyAuthCookiesFromContext } from "@/lib/auth/deferredCommit";
import type { DeferredAuthCommitContext } from "@/lib/auth/serverFetcher";

interface AxiosErrorLike {
  response?: { data?: unknown; status?: number };
  message: string;
}

export async function GET() {
  const authContext: DeferredAuthCommitContext = {};
  try {
    const result = await getRankingBFF(authContext);
    const response = NextResponse.json(result);
    return applyAuthCookiesFromContext(response, authContext);
  } catch (err) {
    const error = err as AxiosErrorLike;
    console.error("Ranking BFF Error:", error.response?.data || error.message);
    const response = NextResponse.json(
      error.response?.data ?? { message: "랭킹 데이터를 불러오지 못했습니다." },
      { status: error.response?.status ?? 500 },
    );
    return applyAuthCookiesFromContext(response, authContext);
  }
}

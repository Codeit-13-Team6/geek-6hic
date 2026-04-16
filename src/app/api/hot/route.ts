import { NextResponse } from "next/server";
import { getHotPostsBFF } from "@/bff/hot";
import { applyAuthCookiesFromContext } from "@/lib/auth/deferredCommit";
import type { DeferredAuthCommitContext } from "@/lib/auth/fetcher.server";

export const revalidate = 600;

export async function GET() {
  const authContext: DeferredAuthCommitContext = {};
  try {
    const result = await getHotPostsBFF(authContext);
    const response = NextResponse.json(result ?? []);
    return applyAuthCookiesFromContext(response, authContext);
  } catch (error: any) {
    console.error("Hot Posts BFF Error:", error.response?.data || error.message);
    const response = NextResponse.json(
      { error: "핫 게시물을 불러오지 못했습니다.", detail: error.message },
      { status: 500 },
    );
    return applyAuthCookiesFromContext(response, authContext);
  }
}

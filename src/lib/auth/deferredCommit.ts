import type { NextResponse } from "next/server";
import { setAuthCookies } from "@/lib/auth/cookies";
import type { DeferredAuthCommitContext } from "@/lib/auth/fetcher.server";

export function applyAuthCookiesFromContext(
  response: NextResponse,
  context?: DeferredAuthCommitContext,
) {
  const refreshedTokens = context?.refreshedTokens;
  if (!refreshedTokens) {
    return response;
  }

  const { accessToken, refreshToken } = refreshedTokens;
  setAuthCookies(response, {
    accessToken,
    ...(refreshToken ? { refreshToken } : {}),
  });

  return response;
}

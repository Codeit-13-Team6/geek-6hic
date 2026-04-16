import axios from "axios";
import { NextRequest, NextResponse } from "next/server";
import { clearAuthCookies, setAuthCookies } from "@/lib/auth/cookies";
import {
  AUTH_SYNC_REQUIRED_CODE,
  isAuthSyncRequiredError,
  serverAxios,
} from "@/lib/auth/serverFetcher";

const DEFAULT_NEXT_PATH = "/";
const SYNC_PATH = "/api/auth/sync";

function toSafeNextPath(request: NextRequest, raw: string | null) {
  if (!raw) {
    return DEFAULT_NEXT_PATH;
  }

  try {
    const url = new URL(raw, request.nextUrl.origin);
    if (url.origin !== request.nextUrl.origin) {
      return DEFAULT_NEXT_PATH;
    }

    const nextPath = `${url.pathname}${url.search}${url.hash}`;
    if (!nextPath.startsWith("/") || nextPath.startsWith(SYNC_PATH)) {
      return DEFAULT_NEXT_PATH;
    }

    return nextPath;
  } catch {
    return DEFAULT_NEXT_PATH;
  }
}

function resolveNextPath(request: NextRequest) {
  const explicitNext = request.nextUrl.searchParams.get("next");
  if (explicitNext) {
    return toSafeNextPath(request, explicitNext);
  }

  const referer = request.headers.get("referer");
  return toSafeNextPath(request, referer);
}

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const nextPath = resolveNextPath(request);

  try {
    const authResponse = await serverAxios.get("/users/me");
    const response = NextResponse.redirect(new URL(nextPath, request.url));

    if (authResponse._refreshedTokens) {
      const { accessToken, refreshToken } = authResponse._refreshedTokens;
      setAuthCookies(response, {
        accessToken,
        ...(refreshToken ? { refreshToken } : {}),
      });
    }

    return response;
  } catch (error) {
    if (isAuthSyncRequiredError(error)) {
      const response = NextResponse.redirect(new URL("/login", request.url));
      clearAuthCookies(response);
      return response;
    }
    if (
      axios.isAxiosError(error) &&
      (error.response?.status === 401 ||
        (error.response?.data as { code?: string } | undefined)?.code ===
          AUTH_SYNC_REQUIRED_CODE)
    ) {
      const response = NextResponse.redirect(new URL("/login", request.url));
      clearAuthCookies(response);
      return response;
    }
    throw error;
  }
}

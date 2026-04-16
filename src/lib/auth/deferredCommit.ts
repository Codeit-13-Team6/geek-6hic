import { NextResponse } from "next/server";
import {
  AUTH_SYNC_REQUIRED_CODE,
  type DeferredAuthCommitContext,
} from "@/lib/auth/serverFetcher";

export function applyAuthCookiesFromContext(
  response: NextResponse,
  context?: DeferredAuthCommitContext,
) {
  if (!context?.authSyncRequired) {
    return response;
  }
  return NextResponse.json(
    { message: "Unauthorized", code: AUTH_SYNC_REQUIRED_CODE },
    { status: 401 },
  );
}

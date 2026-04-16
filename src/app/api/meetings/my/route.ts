import { NextResponse } from "next/server";
import { getMyMeetingsBFF } from "@/bff/meetings";
import type { MyMeetingsPageResponse } from "@/types";
import { applyAuthCookiesFromContext } from "@/lib/auth/deferredCommit";
import type { DeferredAuthCommitContext } from "@/lib/auth/serverFetcher";

export async function GET(request: Request) {
  const authContext: DeferredAuthCommitContext = {};
  const { searchParams } = new URL(request.url);

  try {
    const result = await getMyMeetingsBFF({
      offset: Number(searchParams.get("offset")) || undefined,
      limit: Number(searchParams.get("limit")) || undefined,
    }, authContext);
    const response = NextResponse.json<MyMeetingsPageResponse>(result);
    return applyAuthCookiesFromContext(response, authContext);
  } catch (error) {
    console.error("[My Meetings BFF Error]", error);
    const response = NextResponse.json(
      { message: "Failed to fetch my meetings" },
      { status: 500 },
    );
    return applyAuthCookiesFromContext(response, authContext);
  }
}

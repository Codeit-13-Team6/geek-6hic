import { NextResponse } from "next/server";
import { getMyPostsBFF } from "@/bff/users";
import type { VisiblePostsPageResponse } from "@/types";
import { applyAuthCookiesFromContext } from "@/lib/auth/deferredCommit";
import type { DeferredAuthCommitContext } from "@/lib/auth/fetcher.server";

export async function GET(request: Request) {
  const authContext: DeferredAuthCommitContext = {};
  const { searchParams } = new URL(request.url);

  try {
    const data = await getMyPostsBFF({
      offset: Number(searchParams.get("offset")) || undefined,
      limit: Number(searchParams.get("limit")) || undefined,
    }, authContext);

    const response = NextResponse.json<VisiblePostsPageResponse>(data);
    return applyAuthCookiesFromContext(response, authContext);
  } catch (error) {
    console.error("[Visible My Posts BFF Error]", error);
    const response = NextResponse.json(
      { message: "Failed to fetch visible my posts" },
      { status: 500 },
    );
    return applyAuthCookiesFromContext(response, authContext);
  }
}

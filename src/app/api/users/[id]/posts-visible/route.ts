import { NextResponse } from "next/server";
import { getUserPostsBFF } from "@/bff/users";
import type { VisiblePostsPageResponse } from "@/types";
import { applyAuthCookiesFromContext } from "@/lib/auth/deferredCommit";
import type { DeferredAuthCommitContext } from "@/lib/auth/fetcher.server";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function GET(request: Request, { params }: RouteParams) {
  const authContext: DeferredAuthCommitContext = {};
  const { id } = await params;
  const userId = Number(id);

  if (!Number.isFinite(userId)) {
    return NextResponse.json({ message: "Invalid user id" }, { status: 400 });
  }

  const { searchParams } = new URL(request.url);

  try {
    const data = await getUserPostsBFF({
      userId,
      offset: Number(searchParams.get("offset")) || undefined,
      limit: Number(searchParams.get("limit")) || undefined,
    }, authContext);

    const response = NextResponse.json<VisiblePostsPageResponse>(data);
    return applyAuthCookiesFromContext(response, authContext);
  } catch (error) {
    console.error("[Visible User Posts BFF Error]", error);
    const response = NextResponse.json(
      { message: "Failed to fetch visible user posts" },
      { status: 500 },
    );
    return applyAuthCookiesFromContext(response, authContext);
  }
}

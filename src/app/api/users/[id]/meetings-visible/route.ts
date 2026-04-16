import { NextResponse } from "next/server";
import { getUserMeetingsBFF } from "@/bff/users";
import type { MyMeetingsPageResponse } from "@/types";
import { applyAuthCookiesFromContext } from "@/lib/auth/deferredCommit";
import type { DeferredAuthCommitContext } from "@/lib/auth/serverFetcher";

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
    const data = await getUserMeetingsBFF({
      userId,
      offset: Number(searchParams.get("offset")) || undefined,
      limit: Number(searchParams.get("limit")) || undefined,
    }, authContext);

    const response = NextResponse.json<MyMeetingsPageResponse>(data);
    return applyAuthCookiesFromContext(response, authContext);
  } catch (error) {
    console.error("[Visible User Meetings BFF Error]", error);
    const response = NextResponse.json(
      { message: "Failed to fetch visible user meetings" },
      { status: 500 },
    );
    return applyAuthCookiesFromContext(response, authContext);
  }
}

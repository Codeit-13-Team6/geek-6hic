import { NextResponse } from "next/server";
import { getRecommendedMeetingsBFF } from "@/bff/recommend";
import { applyAuthCookiesFromContext } from "@/lib/auth/deferredCommit";
import type { DeferredAuthCommitContext } from "@/lib/auth/serverFetcher";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const authContext: DeferredAuthCommitContext = {};
  const { id } = await params;
  const meetingId = Number(id);
  const { searchParams } = new URL(request.url);
  const meetingType = searchParams.get("type");

  if (!Number.isFinite(meetingId)) {
    return NextResponse.json(
      { message: "Invalid meeting id" },
      { status: 400 },
    );
  }
  if (!meetingType) {
    return NextResponse.json(
      { message: "Missing meeting type" },
      { status: 400 },
    );
  }

  try {
    const data = await getRecommendedMeetingsBFF(
      { meetingId, meetingType },
      authContext,
    );
    const response = NextResponse.json({ data });
    return applyAuthCookiesFromContext(response, authContext);
  } catch {
    const response = NextResponse.json(
      { message: "Failed to load meeting recommendations" },
      { status: 500 },
    );
    return applyAuthCookiesFromContext(response, authContext);
  }
}

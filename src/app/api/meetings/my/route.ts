import { NextResponse } from "next/server";
import { getMyMeetingsBFF } from "@/internal/meetings";
import type { MyMeetingsPageResponse } from "@/types";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const offset = Number(searchParams.get("offset") ?? "0");
  const limit = Number(searchParams.get("limit") ?? "10");

  const safeOffset = Number.isFinite(offset) && offset >= 0 ? offset : 0;
  const safeLimit = Number.isFinite(limit) && limit > 0 ? limit : 10;

  try {
    const result = await getMyMeetingsBFF({ offset: safeOffset, limit: safeLimit });
    return NextResponse.json<MyMeetingsPageResponse>(result);
  } catch (error) {
    console.error("[My Meetings BFF Error]", error);
    return NextResponse.json(
      { message: "Failed to fetch my meetings" },
      { status: 500 },
    );
  }
}

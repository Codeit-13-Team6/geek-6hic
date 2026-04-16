import { NextResponse } from "next/server";
import { getMyMeetingsBFF } from "@/app/api/_services/meetings";
import type { MyMeetingsPageResponse } from "@/shared/types";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  try {
    const result = await getMyMeetingsBFF({
      offset: Number(searchParams.get("offset")) || undefined,
      limit: Number(searchParams.get("limit")) || undefined,
    });
    return NextResponse.json<MyMeetingsPageResponse>(result);
  } catch (error) {
    console.error("[My Meetings BFF Error]", error);
    return NextResponse.json(
      { message: "Failed to fetch my meetings" },
      { status: 500 },
    );
  }
}

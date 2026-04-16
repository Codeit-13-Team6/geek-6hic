import { NextResponse } from "next/server";
import { getRecommendedMeetingsBFF } from "@/app/api/_services/recommend";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
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
    const data = await getRecommendedMeetingsBFF({ meetingId, meetingType });
    return NextResponse.json({ data });
  } catch {
    return NextResponse.json(
      { message: "Failed to load meeting recommendations" },
      { status: 500 },
    );
  }
}

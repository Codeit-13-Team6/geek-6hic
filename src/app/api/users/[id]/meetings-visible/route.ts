import { NextResponse } from "next/server";
import { getUserMeetingsBFF } from "@/internal/users";
import type { MyMeetingsPageResponse } from "@/types";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function GET(request: Request, { params }: RouteParams) {
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
    });

    return NextResponse.json<MyMeetingsPageResponse>(data);
  } catch (error) {
    console.error("[Visible User Meetings BFF Error]", error);
    return NextResponse.json(
      { message: "Failed to fetch visible user meetings" },
      { status: 500 },
    );
  }
}

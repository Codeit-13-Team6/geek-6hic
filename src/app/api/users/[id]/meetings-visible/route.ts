import { NextResponse } from "next/server";
import { serverAxios } from "@/lib/serverFetcher";
import { getVisibleCursorPage } from "@/lib/visibleCursorPage";
import { sortByCreatedAtDesc } from "@/lib/sortByCreatedAt";
import type {
  GetMeetingsResponse,
  MeetingResponse,
  MyMeetingsPageResponse,
} from "@/types";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function GET(request: Request, { params }: RouteParams) {
  const { id } = await params;
  const userId = Number(id);
  const { searchParams } = new URL(request.url);
  const offset = Number(searchParams.get("offset") ?? "0");
  const limit = Number(searchParams.get("limit") ?? "10");

  const safeOffset = Number.isFinite(offset) && offset >= 0 ? offset : 0;
  const safeLimit = Number.isFinite(limit) && limit > 0 ? limit : 10;

  if (!Number.isFinite(userId)) {
    return NextResponse.json({ message: "Invalid user id" }, { status: 400 });
  }

  try {
    const data = await getVisibleCursorPage<MeetingResponse>({
      offset: safeOffset,
      limit: safeLimit,
      fetchPage: async ({ cursor, size }) => {
        const response = await serverAxios.get<GetMeetingsResponse>(
          "/meetings",
          {
            params: {
              sortBy: "dateTime",
              sortOrder: "desc",
              size,
              ...(cursor ? { cursor } : {}),
            },
          },
        );

        return {
          ...response.data,
          data: sortByCreatedAtDesc(response.data.data),
        };
      },
      filter: (meeting) =>
        meeting.hostId === userId ||
        meeting.host?.id === userId ||
        meeting.createdBy === userId,
    });

    const sortedData = {
      ...data,
      data: sortByCreatedAtDesc(data.data),
    };

    return NextResponse.json<MyMeetingsPageResponse>(sortedData);
  } catch (error) {
    console.error("[Visible User Meetings BFF Error]", error);
    return NextResponse.json(
      { message: "Failed to fetch visible user meetings" },
      { status: 500 },
    );
  }
}

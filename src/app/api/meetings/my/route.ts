import { NextResponse } from "next/server";
import { serverAxios } from "@/lib/serverFetcher";
import { getVisibleCursorPage } from "@/lib/visibleCursorPage";
import { sortByCreatedAtDesc } from "@/lib/sortByCreatedAt";
import type { GetMeetingsResponse, MeetingResponse, MyMeetingsPageResponse } from "@/types";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const offset = Number(searchParams.get("offset") ?? "0");
  const limit = Number(searchParams.get("limit") ?? "10");

  const safeOffset = Number.isFinite(offset) && offset >= 0 ? offset : 0;
  const safeLimit = Number.isFinite(limit) && limit > 0 ? limit : 10;

  try {
    const data = await getVisibleCursorPage<MeetingResponse>({
      offset: safeOffset,
      limit: safeLimit,
      fetchPage: async ({ cursor, size }) => {
        const response = await serverAxios.get<GetMeetingsResponse>("/meetings/my", {
          params: {
            size,
            ...(cursor ? { cursor } : {}),
          },
        });

        return {
          ...response.data,
          data: sortByCreatedAtDesc(response.data.data),
        };
      },
      filter: () => true,
    });

    const sortedData = {
      ...data,
      data: sortByCreatedAtDesc(data.data),
    };

    return NextResponse.json<MyMeetingsPageResponse>(sortedData);
  } catch (error) {
    console.error("[My Meetings BFF Error]", error);
    return NextResponse.json(
      { message: "Failed to fetch my meetings" },
      { status: 500 },
    );
  }
}

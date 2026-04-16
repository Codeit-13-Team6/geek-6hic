import { serverFetch } from "@/lib/auth/fetcher.server";
import { getVisibleCursorPage } from "@/lib/visibleCursorPage";
import { sortByCreatedAtDesc } from "@/lib/sortByCreatedAt";
import { fetchAllCursor } from "@/lib/fetchAllCursor";
import { safeOffset, safeLimit } from "@/lib/safePagination";
import type {
  GetMeetingsResponse,
  JoinedMeeting,
  JoinedMeetingsResponse,
  MeetingResponse,
  MyMeetingsPageResponse,
} from "@/types";

export async function getMyMeetingsBFF({
  offset: rawOffset,
  limit: rawLimit,
}: {
  offset?: number;
  limit?: number;
} = {}): Promise<MyMeetingsPageResponse> {
  const offset = safeOffset(rawOffset);
  const limit = safeLimit(rawLimit);
  const data = await getVisibleCursorPage<MeetingResponse>({
    offset,
    limit,
    fetchPage: async ({ cursor, size }) => {
      const response = await serverFetch<GetMeetingsResponse>({
        method: "GET",
        url: "/meetings/my",
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

  return {
    ...data,
    data: sortByCreatedAtDesc(data.data),
  };
}

export async function getJoinedMeetingIdsBFF(): Promise<number[]> {
  const meetings = await fetchAllCursor<JoinedMeeting>({
    fetchPage: (cursor) =>
      serverFetch<JoinedMeetingsResponse>({
        method: "GET",
        url: "/meetings/joined",
        params: {
          size: 50,
          sortBy: "joinedAt",
          ...(cursor ? { cursor } : {}),
        },
      }).then((r) => r.data),
  });

  return meetings.map((m) => m.id);
}

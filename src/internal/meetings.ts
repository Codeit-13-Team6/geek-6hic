import { serverFetch } from "@/lib/serverFetcher";
import { getVisibleCursorPage } from "@/lib/visibleCursorPage";
import { sortByCreatedAtDesc } from "@/lib/sortByCreatedAt";
import type {
  GetMeetingsResponse,
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
  const offset = Number.isFinite(rawOffset) && (rawOffset ?? 0) >= 0 ? (rawOffset ?? 0) : 0;
  const limit = Number.isFinite(rawLimit) && (rawLimit ?? 0) > 0 ? (rawLimit ?? 10) : 10;
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

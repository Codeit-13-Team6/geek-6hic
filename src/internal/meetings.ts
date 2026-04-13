import { serverFetch } from "@/lib/serverFetcher";
import { getVisibleCursorPage } from "@/lib/visibleCursorPage";
import { sortByCreatedAtDesc } from "@/lib/sortByCreatedAt";
import type {
  GetMeetingsResponse,
  MeetingResponse,
  MyMeetingsPageResponse,
} from "@/types";

export async function getMyMeetingsBFF({
  offset,
  limit,
}: {
  offset: number;
  limit: number;
}): Promise<MyMeetingsPageResponse> {
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

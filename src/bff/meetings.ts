import {
  collectDeferredAuthTokens,
  serverFetch,
  type DeferredAuthCommitContext,
} from "@/lib/auth/fetcher.server";
import { getVisibleCursorPage } from "@/lib";
import { sortByCreatedAtDesc } from "@/lib";
import { fetchAllCursor } from "@/lib";
import { safeOffset, safeLimit } from "@/lib";
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
} = {},
authContext?: DeferredAuthCommitContext,
): Promise<MyMeetingsPageResponse> {
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
      collectDeferredAuthTokens(authContext, response);

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

export async function getJoinedMeetingIdsBFF(
  authContext?: DeferredAuthCommitContext,
): Promise<number[]> {
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
      }).then((r) => {
        collectDeferredAuthTokens(authContext, r);
        return r.data;
      }),
  });

  return meetings.map((m) => m.id);
}

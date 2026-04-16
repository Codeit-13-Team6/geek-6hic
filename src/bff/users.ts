import {
  collectDeferredAuthTokens,
  serverFetch,
  type DeferredAuthCommitContext,
} from "@/lib/auth/fetcher.server";
import { getVisibleCursorPage } from "@/lib";
import { getVisiblePostsPage, getVisibleMyPostsPage } from "@/lib";
import { sortByCreatedAtDesc } from "@/lib";
import { safeOffset, safeLimit } from "@/lib";
import type {
  GetMeetingsResponse,
  GetPostsResponse,
  MeetingResponse,
  MyMeetingsPageResponse,
  VisiblePostsPageResponse,
} from "@/types";

export async function getUserMeetingsBFF({
  userId,
  offset: rawOffset,
  limit: rawLimit,
}: {
  userId: number;
  offset?: number;
  limit?: number;
},
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
        url: "/meetings",
        params: {
          sortBy: "dateTime",
          sortOrder: "desc",
          size,
          ...(cursor ? { cursor } : {}),
        },
      }, {
        deferredCommitMode: authContext ? "bubble" : "redirect",
      });
      collectDeferredAuthTokens(authContext, response);

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

  return {
    ...data,
    data: sortByCreatedAtDesc(data.data),
  };
}

export async function getUserPostsBFF({
  userId,
  offset: rawOffset,
  limit: rawLimit,
}: {
  userId: number;
  offset?: number;
  limit?: number;
},
authContext?: DeferredAuthCommitContext,
): Promise<VisiblePostsPageResponse> {
  const offset = safeOffset(rawOffset);
  const limit = safeLimit(rawLimit);

  return getVisiblePostsPage(
    { offset, limit },
    async ({ offset: pageOffset, limit: pageLimit }) => {
      const response = await serverFetch<GetPostsResponse>({
        method: "GET",
        url: "/posts",
        params: {
          keyword: "",
          sortBy: "createdAt",
          sortOrder: "desc",
          offset: pageOffset,
          limit: pageLimit,
        },
      }, {
        deferredCommitMode: authContext ? "bubble" : "redirect",
      });
      collectDeferredAuthTokens(authContext, response);

      return response.data;
    },
    { filter: (post) => post.author.id === userId },
  );
}

export async function getMyPostsBFF({
  offset: rawOffset,
  limit: rawLimit,
}: {
  offset?: number;
  limit?: number;
} = {},
authContext?: DeferredAuthCommitContext,
): Promise<VisiblePostsPageResponse> {
  const offset = safeOffset(rawOffset);
  const limit = safeLimit(rawLimit, 20);

  return getVisibleMyPostsPage(
    { offset, limit },
    async ({ offset: pageOffset, limit: pageLimit }) => {
      const response = await serverFetch<GetPostsResponse>({
        method: "GET",
        url: "/users/me/posts",
        params: {
          sortBy: "createdAt",
          sortOrder: "desc",
          offset: pageOffset,
          limit: pageLimit,
        },
      }, {
        deferredCommitMode: authContext ? "bubble" : "redirect",
      });
      collectDeferredAuthTokens(authContext, response);

      return response.data;
    },
  );
}

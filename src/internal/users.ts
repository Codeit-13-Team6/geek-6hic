import { serverFetch } from "@/lib/serverFetcher";
import { getVisibleCursorPage } from "@/lib/visibleCursorPage";
import { getVisiblePostsPage, getVisibleMyPostsPage } from "@/lib/myVisiblePosts";
import { sortByCreatedAtDesc } from "@/lib/sortByCreatedAt";
import type {
  GetMeetingsResponse,
  GetPostsResponse,
  MeetingResponse,
  MyMeetingsPageResponse,
  VisiblePostsPageResponse,
} from "@/types";

function safeOffset(raw?: number) {
  return Number.isFinite(raw) && (raw ?? 0) >= 0 ? (raw ?? 0) : 0;
}

function safeLimit(raw?: number, defaultVal = 10) {
  return Number.isFinite(raw) && (raw ?? 0) > 0 ? (raw ?? defaultVal) : defaultVal;
}

export async function getUserMeetingsBFF({
  userId,
  offset: rawOffset,
  limit: rawLimit,
}: {
  userId: number;
  offset?: number;
  limit?: number;
}): Promise<MyMeetingsPageResponse> {
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
      });

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
}): Promise<VisiblePostsPageResponse> {
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
      });

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
} = {}): Promise<VisiblePostsPageResponse> {
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
      });

      return response.data;
    },
  );
}

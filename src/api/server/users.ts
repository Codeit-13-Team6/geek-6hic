import {
  redirectToAuthSyncIfNeeded,
  serverFetch,
} from "@/lib/auth/serverFetcher";
import type {
  GetMeetingsResponse,
  GetPostsResponse,
  MeetingResponse,
  MyMeetingsPageResponse,
  User,
  VisiblePostsPageResponse,
} from "@/types";
import { getVisibleCursorPage } from "@/lib";
import { getVisiblePostsPage } from "@/lib";

export async function getPublicUserProfile({ userId }: { userId: number }) {
  try {
    const response = await serverFetch<User>({
      method: "GET",
      url: `/users/${userId}`,
    });
    return response.data;
  } catch (error) {
    redirectToAuthSyncIfNeeded(error);
    throw error;
  }
}

export async function getUserMeetingsPageServer({
  userId,
  offset = 0,
  limit = 10,
}: {
  userId: number;
  offset?: number;
  limit?: number;
}): Promise<MyMeetingsPageResponse> {
  try {
    return getVisibleCursorPage<MeetingResponse>({
      offset,
      limit,
      fetchPage: async ({ cursor, size }) => {
        const { data } = await serverFetch<GetMeetingsResponse>({
          method: "GET",
          url: "/meetings",
          params: {
            sortBy: "dateTime",
            sortOrder: "desc",
            size,
            ...(cursor ? { cursor } : {}),
          },
        });

        return data;
      },
      filter: (meeting) =>
        meeting.hostId === userId ||
        meeting.host?.id === userId ||
        meeting.createdBy === userId,
    });
  } catch (error) {
    redirectToAuthSyncIfNeeded(error);
    throw error;
  }
}

export async function getUserPostsPageServer({
  userId,
  offset = 0,
  limit = 10,
}: {
  userId: number;
  offset?: number;
  limit?: number;
}): Promise<VisiblePostsPageResponse> {
  try {
    return getVisiblePostsPage(
      { offset, limit },
      async ({ offset: pageOffset, limit: pageLimit }) => {
        const { data } = await serverFetch<GetPostsResponse>({
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

        return data;
      },
      {
        filter: (post) => post.author.id === userId,
      },
    );
  } catch (error) {
    redirectToAuthSyncIfNeeded(error);
    throw error;
  }
}

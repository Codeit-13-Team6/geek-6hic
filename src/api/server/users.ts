import { serverAxios } from "@/lib/serverFetcher";
import type {
  GetMeetingsResponse,
  GetPostsResponse,
  MeetingResponse,
  MyMeetingsPageResponse,
  User,
  VisiblePostsPageResponse,
} from "@/types";
import { getVisibleCursorPage } from "@/lib/visibleCursorPage";
import { getVisiblePostsPage } from "@/lib/myVisiblePosts";

export async function getPublicUserProfile({ userId }: { userId: number }) {
  const response = await serverAxios.get<User>(`/users/${userId}`);
  return response.data;
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
  return getVisibleCursorPage<MeetingResponse>({
    offset,
    limit,
    fetchPage: async ({ cursor, size }) => {
      const { data } = await serverAxios.get<GetMeetingsResponse>("/meetings", {
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
  return getVisiblePostsPage(
    { offset, limit },
    async ({ offset: pageOffset, limit: pageLimit }) => {
      const { data } = await serverAxios.get<GetPostsResponse>("/posts", {
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
}
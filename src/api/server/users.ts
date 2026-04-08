import { serverAxios, serverFetch } from "@/lib/serverFetcher";
import { filterThreadPosts } from "@/lib/postUtils";
import type {
  GetPostsResponse,
  MeetingResponse,
  MeetingListResponse,
  GetMeetingsResponse,
  MyMeetingsResponse,
  Post,
  User,
} from "@/types";

export async function getPublicUserProfile({ userId }: { userId: number }) {
  const response = await serverAxios.get<User>(`/users/${userId}`);
  return response.data;
}

export async function getUserMeetings({
  userId,
  cursor,
  size = 10,
}: {
  userId: number;
  cursor?: string;
  size?: number;
}): Promise<MyMeetingsResponse> {
  const collected: MyMeetingsResponse["data"] = [];
  let nextCursor = cursor;
  let hasMore = true;

  while (hasMore && collected.length < size) {
    const { data } = await serverFetch<GetMeetingsResponse>({
      method: "GET",
      url: "/meetings",
      params: {
        sortBy: "dateTime",
        sortOrder: "desc",
        size: 50,
        ...(nextCursor ? { cursor: nextCursor } : {}),
      },
    });

    collected.push(
      ...data.data.filter(
        (meeting: MeetingResponse) =>
          meeting.hostId === userId ||
          meeting.host?.id === userId ||
          meeting.createdBy === userId,
      ),
    );
    if (data.hasMore && !data.nextCursor) {
      hasMore = false;
      nextCursor = undefined;
      break;
    }

    hasMore = data.hasMore;
    nextCursor = data.nextCursor ?? undefined;
  }

  return {
    data: collected,
    hasMore,
    nextCursor: nextCursor ?? null,
  };
}

export async function getUserLoungePosts({
  userId,
  cursor,
  size = 20,
}: {
  userId: number;
  cursor?: string;
  size?: number;
}): Promise<GetPostsResponse> {
  const collected: GetPostsResponse["data"] = [];
  let nextCursor = cursor;
  let hasMore = true;

  while (hasMore && collected.length < size) {
    const { data } = await serverFetch<GetPostsResponse>({
      method: "GET",
      url: "/posts",
      params: {
        keyword: "",
        sortBy: "createdAt",
        sortOrder: "desc",
        size: 50,
        ...(nextCursor ? { cursor: nextCursor } : {}),
      },
    });

    const filteredPage = filterThreadPosts(data);

    collected.push(
      ...filteredPage.data.filter((post: Post) => post.author.id === userId),
    );
    if (filteredPage.hasMore && !filteredPage.nextCursor) {
      hasMore = false;
      nextCursor = undefined;
      break;
    }

    hasMore = filteredPage.hasMore;
    nextCursor = filteredPage.nextCursor ?? undefined;
  }

  return {
    data: collected,
    hasMore,
    nextCursor: nextCursor ?? null,
  };
}

import type {
  FavoritesPageResponse,
  GetPostsResponse,
  MyMeetingsPageResponse,
} from "@/types";
import { serverFetch } from "@/lib/serverFetcher";
import { filterThreadPosts } from "@/lib/postUtils";

export async function getFavorites(
  params: {
    offset?: number;
    limit?: number;
    cursor?: string;
    size?: number;
  } = {},
): Promise<FavoritesPageResponse> {
  const { data } = await serverFetch({
    method: "GET",
    url: "/favorites",
    params: { ...params, sortBy: "createdAt", sortOrder: "desc" },
  });
  return data;
}

export async function getMyMeetings(
  params: {
    offset?: number;
    limit?: number;
    cursor?: string;
    size?: number;
  } = {},
): Promise<MyMeetingsPageResponse> {
  const { data } = await serverFetch({
    method: "GET",
    url: "/meetings/my",
    params,
  });
  return data;
}

export async function getLoungePosts(
  cursor?: string,
): Promise<GetPostsResponse> {
  const { data } = await serverFetch({
    method: "GET",
    url: "/posts",
    params: {
      keyword: "",
      sortBy: "createdAt",
      sortOrder: "desc",
      size: 10,
      ...(cursor ? { cursor } : {}),
    },
  });
  return filterThreadPosts(data);
}

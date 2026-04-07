import type {
  FavoritesResponse,
  GetPostsResponse,
  MyMeetingsResponse,
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
): Promise<FavoritesResponse> {
  const { data } = await serverFetch({
    method: "GET",
    url: "/favorites",
    params,
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
): Promise<MyMeetingsResponse> {
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
      size: 20,
      ...(cursor ? { cursor } : {}),
    },
  });
  return filterThreadPosts(data);
}

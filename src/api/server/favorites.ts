import type {
  FavoritesResponse,
  GetPostsResponse,
  MyMeetingsResponse,
} from "@/types";
import { serverFetch } from "@/lib/serverFetcher";

export async function  getFavorites (
  cursor?: string,
): Promise<FavoritesResponse> {
  const { data } = await serverFetch({
    method: "GET",
    url: "/favorites",
    params: cursor ? { cursor, size: 10 } : { size: 10 },
  });
  return data;
};

export async function  getMyMeetings  (
  cursor?: string,
): Promise<MyMeetingsResponse> {
  const { data } = await serverFetch({
    method: "GET",
    url: "/meetings/my",
    params: cursor ? { cursor, size: 10 } : { size: 10 },
  });
  return data;
};

export async function  getLoungePosts (
  cursor?: string,
): Promise<GetPostsResponse>  {
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
  return data;
};

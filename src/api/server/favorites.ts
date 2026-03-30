import type {
  FavoritesResponse,
  GetPostsResponse,
  MyMeetingsResponse,
} from "@/types";
import { serverFetch } from "@/lib/serverFetcher";

export const getFavorites = async (
  cursor?: string,
): Promise<FavoritesResponse> => {
  const { data } = await serverFetch({
    method: "GET",
    url: "/favorites",
    params: cursor ? { cursor, size: 10 } : { size: 10 },
  });
  return data;
};

export const getMyMeetings = async (
  cursor?: string,
): Promise<MyMeetingsResponse> => {
  const { data } = await serverFetch({
    method: "GET",
    url: "/meetings/my",
    params: cursor ? { cursor, size: 10 } : { size: 10 },
  });
  return data;
};

export const getLoungePosts = async (
  cursor?: string,
): Promise<GetPostsResponse> => {
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

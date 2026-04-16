import type {
  FavoritesPageResponse,
  GetPostsResponse,
  MyMeetingsPageResponse,
} from "@/types";
import {
  redirectToAuthSyncIfNeeded,
  serverFetch,
} from "@/lib/auth/serverFetcher";
import { filterThreadPosts } from "@/lib";

export async function getFavorites(
  params: {
    offset?: number;
    limit?: number;
    cursor?: string;
    size?: number;
  } = {},
): Promise<FavoritesPageResponse> {
  try {
    const { data } = await serverFetch({
      method: "GET",
      url: "/favorites",
      params: { ...params, sortBy: "meetingCreatedAt", sortOrder: "desc" },
    });

    return data;
  } catch (error) {
    redirectToAuthSyncIfNeeded(error);
    throw error;
  }
}

export async function getMyMeetings(
  params: {
    offset?: number;
    limit?: number;
    cursor?: string;
    size?: number;
  } = {},
): Promise<MyMeetingsPageResponse> {
  try {
    const { data } = await serverFetch({
      method: "GET",
      url: "/meetings/my",
      params,
    });
    return data;
  } catch (error) {
    redirectToAuthSyncIfNeeded(error);
    throw error;
  }
}

export async function getLoungePosts(
  cursor?: string,
): Promise<GetPostsResponse> {
  try {
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
  } catch (error) {
    redirectToAuthSyncIfNeeded(error);
    throw error;
  }
}

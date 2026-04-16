import {
  collectDeferredAuthTokens,
  redirectToAuthSyncIfNeeded,
  serverFetch,
  type DeferredAuthCommitContext,
} from "@/lib/auth/serverFetcher";
import type {
  GetCommentsResponse,
  GetPostsParams,
  GetPostsResponse,
  Post,

  VisiblePostsPageResponse,
} from "@/types";
import { filterThreadPosts } from "@/lib";
import { getVisibleMyPostsPage } from "@/lib";

export async function getPostDetail(postId: number): Promise<Post> {
  try {
    const { data } = await serverFetch({
      method: "GET",
      url: `/posts/${postId}`,
    });
    return data;
  } catch (error) {
    redirectToAuthSyncIfNeeded(error);
    throw error;
  }
}

export async function getPostCommentsServer(
  postId: number,
  params: {
    offset?: number;
    limit?: number;
  } = {},
  authContext?: DeferredAuthCommitContext,
): Promise<GetCommentsResponse> {
  try {
    const response = await serverFetch({
      method: "GET",
      url: `/posts/${postId}/comments`,
      params: {
        sortOrder: "desc",
        offset: params.offset ?? 0,
        limit: params.limit ?? 100,
      },
    }, {
      authSyncMode: authContext ? "response" : "throw",
    });
    collectDeferredAuthTokens(authContext, response);
    return response.data;
  } catch (error) {
    if (!authContext) {
      redirectToAuthSyncIfNeeded(error);
    }
    throw error;
  }
}

export async function getPosts(
  params: GetPostsParams = {},
  authContext?: DeferredAuthCommitContext,
): Promise<GetPostsResponse> {
  try {
    const response = await serverFetch({
      method: "GET",
      url: "/posts",
      params: {
        keyword: params.keyword,
        sortBy: params.sortBy || "createdAt",
        sortOrder: params.sortOrder || "desc",
        size: params.size || 10,
        ...(params.cursor ? { cursor: params.cursor } : {}),
      },
    }, {
      authSyncMode: authContext ? "response" : "throw",
    });
    collectDeferredAuthTokens(authContext, response);

    return filterThreadPosts(response.data);
  } catch (error) {
    if (!authContext) {
      redirectToAuthSyncIfNeeded(error);
    }
    throw error;
  }
}

export async function getMyPostsServer(
  params: {
    offset?: number;
    limit?: number;
  } = {},
): Promise<VisiblePostsPageResponse> {
  try {
    return getVisibleMyPostsPage(
      {
        offset: params.offset ?? 0,
        limit: params.limit ?? 10,
      },
      async ({ offset, limit }) => {
        const { data } = await serverFetch<GetPostsResponse>({
          method: "GET",
          url: "/users/me/posts",
          params: {
            sortBy: "createdAt",
            sortOrder: "desc",
            offset,
            limit,
          },
        });

        return data;
      },
    );
  } catch (error) {
    redirectToAuthSyncIfNeeded(error);
    throw error;
  }
}

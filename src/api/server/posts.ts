import { serverFetch, serverAxios } from "@/lib/auth/fetcher.server";
import type {
  GetCommentsResponse,
  GetPostsParams,
  GetPostsResponse,
  Post,

  VisiblePostsPageResponse,
} from "@/types";
import { filterThreadPosts } from "@/lib/postUtils";
import { getVisibleMyPostsPage } from "@/lib/myVisiblePosts";

export async function getPostDetail(postId: number): Promise<Post> {
  const { data } = await serverFetch({
    method: "GET",
    url: `/posts/${postId}`,
  });
  return data;
}

export async function getPostCommentsServer(
  postId: number,
  params: {
    offset?: number;
    limit?: number;
  } = {},
): Promise<GetCommentsResponse> {
  const { data } = await serverFetch({
    method: "GET",
    url: `/posts/${postId}/comments`,
    params: {
      sortOrder: "desc",
      offset: params.offset ?? 0,
      limit: params.limit ?? 100,
    },
  });
  return data;
}

export async function getPosts(
  params: GetPostsParams = {},
): Promise<GetPostsResponse> {
  const { data } = await serverFetch({
    method: "GET",
    url: "/posts",
    params: {
      keyword: params.keyword,
      sortBy: params.sortBy || "createdAt",
      sortOrder: params.sortOrder || "desc",
      size: params.size || 10,
      ...(params.cursor ? { cursor: params.cursor } : {}),
    },
  });

  return filterThreadPosts(data);
}

export async function getMyPostsServer(
  params: {
    offset?: number;
    limit?: number;
  } = {},
): Promise<VisiblePostsPageResponse> {
  return getVisibleMyPostsPage(
    {
      offset: params.offset ?? 0,
      limit: params.limit ?? 10,
    },
    async ({ offset, limit }) => {
      const { data } = await serverAxios.get<GetPostsResponse>(
        "/users/me/posts",
        {
          params: {
            sortBy: "createdAt",
            sortOrder: "desc",
            offset,
            limit,
          },
        },
      );

      return data;
    },
  );
}

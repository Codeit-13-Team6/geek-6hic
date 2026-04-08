import { serverAxios, serverFetch } from "@/lib/serverFetcher";
import type {
  GetCommentsResponse,
  GetPostsResponse,
  MyPostsPageResponse,
  Post,
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

export async function getPosts(cursor?: string): Promise<GetPostsResponse> {
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

export async function getMyPostsServer(
  params: {
    offset?: number;
    limit?: number;
  } = {},
): Promise<MyPostsPageResponse> {
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

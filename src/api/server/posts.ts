import { serverFetch } from "@/lib/serverFetcher";
import type { GetCommentsResponse, GetPostsResponse, Post } from "@/types";
import { filterThreadPosts } from "@/lib/postUtils";

export async function getPostDetail(postId: number): Promise<Post> {
  const { data } = await serverFetch({
    method: "GET",
    url: `/posts/${postId}`,
  });
  return data;
}

export async function getPostCommentsServer(
  postId: number,
  params?: {
    offset?: number;
    limit?: number;
  },
): Promise<GetCommentsResponse> {
  const { data } = await serverFetch({
    method: "GET",
    url: `/posts/${postId}/comments`,
    params: params
      ? {
          sortOrder: "desc",
          offset: params.offset,
          limit: params.limit,
        }
      : //쓰레드 댓글 위해 남겨놓을게용
        {
          sortOrder: "desc",
          size: 100,
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

import { serverFetch } from "@/lib/server-fetcher";
import type {
  GetCommentsResponse,
  GetPostsResponse,
} from "@/types";
import { filterThreadPosts } from "@/lib/postUtils";



export async function getPostCommentsServer(
  postId: number,
): Promise<GetCommentsResponse> {
  const { data } = await serverFetch({
    method: "GET",
    url: `/posts/${postId}/comments`,
    params: {
      sortOrder: "desc",
      size: 100,
    },
  });
  return data;
}

export async function fetchPostDetail(postId: number) {
  const { data } = await serverFetch({
    method: "GET",
    url: `/posts/${postId}`,
  });
  return data;
}


export async function fetchPosts(cursor?: string): Promise<GetPostsResponse> {
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



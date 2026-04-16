import axiosInstance from "@/infra/auth/fetcher.client";
import { filterThreadPosts } from "@/shared/lib/postUtils";
import {
  GetPostsParams,
  GetPostsResponse,
  MyPostsPageResponse,
  Post,
} from "@/shared/types";
import { threadKeyword } from "@/shared/lib/threadKeyword";

export async function getHotPosts(): Promise<Post[]> {
  const { data } = await axiosInstance.get<Post[]>("/hot");
  return data;
}

export async function getPosts(
  params: GetPostsParams,
): Promise<GetPostsResponse> {
  const { data: res } = await axiosInstance.get("/posts", {
    params,
  });

  return filterThreadPosts(res);
}

export async function getUserPostsPage(
  params: {
    userId: number;
    offset?: number;
    limit?: number;
  },
): Promise<MyPostsPageResponse> {
  const { data } = await axiosInstance.get<MyPostsPageResponse>(
    `/users/${params.userId}/posts-visible`,
    {
      params: {
        offset: params.offset ?? 0,
        limit: params.limit ?? 10,
      },
    },
  );

  return data;
}

export async function getMyPosts(
  params: {
    offset?: number;
    limit?: number;
  } = {},
): Promise<MyPostsPageResponse> {
  const { data } = await axiosInstance.get<MyPostsPageResponse>(
    "/users/me/posts-visible",
    {
      params: {
        offset: params.offset ?? 0,
        limit: params.limit ?? 20,
        // BFF가 내부에서 /users/me/posts 정렬/필터링을 처리 -> 클라이언트에서는 offset/limit만 넘기면 됩니다.
      },
    },
  );

  return data;
}

export async function getPostDetail(postId: number): Promise<Post> {
  const { data } = await axiosInstance.get(`/posts/${postId}`);
  return data;
}

export async function createPost(postData: {
  title: string;
  content: string;
  image?: string | null;
}): Promise<Post> {
  const { data } = await axiosInstance.post("/posts", postData);
  return data;
}

export async function deletePost(postId: number): Promise<void> {
  await axiosInstance.delete(`/posts/${postId}`);
}

export async function updatePost(
  postId: number,
  postData: { title: string; content: string; image?: string | null },
): Promise<Post> {
  const { data } = await axiosInstance.patch<Post>(
    `/posts/${postId}`,
    postData,
  );
  return data;
}

export async function likePost(postId: number): Promise<void> {
  await axiosInstance.post(`/posts/${postId}/like`);
}

export async function unlikePost(postId: number): Promise<void> {
  await axiosInstance.delete(`/posts/${postId}/like`);
}

export async function getLoungePosts(params: GetPostsParams): Promise<GetPostsResponse> {
  const { data } = await axiosInstance.get<GetPostsResponse>("/lounge/posts", {
    params,
  });
  return data;
}

export async function getThreadPost(meetingId: number): Promise<Post> {
  const { data } = await axiosInstance.get("/posts", {
    params: { keyword: threadKeyword.build(meetingId) },
  });
  return data?.data?.[0] || null;
}

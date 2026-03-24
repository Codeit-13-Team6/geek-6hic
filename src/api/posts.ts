import axiosInstance from "@/lib/client-fetcher";
import { Post } from "@/types";

export interface GetPostsParams {
  type?: "all" | "best";
  keyword?: string;
  sortBy?: "createdAt" | "viewCount" | "likeCount";
  sortOrder?: "asc" | "desc";
  cursor?: string;
  size?: number;
}

interface GetPostsResponse {
  data: Post[];
  nextCursor: string | null;
  hasMore: boolean;
}

export async function getPosts(
  params?: GetPostsParams,
): Promise<GetPostsResponse> {
  const { data } = await axiosInstance.get("/posts", { params });
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

export async function getPostsDetail(postId: number): Promise<Post> {
  const { data } = await axiosInstance.get(`/posts/${postId}`);
  return data;
}

export async function deletePost(postId: number): Promise<void> {
  await axiosInstance.delete(`/posts/${postId}`);
}

export async function updatePost(
  postId: number,
  postData: { title: string; content: string; image?: string | null },
) {
  const { data } = await axiosInstance.patch(`/posts/${postId}`, postData);
  return data;
}

export async function likePost(postId: number): Promise<void> {
  await axiosInstance.post(`/posts/${postId}/like`);
}

export async function unlikePost(postId: number): Promise<void> {
  await axiosInstance.delete(`/posts/${postId}/like`);
}

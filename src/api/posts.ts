import axiosInstance from "@/lib/axios";
import { GetPostsParams, GetPostsResponse, Post } from "@/types";

export async function getPosts(
  params?: GetPostsParams,
): Promise<GetPostsResponse> {
  const { data } = await axiosInstance.get("/posts", { params });
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

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

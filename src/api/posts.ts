import axiosInstance from "@/lib/axios";
import { Posts } from "@/types";

interface GetPostsParams {
  type?: string;
  keyword?: string;
  sortBy?: string;
  sortOrder?: string;
  cursor?: string;
  size?: number;
}

export async function getPosts(params?: GetPostsParams): Promise<Posts[]> {
  const { data } = await axiosInstance.get("/posts", { params });
  return data.data;
}




export async function getPostsDetail(postId: number): Promise<Posts[]> {
  const { data } = await axiosInstance.get(`/posts${postId}`);
  return data.data;
}

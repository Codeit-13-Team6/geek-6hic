import axiosInstance from "@/lib/client-fetcher";
import { GetPostsParams, Post } from "@/types";
import axios from "axios";

// export async function getHotPosts() {
//   const { data } = await axiosInstance.get("/hot");
//   return data;
// }

export const getHotPosts = async (extraHeaders?: any) => {
  const isServer = typeof window === "undefined";
  const baseUrl = isServer
    ? process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"
    : "";

  // 밖에서 넘겨받은 헤더(쿠키)가 있으면 쓰고, 없으면 빈 객체
  const { data } = await axios.get(`${baseUrl}/api/hot`, {
    headers: {
      ...extraHeaders,
    },
  });
  return data;
};

// export async function getPosts(
//   params?: GetPostsParams,
// ): Promise<GetPostsResponse> {
//   const { data } = await axiosInstance.get("/posts", { params });
//   return data;
// }

export const getPosts = async (params: GetPostsParams, extraHeaders?: any) => {
  const isServer = typeof window === "undefined";
  const baseUrl = isServer
    ? process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"
    : "";

  const { data } = await axios.get(`${baseUrl}/api/posts`, {
    params,
    headers: { ...extraHeaders }, // 서버에서 넘겨준 쿠키 배달
  });
  return data;
};

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

import axiosInstance from "@/lib/client-fetcher";
import { filterThreadPosts } from "@/lib/postUtils";
import { GetPostsParams, GetPostsResponse, Post } from "@/types";

export async function getHotPosts() {
  const { data } = await axiosInstance.get("/hot");
  return data;
}

export const getPosts = async (
  params: GetPostsParams,
): Promise<GetPostsResponse> => {
  const { data: res } = await axiosInstance.get("/posts", {
    params,
  });

  return filterThreadPosts(res);
};

export const getPostDetail = async (postId: number) => {
  const { data } = await axiosInstance.get(`/posts/${postId}`);
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

export async function getThreadPost(meetingId: number) {
  const { data } = await axiosInstance.get("/posts", {
    params: { keyword: `isThread_${meetingId}` },
  });
  return data?.data?.[0] || null;
}

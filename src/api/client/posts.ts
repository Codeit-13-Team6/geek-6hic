import axiosInstance from "@/lib/clientFetcher";
import { filterThreadPosts } from "@/lib/postUtils";
import { GetPostsParams, GetPostsResponse, Post } from "@/types";
import { threadKeyword } from "@/constans/post";

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
export async function getThreadPost(meetingId: number): Promise<Post> {
  const { data } = await axiosInstance.get("/posts", {
    params: { keyword: threadKeyword.build(meetingId) },
  });
  return data?.data?.[0] || null;
}

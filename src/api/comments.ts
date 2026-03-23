import { GetCommentsResponse } from "@/types/comment";
import axiosInstance from "@/lib/client-fetcher";

export async function getComments(
  postId: number,
): Promise<GetCommentsResponse> {
  const { data } = await axiosInstance.get(`/posts/${postId}/comments`, {
    params: {
      sortOrder: "desc",
      size: 10,
    },
  });
  return data;
}

export async function createComment(
  postId: number,
  content: string,
): Promise<Comment> {
  const { data } = await axiosInstance.post(`/posts/${postId}/comments`, {
    content,
  });
  return data;
}

export async function updateComment(
  postId: number,
  commentId: number,
  content: string,
): Promise<Comment> {
  const { data } = await axiosInstance.patch(
    `/posts/${postId}/comments/${commentId}`,
    {
      content,
    },
  );
  return data;
}

export async function deleteComment(
  postId: number,
  commentId: number,
): Promise<void> {
  await axiosInstance.delete(`/posts/${postId}/comments/${commentId}`);
}

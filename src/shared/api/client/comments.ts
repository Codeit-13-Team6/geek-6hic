import type { Comment, GetCommentsResponse } from "@/shared/types";
import axiosInstance from "@/infra/auth/fetcher.client";

export async function getComments(
  postId: number,
  params: {
    offset?: number;
    limit?: number;
  } = {},
): Promise<GetCommentsResponse> {
  const { data } = await axiosInstance.get(`/posts/${postId}/comments`, {
    params: {
      sortOrder: "desc",
      offset: params.offset ?? 0,
      limit: params.limit ?? 100,
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

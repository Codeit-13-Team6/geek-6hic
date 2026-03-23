import axiosInstance from "@/lib/axios";
import { GetCommentsResponse } from "@/types/comment";

export async function getComments(
  postId: number,
): Promise<GetCommentsResponse> {
  const { data } = await axiosInstance.get(`/posts/${postId}/comments`);
  return data;
}

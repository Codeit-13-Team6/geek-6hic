import axiosInstance from "@/lib/client-fetcher";
import { Posts } from "@/types";

interface GetPostsParams {
  type?: "all" | "best";
  keyword?: string;
  sortBy?: "createdAt" | "viewCount" | "likeCount";
  sortOrder?: "asc" | "desc";
  cursor?: string;
  size?: number;
}

// 페이지네이션을 위해 정의
interface GetPostsResponse {
  data: Posts[];
  nextCursor: string | null;
  hasMore: boolean;
}

export async function getPosts(
  params?: GetPostsParams,
): Promise<GetPostsResponse> {
  const { data } = await axiosInstance.get("/posts", { params });
  return data;
}

export async function getPostsDetail(postId: number): Promise<Posts[]> {
  const { data } = await axiosInstance.get(`/posts${postId}`);
  return data.data;
}

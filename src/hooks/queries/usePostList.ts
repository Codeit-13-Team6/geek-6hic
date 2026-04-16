"use client";

import { useInfiniteQuery } from "@tanstack/react-query";
import { getLoungePosts } from "@/api/client/posts";
import { GetPostsResponse, LoungeSortBy, SortOrder } from "@/types";
import { QUERY_KEYS } from "@/constants/queryKey";
import { getNextPageParam } from "@/lib/pagination";

export interface UsePostListParams {
  keyword: string;
  sortBy: LoungeSortBy;
  sortOrder: SortOrder;
}

export const usePostList = (currentParams: UsePostListParams) => {
  return useInfiniteQuery<GetPostsResponse>({
    queryKey: QUERY_KEYS.posts.listParams(currentParams),
    queryFn: ({ pageParam }) => {
      const cursor = typeof pageParam === "string" ? pageParam : undefined;
      return getLoungePosts({
        ...currentParams,
        size: 10,
        ...(cursor ? { cursor } : {}),
      });
    },
    initialPageParam: undefined,
    getNextPageParam,
    staleTime: 1000 * 60,
  });
};

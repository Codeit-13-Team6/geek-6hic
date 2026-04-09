"use client";

import { useInfiniteQuery } from "@tanstack/react-query";
import { getMeetingList, getJoinedMeetings } from "@/api/client/meetings";
import type {
  JoinedMeetingsResponse,
  GetMeetingListParams,
  SortValue,
  SortOrder,
} from "@/types";
import { getNextPageParam } from "@/lib/pagination";
import { QUERY_KEYS } from "@/constans/queryKey";
import { useUrlQuery } from "@/hooks/useUrlQuery";
import type { QueryKey } from "@tanstack/react-query";

interface UseMeetingListProps {
  type?: string;
  keyword?: string;
  sortBy?: SortValue;
  sortOrder?: SortOrder;
  enabled?: boolean;
}

export interface InfiniteListResult {
  meetingList: JoinedMeetingsResponse["data"];
  isLoading: boolean;
  fetchNextPage: () => void;
  hasNextPage: boolean | undefined;
  isFetchingNextPage: boolean;
  sortValue?: SortValue;
  favoriteQueryKey: QueryKey; // 좋아요/수정 후 이 키를 무효화해야 함
}

export function useMeetingList({
  type = "",
  keyword = "",
  sortBy = "createdAt",
  sortOrder = "desc",
  enabled = true,
}: UseMeetingListProps = {}): InfiniteListResult {
  const currentParams = { type, keyword, sortBy, sortOrder };
  const listQueryKey = QUERY_KEYS.meetings.listParams(currentParams);

  const { data, status, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useInfiniteQuery<JoinedMeetingsResponse>({
      queryKey: listQueryKey,
      queryFn: ({ pageParam }) => {
        const cursor = typeof pageParam === "string" ? pageParam : undefined;
        const params: GetMeetingListParams = {
          size: 10,
          type: type || undefined,
          keyword: keyword || undefined,
          sortBy,
          sortOrder,
          ...(cursor ? { cursor } : {}),
        };
        return getMeetingList(params);
      },
      initialPageParam: undefined,
      getNextPageParam,
      staleTime: 1000 * 60,
      enabled,
    });

  const meetingList = data?.pages.flatMap((page) => page.data ?? []) ?? [];

  return {
    meetingList,
    isLoading: status === "pending",
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    sortValue: sortBy || undefined,
    favoriteQueryKey: listQueryKey,
  };
}

export function useJoinedMeetingList(enabled = true): InfiniteListResult {
  const { data, status, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useInfiniteQuery<JoinedMeetingsResponse>({
      queryKey: QUERY_KEYS.meetings.joined,
      queryFn: ({ pageParam }) =>
        getJoinedMeetings(
          pageParam
            ? { cursor: pageParam as string, size: 10, sortOrder: "desc" }
            : { size: 10, sortOrder: "desc" },
        ),
      initialPageParam: undefined,
      getNextPageParam,
      enabled,
    });

  return {
    meetingList: data?.pages.flatMap((p) => p.data ?? []) ?? [],
    isLoading: status === "pending",
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    favoriteQueryKey: QUERY_KEYS.meetings.joined,
  };
}

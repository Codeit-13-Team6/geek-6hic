"use client";

import { useInfiniteQuery } from "@tanstack/react-query";
import { getMeetingList, getJoinedMeetings } from "@/api/client/meetings";
import type {
  JoinedMeetingsResponse,
  GetMeetingListParams,
  SortValue,
} from "@/types";
import { getNextPageParam } from "@/lib/pagination";
import { QUERY_KEYS } from "@/constans/queryKey";
import { useMeetingSearchParams } from "@/hooks/useMeetingSearchParams";
import type { QueryKey } from "@tanstack/react-query";

export interface InfiniteListResult {
  meetingList: JoinedMeetingsResponse["data"];
  isLoading: boolean;
  fetchNextPage: () => void;
  hasNextPage: boolean | undefined;
  isFetchingNextPage: boolean;
  sortValue?: SortValue;
  favoriteQueryKey: QueryKey; // 중요: 좋아요/수정 후 이 키를 무효화해야 함
}

export function useAllMeetingList(enabled = true): InfiniteListResult {
  const { tabValue, keyword, sortBy, sortOrder } = useMeetingSearchParams();

  // 1. 쿼리 파라미터를 객체로 고정 (키와 API 호출에 동일하게 사용)
  const currentParams = {
    type: tabValue,
    keyword: keyword, // 이미 useMeetingSearchParams에서 "" 처리가 됨
    sortBy: sortBy,
    sortOrder: sortOrder,
  };

  // 2. QUERY_KEYS 팩토리를 사용하여 키 생성 (서버와 100% 일치)
  const listQueryKey = QUERY_KEYS.meetings.listParams(currentParams);

  const { data, status, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useInfiniteQuery<JoinedMeetingsResponse>({
      queryKey: listQueryKey,
      queryFn: ({ pageParam }) => {
        const cursor = typeof pageParam === "string" ? pageParam : undefined;
        const params: GetMeetingListParams = {
          size: 10,
          sortOrder,
          // 빈 문자열일 경우 아예 속성을 보내지 않거나 기본값을 할당
          type: tabValue || undefined,
          keyword: keyword || undefined,
          // sortBy가 ""이면 undefined로 처리하거나 기본값 "dateTime" 부여
          sortBy: (sortBy === ""
            ? "dateTime"
            : sortBy) as GetMeetingListParams["sortBy"],
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
    // 3. 반환하는 키도 생성된 키를 그대로 사용 (매우 중요!)
    favoriteQueryKey: listQueryKey,
  };
}

// 이 훅은 URL 파라미터에 영향을 받지 않으므로 기존 로직 유지
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

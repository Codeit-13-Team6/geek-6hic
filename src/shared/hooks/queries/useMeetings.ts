"use client";

import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import {
  getMeetingList,
  getJoinedMeetings,
  getMeetingTypes,
} from "@/shared/api/client/meetings";
import type {
  JoinedMeetingsResponse,
  GetMeetingListParams,
  SortOrder,
  MeetingSortBy,
  MeetingType,
} from "@/shared/types";
import { getNextPageParam } from "@/shared/lib/pagination";
import { QUERY_KEYS } from "@/shared/constants/queryKey";
import type { QueryKey } from "@tanstack/react-query";

interface GetMeetingsProps {
  type?: string;
  keyword?: string;
  sortBy?: MeetingSortBy;
  sortOrder?: SortOrder;
  enabled?: boolean;
}

export interface InfiniteListResult {
  meetingList: JoinedMeetingsResponse["data"];
  fetchNextPage: () => void;
  hasNextPage: boolean | undefined;
  isFetchingNextPage: boolean;
  sortValue?: MeetingSortBy;
  favoriteQueryKey: QueryKey; // 좋아요/수정 후 이 키를 무효화해야 함
}

export const useGetMeetings = ({
  type = "",
  keyword = "",
  sortBy = "createdAt",
  sortOrder = "desc",
  enabled = true,
}: GetMeetingsProps = {}): InfiniteListResult => {
  const currentParams = { type, keyword, sortBy, sortOrder };
  const listQueryKey = QUERY_KEYS.meetings.listParams(currentParams);

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
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
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    sortValue: sortBy || undefined,
    favoriteQueryKey: listQueryKey,
  };
};

export const useJoinedMeetingList = (enabled = true): InfiniteListResult => {
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useInfiniteQuery<JoinedMeetingsResponse>({
      queryKey: QUERY_KEYS.meetings.joined,
      queryFn: ({ pageParam }) =>
        getJoinedMeetings(
          pageParam
            ? { cursor: pageParam as string, size: 10, sortOrder: "desc", sortBy: "joinedAt" }
            : { size: 10, sortOrder: "desc", sortBy: "joinedAt" },
        ),
      initialPageParam: undefined,
      getNextPageParam,
      enabled,
    });

  return {
    meetingList: data?.pages.flatMap((p) => p.data ?? []) ?? [],
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    favoriteQueryKey: QUERY_KEYS.meetings.joined,
  };
};

export const useMeetingTypes = () => {
  const queryResult = useQuery<MeetingType[]>({
    queryKey: QUERY_KEYS.meetings.meetingType,
    queryFn: getMeetingTypes,
    staleTime: 1000 * 60 * 5,
  });

  return { ...queryResult, meetingTypes: queryResult.data || [] };
};

"use client";

import { useInfiniteQuery } from "@tanstack/react-query";
import { getMeetingList, getJoinedMeetings } from "@/api/client/meetings";
import type {
  JoinedMeetingsResponse,
  GetMeetingListParams,
  SortOrder,
  MeetingSortBy,
  JoinedMeeting
} from "@/types";
import { getNextPageParam } from "@/lib/pagination";
import {
  InfiniteData,
  QueryKey,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { deleteFavorites, updateFavorites } from "@/api/client";
import { QUERY_KEYS } from "@/constants/queryKey";
import { useOptimisticMutation } from "@/hooks/useOptimisticUpdate";


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
  favoriteQueryKey: QueryKey;
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



export const useMeetingFavoriteMutation = (
  queryKey: QueryKey = QUERY_KEYS.meetings.joined,
) => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (meeting: Pick<JoinedMeeting, "id" | "isFavorited">) => {
      if (meeting.isFavorited) {
        await deleteFavorites(meeting.id);
        return;
      }
      await updateFavorites(meeting.id);
    },
    ...useOptimisticMutation<
      InfiniteData<JoinedMeetingsResponse>,
      Pick<JoinedMeeting, "id" | "isFavorited">
    >(queryClient, {
      queryKey,
      updater: (oldData, meeting) => ({
        ...oldData,
        pages: oldData.pages.map((page) => ({
          ...page,
          data: page.data.map((item) =>
            item.id === meeting.id
              ? { ...item, isFavorited: !item.isFavorited }
              : item,
          ),
        })),
      }),
      invalidateKeys: [QUERY_KEYS.meetings.root, QUERY_KEYS.favorites.root],
      onErrorMessage: "즐겨찾기 처리에 실패했습니다.",
    }),
  });

  return {
    toggleFavorite: mutation.mutate,
    toggleFavoriteAsync: mutation.mutateAsync,
    isPending: mutation.isPending,
    error: mutation.error,
  };
};


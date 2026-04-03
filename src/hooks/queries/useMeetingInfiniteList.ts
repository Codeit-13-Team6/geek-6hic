import { useInfiniteQuery } from "@tanstack/react-query";
import { getMeetingList, getJoinedMeetings } from "@/api/client/meetings";
import type { JoinedMeetingsResponse, GetMeetingListParams, SortBy } from "@/types";
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
  sortValue?: SortBy;
  favoriteQueryKey: QueryKey;
}

export function useAllMeetingList(enabled = true): InfiniteListResult {
  const { tabValue, sortBy, sortOrder, dateRange } = useMeetingSearchParams();

  const { data, status, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useInfiniteQuery<JoinedMeetingsResponse>({
      queryKey: QUERY_KEYS.meetings.listParams({
        type: tabValue,
        sortBy: sortBy ?? "",
        sortOrder,
      }),
      queryFn: ({ pageParam }) => {
        const cursor = typeof pageParam === "string" ? pageParam : undefined;
        const params: GetMeetingListParams = {
          type: tabValue,
          size: 10,
          sortOrder,
          ...(sortBy ? { sortBy } : {}),
          ...(cursor ? { cursor } : {}),
        };
        return getMeetingList(params);
      },
      initialPageParam: undefined,
      getNextPageParam,
      staleTime: 1000 * 60,
      enabled,
    });

  const rawList = data?.pages.flatMap((page) => page.data ?? []) ?? [];

  const meetingList =
    dateRange?.from && dateRange?.to
      ? rawList.filter((m) => {
          const t = new Date(m.dateTime).getTime();
          const from = new Date(dateRange.from!).setHours(0, 0, 0, 0);
          const to = new Date(dateRange.to!).setHours(23, 59, 59, 999);
          return t >= from && t <= to;
        })
      : rawList;

  return {
    meetingList,
    isLoading: status === "pending",
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    sortValue: sortBy || undefined,
    favoriteQueryKey: ["meetings", tabValue, sortBy, sortOrder],
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

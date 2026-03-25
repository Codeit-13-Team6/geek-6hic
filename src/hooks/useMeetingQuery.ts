"use client";

import { infiniteQueryOptions, useInfiniteQuery } from "@tanstack/react-query";
import { getJoinedMeetings } from "@/api/meetings";
import type { JoinedMeetingsResponse } from "@/types";

export const meetingJoinedQueryKey = ["meetings", "joined"] as const;

export const meetingJoinedInfiniteQueryOptions =
  infiniteQueryOptions<JoinedMeetingsResponse>({
    queryKey: meetingJoinedQueryKey,
    queryFn: ({ pageParam }) =>
      getJoinedMeetings(
        pageParam ? { cursor: pageParam as string, size: 10 } : { size: 10 },
      ),
    initialPageParam: undefined,
    getNextPageParam: (lastPage) =>
      lastPage.hasMore ? (lastPage.nextCursor ?? undefined) : undefined,
  });

export function useMeetingQuery() {
  return useInfiniteQuery(meetingJoinedInfiniteQueryOptions);
}

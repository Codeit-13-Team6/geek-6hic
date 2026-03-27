"use client";

import { infiniteQueryOptions, useInfiniteQuery } from "@tanstack/react-query";
import { getJoinedMeetings } from "@/api/meetings";
import type { JoinedMeetingsResponse } from "@/types";


export function getMeetingJoinedNextPageParam(
  lastPage: JoinedMeetingsResponse,
) {
  return lastPage.hasMore ? (lastPage.nextCursor ?? undefined) : undefined;
}

export const meetingJoinedInfiniteQueryOptions =
  infiniteQueryOptions<JoinedMeetingsResponse>({
    queryKey: ["meetings", "joined"],
    queryFn: ({ pageParam }) =>
      getJoinedMeetings(
        pageParam ? { cursor: pageParam as string, size: 10 } : { size: 10 },
      ),
    initialPageParam: undefined,
    getNextPageParam: getMeetingJoinedNextPageParam,
  });

export function useMeetingQuery() {
  return useInfiniteQuery(meetingJoinedInfiniteQueryOptions);
}

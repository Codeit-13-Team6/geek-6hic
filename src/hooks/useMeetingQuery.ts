"use client";

import { infiniteQueryOptions, useInfiniteQuery } from "@tanstack/react-query";
import { getJoinedMeetings } from "@/api/meetings";
import type { JoinedMeetingsResponse } from "@/types";
import {
  getMeetingJoinedNextPageParam,
  meetingJoinedQueryKey,
} from "@/hooks/meetingQuery.shared";

export const meetingJoinedInfiniteQueryOptions =
  infiniteQueryOptions<JoinedMeetingsResponse>({
    queryKey: meetingJoinedQueryKey,
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

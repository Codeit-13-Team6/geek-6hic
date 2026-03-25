"use client";

import { usePrefetchInfiniteQuery } from "@tanstack/react-query";
import { meetingJoinedInfiniteQueryOptions } from "@/hooks/useMeetingQuery";

export function usePrefetchMeetingQuery() {
  usePrefetchInfiniteQuery(meetingJoinedInfiniteQueryOptions);
}

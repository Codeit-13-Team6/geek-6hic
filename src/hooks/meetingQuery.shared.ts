import type { JoinedMeetingsResponse } from "@/types";

export const meetingJoinedQueryKey = ["meetings", "joined"] as const;

export function getMeetingJoinedNextPageParam(
  lastPage: JoinedMeetingsResponse,
) {
  return lastPage.hasMore ? (lastPage.nextCursor ?? undefined) : undefined;
}

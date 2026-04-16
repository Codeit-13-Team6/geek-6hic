"use client";

import { useQuery } from "@tanstack/react-query";
import { getMeetingTypes } from "@/api/client/meetings";
import type { MeetingType } from "@/types";
import { QUERY_KEYS } from "@/constants/queryKey";

export const useMeetingTypes = () => {
  const queryResult = useQuery<MeetingType[]>({
    queryKey: QUERY_KEYS.meetings.meetingType,
    queryFn: getMeetingTypes,
    staleTime: 1000 * 60 * 5,
  });

  return { ...queryResult, meetingTypes: queryResult.data || [] };
};

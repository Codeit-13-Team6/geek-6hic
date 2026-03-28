"use client";

import { useQuery } from "@tanstack/react-query";
import {
  getMeetingDetailQueryKey,
  getMeetingParticipantsQueryKey,
  getMeetingRecommendationCandidatesQueryKey,
} from "./meeting-detail.query-keys";
import {
  fetchMeetingDetail,
  fetchMeetingParticipants,
  fetchMeetingRecommendationCandidates,
} from "@/api/meeting-detail.api";

export function useMeetingDetailQueries(meetingId: number) {
  const detailQuery = useQuery({
    queryKey: getMeetingDetailQueryKey(meetingId),
    queryFn: () => fetchMeetingDetail(meetingId),
  });

  const participantsQuery = useQuery({
    queryKey: getMeetingParticipantsQueryKey(meetingId),
    queryFn: () => fetchMeetingParticipants(meetingId),
  });

  const recommendationCandidatesQuery = useQuery({
    queryKey: getMeetingRecommendationCandidatesQueryKey(meetingId),
    queryFn: () => fetchMeetingRecommendationCandidates(),
  });

  return {
    detailQuery,
    participantsQuery,
    recommendationCandidatesQuery,
  };
}

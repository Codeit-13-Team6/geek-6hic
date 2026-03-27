"use client";

import { useQuery } from "@tanstack/react-query";
import {
  fetchMeetingDetail,
  fetchMeetingParticipants,
  fetchMeetingRecommendationCandidates,
} from "@/app/meetings/[id]/api/meeting-detail.api";
import {
  getMeetingDetailQueryKey,
  getMeetingParticipantsQueryKey,
  getMeetingRecommendationCandidatesQueryKey,
} from "@/app/meetings/[id]/model/meeting-detail.query-keys";

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

export const getMeetingDetailQueryKey = (meetingId: number) =>
  ["meeting-detail", meetingId] as const;

export const getMeetingParticipantsQueryKey = (meetingId: number) =>
  ["meeting-participants", meetingId] as const;

export const getMeetingRecommendationCandidatesQueryKey = (meetingId: number) =>
  ["meeting-recommendation-candidates", meetingId] as const;

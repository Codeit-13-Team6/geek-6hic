import type {
  MeetingDetailApiData,
  MeetingListItemApiData,
  RecommendedMeetingItem,
} from "@/app/meetings/[meetingId]/types";

const hasRecruitmentOpen = (
  meeting: Pick<
    MeetingListItemApiData,
    "canceledAt" | "registrationEnd" | "participantCount" | "capacity"
  >,
  currentTimestamp: number,
) =>
  !meeting.canceledAt &&
  new Date(meeting.registrationEnd).getTime() > currentTimestamp &&
  meeting.participantCount < meeting.capacity;

const getStableRecommendationWeight = (
  currentMeetingId: number,
  candidateId: number,
) => (candidateId * 31 + currentMeetingId * 17) % 997;

const toRecommendedMeetingItem = (
  meeting: MeetingListItemApiData,
): RecommendedMeetingItem => ({
  id: meeting.id,
  name: meeting.name,
  image: meeting.image,
  participantCount: meeting.participantCount,
  capacity: meeting.capacity,
  registrationEnd: meeting.registrationEnd,
  dateTime: meeting.dateTime,
});

export const getRecommendedMeetings = ({
  currentMeeting,
  candidates,
  currentTimestamp,
}: {
  currentMeeting: MeetingDetailApiData;
  candidates: MeetingListItemApiData[];
  currentTimestamp: number;
}) => {
  const availableCandidates = candidates.filter(
    (candidate) =>
      candidate.id !== currentMeeting.id &&
      hasRecruitmentOpen(candidate, currentTimestamp),
  );

  const sameTypeCandidates = availableCandidates
    .filter((candidate) => candidate.type === currentMeeting.type)
    .sort(
      (left, right) =>
        new Date(left.dateTime).getTime() - new Date(right.dateTime).getTime(),
    );

  const recommendedCandidates: MeetingListItemApiData[] = [];
  const usedIds = new Set<number>();

  sameTypeCandidates.slice(0, 2).forEach((candidate) => {
    recommendedCandidates.push(candidate);
    usedIds.add(candidate.id);
  });

  const otherCandidates = availableCandidates
    .filter((candidate) => !usedIds.has(candidate.id))
    .sort(
      (left, right) =>
        getStableRecommendationWeight(currentMeeting.id, left.id) -
        getStableRecommendationWeight(currentMeeting.id, right.id),
    );

  otherCandidates.forEach((candidate) => {
    if (recommendedCandidates.length >= 4) {
      return;
    }

    recommendedCandidates.push(candidate);
  });

  return recommendedCandidates.slice(0, 4).map(toRecommendedMeetingItem);
};

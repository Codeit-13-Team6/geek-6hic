import { serverFetch } from "@/lib/auth/fetcher.server";
import { fetchAllCursor } from "@/lib/fetchAllCursor";
import { isSecretMeeting } from "@/lib/meetingSecret";
import type {
  GetMeetingsResponse,
  GetPostsResponse,
  MeetingResponse,
  RecommendedMeetingItem,
} from "@/types";

const THREAD_KEYWORD = "isThread_";
const MEETING_PAGE_SIZE = 50;
const MEETING_MAX_COUNT = 100;
const THREAD_PAGE_SIZE = 100;
const THREAD_MAX_COUNT = 300;

function isRecommendableMeeting(
  candidate: MeetingResponse,
  currentMeetingId: number,
) {
  if (candidate.id === currentMeetingId) return false;
  if (candidate.canceledAt) return false;
  if (candidate.participantCount >= candidate.capacity) return false;
  if (isSecretMeeting(candidate.dateTime)) return false;
  return true;
}

function getParticipantRatioScore(participantCount: number, capacity: number) {
  if (capacity <= 0) return 0;

  const participantRatio = participantCount / capacity;

  if (participantRatio >= 0.5 && participantRatio <= 0.7) return 3;
  if (
    (participantRatio >= 0.3 && participantRatio < 0.5) ||
    (participantRatio > 0.7 && participantRatio <= 0.9)
  ) {
    return 2;
  }

  return 1;
}

function getStableWeight(currentMeetingId: number, candidateId: number) {
  return (candidateId * 31 + currentMeetingId * 17) % 997;
}

function compareMeetingCandidate(
  targetA: MeetingResponse,
  targetB: MeetingResponse,
  currentMeetingId: number,
  threadActivityMap: Map<number, number>,
  compareMode: "sameType" | "otherType" | "fallback",
) {
  if (compareMode !== "sameType") {
    const activityDiff =
      (threadActivityMap.get(targetB.id) ?? 0) -
      (threadActivityMap.get(targetA.id) ?? 0);

    if (activityDiff !== 0) return activityDiff;
  }

  const participantRatioScoreDiff =
    getParticipantRatioScore(targetB.participantCount, targetB.capacity) -
    getParticipantRatioScore(targetA.participantCount, targetA.capacity);

  if (participantRatioScoreDiff !== 0) return participantRatioScoreDiff;

  return (
    getStableWeight(currentMeetingId, targetA.id) -
    getStableWeight(currentMeetingId, targetB.id)
  );
}

async function getMeetingCandidateList() {
  return fetchAllCursor<MeetingResponse>({
    fetchPage: (cursor) =>
      serverFetch<GetMeetingsResponse>({
        method: "GET",
        url: "/meetings",
        params: {
          sortBy: "participantCount",
          sortOrder: "desc",
          size: MEETING_PAGE_SIZE,
          ...(cursor ? { cursor } : {}),
        },
      }).then((r) => r.data),
    maxItems: MEETING_MAX_COUNT,
  });
}

async function getThreadActivityMap() {
  const threadPostList = await fetchAllCursor<GetPostsResponse["data"][number]>({
    fetchPage: (cursor) =>
      serverFetch<GetPostsResponse>({
        method: "GET",
        url: "/posts",
        params: {
          type: "all",
          keyword: THREAD_KEYWORD,
          sortBy: "commentCount",
          sortOrder: "desc",
          size: THREAD_PAGE_SIZE,
          ...(cursor ? { cursor } : {}),
        },
      }).then((r) => r.data),
    maxItems: THREAD_MAX_COUNT,
  });

  const threadActivityMap = new Map<number, number>();

  for (const post of threadPostList) {
    if (!post.title.startsWith(THREAD_KEYWORD)) continue;

    const meetingId = Number(post.title.replace(THREAD_KEYWORD, ""));
    if (!Number.isFinite(meetingId)) continue;

    threadActivityMap.set(meetingId, post._count.comments);
  }

  return threadActivityMap;
}

function toRecommendedMeetingItem(
  meeting: MeetingResponse,
): RecommendedMeetingItem {
  return {
    id: meeting.id,
    name: meeting.name,
    image: meeting.image,
    participantCount: meeting.participantCount,
    capacity: meeting.capacity,
    registrationEnd: meeting.registrationEnd,
    dateTime: meeting.dateTime,
  };
}

function selectRecommendedMeetingList({
  currentMeetingId,
  currentMeetingType,
  meetingCandidateList,
  threadActivityMap,
}: {
  currentMeetingId: number;
  currentMeetingType: string;
  meetingCandidateList: MeetingResponse[];
  threadActivityMap: Map<number, number>;
}) {
  const filteredCandidateList: MeetingResponse[] = [];

  for (const meeting of meetingCandidateList) {
    if (isRecommendableMeeting(meeting, currentMeetingId)) {
      filteredCandidateList.push(meeting);
    }
  }

  const sameTypeCandidateList: MeetingResponse[] = [];
  const otherTypeCandidateList: MeetingResponse[] = [];

  for (const candidate of filteredCandidateList) {
    if (candidate.type === currentMeetingType) {
      sameTypeCandidateList.push(candidate);
      continue;
    }
    otherTypeCandidateList.push(candidate);
  }

  sameTypeCandidateList.sort((targetA, targetB) =>
    compareMeetingCandidate(targetA, targetB, currentMeetingId, threadActivityMap, "sameType"),
  );
  otherTypeCandidateList.sort((targetA, targetB) =>
    compareMeetingCandidate(targetA, targetB, currentMeetingId, threadActivityMap, "otherType"),
  );

  const prioritizedSameTypeCandidateList = sameTypeCandidateList.slice(0, 4);
  const prioritizedOtherTypeCandidateList = otherTypeCandidateList.slice(0, 4);

  const recommendedMeetingList: RecommendedMeetingItem[] = [];
  const selectedMeetingIdSet = new Set<number>();

  function pushCandidate(candidate?: MeetingResponse) {
    if (!candidate) return;
    if (selectedMeetingIdSet.has(candidate.id)) return;
    if (recommendedMeetingList.length >= 4) return;

    selectedMeetingIdSet.add(candidate.id);
    recommendedMeetingList.push(toRecommendedMeetingItem(candidate));
  }

  pushCandidate(prioritizedSameTypeCandidateList[0]);
  pushCandidate(prioritizedSameTypeCandidateList[1]);
  pushCandidate(prioritizedOtherTypeCandidateList[0]);
  pushCandidate(prioritizedOtherTypeCandidateList[1]);
  pushCandidate(prioritizedSameTypeCandidateList[2]);
  pushCandidate(prioritizedSameTypeCandidateList[3]);
  pushCandidate(prioritizedOtherTypeCandidateList[2]);
  pushCandidate(prioritizedOtherTypeCandidateList[3]);

  return recommendedMeetingList;
}

export async function getRecommendedMeetingsBFF({
  meetingId,
  meetingType,
}: {
  meetingId: number;
  meetingType: string;
}): Promise<RecommendedMeetingItem[]> {
  const [meetingCandidateList, threadActivityMap] = await Promise.all([
    getMeetingCandidateList(),
    getThreadActivityMap(),
  ]);

  return selectRecommendedMeetingList({
    currentMeetingId: meetingId,
    currentMeetingType: meetingType,
    meetingCandidateList,
    threadActivityMap,
  });
}

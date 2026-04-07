import { NextResponse } from "next/server";
import { serverAxios } from "@/lib/serverFetcher";
import type {
  GetPostsResponse,
  MeetingDetailApiData,
  MeetingResponse,
  MeetingListResponse,
  RecommendedMeetingItem,
} from "@/types";

const THREAD_KEYWORD = "isThread_";
const MEETING_PAGE_SIZE = 50;
const MEETING_MAX_COUNT = 100;
const THREAD_PAGE_SIZE = 100;
const THREAD_MAX_COUNT = 300;

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

function isRecommendableMeeting(
  candidate: MeetingResponse,
  currentMeetingId: number,
) {
  if (candidate.id === currentMeetingId) return false;
  if (candidate.canceledAt) return false;
  if (candidate.participantCount >= candidate.capacity) return false;
  return true;
}

function getParticipantRatioScore(participantCount: number, capacity: number) {
  if (capacity <= 0) return 0;

  const ratio = participantCount / capacity;

  if (ratio >= 0.5 && ratio <= 0.7) return 3;
  if ((ratio >= 0.3 && ratio < 0.5) || (ratio > 0.7 && ratio <= 0.9)) {
    return 2;
  }

  return 1;
}

function getStableWeight(currentMeetingId: number, candidateId: number) {
  return (candidateId * 31 + currentMeetingId * 17) % 997;
}

function extractMeetingIdFromThreadTitle(title: string) {
  if (!title.startsWith(THREAD_KEYWORD)) return null;

  const meetingId = Number(title.replace(THREAD_KEYWORD, ""));
  return Number.isFinite(meetingId) ? meetingId : null;
}

async function getMeetingDetail(meetingId: number) {
  const response = await serverAxios.get<MeetingDetailApiData>(
    `/meetings/${meetingId}`,
  );

  return response.data;
}

async function getMeetingCandidates() {
  let cursor: string | undefined;
  const results: MeetingResponse[] = [];

  while (results.length < MEETING_MAX_COUNT) {
    const response = await serverAxios.get<MeetingListResponse>("/meetings", {
      params: {
        sortBy: "participantCount",
        sortOrder: "desc",
        size: MEETING_PAGE_SIZE,
        ...(cursor ? { cursor } : {}),
      },
    });

    const pageItems = response.data.data;
    for (const item of pageItems) {
      results.push(item);
    }

    if (!response.data.hasMore || !response.data.nextCursor) {
      break;
    }

    cursor = response.data.nextCursor;
  }

  return results.slice(0, MEETING_MAX_COUNT);
}

// 댓글 수가 많은 스레드 후보를 cursor 기반으로 더 넓게 수집합니다.
// 추천 후보 모임이 1페이지 바깥에 있어도 활동도를 반영할 수 있게 합니다.
async function getThreadActivityMap() {
  let cursor: string | undefined;
  const posts: GetPostsResponse["data"] = [];

  while (posts.length < THREAD_MAX_COUNT) {
    const response = await serverAxios.get<GetPostsResponse>("/posts", {
      params: {
        type: "all",
        keyword: THREAD_KEYWORD,
        sortBy: "commentCount",
        sortOrder: "desc",
        size: THREAD_PAGE_SIZE,
        ...(cursor ? { cursor } : {}),
      },
    });

    const pagePosts = response.data.data;
    for (const post of pagePosts) {
      posts.push(post);
    }

    if (!response.data.hasMore || !response.data.nextCursor) {
      break;
    }

    cursor = response.data.nextCursor;
  }

  const activityMap = new Map<number, number>();
  const limitedPosts = posts.slice(0, THREAD_MAX_COUNT);

  for (const post of limitedPosts) {
    const meetingId = extractMeetingIdFromThreadTitle(post.title);
    if (!meetingId) continue;

    activityMap.set(meetingId, post._count.comments);
  }

  return activityMap;
}

function sortSameTypeCandidates(
  currentMeetingId: number,
  candidates: MeetingResponse[],
) {
  return [...candidates].sort(function compareSameType(a, b) {
    const scoreDiff =
      getParticipantRatioScore(b.participantCount, b.capacity) -
      getParticipantRatioScore(a.participantCount, a.capacity);

    if (scoreDiff !== 0) return scoreDiff;

    return (
      getStableWeight(currentMeetingId, a.id) -
      getStableWeight(currentMeetingId, b.id)
    );
  });
}

function sortOtherTypeCandidates(
  currentMeetingId: number,
  candidates: MeetingResponse[],
  threadActivityMap: Map<number, number>,
) {
  return [...candidates].sort(function compareOtherType(a, b) {
    const activityDiff =
      (threadActivityMap.get(b.id) ?? 0) - (threadActivityMap.get(a.id) ?? 0);

    if (activityDiff !== 0) return activityDiff;

    const scoreDiff =
      getParticipantRatioScore(b.participantCount, b.capacity) -
      getParticipantRatioScore(a.participantCount, a.capacity);

    if (scoreDiff !== 0) return scoreDiff;

    return (
      getStableWeight(currentMeetingId, a.id) -
      getStableWeight(currentMeetingId, b.id)
    );
  });
}

function sortFallbackCandidates(
  currentMeetingId: number,
  candidates: MeetingResponse[],
  threadActivityMap: Map<number, number>,
) {
  return [...candidates].sort(function compareFallback(a, b) {
    const aActivity = threadActivityMap.get(a.id) ?? 0;
    const bActivity = threadActivityMap.get(b.id) ?? 0;

    if (bActivity !== aActivity) return bActivity - aActivity;

    const scoreDiff =
      getParticipantRatioScore(b.participantCount, b.capacity) -
      getParticipantRatioScore(a.participantCount, a.capacity);

    if (scoreDiff !== 0) return scoreDiff;

    return (
      getStableWeight(currentMeetingId, a.id) -
      getStableWeight(currentMeetingId, b.id)
    );
  });
}

// 같은 타입 2개, 다른 타입 2개를 우선 추천합니다.
// 같은 타입은 참가율, 다른 타입은 활동도(스레드 댓글 수) + 참가율 기준으로 정렬하고,
// 부족한 경우 남은 후보로 최대 4개까지 보충합니다.
function selectRecommendedMeetings({
  currentMeeting,
  candidates,
  threadActivityMap,
}: {
  currentMeeting: MeetingDetailApiData;
  candidates: MeetingResponse[];
  threadActivityMap: Map<number, number>;
}) {
  const filteredCandidates: MeetingResponse[] = [];

  for (const candidate of candidates) {
    if (isRecommendableMeeting(candidate, currentMeeting.id)) {
      filteredCandidates.push(candidate);
    }
  }

  const sameTypePool: MeetingResponse[] = [];
  const otherTypePool: MeetingResponse[] = [];

  for (const candidate of filteredCandidates) {
    if (candidate.type === currentMeeting.type) {
      sameTypePool.push(candidate);
      continue;
    }

    otherTypePool.push(candidate);
  }

  const sameTypeCandidates = sortSameTypeCandidates(
    currentMeeting.id,
    sameTypePool,
  );
  const otherTypeCandidates = sortOtherTypeCandidates(
    currentMeeting.id,
    otherTypePool,
    threadActivityMap,
  );

  // 우선 같은 타입 2개, 다른 타입 2개를 먼저 선별합니다.
  const pickedSameType = sameTypeCandidates.slice(0, 2);
  const pickedOtherType = otherTypeCandidates.slice(0, 2);

  const selectedIds = new Set<number>();

  for (const candidate of pickedSameType) {
    selectedIds.add(candidate.id);
  }

  for (const candidate of pickedOtherType) {
    selectedIds.add(candidate.id);
  }

  const remainingCandidates: MeetingResponse[] = [];

  for (const candidate of filteredCandidates) {
    if (!selectedIds.has(candidate.id)) {
      remainingCandidates.push(candidate);
    }
  }

  // 타입별 추천으로 4개를 못 채우면, 남은 후보 중 활동도와 참가율이 높은 순으로 보충합니다.
  const fallbackCandidates = sortFallbackCandidates(
    currentMeeting.id,
    remainingCandidates,
    threadActivityMap,
  );

  const mergedCandidates = [
    ...pickedSameType,
    ...pickedOtherType,
    ...fallbackCandidates,
  ].slice(0, 4);

  const recommendations: RecommendedMeetingItem[] = [];

  for (const candidate of mergedCandidates) {
    recommendations.push(toRecommendedMeetingItem(candidate));
  }

  return recommendations;
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const meetingId = Number(id);

  if (!Number.isFinite(meetingId)) {
    return NextResponse.json(
      { message: "Invalid meeting id" },
      { status: 400 },
    );
  }

  try {
    const [currentMeeting, meetingCandidates, threadActivityMap] =
      await Promise.all([
        getMeetingDetail(meetingId),
        getMeetingCandidates(),
        getThreadActivityMap(),
      ]);

    const recommendations = selectRecommendedMeetings({
      currentMeeting,
      candidates: meetingCandidates,
      threadActivityMap,
    });

    return NextResponse.json({
      data: recommendations,
    });
  } catch {
    return NextResponse.json(
      { message: "Failed to load meeting recommendations" },
      { status: 500 },
    );
  }
}

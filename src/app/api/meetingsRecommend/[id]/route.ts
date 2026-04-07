import { NextResponse } from "next/server";
import { serverAxios } from "@/lib/serverFetcher";
import type {
  GetMeetingsResponse,
  GetPostsResponse,
  MeetingBaseData,
  RecommendedMeetingItem,
} from "@/types";

const THREAD_KEYWORD = "isThread_";
const MEETING_PAGE_SIZE = 50;
const MEETING_MAX_COUNT = 100;
const THREAD_PAGE_SIZE = 100;
const THREAD_MAX_COUNT = 300;

// 현재 모임, 취소된 모임, 정원이 다 찬 모임은 추천 대상에서 제외합니다.
function isRecommendableMeeting(
  candidate: MeetingBaseData,
  currentMeetingId: number,
) {
  if (candidate.id === currentMeetingId) return false;
  if (candidate.canceledAt) return false;
  if (candidate.participantCount >= candidate.capacity) return false;
  return true;
}

// 정원 대비 참가율이 적당히 찬 모임을 우선 추천하기 위한 점수입니다.
// 50~70% 구간을 가장 높은 점수로 보고, 그 주변 구간에 보조 점수를 줍니다.
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

// 참가율, 활동도 점수가 같을 때 추천 결과가 매번 완전히 바뀌지 않도록
// 현재 모임 id와 후보 모임 id를 섞어서 고정된 비교값을 만듭니다.
function getStableWeight(currentMeetingId: number, candidateId: number) {
  return (candidateId * 31 + currentMeetingId * 17) % 997;
}

// 같은 타입 / 다른 타입 / fallback 정렬을 하나의 비교 함수로 처리합니다.
// 같은 타입은 참가율 위주, 다른 타입과 fallback은 활동도 + 참가율 위주로 비교합니다.
function compareMeetingCandidate(
  targetA: MeetingBaseData,
  targetB: MeetingBaseData,
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

// 추천 후보군을 넉넉히 확보하기 위해 meetings 목록을 cursor 기반으로 여러 번 조회합니다.
// participantCount 내림차순으로 가져와 인기 있는 모임을 우선 후보로 모읍니다.
async function getMeetingCandidateList() {
  let cursor: string | undefined;
  const meetingCandidateList: MeetingBaseData[] = [];

  while (meetingCandidateList.length < MEETING_MAX_COUNT) {
    const response = await serverAxios.get<GetMeetingsResponse>("/meetings", {
      params: {
        sortBy: "participantCount",
        sortOrder: "desc",
        size: MEETING_PAGE_SIZE,
        ...(cursor ? { cursor } : {}),
      },
    });

    for (const meeting of response.data.data) {
      meetingCandidateList.push(meeting);
    }

    if (!response.data.hasMore || !response.data.nextCursor) {
      break;
    }

    cursor = response.data.nextCursor;
  }

  return meetingCandidateList.slice(0, MEETING_MAX_COUNT);
}

// 다른 타입 추천에서 활동도 기준을 쓰기 위해 스레드 댓글 수를 모임별로 수집합니다.
// isThread_{meetingId} 제목 규칙을 가진 post를 찾아 meetingId -> 댓글 수 맵으로 만듭니다.
async function getThreadActivityMap() {
  let cursor: string | undefined;
  const threadPostList: GetPostsResponse["data"] = [];

  while (threadPostList.length < THREAD_MAX_COUNT) {
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

    for (const post of response.data.data) {
      threadPostList.push(post);
    }

    if (!response.data.hasMore || !response.data.nextCursor) {
      break;
    }

    cursor = response.data.nextCursor;
  }

  const threadActivityMap = new Map<number, number>();

  for (const post of threadPostList.slice(0, THREAD_MAX_COUNT)) {
    if (!post.title.startsWith(THREAD_KEYWORD)) continue;

    const meetingId = Number(post.title.replace(THREAD_KEYWORD, ""));
    if (!Number.isFinite(meetingId)) continue;

    threadActivityMap.set(meetingId, post._count.comments);
  }

  return threadActivityMap;
}

// 추천 API 응답에서 바로 내려줄 카드 형태로 변환합니다.
function toRecommendedMeetingItem(
  meeting: MeetingBaseData,
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

// 추천 전체 흐름:
// 1. 추천 가능 후보만 남김
// 2. 같은 타입 / 다른 타입 후보를 분리
// 3. 같은 타입 2개, 다른 타입 2개를 우선 선별
// 4. 부족하면 각 타입의 다음 순번 후보(3, 4등)로 최대 4개까지 보충
function selectRecommendedMeetingList({
  currentMeetingId,
  currentMeetingType,
  meetingCandidateList,
  threadActivityMap,
}: {
  currentMeetingId: number;
  currentMeetingType: string;
  meetingCandidateList: MeetingBaseData[];
  threadActivityMap: Map<number, number>;
}) {
  const filteredCandidateList: MeetingBaseData[] = [];

  for (const meeting of meetingCandidateList) {
    if (isRecommendableMeeting(meeting, currentMeetingId)) {
      filteredCandidateList.push(meeting);
    }
  }

  const sameTypeCandidateList: MeetingBaseData[] = [];
  const otherTypeCandidateList: MeetingBaseData[] = [];

  for (const candidate of filteredCandidateList) {
    if (candidate.type === currentMeetingType) {
      sameTypeCandidateList.push(candidate);
      continue;
    }

    otherTypeCandidateList.push(candidate);
  }

  sameTypeCandidateList.sort((targetA, targetB) =>
    compareMeetingCandidate(
      targetA,
      targetB,
      currentMeetingId,
      threadActivityMap,
      "sameType",
    ),
  );
  otherTypeCandidateList.sort((targetA, targetB) =>
    compareMeetingCandidate(
      targetA,
      targetB,
      currentMeetingId,
      threadActivityMap,
      "otherType",
    ),
  );

  // 우선 같은 타입 2개, 다른 타입 2개를 먼저 선별합니다.
  const prioritizedSameTypeCandidateList = sameTypeCandidateList.slice(0, 4);
  const prioritizedOtherTypeCandidateList = otherTypeCandidateList.slice(0, 4);

  const recommendedMeetingList: RecommendedMeetingItem[] = [];
  const selectedMeetingIdSet = new Set<number>();

  function pushCandidate(candidate?: MeetingBaseData) {
    if (!candidate) return;
    if (selectedMeetingIdSet.has(candidate.id)) return;
    if (recommendedMeetingList.length >= 4) return;

    selectedMeetingIdSet.add(candidate.id);
    recommendedMeetingList.push(toRecommendedMeetingItem(candidate));
  }

  // 우선 same 2개, other 2개를 먼저 채웁니다.
  pushCandidate(prioritizedSameTypeCandidateList[0]);
  pushCandidate(prioritizedSameTypeCandidateList[1]);
  pushCandidate(prioritizedOtherTypeCandidateList[0]);
  pushCandidate(prioritizedOtherTypeCandidateList[1]);

  // 부족하면 same / other의 3, 4등 후보로 보충합니다.
  pushCandidate(prioritizedSameTypeCandidateList[2]);
  pushCandidate(prioritizedSameTypeCandidateList[3]);
  pushCandidate(prioritizedOtherTypeCandidateList[2]);
  pushCandidate(prioritizedOtherTypeCandidateList[3]);

  return recommendedMeetingList;
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const meetingId = Number(id);
  const { searchParams } = new URL(request.url);
  const meetingType = searchParams.get("type");

  if (!Number.isFinite(meetingId)) {
    return NextResponse.json(
      { message: "Invalid meeting id" },
      { status: 400 },
    );
  }
  if (!meetingType) {
    return NextResponse.json(
      { message: "Missing meeting type" },
      { status: 400 },
    );
  }

  try {
    // 추천 후보 목록과 스레드 활동도를 모아 최종 추천 목록을 계산합니다.

    const meetingCandidateList = await getMeetingCandidateList();
    const threadActivityMap = await getThreadActivityMap();

    // 모은 데이터를 바탕으로 최종 추천 목록 4개를 계산합니다.
    const recommendedMeetingList = selectRecommendedMeetingList({
      currentMeetingId: meetingId,
      currentMeetingType: meetingType,
      meetingCandidateList,
      threadActivityMap,
    });

    return NextResponse.json({
      data: recommendedMeetingList,
    });
  } catch {
    return NextResponse.json(
      { message: "Failed to load meeting recommendations" },
      { status: 500 },
    );
  }
}

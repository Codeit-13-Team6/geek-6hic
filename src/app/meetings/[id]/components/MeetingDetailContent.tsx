"use client";

import { useState } from "react";
import { MeetingDetailView } from "@/app/meetings/[id]/components/MeetingDetailView";

import { JoinedMeeting, User } from "@/types";
import { useMeetingDetailQueries, useMeetingDetailMutations } from "@/hooks";
import {
  MeetingDetailApiData,
  MeetingDetailData,
  MeetingListItemApiData,
  MeetingParticipant,
  RecommendedMeetingItem,
  MeetingDetailContentProps,
} from "@/types";
import { AlertCircle } from "lucide-react";

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

interface GetActionLabelProps {
  isLoggedIn: boolean;
  isHost: boolean;
  isComplete: boolean;
  isClosed: boolean;
  hasAttended: boolean;
  isJoined: boolean;
}

const getActionLabel = ({
  isLoggedIn,
  isHost,
  isComplete,
  isClosed,
  hasAttended,
  isJoined,
}: GetActionLabelProps) => {
  if (!isLoggedIn) {
    return isClosed || isComplete ? "모집 마감" : "참여하기";
  }

  if (isHost) {
    // closed = 사람 다찼따
    if (isClosed) {
      if (isComplete) {
        // complete be 에서 내려주는 값
        return hasAttended ? "출석 완료" : "출석하기";
      } else {
        return "모집 마감";
      }
    } else {
      return "공유 하기";
    }
  }

  if (isComplete) {
    if (isJoined) return hasAttended ? "출석 완료" : "출석하기";
    return "모집 마감";
  }

  if (isJoined) return "참여 취소하기";

  return "참여하기";
};

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

const getIsHost = (detail: MeetingDetailApiData, user: User | null) =>
  user?.id === detail.hostId || user?.id === detail.host.id;

const getIsJoined = ({
  detail,
  participants,
  user,
  isHost,
  isLoggedIn,
}: {
  detail: MeetingDetailApiData;
  participants: MeetingParticipant[];
  user: User | null;
  isHost: boolean;
  isLoggedIn: boolean;
}) => {
  return (
    isHost ||
    (isLoggedIn &&
      (detail.isJoined ||
        participants.some((participant) => participant.userId === user?.id)))
  );
};

const getIsLoggedIn = ({ user }: { user: User | null }) => Boolean(user);

export const toMeetingDetailViewModel = ({
  detail,
  participants,
  recommendationCandidates,
  currentTimestamp,
  user,
  isAuthLoading,
  hasAttended,
}: {
  detail: MeetingDetailApiData;
  participants: MeetingParticipant[];
  recommendationCandidates: MeetingListItemApiData[];
  currentTimestamp: number;
  user: User | null;
  isAuthLoading: boolean;
  hasAttended: boolean;
}) => {
  const isHost = getIsHost(detail, user);
  const isLoggedIn = getIsLoggedIn({ user });
  const isJoined = getIsJoined({
    detail,
    participants,
    user,
    isHost,
    isLoggedIn,
  });

  const recommendedMeetings = getRecommendedMeetings({
    currentMeeting: detail,
    candidates: recommendationCandidates,
    currentTimestamp,
  });

  const data: MeetingDetailData = {
    id: detail.id,
    teamId: detail.teamId,
    name: detail.name,
    type: detail.type,
    region: detail.region,
    address: detail.address,
    link: detail.address,
    latitude: detail.latitude,
    longitude: detail.longitude,
    dateTime: detail.dateTime,
    registrationEnd: detail.registrationEnd,
    capacity: detail.capacity,
    participantCount: detail.participantCount,
    image: detail.image,
    description: detail.description,
    canceledAt: detail.canceledAt,
    confirmedAt: detail.confirmedAt,
    hostId: detail.hostId,
    createdBy: detail.createdBy,
    createdAt: detail.createdAt,
    updatedAt: detail.updatedAt,
    host: detail.host,
    isFavorited: detail.isFavorited,
    isHost,
    isJoined,
    isLoggedIn,
    threads: [],
    recommendedMeetings,
  };

  const isStarted = new Date(data.dateTime).getTime() <= currentTimestamp;

  const canViewLink = isLoggedIn && isJoined;
  const canWriteThread = isHost || (isLoggedIn && isJoined);
  const shouldShowHostMenu = isHost;

  const isComplete = detail.isCompleted;

  function isMeetingClosed(detail: MeetingDetailApiData) {
    const now = new Date();
    const isRegistrationClosed = new Date(detail.registrationEnd) < now;
    const isFull = detail.participantCount >= detail.capacity;

    return isRegistrationClosed || isFull;
  }

  const isClosed = isMeetingClosed(detail);

  const shouldShowClosedGuide =
    isLoggedIn && !isHost && !isJoined && isClosed && !isStarted;

  const actionLabel = getActionLabel({
    isLoggedIn,
    isHost,
    isComplete,
    isClosed,
    hasAttended,
    isJoined,
  });

  // console.log(isStarted, actionLabel, isHost, isClosed, " 누구새오 ");

  //
  // console.log(
  //   hasAttended,
  //   actionLabel,
  //   isAuthLoading,
  //   isStarted,
  //   hasAttended,
  //   isHost && isClosed,
  //   !isHost && isClosed && !isJoined,
  // );

  const isActionDisabled = () => {
    if (actionLabel === "모집 마감" || actionLabel === "출석 완료") return true;
    return false;
  };
  const linkGuideText = isLoggedIn
    ? "모임에 참여하면 링크를 확인할 수 있습니다."
    : "로그인 후 모임에 참여하면 링크를 확인할 수 있습니다.";
  const threadGuideText = isLoggedIn
    ? "모임에 참여하면 스레드를 작성할 수 있습니다."
    : "로그인 후 모임에 참여하면 스레드를 작성할 수 있습니다.";

  return {
    actionLabel,
    canViewLink,
    canWriteThread,
    data,
    isActionDisabled,
    linkGuideText,
    participantAvatars: participants.map((participant) => participant.user),
    shouldShowClosedGuide,
    shouldShowHostMenu,
    threadGuideText,
  };
};

export function MeetingDetailContent({
  meetingId,
  hasAttendedInitially,
}: MeetingDetailContentProps) {
  const [currentTimestamp] = useState(() => Date.now());
  const { detailQuery, participantsQuery, recommendationCandidatesQuery } =
    useMeetingDetailQueries(meetingId);
  const {
    user,
    isAuthLoading,
    hasAttended,
    joinMutation,
    cancelJoinMutation,
    favoriteMutation,
    attendMutation,
    handleJoinMeeting,
    handleCancelJoinMeeting,
    handleShareMeeting,
    handleEditMeeting,
    handleDeleteMeeting,
    handleToggleFavorite,
    handleAttendMeeting,
  } = useMeetingDetailMutations({
    meetingId,
    initialHasAttended: hasAttendedInitially,
  });

  const detail = detailQuery.data;
  const participants = participantsQuery.data?.data ?? [];
  const recommendationCandidates =
    recommendationCandidatesQuery.data?.data ?? [];

  /* 💡 로딩 상태: 아카이브 테마의 부드러운 UI */
  if (detailQuery.isLoading || !detail) {
    return (
      <div className="flex min-h-[400px] w-full flex-col items-center justify-center rounded-[32px] border border-slate-50 bg-white p-12 shadow-sm">
        <div className="bg-main-purple/10 flex size-12 animate-pulse items-center justify-center rounded-full">
          <div className="bg-main-purple size-3 rounded-full" />
        </div>
        <p className="mt-4 text-sm font-bold tracking-tight text-slate-400">
          ARCHIVE LOADING...
        </p>
      </div>
    );
  }

  if (detailQuery.isError) {
    return (
      <div className="flex min-h-[400px] w-full flex-col items-center justify-center rounded-[32px] border border-red-50 bg-red-50/30 p-12 text-center shadow-sm">
        <div className="mb-4 flex size-14 items-center justify-center rounded-full bg-red-100/50 text-red-500">
          {/* 💡 Lucide 아이콘은 size 프롭을 지원합니다 */}
          <AlertCircle size={32} strokeWidth={2.5} />
        </div>
        <p className="text-lg font-black tracking-tighter text-slate-950">
          정보를 불러올 수 없습니다.
        </p>
        <p className="mt-2 text-sm font-medium text-slate-400">
          잠시 후 다시 시도해 주세요.
        </p>
      </div>
    );
  }

  const viewModel = toMeetingDetailViewModel({
    detail,
    participants,
    recommendationCandidates,
    currentTimestamp,
    user,
    isAuthLoading,
    hasAttended,
  });
  console.log(viewModel.data, "뷰모델");

  return (
    <>
      <MeetingDetailView
        data={viewModel.data}
        participantAvatars={viewModel.participantAvatars}
        isFavoritePending={favoriteMutation.isPending}
        isJoinPending={
          joinMutation.isPending ||
          cancelJoinMutation.isPending ||
          attendMutation.isPending
        }
        isAuthLoading={isAuthLoading}
        actionLabel={viewModel.actionLabel}
        isActionDisabled={viewModel.isActionDisabled()}
        shouldShowHostMenu={viewModel.shouldShowHostMenu}
        shouldShowClosedGuide={viewModel.shouldShowClosedGuide}
        canViewLink={viewModel.canViewLink}
        canWriteThread={viewModel.canWriteThread}
        linkGuideText={viewModel.linkGuideText}
        threadGuideText={viewModel.threadGuideText}
        onJoin={handleJoinMeeting}
        onCancelJoin={handleCancelJoinMeeting}
        onAttend={() => handleAttendMeeting(detail.region)}
        onShare={handleShareMeeting}
        onEdit={handleEditMeeting}
        onDelete={handleDeleteMeeting}
        onToggleFavorite={() =>
          handleToggleFavorite(viewModel.data.isFavorited)
        }
      />
    </>
  );
}

"use client";

import { AlertCircle } from "lucide-react";
import { MeetingDetailView } from "@/app/meetings/[id]/components/MeetingDetailView";
import { useMeetingDetailMutations, useMeetingDetailQueries } from "@/hooks";
import type {
  MeetingActionState,
  MeetingDetailApiData,
  MeetingDetailContentProps,
  MeetingDetailData,
  MeetingParticipant,
  User,
} from "@/types";

const getActionState = ({
  isLoggedIn,
  isParticipant,
  hasAttended,
}: {
  isLoggedIn: boolean;
  isParticipant: boolean;
  hasAttended: boolean;
}): MeetingActionState => {
  if (!isLoggedIn) return "guest_join";
  if (!isParticipant) return "joinable";
  if (hasAttended) return "attendance_done";
  return "attendance_ready";
};

const getActionUI = ({
  actionState,
  isCapacityFull,
}: {
  actionState: MeetingActionState;
  isCapacityFull: boolean;
}) => {
  switch (actionState) {
    case "guest_join":
      return { label: "참여하기", disabled: false };
    case "joinable":
      return { label: "참여하기", disabled: isCapacityFull };
    case "attendance_done":
      return { label: "출석완료", disabled: true };
    case "attendance_ready":
      return { label: "출석하기", disabled: false };
  }
};

const getIsHost = (detail: MeetingDetailApiData, user: User | null) =>
  user?.id === detail.hostId || user?.id === detail.host?.id;

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

export const toMeetingDetailViewModel = ({
  detail,
  participants,
  user,
  hasAttended,
}: {
  detail: MeetingDetailApiData;
  participants: MeetingParticipant[];
  user: User | null;
  hasAttended: boolean;
}) => {
  const isHost = getIsHost(detail, user);
  const isLoggedIn = Boolean(user);
  const isJoined = getIsJoined({
    detail,
    participants,
    user,
    isHost,
    isLoggedIn,
  });
  const isParticipant = isHost || isJoined;
  const isCapacityFull = detail.participantCount >= detail.capacity;
  const actionState = getActionState({
    isLoggedIn,
    isParticipant,
    hasAttended,
  });
  const actionUI = getActionUI({
    actionState,
    isCapacityFull,
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
  };

  const canViewLink = isLoggedIn && isParticipant;
  const canWriteThread = isLoggedIn && isParticipant;
  const shouldShowShareButton = isLoggedIn && isParticipant;
  const shouldShowHostMenu = isHost;
  const shouldShowParticipantMenu = isJoined && !isHost;
  const linkGuideText = isLoggedIn
    ? "모임에 참여하면 링크를 확인할 수 있어요."
    : "로그인 후 모임에 참여하면 링크를 확인할 수 있어요.";
  const threadGuideText = isLoggedIn
    ? "모임에 참여하면 스레드를 작성할 수 있어요."
    : "로그인 후 모임에 참여하면 스레드를 작성할 수 있어요.";

  return {
    actionState,
    actionLabel: actionUI.label,
    canViewLink,
    canWriteThread,
    data,
    isActionDisabled: actionUI.disabled,
    linkGuideText,
    participantAvatars: participants.map((participant) => participant.user),
    shouldShowShareButton,
    shouldShowHostMenu,
    shouldShowParticipantMenu,
    threadGuideText,
  };
};

export function MeetingDetailContent({
  meetingId,
  hasAttendedInitially,
}: MeetingDetailContentProps) {
  const { detailQuery, participantsQuery } = useMeetingDetailQueries(meetingId);

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
    user,
    hasAttended,
  });

  return (
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
      actionState={viewModel.actionState}
      actionLabel={viewModel.actionLabel}
      isActionDisabled={viewModel.isActionDisabled}
      shouldShowShareButton={viewModel.shouldShowShareButton}
      shouldShowHostMenu={viewModel.shouldShowHostMenu}
      shouldShowParticipantMenu={viewModel.shouldShowParticipantMenu}
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
      onToggleFavorite={() => handleToggleFavorite(viewModel.data.isFavorited)}
    />
  );
}

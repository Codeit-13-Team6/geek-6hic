"use client";

import { useState } from "react";
import { MeetingDetailView } from "@/app/meetings/[meetingId]/components/MeetingDetailView";
import { useMeetingDetailMutations } from "@/app/meetings/[meetingId]/hooks/useMeetingDetailMutations";
import { useMeetingDetailQueries } from "@/app/meetings/[meetingId]/hooks/useMeetingDetailQueries";
import { toMeetingDetailViewModel } from "@/app/meetings/[meetingId]/model/meeting-detail.selectors";

interface MeetingDetailContentProps {
  meetingId: number;
  hasAttendedInitially: boolean;
}

export function MeetingDetailContent({
  meetingId,
  hasAttendedInitially,
}: MeetingDetailContentProps) {
  const [currentTimestamp] = useState(() => Date.now());
  const {
    detailQuery,
    participantsQuery,
    recommendationCandidatesQuery,
  } = useMeetingDetailQueries(meetingId);
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

  if (detailQuery.isLoading || !detail) {
    return (
      <div className="rounded-[24px] border border-gray-100 bg-white px-6 py-10 text-center text-sm text-gray-500 shadow-sm">
        모임 정보를 불러오는 중입니다.
      </div>
    );
  }

  if (detailQuery.isError) {
    return (
      <div className="rounded-[24px] border border-red-100 bg-red-50 px-6 py-10 text-center text-sm text-red-600 shadow-sm">
        모임 정보를 불러오지 못했습니다. 잠시 후 다시 시도해 주세요.
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
      actionLabel={viewModel.actionLabel}
      isActionDisabled={viewModel.isActionDisabled}
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
      onToggleFavorite={() => handleToggleFavorite(viewModel.data.isFavorited)}
    />
  );
}

"use client";

import type {
  MeetingDetailData,
  MeetingParticipantUser,
} from "@/app/meetings/[id]/types";
import { MeetingDescriptionSection } from "@/app/meetings/[id]/components/MeetingDescriptionSection";
import { MeetingHeaderSection } from "@/app/meetings/[id]/components/MeetingHeaderSection";
import { MeetingLinkSection } from "@/app/meetings/[id]/components/MeetingLinkSection";
import { RecommendedMeetingsSection } from "@/app/meetings/[id]/components/RecommendedMeetingsSection";
import { MeetingThreadSection } from "@/app/meetings/[id]/components/MeetingThreadSection";

interface MeetingDetailViewProps {
  data: MeetingDetailData;
  participantAvatars: MeetingParticipantUser[];
  isFavoritePending: boolean;
  isJoinPending: boolean;
  isAuthLoading: boolean;
  actionLabel: string;
  isActionDisabled: boolean;
  shouldShowHostMenu: boolean;
  shouldShowClosedGuide: boolean;
  canViewLink: boolean;
  canWriteThread: boolean;
  linkGuideText: string;
  threadGuideText: string;
  onJoin: () => Promise<void> | void;
  onCancelJoin: () => Promise<void> | void;
  onAttend: () => Promise<void> | void;
  onShare: () => Promise<void> | void;
  onEdit: (nextValues: Partial<MeetingDetailData>) => void;
  onDelete: () => void;
  onToggleFavorite: () => void;
}

export function MeetingDetailView({
  data,
  participantAvatars,
  isFavoritePending,
  isJoinPending,
  isAuthLoading,
  actionLabel,
  isActionDisabled,
  shouldShowHostMenu,
  shouldShowClosedGuide,
  canViewLink,
  canWriteThread,
  linkGuideText,
  threadGuideText,
  onJoin,
  onCancelJoin,
  onAttend,
  onShare,
  onEdit,
  onDelete,
  onToggleFavorite,
}: MeetingDetailViewProps) {
  return (
    <div className="flex w-full flex-col gap-10 sm:gap-12 lg:gap-16">
      <MeetingHeaderSection
        data={data}
        participantAvatars={participantAvatars}
        isFavoritePending={isFavoritePending}
        isJoinPending={isJoinPending}
        isAuthLoading={isAuthLoading}
        actionLabel={actionLabel}
        isActionDisabled={isActionDisabled}
        shouldShowHostMenu={shouldShowHostMenu}
        shouldShowClosedGuide={shouldShowClosedGuide}
        onJoin={onJoin}
        onCancelJoin={onCancelJoin}
        onAttend={onAttend}
        onShare={onShare}
        onEdit={onEdit}
        onDelete={onDelete}
        onToggleFavorite={onToggleFavorite}
      />
      <MeetingDescriptionSection data={data} />
      <MeetingLinkSection
        link={data.link}
        canViewLink={canViewLink}
        guideText={linkGuideText}
      />
      <MeetingThreadSection
        meetingId={data.id}
        canWriteThread={canWriteThread}
        guideText={threadGuideText}
      />
      <RecommendedMeetingsSection data={data} />
    </div>
  );
}

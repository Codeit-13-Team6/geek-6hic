"use client";

import { useState } from "react";

import { MeetingDescriptionSection } from "@/app/meetings/[meetingId]/components/MeetingDescriptionSection";
import { MeetingHeaderSection } from "@/app/meetings/[meetingId]/components/MeetingHeaderSection";
import { MeetingLinkSection } from "@/app/meetings/[meetingId]/components/MeetingLinkSection";
import { RecommendedMeetingsSection } from "@/app/meetings/[meetingId]/components/RecommendedMeetingsSection";
import { MeetingThreadSection } from "@/app/meetings/[meetingId]/components/MeetingThreadSection";
import { MeetingDetailData } from "@/app/meetings/[meetingId]/types";

interface MeetingDetailContentProps {
  initialData: MeetingDetailData;
  currentTimestamp: number;
}

export function MeetingDetailContent({
  initialData,
  currentTimestamp,
}: MeetingDetailContentProps) {
  const [data, setData] = useState(initialData);
  const [isFavoritePending] = useState(false);
  const [hasAttended, setHasAttended] = useState(false);

  const isLoggedIn = data.isLoggedIn;
  const isHost = data.isHost;
  const isJoined = data.isJoined;
  const isStarted = new Date(data.dateTime).getTime() <= currentTimestamp;
  const isClosed =
    new Date(data.registrationEnd).getTime() < currentTimestamp ||
    data.participantCount >= data.capacity;

  // 상세 화면에서 공통으로 쓰는 권한과 상태값을 여기서 한 번만 계산한다.
  const canViewLink = isHost || (isLoggedIn && isJoined);
  const canWriteThread = isHost || (isLoggedIn && isJoined);
  const shouldShowHostMenu = isHost;
  const shouldShowClosedGuide =
    isLoggedIn && !isHost && !isJoined && isClosed && !isStarted;
  let actionLabel = "참여하기";

  if (isStarted) {
    actionLabel = hasAttended ? "출석 완료" : "출석하기";
  } else if (isHost) {
    actionLabel = "공유하기";
  } else if (isJoined) {
    actionLabel = "참여 취소하기";
  }

  const isActionDisabled = isStarted
    ? hasAttended
    : !isHost && isClosed && !isJoined;
  const linkGuideText = isLoggedIn
    ? "모임에 참여하면 링크를 확인할 수 있습니다."
    : "로그인 후 모임에 참여하면 링크를 확인할 수 있습니다.";
  const threadGuideText = isLoggedIn
    ? "모임에 참여하면 스레드를 작성할 수 있습니다."
    : "로그인 후 모임에 참여하면 스레드를 작성할 수 있습니다.";

  const handleJoinMeeting = () => {
    setData((prev) => ({
      ...prev,
      isJoined: true,
      participantCount: Math.min(prev.capacity, prev.participantCount + 1),
    }));
  };

  const handleCancelJoinMeeting = () => {
    setData((prev) => ({
      ...prev,
      isJoined: false,
      participantCount: Math.max(0, prev.participantCount - 1),
    }));
  };

  // 수정은 서버 호출 대신 현재 mock 상태만 갱신한다.
  const handleEditMeeting = (nextValues: Partial<MeetingDetailData>) => {
    setData((prev) => ({
      ...prev,
      ...nextValues,
    }));
  };

  const handleDeleteMeeting = () => {
    // 삭제 기능은 아직 mock 단계라 비워 둔다.
  };

  const handleToggleFavorite = () => {
    const isNextFavorited = !data.isFavorited;

    // 찜도 서버 대신 로컬 상태만 반영한다.
    setData((prev) => ({
      ...prev,
      isFavorited: isNextFavorited,
    }));
  };

  const handleAttendMeeting = () => {
    setHasAttended(true);
  };

  return (
    <div className="flex w-full flex-col gap-10 md:gap-12 xl:gap-16">
      <MeetingHeaderSection
        data={data}
        isFavoritePending={isFavoritePending}
        actionLabel={actionLabel}
        isActionDisabled={isActionDisabled}
        shouldShowHostMenu={shouldShowHostMenu}
        shouldShowClosedGuide={shouldShowClosedGuide}
        onJoin={handleJoinMeeting}
        onCancelJoin={handleCancelJoinMeeting}
        onAttend={handleAttendMeeting}
        onEdit={handleEditMeeting}
        onDelete={handleDeleteMeeting}
        onToggleFavorite={handleToggleFavorite}
      />
      <MeetingDescriptionSection data={data} />
      <MeetingLinkSection
        link={data.link}
        canViewLink={canViewLink}
        guideText={linkGuideText}
      />
      <MeetingThreadSection
        threads={data.threads}
        canWriteThread={canWriteThread}
        guideText={threadGuideText}
      />
      <RecommendedMeetingsSection data={data} />
    </div>
  );
}

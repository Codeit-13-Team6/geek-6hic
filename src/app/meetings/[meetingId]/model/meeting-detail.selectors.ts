import type { User } from "@/types";
import type {
  MeetingDetailApiData,
  MeetingDetailData,
  MeetingListItemApiData,
  MeetingParticipant,
} from "@/app/meetings/[meetingId]/types";
import { getRecommendedMeetings } from "@/app/meetings/[meetingId]/model/meeting-detail.recommend";

const getIsHost = (detail: MeetingDetailApiData, user: User | null) =>
  user?.id === detail.hostId || user?.id === detail.host.id;

const getIsJoined = ({
  detail,
  participants,
  user,
  isHost,
}: {
  detail: MeetingDetailApiData;
  participants: MeetingParticipant[];
  user: User | null;
  isHost: boolean;
}) =>
  detail.isJoined ||
  isHost ||
  (user ? participants.some((participant) => participant.userId === user.id) : false);

const getIsLoggedIn = ({
  user,
  detail,
  isHost,
}: {
  user: User | null;
  detail: MeetingDetailApiData;
  isHost: boolean;
}) => Boolean(user) || detail.isJoined || detail.isFavorited || isHost;

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
  const isJoined = getIsJoined({ detail, participants, user, isHost });
  const isLoggedIn = getIsLoggedIn({ user, detail, isHost });
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
  const isClosed =
    Boolean(data.canceledAt) ||
    new Date(data.registrationEnd).getTime() < currentTimestamp ||
    data.participantCount >= data.capacity;
  const canViewLink = isHost || (isLoggedIn && isJoined);
  const canWriteThread = isHost || (isLoggedIn && isJoined);
  const shouldShowHostMenu = isHost;
  const shouldShowClosedGuide =
    isLoggedIn && !isHost && !isJoined && isClosed && !isStarted;

  let actionLabel = "참여하기";

  if (isStarted) {
    actionLabel = hasAttended ? "출석 완료" : "출석하기";
  } else if (isHost && isClosed) {
    actionLabel = "모집 마감";
  } else if (isHost) {
    actionLabel = "공유하기";
  } else if (isJoined) {
    actionLabel = "참여 취소하기";
  }

  const isActionDisabled =
    isAuthLoading ||
    (isStarted
      ? hasAttended
      : (isHost && isClosed) || (!isHost && isClosed && !isJoined));
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

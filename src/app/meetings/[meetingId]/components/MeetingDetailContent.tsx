"use client";

import { useState } from "react";
import type { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { MeetingDescriptionSection } from "@/app/meetings/[meetingId]/components/MeetingDescriptionSection";
import { MeetingHeaderSection } from "@/app/meetings/[meetingId]/components/MeetingHeaderSection";
import { MeetingLinkSection } from "@/app/meetings/[meetingId]/components/MeetingLinkSection";
import { RecommendedMeetingsSection } from "@/app/meetings/[meetingId]/components/RecommendedMeetingsSection";
import { MeetingThreadSection } from "@/app/meetings/[meetingId]/components/MeetingThreadSection";
import {
  MeetingActionErrorResponse,
  MeetingDetailApiData,
  MeetingDetailData,
  MeetingJoinResponse,
  MeetingListItemApiData,
  MeetingListResponse,
  MeetingParticipantsResponse,
  RecommendedMeetingItem,
} from "@/app/meetings/[meetingId]/types";
import { createComment } from "@/api/comments";
import { ToastCommon } from "@/components/ui/ToastCommon";
import axiosInstance from "@/lib/client-fetcher";
import { useAuthStore } from "@/store/useAuthStore";

const PARTICIPANTS_PAGE_SIZE = 100;
const RECOMMENDED_MEETINGS_PAGE_SIZE = 100;

const getMeetingDetailQueryKey = (meetingId: number) =>
  ["meeting-detail", meetingId] as const;

const getMeetingParticipantsQueryKey = (meetingId: number) =>
  ["meeting-participants", meetingId] as const;

const getMeetingRecommendationCandidatesQueryKey = (meetingId: number) =>
  ["meeting-recommendation-candidates", meetingId] as const;

const getAttendancePostId = (region: string) => {
  const postId = Number(region);

  return Number.isFinite(postId) && postId > 0 ? postId : null;
};

async function fetchMeetingDetail(meetingId: number) {
  const { data } = await axiosInstance.get<MeetingDetailApiData>(
    `/meetings/${meetingId}`,
  );

  return data;
}

async function fetchMeetingParticipants(meetingId: number) {
  const { data } = await axiosInstance.get<MeetingParticipantsResponse>(
    `/meetings/${meetingId}/participants`,
    {
      params: {
        size: PARTICIPANTS_PAGE_SIZE,
      },
    },
  );

  return data;
}

async function fetchMeetingRecommendationCandidates() {
  const { data } = await axiosInstance.get<MeetingListResponse>("/meetings", {
    params: {
      sortBy: "dateTime",
      sortOrder: "asc",
      size: RECOMMENDED_MEETINGS_PAGE_SIZE,
    },
  });

  return data;
}

async function joinMeeting(meetingId: number) {
  const { data } = await axiosInstance.post<MeetingJoinResponse>(
    `/meetings/${meetingId}/join`,
  );

  return data;
}

async function cancelMeetingJoin(meetingId: number) {
  const { data } = await axiosInstance.delete<MeetingJoinResponse>(
    `/meetings/${meetingId}/join`,
  );

  return data;
}

async function addMeetingFavorite(meetingId: number) {
  await axiosInstance.post(`/meetings/${meetingId}/favorites`);
}

async function removeMeetingFavorite(meetingId: number) {
  await axiosInstance.delete(`/meetings/${meetingId}/favorites`);
}

async function updateMeeting(
  meetingId: number,
  nextValues: Partial<MeetingDetailData>,
) {
  const { data } = await axiosInstance.patch<MeetingDetailApiData>(
    `/meetings/${meetingId}`,
    {
      name: nextValues.name,
      type: nextValues.type,
      region: nextValues.region,
      address: nextValues.link ?? nextValues.address,
      latitude: nextValues.latitude ?? 0,
      longitude: nextValues.longitude ?? 0,
      dateTime: nextValues.dateTime,
      registrationEnd: nextValues.registrationEnd,
      capacity: nextValues.capacity,
      image: nextValues.image,
      description: nextValues.description,
    },
  );

  return data;
}

async function deleteMeeting(meetingId: number) {
  await axiosInstance.delete(`/meetings/${meetingId}`);
}

const getJoinErrorMessage = (code?: string) => {
  switch (code) {
    case "CANCELED":
      return "취소된 모임은 참여할 수 없어요.";
    case "REGISTRATION_CLOSED":
      return "모집이 마감된 모임이에요.";
    case "CAPACITY_FULL":
      return "정원이 가득 찬 모임이에요.";
    case "ALREADY_JOINED":
      return "이미 참여한 모임이에요.";
    case "NOT_FOUND":
      return "존재하지 않는 모임이에요.";
    case "REFRESH_FAILED":
      return "로그인 후 참여할 수 있어요.";
    default:
      return "참여 처리 중 문제가 발생했어요.";
  }
};

const getCancelJoinErrorMessage = (code?: string) => {
  switch (code) {
    case "NOT_FOUND":
      return "존재하지 않는 모임이에요.";
    case "REFRESH_FAILED":
      return "로그인 후 참여 취소를 할 수 있어요.";
    default:
      return "참여 취소 처리 중 문제가 발생했어요.";
  }
};

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

const getRecommendedMeetings = ({
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

interface MeetingDetailContentProps {
  meetingId: number;
  initialHasAttended: boolean;
}

export function MeetingDetailContent({
  meetingId,
  initialHasAttended,
}: MeetingDetailContentProps) {
  const queryClient = useQueryClient();
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const isAuthLoading = useAuthStore((state) => state.isAuthLoading);
  const [currentTimestamp] = useState(() => Date.now());
  const [hasAttended, setHasAttended] = useState(initialHasAttended);

  const detailQuery = useQuery({
    queryKey: getMeetingDetailQueryKey(meetingId),
    queryFn: () => fetchMeetingDetail(meetingId),
  });

  const participantsQuery = useQuery({
    queryKey: getMeetingParticipantsQueryKey(meetingId),
    queryFn: () => fetchMeetingParticipants(meetingId),
  });

  const recommendationCandidatesQuery = useQuery({
    queryKey: getMeetingRecommendationCandidatesQueryKey(meetingId),
    queryFn: () => fetchMeetingRecommendationCandidates(),
  });

  const joinMutation = useMutation({
    mutationFn: () => joinMeeting(meetingId),
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: getMeetingDetailQueryKey(meetingId),
        }),
        queryClient.invalidateQueries({
          queryKey: getMeetingParticipantsQueryKey(meetingId),
        }),
      ]);

      ToastCommon({ message: "모임에 참여했어요.", size: "sm" });
    },
    onError: (error: AxiosError<MeetingActionErrorResponse>) => {
      ToastCommon({
        message: getJoinErrorMessage(error.response?.data?.code),
        size: "sm",
      });
    },
  });

  const cancelJoinMutation = useMutation({
    mutationFn: () => cancelMeetingJoin(meetingId),
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: getMeetingDetailQueryKey(meetingId),
        }),
        queryClient.invalidateQueries({
          queryKey: getMeetingParticipantsQueryKey(meetingId),
        }),
      ]);

      ToastCommon({ message: "참여를 취소했어요.", size: "sm" });
    },
    onError: (error: AxiosError<MeetingActionErrorResponse>) => {
      ToastCommon({
        message: getCancelJoinErrorMessage(error.response?.data?.code),
        size: "sm",
      });
    },
  });

  const favoriteMutation = useMutation({
    mutationFn: (isFavorited: boolean) =>
      isFavorited
        ? removeMeetingFavorite(meetingId)
        : addMeetingFavorite(meetingId),
    onMutate: async (isFavorited) => {
      await queryClient.cancelQueries({
        queryKey: getMeetingDetailQueryKey(meetingId),
      });

      const previousDetail = queryClient.getQueryData<MeetingDetailApiData>(
        getMeetingDetailQueryKey(meetingId),
      );

      queryClient.setQueryData<MeetingDetailApiData>(
        getMeetingDetailQueryKey(meetingId),
        (previous) => {
          if (!previous) {
            return previous;
          }

          return {
            ...previous,
            isFavorited: !isFavorited,
          };
        },
      );

      return { previousDetail };
    },
    onError: (
      _error,
      _isFavorited,
      context: { previousDetail?: MeetingDetailApiData } | undefined,
    ) => {
      if (context?.previousDetail) {
        queryClient.setQueryData(
          getMeetingDetailQueryKey(meetingId),
          context.previousDetail,
        );
      }

      ToastCommon({
        message: "찜하기 처리 중 문제가 발생했어요.",
        size: "sm",
      });
    },
    onSettled: async () => {
      await queryClient.invalidateQueries({
        queryKey: getMeetingDetailQueryKey(meetingId),
      });
    },
  });

  const updateMeetingMutation = useMutation({
    mutationFn: (nextValues: Partial<MeetingDetailData>) =>
      updateMeeting(meetingId, nextValues),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: getMeetingDetailQueryKey(meetingId),
      });

      ToastCommon({ message: "모임 수정이 반영되었습니다.", size: "sm" });
    },
    onError: (error: AxiosError<MeetingActionErrorResponse>) => {
      ToastCommon({
        message:
          error.response?.data?.message ?? "모임 수정 중 문제가 발생했어요.",
        size: "sm",
      });
    },
  });

  const deleteMeetingMutation = useMutation({
    mutationFn: () => deleteMeeting(meetingId),
    onSuccess: () => {
      ToastCommon({ message: "모임이 삭제되었어요.", size: "sm" });
      router.push("/meetings");
      router.refresh();
    },
    onError: (error: AxiosError<MeetingActionErrorResponse>) => {
      ToastCommon({
        message:
          error.response?.data?.message ?? "모임 삭제 중 문제가 발생했어요.",
        size: "sm",
      });
    },
  });

  const attendMutation = useMutation({
    mutationFn: async (region: string) => {
      const postId = getAttendancePostId(region);

      if (!postId) {
        throw new Error("INVALID_ATTENDANCE_POST_ID");
      }

      await createComment(
        postId,
        `onlyScore_${region}_${Math.floor(Math.random() * 5) + 1}`,
      );
    },
    onSuccess: () => {
      setHasAttended(true);
    },
    onError: () => {
      ToastCommon({
        message: "출석 처리 중 문제가 발생했어요.",
        size: "sm",
      });
    },
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

  const isHost = user?.id === detail.hostId || user?.id === detail.host.id;
  const isJoined =
    detail.isJoined ||
    isHost ||
    (user
      ? participants.some((participant) => participant.userId === user.id)
      : false);
  const isLoggedIn =
    Boolean(user) || detail.isJoined || detail.isFavorited || isHost;
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
    threads: [], // (참고: 타입 에러 방지용으로 남겨둠. 실제로는 MeetingThreadSection 안에서 알아서 패치함!)
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
    ? "모임에 참여하면 포스트를 작성할 수 있습니다."
    : "로그인 후 모임에 참여하면 포스트를 작성할 수 있습니다.";

  const handleJoinMeeting = async () => {
    await joinMutation.mutateAsync();
  };

  const handleCancelJoinMeeting = async () => {
    await cancelJoinMutation.mutateAsync();
  };

  const handleShareMeeting = async () => {
    const meetingUrl = window.location.href;

    try {
      await navigator.clipboard.writeText(meetingUrl);
      ToastCommon({ message: "모임 링크가 복사되었어요." });
    } catch {
      ToastCommon({ message: "링크 복사에 실패했습니다." });
    }
  };

  const handleEditMeeting = async (nextValues: Partial<MeetingDetailData>) => {
    await updateMeetingMutation.mutateAsync(nextValues);
  };

  const handleDeleteMeeting = () => {
    deleteMeetingMutation.mutate();
  };

  const handleToggleFavorite = () => {
    favoriteMutation.mutate(data.isFavorited);
  };

  const handleAttendMeeting = () => {
    attendMutation.mutate(detail.region);
  };

  return (
    <div className="flex w-full flex-col gap-10 md:gap-12 xl:gap-16">
      <MeetingHeaderSection
        data={data}
        participantAvatars={participants.map((participant) => participant.user)}
        isFavoritePending={favoriteMutation.isPending}
        isJoinPending={
          joinMutation.isPending ||
          cancelJoinMutation.isPending ||
          attendMutation.isPending
        }
        isAuthLoading={isAuthLoading}
        actionLabel={actionLabel}
        isActionDisabled={isActionDisabled}
        shouldShowHostMenu={shouldShowHostMenu}
        shouldShowClosedGuide={shouldShowClosedGuide}
        onJoin={handleJoinMeeting}
        onCancelJoin={handleCancelJoinMeeting}
        onAttend={handleAttendMeeting}
        onShare={handleShareMeeting}
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
        meetingId={meetingId}
        canWriteThread={canWriteThread}
        guideText={threadGuideText}
      />

      <RecommendedMeetingsSection data={data} />
    </div>
  );
}

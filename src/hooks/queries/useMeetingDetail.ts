"use client";

import { useState } from "react";
import type { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import {
  InfiniteData,
  QueryKey,
  useMutation,
  useQuery,
  useSuspenseQuery,
  useQueryClient,
} from "@tanstack/react-query";
import {
  addMeetingFavorite,
  attendMeeting,
  cancelMeetingJoin,
  deleteMeeting,
  getMeetingDetail,
  getMeetingParticipants,
  getMeetingRecommendations,
  joinMeeting,
  removeMeetingFavorite,
  updateMeeting,
} from "@/api/client/meetingDetail";
import { Toast } from "@/components/ui/Toast";
import {
  JoinedMeeting,
  JoinedMeetingsResponse,
  MeetingActionErrorResponse,
  MeetingDetailApiData,
  MeetingDetailData,
} from "@/types";
import { deleteFavorites, updateFavorites } from "@/api/client";
import { useOptimisticMutation } from "@/hooks/useOptimisticUpdate";
import { QUERY_KEYS } from "@/constants/queryKey";

const getJoinErrorMessage = (code?: string) => {
  switch (code) {
    case "CANCELED":
      return "취소된 모임은 참여할 수 없어요.";
    case "REGISTRATION_CLOSED":
      return "모집이 마감된 모임이에요.";
    case "CAPACITY_FULL":
      return "정원이 가득 찬 모임이에요.";
    case "ALREADY_JOINED":
      return "이미 참여 중인 모임이에요.";
    case "NOT_FOUND":
      return "존재하지 않는 모임이에요.";
    case "REFRESH_FAILED":
      return "로그인 후 다시 참여해 주세요.";
    default:
      return "참여 처리 중 문제가 발생했어요.";
  }
};

const getCancelJoinErrorMessage = (code?: string) => {
  switch (code) {
    case "NOT_FOUND":
      return "존재하지 않는 모임이에요.";
    case "REFRESH_FAILED":
      return "로그인 후 다시 참여 취소해 주세요.";
    default:
      return "참여 취소 처리 중 문제가 발생했어요.";
  }
};

// 모임 상세 조회 함수 모음
export const useMeetingDetailQueries = (meetingId: number) => {
  const detailQuery = useSuspenseQuery({
    queryKey: QUERY_KEYS.meetings.detail(meetingId),
    queryFn: () => getMeetingDetail(meetingId),
  });

  const participantsQuery = useSuspenseQuery({
    queryKey: QUERY_KEYS.meetings.participants(meetingId),
    queryFn: () => getMeetingParticipants(meetingId),
  });

  return {
    detailQuery,
    participantsQuery,
  };
};

// 추천 모임 조회
export const useMeetingRecommendationsQuery = (
  meetingId: number,
  meetingType: string,
) => {
  return useQuery({
    queryKey: [...QUERY_KEYS.meetings.recommendations(meetingId), meetingType],
    queryFn: () => getMeetingRecommendations(meetingId, meetingType),
    staleTime: 1000 * 60 * 10,
  });
};

// 참여 / 탈퇴
export const useMeetingJoinMutations = (meetingId: number) => {
  const queryClient = useQueryClient();

  const joinMutation = useMutation({
    mutationFn: () => joinMeeting(meetingId),
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: QUERY_KEYS.meetings.detail(meetingId),
        }),
        queryClient.invalidateQueries({
          queryKey: QUERY_KEYS.meetings.participants(meetingId),
        }),
        queryClient.invalidateQueries({
          queryKey: QUERY_KEYS.meetings.recommendations(meetingId),
        }),
        queryClient.invalidateQueries({
          queryKey: QUERY_KEYS.meetings.list,
        }),
      ]);
      Toast({ message: "모임에 참여했어요.", type: "success" });
    },
    onError: (error: AxiosError<MeetingActionErrorResponse>) => {
      Toast({
        message: getJoinErrorMessage(error.response?.data?.code),
        type: "error",
      });
    },
  });

  const cancelJoinMutation = useMutation({
    mutationFn: () => cancelMeetingJoin(meetingId),
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: QUERY_KEYS.meetings.detail(meetingId),
        }),
        queryClient.invalidateQueries({
          queryKey: QUERY_KEYS.meetings.participants(meetingId),
        }),
        queryClient.invalidateQueries({
          queryKey: QUERY_KEYS.meetings.recommendations(meetingId),
        }),
        queryClient.invalidateQueries({
          queryKey: QUERY_KEYS.meetings.list,
        }),
        queryClient.invalidateQueries({
          queryKey: QUERY_KEYS.meetings.joined,
        }),
      ]);
      Toast({ message: "참여를 취소했어요.", type: "success" });
    },
    onError: (error: AxiosError<MeetingActionErrorResponse>) => {
      Toast({
        message: getCancelJoinErrorMessage(error.response?.data?.code),
        type: "error",
      });
    },
  });

  return {
    isJoinPending: joinMutation.isPending || cancelJoinMutation.isPending,
    handleJoinMeeting: async () => {
      await joinMutation.mutateAsync();
    },
    handleCancelJoinMeeting: async () => {
      await cancelJoinMutation.mutateAsync();
    },
  };
};

// 수정 / 삭제 (호스트 전용)
export const useMeetingHostMutations = (meetingId: number) => {
  const queryClient = useQueryClient();
  const router = useRouter();

  const updateMeetingMutation = useMutation({
    mutationFn: (nextValues: Partial<MeetingDetailData>) =>
      updateMeeting(meetingId, nextValues),
    onSuccess: async () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.meetings.root });
      Toast({ message: "모임 수정이 반영되었어요.", type: "success" });
    },
    onError: (error: AxiosError<MeetingActionErrorResponse>) => {
      Toast({
        message:
          error.response?.data?.message ?? "모임 수정 중 문제가 발생했어요.",
        type: "error",
      });
    },
  });

  const deleteMeetingMutation = useMutation({
    mutationFn: () => deleteMeeting(meetingId),
    onSuccess: () => {
      Toast({ message: "모임을 삭제했어요.", type: "success" });
      router.push("/meetings");
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.meetings.root });
      router.refresh();
    },
    onError: (error: AxiosError<MeetingActionErrorResponse>) => {
      Toast({
        message:
          error.response?.data?.message ?? "모임 삭제 중 문제가 발생했어요.",
        type: "error",
      });
    },
  });

  return {
    handleEditMeeting: async (nextValues: Partial<MeetingDetailData>) => {
      await updateMeetingMutation.mutateAsync(nextValues);
    },
    handleDeleteMeeting: () => {
      deleteMeetingMutation.mutate();
    },
  };
};

// 출석
export const useMeetingAttendMutation = (meetingId: number) => {
  const queryClient = useQueryClient();
  const [hasAttended, setHasAttended] = useState(
    queryClient.getQueryData<boolean>(
      QUERY_KEYS.meetings.attendance(meetingId),
    ) ?? false,
  );

  const attendMutation = useMutation({
    mutationFn: attendMeeting,
    onSuccess: () => {
      setHasAttended(true);
    },
    onError: () => {
      Toast({
        message: "출석 처리 중 문제가 발생했어요.",
        type: "error",
      });
    },
  });

  // 공통 성공/실패 처리는 mutation에서 담당하고,
  //  UI(보상/애니메이션)만 호출 시 onSuccess로 분리
  return {
    hasAttended,
    isCheckingAttendance: attendMutation.isPending,
    handleAttendMeeting: (
      region: string,
      options?: {
        onSuccess?: (result: Awaited<ReturnType<typeof attendMeeting>>) => void;
      },
    ) => {
      attendMutation.mutate(region, {
        onSuccess: (result) => {
          options?.onSuccess?.(result);
        },
      });
    },
  };
};

// 찜하기 (상세 페이지)
export const useMeetingDetailFavoriteMutation = (meetingId: number) => {
  const queryClient = useQueryClient();

  const favoriteMutation = useMutation({
    mutationFn: (isFavorited: boolean) =>
      isFavorited
        ? removeMeetingFavorite(meetingId)
        : addMeetingFavorite(meetingId),
    ...useOptimisticMutation<MeetingDetailApiData, boolean>(queryClient, {
      queryKey: QUERY_KEYS.meetings.detail(meetingId),
      updater: (old, isFavorited) => ({ ...old, isFavorited: !isFavorited }),
      invalidateKeys: [
        QUERY_KEYS.meetings.detail(meetingId),
        QUERY_KEYS.meetings.list,
        QUERY_KEYS.favorites.root,
      ],
      onErrorMessage: "찜하기 처리 중 문제가 발생했어요.",
    }),
  });

  return {
    isFavoritePending: favoriteMutation.isPending,
    handleToggleFavorite: (isFavorited: boolean) => {
      favoriteMutation.mutate(isFavorited);
    },
  };
};

// 모임 좋아요 mutation 함수
export const useMeetingFavoriteMutation = (
  queryKey: QueryKey = QUERY_KEYS.meetings.joined,
) => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (meeting: Pick<JoinedMeeting, "id" | "isFavorited">) => {
      if (meeting.isFavorited) {
        await deleteFavorites(meeting.id);
        return;
      }
      await updateFavorites(meeting.id);
    },
    ...useOptimisticMutation<
      InfiniteData<JoinedMeetingsResponse>,
      Pick<JoinedMeeting, "id" | "isFavorited">
    >(queryClient, {
      queryKey,
      updater: (oldData, meeting) => ({
        ...oldData,
        pages: oldData.pages.map((page) => ({
          ...page,
          data: page.data.map((item) =>
            item.id === meeting.id
              ? { ...item, isFavorited: !item.isFavorited }
              : item,
          ),
        })),
      }),
      invalidateKeys: [QUERY_KEYS.meetings.root, QUERY_KEYS.favorites.root],
      onErrorMessage: "즐겨찾기 처리에 실패했습니다.",
    }),
  });

  return {
    toggleFavorite: mutation.mutate,
    toggleFavoriteAsync: mutation.mutateAsync,
    isPending: mutation.isPending,
    error: mutation.error,
  };
};

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
import { ToastCommon } from "@/components/ui/ToastCommon";
import {
  JoinedMeeting,
  JoinedMeetingsResponse,
  MeetingActionErrorResponse,
  MeetingDetailApiData,
  MeetingDetailData,
} from "@/types";
import { deleteFavorites, updateFavorites } from "@/api/client";
import { useOptimisticMutation } from "@/hooks/useOptimisticUpdate";
import { QUERY_KEYS } from "@/constans/queryKey";

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
export function useMeetingDetailQueries(meetingId: number) {
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
}

// 추천 모임 조회
export function useMeetingRecommendationsQuery(meetingId: number) {
  return useQuery({
    queryKey: QUERY_KEYS.meetings.recommendations(meetingId),
    queryFn: () => getMeetingRecommendations(meetingId),
    staleTime: 1000 * 60 * 10,
  });
}

// 참여 / 탈퇴
export function useMeetingJoinMutations(meetingId: number) {
  const queryClient = useQueryClient();

  const joinMutation = useMutation({
    mutationFn: () => joinMeeting(meetingId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.meetings.detail(meetingId) });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.meetings.participants(meetingId) });
      ToastCommon({ message: "모임에 참여했어요.", size: "sm" });
    },
    onError: (error: AxiosError<MeetingActionErrorResponse>) => {
      ToastCommon({ message: getJoinErrorMessage(error.response?.data?.code), size: "sm" });
    },
  });

  const cancelJoinMutation = useMutation({
    mutationFn: () => cancelMeetingJoin(meetingId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.meetings.detail(meetingId) });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.meetings.participants(meetingId) });
      ToastCommon({ message: "참여를 취소했어요.", size: "sm" });
    },
    onError: (error: AxiosError<MeetingActionErrorResponse>) => {
      ToastCommon({ message: getCancelJoinErrorMessage(error.response?.data?.code), size: "sm" });
    },
  });

  return {
    isJoinPending: joinMutation.isPending || cancelJoinMutation.isPending,
    handleJoinMeeting: () => { joinMutation.mutate(); },
    handleCancelJoinMeeting: () => { cancelJoinMutation.mutate(); },
  };
}

// 수정 / 삭제 (호스트 전용)
export function useMeetingHostMutations(meetingId: number) {
  const queryClient = useQueryClient();
  const router = useRouter();

  const updateMeetingMutation = useMutation({
    mutationFn: (nextValues: Partial<MeetingDetailData>) =>
      updateMeeting(meetingId, nextValues),
    onSuccess: async () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.meetings.root });
      ToastCommon({ message: "모임 수정이 반영되었어요.", size: "sm" });
    },
    onError: (error: AxiosError<MeetingActionErrorResponse>) => {
      ToastCommon({
        message: error.response?.data?.message ?? "모임 수정 중 문제가 발생했어요.",
        size: "sm",
      });
    },
  });

  const deleteMeetingMutation = useMutation({
    mutationFn: () => deleteMeeting(meetingId),
    onSuccess: () => {
      ToastCommon({ message: "모임을 삭제했어요.", size: "sm" });
      router.push("/meetings");
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.meetings.root });
      router.refresh();
    },
    onError: (error: AxiosError<MeetingActionErrorResponse>) => {
      ToastCommon({
        message: error.response?.data?.message ?? "모임 삭제 중 문제가 발생했어요.",
        size: "sm",
      });
    },
  });

  return {
    handleEditMeeting: async (nextValues: Partial<MeetingDetailData>) => {
      await updateMeetingMutation.mutateAsync(nextValues);
    },
    handleDeleteMeeting: () => { deleteMeetingMutation.mutate(); },
  };
}

// 출석
export function useMeetingAttendMutation(meetingId: number) {
  const queryClient = useQueryClient();
  const [hasAttended, setHasAttended] = useState(
    queryClient.getQueryData<boolean>(QUERY_KEYS.meetings.attendance(meetingId)) ?? false,
  );

  const attendMutation = useMutation({
    mutationFn: attendMeeting,
    onSuccess: () => {
      setHasAttended(true);
      ToastCommon({ message: "출석이 완료되었습니다.", size: "sm" });
    },
    onError: () => {
      ToastCommon({ message: "출석 처리 중 문제가 발생했어요.", size: "sm" });
    },
  });

  return {
    hasAttended,
    isCheckingAttendance: attendMutation.isPending,
    handleAttendMeeting: (region: string) => { attendMutation.mutate(region); },
  };
}

// 찜하기 (상세 페이지)
export function useMeetingDetailFavoriteMutation(meetingId: number) {
  const queryClient = useQueryClient();

  const favoriteMutation = useMutation({
    mutationFn: (isFavorited: boolean) =>
      isFavorited ? removeMeetingFavorite(meetingId) : addMeetingFavorite(meetingId),
    ...useOptimisticMutation<MeetingDetailApiData, boolean>(queryClient, {
      queryKey: QUERY_KEYS.meetings.detail(meetingId),
      updater: (old, isFavorited) => ({ ...old, isFavorited: !isFavorited }),
      invalidateKeys: [["meeting-detail", meetingId]],
      onErrorMessage: "찜하기 처리 중 문제가 발생했어요.",
    }),
  });

  return {
    isFavoritePending: favoriteMutation.isPending,
    handleToggleFavorite: (isFavorited: boolean) => { favoriteMutation.mutate(isFavorited); },
  };
}

// 모임 좋아요 mutation 함수
export function useMeetingFavoriteMutation(
  queryKey: QueryKey = QUERY_KEYS.meetings.joined,
) {
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
      invalidateKeys: [["meetings"], ["favorites"]],
      onErrorMessage: "즐겨찾기 처리에 실패했습니다.",
    }),
  });

  return {
    toggleFavorite: mutation.mutate,
    toggleFavoriteAsync: mutation.mutateAsync,
    isPending: mutation.isPending,
    error: mutation.error,
  };
}

"use client";

import { useState } from "react";
import type { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import {
  addMeetingFavorite,
  attendMeeting,
  cancelMeetingJoin,
  deleteMeeting,
  joinMeeting,
  removeMeetingFavorite,
  updateMeeting,
} from "@/api/meeting-detail.api";

import { ToastCommon } from "@/components/ui/ToastCommon";
import { useAuthStore } from "@/store/useAuthStore";
import {
  getMeetingDetailQueryKey,
  getMeetingParticipantsQueryKey,
} from "./meeting-detail.query-keys";
import {
  MeetingActionErrorResponse,
  MeetingDetailApiData,
  MeetingDetailData,
} from "@/types/meeting/meetingTypes";

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

export function useMeetingDetailMutations({
  meetingId,
  initialHasAttended,
}: {
  meetingId: number;
  initialHasAttended: boolean;
}) {
  const queryClient = useQueryClient();
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const isAuthLoading = useAuthStore((state) => state.isAuthLoading);
  const [hasAttended, setHasAttended] = useState(initialHasAttended);

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

      ToastCommon({ message: "모임 수정이 반영되었어요.", size: "sm" });
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
      ToastCommon({ message: "모임을 삭제했어요.", size: "sm" });
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
    mutationFn: attendMeeting,
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

  return {
    user,
    isAuthLoading,
    hasAttended,
    joinMutation,
    cancelJoinMutation,
    favoriteMutation,
    attendMutation,
    handleJoinMeeting: async () => {
      await joinMutation.mutateAsync();
    },
    handleCancelJoinMeeting: async () => {
      await cancelJoinMutation.mutateAsync();
    },
    handleShareMeeting: async () => {
      const meetingUrl = window.location.href;

      try {
        await navigator.clipboard.writeText(meetingUrl);
        ToastCommon({ message: "모임 링크가 복사되었어요." });
      } catch {
        ToastCommon({ message: "링크 복사에 실패했습니다." });
      }
    },
    handleEditMeeting: async (nextValues: Partial<MeetingDetailData>) => {
      await updateMeetingMutation.mutateAsync(nextValues);
    },
    handleDeleteMeeting: () => {
      deleteMeetingMutation.mutate();
    },
    handleToggleFavorite: (isFavorited: boolean) => {
      favoriteMutation.mutate(isFavorited);
    },
    handleAttendMeeting: (region: string) => {
      attendMutation.mutate(region);
    },
  };
}

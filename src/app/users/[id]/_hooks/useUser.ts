import { deleteFavorites } from "@/api/client";
import { getUser, updateUserProfile } from "@/api/client/user";
import { Toast } from "@/components/ui/Toast";
import { QUERY_KEYS } from "@/constants/queryKey";
import { useAuthStore } from "@/store/useAuthStore";
import { User, UserProfileUpdateProps } from "@/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const shouldRefetchUser = (user: User) =>
  !user.id ||
  !user.name?.trim() ||
  !user.teamId?.trim() ||
  !user.createdAt ||
  !user.updatedAt;

export const useUpdateProfile = () => {
  const setUser = useAuthStore((s) => s.setUser);

  return useMutation({
    mutationFn: (data: UserProfileUpdateProps) => updateUserProfile(data),
    onSuccess: async (updated) => {
      // 기본은 patch 응답을 즉시 반영하고, 응답 형태가 불완전할 때만 1회 재조회
      if (!shouldRefetchUser(updated)) {
        setUser(updated);
        return;
      }

      try {
        const freshUser = await getUser();
        setUser(freshUser);
      } catch {
        // 재조회 실패 시에는 patch 응답으로 폴백해 UI 공백을 방지
        setUser(updated);
      }
    },
    onError: () => {
      Toast({ message: "프로필 수정에 실패했습니다.", type: "error" });
    },
  });
};

export const useToggleFavorite = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (meetingId: number) => deleteFavorites(meetingId),
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: QUERY_KEYS.favorites.root }),
        queryClient.invalidateQueries({ queryKey: QUERY_KEYS.meetings.list }),
      ]);
    },
  });
};

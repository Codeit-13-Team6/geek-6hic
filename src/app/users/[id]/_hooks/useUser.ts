import { deleteFavorites } from "@/api/client";
import { updateUserProfile } from "@/api/client/user";
import { Toast } from "@/components/ui/Toast";
import { QUERY_KEYS } from "@/constants/queryKey";
import { useAuthStore } from "@/store/useAuthStore";
import { UserProfileUpdateProps } from "@/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useUpdateProfile = () => {
  const setUser = useAuthStore((s) => s.setUser);

  return useMutation({
    mutationFn: (data: UserProfileUpdateProps) => updateUserProfile(data),
    onSuccess: (updated) => {
      setUser(updated); // Gnb 즉시 반영
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

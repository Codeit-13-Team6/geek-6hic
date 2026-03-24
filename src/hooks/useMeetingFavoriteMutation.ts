"use client";

import { deleteFavorites, updateFavorites } from "@/api/meetings";
import type { JoinedMeeting } from "@/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useMeetingFavoriteMutation() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (meeting: Pick<JoinedMeeting, "id" | "isFavorited">) => {
      if (meeting.isFavorited) {
        await deleteFavorites(meeting.id);
        return;
      }

      await updateFavorites(meeting.id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["meetings", "joined"] });
      queryClient.invalidateQueries({ queryKey: ["favorites"] });
    },
  });

  return {
    toggleFavorite: mutation.mutate,
    toggleFavoriteAsync: mutation.mutateAsync,
    isPending: mutation.isPending,
    error: mutation.error,
  };
}

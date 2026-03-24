"use client";

import { deleteFavorites, updateFavorites } from "@/api/meetings";
import type { JoinedMeeting, JoinedMeetingsResponse } from "@/types";
import {
  InfiniteData,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

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
    onMutate: async (meeting) => {
      const queryKey = ["meetings", "joined"] as const;

      await queryClient.cancelQueries({ queryKey });

      const previousMeetings =
        queryClient.getQueryData<InfiniteData<JoinedMeetingsResponse>>(queryKey);

      queryClient.setQueryData<InfiniteData<JoinedMeetingsResponse>>(
        queryKey,
        (oldData) => {
          if (!oldData) return oldData;

          return {
            ...oldData,
            pages: oldData.pages.map((page) => ({
              ...page,
              data: page.data.map((item) =>
                item.id === meeting.id
                  ? { ...item, isFavorited: !item.isFavorited }
                  : item,
              ),
            })),
          };
        },
      );

      return { previousMeetings, queryKey };
    },
    onError: (_error, _meeting, context) => {
      if (!context?.previousMeetings) return;

      queryClient.setQueryData(context.queryKey, context.previousMeetings);
    },
    onSuccess: () => {
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

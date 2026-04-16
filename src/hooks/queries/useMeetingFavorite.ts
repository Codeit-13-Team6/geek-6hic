"use client";

import { InfiniteData, QueryKey, useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteFavorites, updateFavorites } from "@/api/client";
import { QUERY_KEYS } from "@/constants/queryKey";
import { JoinedMeeting, JoinedMeetingsResponse } from "@/types";
import { useOptimisticMutation } from "@/hooks/useOptimisticUpdate";

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

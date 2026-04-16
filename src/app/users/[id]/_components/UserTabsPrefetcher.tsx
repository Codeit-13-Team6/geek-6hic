"use client";

import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { getMeeting, getUserMeetingsPage } from "@/api/client/meetings";
import { getMyPosts, getUserPostsPage } from "@/api/client/posts";
import { QUERY_KEYS } from "@/constants/queryKey";

const TAB_PAGE_SIZE = 10;

export default function UserTabsPrefetcher({
  isOwnProfile,
  userId,
}: {
  isOwnProfile: boolean;
  userId: number;
}) {
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!Number.isFinite(userId)) return;

    const meetingsQueryKey = isOwnProfile
      ? QUERY_KEYS.meetings.myPage(1, TAB_PAGE_SIZE)
      : QUERY_KEYS.meetings.userPage(userId, 1, TAB_PAGE_SIZE);

    const postsQueryKey = isOwnProfile
      ? QUERY_KEYS.posts.myPage(1, TAB_PAGE_SIZE)
      : QUERY_KEYS.posts.userPage(userId, 1, TAB_PAGE_SIZE);

    void Promise.all([
      queryClient.prefetchQuery({
        queryKey: meetingsQueryKey,
        queryFn: () =>
          isOwnProfile
            ? getMeeting({ offset: 0, limit: TAB_PAGE_SIZE })
            : getUserMeetingsPage({
                userId,
                offset: 0,
                limit: TAB_PAGE_SIZE,
              }),
      }),
      queryClient.prefetchQuery({
        queryKey: postsQueryKey,
        queryFn: () =>
          isOwnProfile
            ? getMyPosts({ offset: 0, limit: TAB_PAGE_SIZE })
            : getUserPostsPage({
                userId,
                offset: 0,
                limit: TAB_PAGE_SIZE,
              }),
      }),
    ]);
  }, [isOwnProfile, queryClient, userId]);

  return null;
}

"use client";

import { useRouter } from "next/navigation";
import { useIntersectionObserver } from "@/hooks/useIntersectionObserver";
import MeetingList from "../../../components/features/list/MeetingList";
import { useMeetingFavoriteMutation } from "@/hooks";
import { infiniteQueryOptions, useInfiniteQuery } from "@tanstack/react-query";
import { getJoinedMeetings } from "@/api/client/meetings";
import type { JoinedMeetingsResponse } from "@/types";

export function getMeetingJoinedNextPageParam(
  lastPage: JoinedMeetingsResponse,
) {
  return lastPage.hasMore ? (lastPage.nextCursor ?? undefined) : undefined;
}

export const meetingJoinedInfiniteQueryOptions =
  infiniteQueryOptions<JoinedMeetingsResponse>({
    queryKey: ["meetings", "joined"],
    queryFn: ({ pageParam }) =>
      getJoinedMeetings(
        pageParam ? { cursor: pageParam as string, size: 10 } : { size: 10 },
      ),
    initialPageParam: undefined,
    getNextPageParam: getMeetingJoinedNextPageParam,
  });

export function useMeetingQuery() {
  return useInfiniteQuery(meetingJoinedInfiniteQueryOptions);
}

export default function MyMeetingsClient() {
  const router = useRouter();

  const { toggleFavorite } = useMeetingFavoriteMutation();
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, status } =
    useMeetingQuery();

  const bottomRef = useIntersectionObserver(
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  );

  const allMeetings = data?.pages.flatMap((page) => page.data) ?? [];

  if (status === "pending") {
    return (
      <div className="flex min-h-[calc(100vh-220px)] items-center justify-center text-center">
        <p>데이터를 불러오고 있어요...</p>
      </div>
    );
  }

  return (
    <>
      <div className="flex flex-col gap-4 lg:grid lg:grid-cols-2">
        <MeetingList
          meetingList={allMeetings}
          isLoading={isFetchingNextPage}
          onItemClick={(item) => router.push(`/meetings/${item.id}`)}
          onHeartClick={(item) => toggleFavorite(item)}
        />
      </div>
      <section>
        <div
          ref={bottomRef}
          className="flex h-40 w-full items-center justify-center"
        >
          {isFetchingNextPage && <p>데이터를 더 불러오고 있어요...</p>}
          {!hasNextPage && allMeetings.length > 0 && (
            <p>모든 모임을 다 확인하셨습니다! ✔️</p>
          )}
        </div>
      </section>
    </>
  );
}

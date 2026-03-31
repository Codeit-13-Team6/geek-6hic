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
      <div className="flex min-h-[300px] items-center justify-center">
        <p className="text-xs font-black tracking-widest text-slate-300 uppercase">
          Syncing Archive...
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="mb-12 flex items-center gap-3">
        <div className="bg-main-purple h-[6px] w-8" />
        <span className="text-[11px] font-black tracking-[0.3em] text-slate-950 uppercase">
          Joined Index
        </span>
      </div>

      <div className="flex flex-col gap-6 lg:grid lg:grid-cols-2 lg:gap-10">
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
          className="mt-20 flex h-60 w-full flex-col items-center justify-center border-t border-slate-100"
        >
          {isFetchingNextPage ? (
            <div className="flex flex-col items-center gap-3">
              <div className="bg-main-purple h-1 w-12 animate-pulse" />
              <p className="text-main-purple text-[10px] font-black tracking-[0.4em] uppercase">
                Updating Archive...
              </p>
            </div>
          ) : (
            !hasNextPage &&
            allMeetings.length > 0 && (
              <div className="flex flex-col items-center gap-4">
                <div className="h-1.5 w-8 bg-slate-400" />
                <p className="text-[11px] font-black tracking-[0.2em] text-slate-300 uppercase">
                  End of Archive.
                </p>
              </div>
            )
          )}
        </div>
      </section>
    </>
  );
}

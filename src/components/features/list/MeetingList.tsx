"use client";

import { useRouter } from "next/navigation";
import { useIntersectionObserver } from "@/hooks/useIntersectionObserver";
import MeetingCard from "../card/MeetingCard";
import { useMeetingFavoriteMutation } from "@/hooks";
import {
  useAllMeetingList,
  useJoinedMeetingList,
} from "@/hooks/queries/useMeetingInfiniteList";

interface MeetingsClientProps {
  variant?: "all" | "joined";
  meetingStatusBadgeVisible?: boolean;
}

export default function MeetingList({
  variant = "all",
  meetingStatusBadgeVisible,
}: MeetingsClientProps) {
  const router = useRouter();

  const allResult = useAllMeetingList(variant === "all");
  const joinedResult = useJoinedMeetingList(variant === "joined");
  const {
    meetingList,
    isLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    sortValue,
    favoriteQueryKey,
  } = variant === "all" ? allResult : joinedResult;

  const { toggleFavorite } = useMeetingFavoriteMutation(favoriteQueryKey);
  const bottomRef = useIntersectionObserver(
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  );

  return (
    <div className="w-full">
      <div className="flex flex-col gap-6 sm:gap-8 lg:grid lg:grid-cols-2 lg:gap-x-10 lg:gap-y-12">
        <MeetingCard
          meetingList={meetingList}
          isLoading={isLoading}
          onItemClick={(item) => router.push(`/meetings/${item.id}`)}
          sortValue={sortValue}
          onHeartClick={(item) => toggleFavorite(item)}
          meetingStatusBadgeVisible={meetingStatusBadgeVisible}
        />
      </div>

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
          meetingList.length > 0 && (
            <div className="flex flex-col items-center gap-4">
              <div className="h-1.5 w-8 bg-slate-400" />
              <p className="text-[11px] font-black tracking-[0.2em] text-slate-300 uppercase">
                End of Archive.
              </p>
            </div>
          )
        )}
      </div>
    </div>
  );
}

"use client";

import { useRouter } from "next/navigation";
import { useIntersectionObserver } from "@/hooks/useIntersectionObserver";
import MeetingCard from "../card/MeetingCard";
import { useMeetingFavoriteMutation } from "@/hooks";
import {
  useMeetingList,
  useJoinedMeetingList,
} from "@/hooks/queries/useMeetingInfiniteList";
import { useUrlQuery } from "@/hooks/useUrlQuery";
import { SortOrder, MeetingSortBy, JoinedMeeting } from "@/types";
import { NoResultFound } from "@/components/ui/NoResultFound";

interface MeetingsClientProps {
  variant?: "all" | "joined";
  meetingStatusBadgeVisible?: boolean;
}

export default function MeetingList({
  variant = "all",
  meetingStatusBadgeVisible,
}: MeetingsClientProps) {
  const router = useRouter();

  const { getParam } = useUrlQuery();
  const type = getParam("type");
  const keyword = getParam("keyword");
  const sortBy = (getParam("sortBy") || "createdAt") as MeetingSortBy;
  const sortOrder = (getParam("sortOrder") || "desc") as SortOrder;

  const allResult = useMeetingList({
    type,
    keyword,
    sortBy,
    sortOrder,
    enabled: variant === "all",
  });

  const joinedResult = useJoinedMeetingList(variant === "joined");

  const {
    meetingList,
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

  function isMeetingClosed(item: JoinedMeeting) {
    return item.participantCount >= item.capacity;
  }

  const visibleMeetingList =
    sortValue === "registrationEnd"
      ? meetingList.filter((item) => !isMeetingClosed(item))
      : meetingList;

  return (
    <div className="w-full">
      <div className="flex flex-col gap-6 sm:gap-8 lg:grid lg:grid-cols-2 lg:gap-x-10 lg:gap-y-12">
        {visibleMeetingList.length > 0 ? (
          visibleMeetingList.map((item) => (
            <MeetingCard
              key={item.id}
              item={item}
              onItemClick={() => router.push(`/meetings/${item.id}`)}
              onHeartClick={() => toggleFavorite(item)}
              meetingStatusBadgeVisible={meetingStatusBadgeVisible}
            />
          ))
        ) : (
          <NoResultFound />
        )}
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

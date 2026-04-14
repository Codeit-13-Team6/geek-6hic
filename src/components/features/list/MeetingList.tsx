"use client";

import { useRouter } from "next/navigation";
import { useIntersectionObserver } from "@/hooks/useIntersectionObserver";
import MeetingCard from "../card/MeetingCard";
import { useMeetingFavoriteMutation } from "@/hooks";
import {
  useGetMeetings,
  useJoinedMeetingList,
} from "@/hooks/queries/useMeetings";
import { useUrlQuery } from "@/hooks/useUrlQuery";
import { SortOrder, MeetingSortBy, JoinedMeeting } from "@/types";
import { NoResultFound } from "@/components/ui/NoResultFound";
import InfiniteScrollTrigger from "@/components/ui/InfiniteScrollTrigger";

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

  const getNoResultType = (): "search" | "meetings" | "myMeetings" => {
    // 검색어가 있는데 결과가 없는 경우
    if (keyword) return "search";

    // 나의 모임(joined) 탭인데 결과가 없는 경우
    if (variant === "joined") return "myMeetings";

    // 모임 찾기인데 아예 데이터가 없는 경우
    return "meetings";
  };

  const allResult = useGetMeetings({
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
          <NoResultFound type={getNoResultType()} />
        )}
      </div>

      <InfiniteScrollTrigger
        ref={bottomRef}
        isFetchingNextPage={isFetchingNextPage}
        hasNextPage={hasNextPage}
        hasData={meetingList.length > 0}
      />
    </div>
  );
}

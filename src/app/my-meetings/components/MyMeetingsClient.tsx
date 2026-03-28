"use client";

import { useRouter } from "next/navigation";
import { EmptyData } from "@/components/features/empty/EmptyData";
import { useIntersectionObserver } from "@/hooks/useIntersectionObserver";
import MeetingList from "../../meetings/components/MeetingList";
import { useMeetingQuery } from "@/hooks/meetings/useMeetingQuery";
import { useMeetingFavoriteMutation } from "@/hooks/meetings/useMeetingFavoriteMutation";

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

  if (allMeetings.length === 0) {
    return (
      <div className="flex min-h-[calc(100vh-220px)] items-center justify-center">
        <EmptyData variant="myMeeting" />
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

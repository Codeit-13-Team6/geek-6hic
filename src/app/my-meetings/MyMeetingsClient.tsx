"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";

import { EmptyData } from "@/components/features/empty/EmptyData";
import { useMeetingFavoriteMutation } from "@/hooks/useMeetingFavoriteMutation";
import { useMeetingQuery } from "@/hooks/useMeetingQuery";

import MeetingList from "../meetings/components/MeetingList";

export default function MyMeetingsClient() {
  const router = useRouter();
  const bottomRef = useRef<HTMLDivElement>(null);

  const { toggleFavorite } = useMeetingFavoriteMutation();
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, status } =
    useMeetingQuery();

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      { threshold: 1.0 },
    );

    if (bottomRef.current) {
      observer.observe(bottomRef.current);
    }

    return () => observer.disconnect();
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

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

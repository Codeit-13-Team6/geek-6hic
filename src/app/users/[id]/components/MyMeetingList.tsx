"use client";

import { useRouter } from "next/navigation";
import { useInfiniteQuery } from "@tanstack/react-query";
import { getMeeting } from "@/api/meetings";
import { UserCard } from "@/components/features/card/UserCard";
import { useIntersectionObserver } from "@/hooks/useIntersectionObserver";

export default function MyMeetingList() {
  const router = useRouter();


  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useInfiniteQuery({
      queryKey: ["meetings", "my"],
      queryFn: ({ pageParam }) =>
        getMeeting(
          pageParam ? { cursor: pageParam, size: 10 } : { size: 10 },
        ),
      initialPageParam: undefined as string | undefined,
      getNextPageParam: (lastPage) =>
        lastPage.hasMore ? (lastPage.nextCursor ?? undefined) : undefined,
    });

  const bottomRef = useIntersectionObserver(fetchNextPage, hasNextPage, isFetchingNextPage);

  const allMeetings = data?.pages.flatMap((page) => page.data) ?? [];

  if (allMeetings.length === 0) {
    return (
      <p className="py-10 text-center text-gray-400">만든 모임이 없습니다.</p>
    );
  }

  return (
    <>
      {allMeetings.map((item: any) => (
        <UserCard
          key={item.id}
          title={item.name}
          type={item.type}
          date={new Date(item.dateTime)}
          imageSrc={item.image}
          capacity={item.capacity}
          participantCount={item.participantCount}
          showLikeBtn={false}
          onDetailClick={() => router.push(`/meetings/${item.id}`)}
        />
      ))}
      <div ref={bottomRef} className="flex h-20 items-center justify-center text-sm text-gray-400">
        {isFetchingNextPage && <p>불러오는 중...</p>}
        {!hasNextPage && allMeetings.length > 0 && <p>더 이상 모임이 없습니다.</p>}
      </div>
    </>
  );
}

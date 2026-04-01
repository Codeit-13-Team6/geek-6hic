"use client";

import { useRouter } from "next/navigation";
import { useInfiniteQuery } from "@tanstack/react-query";
import { getMeeting } from "@/api/client/meetings";
import { UserCard } from "@/components/features/card/UserCard";
import { useIntersectionObserver } from "@/hooks";
import { Loader2, PlusCircle } from "lucide-react";

export default function MyMeetingList() {
  const router = useRouter();

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useInfiniteQuery({
      queryKey: ["meetings", "my"],
      queryFn: ({ pageParam }) =>
        getMeeting(pageParam ? { cursor: pageParam, size: 10 } : { size: 10 }),
      initialPageParam: undefined as string | undefined,
      getNextPageParam: (lastPage) =>
        lastPage.hasMore ? (lastPage.nextCursor ?? undefined) : undefined,
    });

  const bottomRef = useIntersectionObserver(
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  );

  const allMeetings = data?.pages.flatMap((page) => page.data) ?? [];

  if (allMeetings.length === 0 && !isFetchingNextPage) {
    return (
      <div className="flex flex-col items-center justify-center border-t border-slate-100 py-32">
        <div className="mb-6 flex size-20 items-center justify-center rounded-full bg-slate-50">
          <PlusCircle className="size-10 text-slate-200" strokeWidth={1.5} />
        </div>
        <h3 className="text-xl font-black tracking-tighter text-slate-900 uppercase">
          No Entries Created.
        </h3>
        <p className="mt-2 text-sm font-medium text-slate-400">
          아직 직접 개설한 모임이 없습니다. 새로운 모임을 시작해보세요.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col">
      <div className="grid grid-cols-1">
        {allMeetings.map((item) => (
          <UserCard
            key={item.id}
            title={item.name}
            type={item.type}
            date={new Date(item.dateTime)}
            imageSrc={item.image ?? undefined}
            capacity={item.capacity}
            participantCount={item.participantCount}
            showLikeBtn={false}
            onDetailClick={() => router.push(`/meetings/${item.id}`)}
          />
        ))}
      </div>

      <div ref={bottomRef} className="flex h-32 items-center justify-center">
        {isFetchingNextPage ? (
          <div className="flex items-center gap-3">
            <Loader2 className="text-main-purple animate-spin" size={20} />
            <span className="text-[10px] font-black tracking-[0.3em] text-slate-400 uppercase">
              Updating Archive...
            </span>
          </div>
        ) : (
          !hasNextPage &&
          allMeetings.length > 0 && (
            <span className="text-[10px] font-black tracking-[0.3em] text-slate-200 uppercase">
              End of Archive.
            </span>
          )
        )}
      </div>
    </div>
  );
}

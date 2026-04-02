"use client";

import { useRouter } from "next/navigation";
import {
  useInfiniteQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { deleteFavorites, getFavorites } from "@/api/client/meetings";
import { UserCard } from "@/components/features/card/UserCard";
import { useIntersectionObserver } from "@/hooks";
import { Loader2, HeartOff } from "lucide-react";
import { QUERY_KEYS } from "@/constans/queryKey";

export default function FavoriteList() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useInfiniteQuery({
      queryKey: QUERY_KEYS.favorites.root,
      queryFn: ({ pageParam }) =>
        getFavorites(
          pageParam ? { cursor: pageParam, size: 10 } : { size: 10 },
        ),
      initialPageParam: undefined as string | undefined,
      getNextPageParam: (lastPage) =>
        lastPage.hasMore ? (lastPage.nextCursor ?? undefined) : undefined,
      staleTime: 1000 * 60 * 5,
    });

  const bottomRef = useIntersectionObserver(
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  );

  const { mutate: toggleFavorite } = useMutation({
    mutationFn: (meetingId: number) => deleteFavorites(meetingId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.favorites });
    },
  });

  const allFavorites = data?.pages.flatMap((page) => page.data) ?? [];

  if (allFavorites.length === 0 && !isFetchingNextPage) {
    return (
      <div className="flex flex-col items-center justify-center border-t border-slate-100 py-32">
        <div className="mb-6 flex size-20 items-center justify-center rounded-full bg-slate-50">
          <HeartOff className="size-10 text-slate-200" strokeWidth={1.5} />
        </div>
        <h3 className="text-xl font-black tracking-tighter text-slate-900 uppercase">
          Your Archive is Empty.
        </h3>
        <p className="mt-2 text-sm font-medium text-slate-400">
          관심 있는 모임을 찜하여 나만의 리스트를 완성해보세요.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col">
      <div className="grid grid-cols-1 gap-4 sm:gap-6">
        {allFavorites.map((item) => (
          <UserCard
            key={item.id}
            title={item.meeting.name}
            type={item.meeting.type}
            date={new Date(item.meeting.dateTime)}
            imageSrc={item.meeting.image ?? undefined}
            capacity={item.meeting.capacity}
            participantCount={item.meeting.participantCount}
            defaultLiked={true}
            onDetailClick={() => router.push(`/meetings/${item.meetingId}`)}
            onHeartClick={() => toggleFavorite(item.meetingId)}
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
          allFavorites.length > 0 && (
            <span className="text-[10px] font-black tracking-[0.3em] text-slate-200 uppercase">
              End of Archive.
            </span>
          )
        )}
      </div>
    </div>
  );
}

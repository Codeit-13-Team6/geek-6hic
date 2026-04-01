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

export default function FavoriteList() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useInfiniteQuery({
      queryKey: ["favorites"],
      queryFn: ({ pageParam }) =>
        getFavorites(
          pageParam ? { cursor: pageParam, size: 10 } : { size: 10 },
        ),
      initialPageParam: undefined as string | undefined,
      getNextPageParam: (lastPage) =>
        lastPage.hasMore ? (lastPage.nextCursor ?? undefined) : undefined,
    });

  const bottomRef = useIntersectionObserver(
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  );

  const { mutate: toggleFavorite } = useMutation({
    mutationFn: (meetingId: number) => deleteFavorites(meetingId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["favorites"] });
    },
  });

  const allFavorites = data?.pages.flatMap((page) => page.data) ?? [];

  if (allFavorites.length === 0) {
    return (
      <p className="py-10 text-center text-gray-400">찜한 모임이 없습니다.</p>
    );
  }

  return (
    <>
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
      <div
        ref={bottomRef}
        className="flex h-20 items-center justify-center text-sm text-gray-400"
      >
        {isFetchingNextPage && <p>불러오는 중...</p>}
        {!hasNextPage && allFavorites.length > 0 && (
          <p>더 이상 모임이 없습니다.</p>
        )}
      </div>
    </>
  );
}

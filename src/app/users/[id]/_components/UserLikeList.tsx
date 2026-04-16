"use client";

import { useRouter } from "next/navigation";
import { getFavorites } from "@/api/client/meetings";
import { UserCard } from "@/app/users/[id]/_components/UserCard";
import { HeartOff } from "lucide-react";
import { QUERY_KEYS } from "@/constants/queryKey";
import NumberPagination from "@/components/ui/NumberPagination";
import { useEffect } from "react";
import { useOffsetPaginationQuery } from "@/hooks/useOffsetPaginationQuery";
import { useToggleFavorite } from "@/app/users/[id]/_hooks/useUser";
import { isSecretMeeting } from "@/lib";
import { cn } from "@/lib";

const FAVORITES_PAGE_SIZE = 10;

export default function UserLikeList() {
  const router = useRouter();
  const {
    items: favorites,
    isFetching,
    page,
    totalPages,
    handlePageChange,
    setPage,
  } = useOffsetPaginationQuery({
    pageSize: FAVORITES_PAGE_SIZE,
    queryKey: QUERY_KEYS.favorites.page,
    queryFn: getFavorites,
  });

  const { mutate: toggleFavorite } = useToggleFavorite();

  useEffect(() => {
    if (!isFetching && favorites.length === 0 && page > 1) {
      setPage(totalPages);
    }
  }, [favorites.length, isFetching, page, setPage, totalPages]);

  if (favorites.length === 0 && !isFetching) {
    return (
      <div className="flex flex-col items-center justify-center border-t border-slate-100 py-32">
        <div className="mb-6 flex size-20 items-center justify-center rounded-full bg-slate-50">
          <HeartOff className="size-10 text-slate-200" strokeWidth={1.5} />
        </div>
        <h3 className="text-xl font-black tracking-tighter text-slate-900 uppercase">
          찜한 모임이 없어요
        </h3>
        <p className="mt-2 text-sm font-medium text-slate-400">
          관심 있는 모임을 찜하여 나만의 리스트를 완성해보세요.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col">
      <div
        className={cn(
          "grid grid-cols-1 gap-4 transition-opacity duration-200 sm:gap-6",
          isFetching ? "pointer-events-none opacity-50" : "opacity-100",
        )}
      >
        {favorites.map((item) => (
          <UserCard
            key={item.id}
            isSecret={isSecretMeeting(item.meeting.dateTime)}
            title={item.meeting.name}
            type={item.meeting.type}
            date={new Date(item.meeting.createdAt)}
            imageSrc={item.meeting.image ?? undefined}
            capacity={item.meeting.capacity}
            participantCount={item.meeting.participantCount}
            defaultLiked={true}
            onDetailClick={() => router.push(`/meetings/${item.meetingId}`)}
            onHeartClick={() => toggleFavorite(item.meetingId)}
          />
        ))}
      </div>

      <div className="mt-10 flex flex-col items-center gap-4">
        <NumberPagination
          href="#"
          page={page}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      </div>
    </div>
  );
}

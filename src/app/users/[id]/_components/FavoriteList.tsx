"use client";

import { useRouter } from "next/navigation";
import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { deleteFavorites, getFavorites } from "@/api/client/meetings";
import { UserCard } from "@/components/features/card/UserCard";
import { Loader2, HeartOff } from "lucide-react";
import { QUERY_KEYS } from "@/constans/queryKey";
import NumberPagination from "@/components/ui/NumberPagination";
import { useState } from "react";

const FAVORITES_PAGE_SIZE = 10;

export default function FavoriteList() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const currentOffset = (page - 1) * FAVORITES_PAGE_SIZE;

  const { data, isFetching, isLoading } = useQuery({
    queryKey: QUERY_KEYS.favorites.page(page, FAVORITES_PAGE_SIZE),
    queryFn: () =>
      getFavorites({
        offset: currentOffset,
        limit: FAVORITES_PAGE_SIZE,
      }),
    placeholderData: keepPreviousData,
    staleTime: 1000 * 60 * 5,
  });

  const { mutate: toggleFavorite } = useMutation({
    mutationFn: (meetingId: number) => deleteFavorites(meetingId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.favorites.root });
    },
  });

  const favorites = data?.data ?? [];
  const totalCount = data?.totalCount ?? favorites.length;
  const totalPages = Math.max(1, Math.ceil(totalCount / FAVORITES_PAGE_SIZE));

  const handlePageChange = (targetPage: number) => {
    if (targetPage < 1 || targetPage > totalPages) return;
    setPage(targetPage);
  };

  if (isLoading) {
    return null;
  }

  if (favorites.length === 0 && !isFetching) {
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
        {favorites.map((item) => (
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

      <div className="mt-10 flex flex-col items-center gap-4">
        {isFetching && (
          <div className="flex items-center gap-3">
            <Loader2 className="text-main-purple animate-spin" size={20} />
            <span className="text-[10px] font-black tracking-[0.3em] text-slate-400 uppercase">
              Updating Archive...
            </span>
          </div>
        )}

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

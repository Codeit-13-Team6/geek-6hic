"use client";

import { useRouter } from "next/navigation";
import { getMeeting } from "@/api/client/meetings";
import { UserCard } from "@/components/features/card/UserCard";
import { Loader2, PlusCircle } from "lucide-react";
import { QUERY_KEYS } from "@/constans/queryKey";
import NumberPagination from "@/components/ui/NumberPagination";
import { useOffsetPaginationQuery } from "@/hooks/useOffsetPaginationQuery";

const MY_MEETINGS_PAGE_SIZE = 10;

export default function MyMeetingList() {
  const router = useRouter();
  const {
    items: meetings,
    isFetching,
    isLoading,
    page,
    totalPages,
    handlePageChange,
  } = useOffsetPaginationQuery({
    pageSize: MY_MEETINGS_PAGE_SIZE,
    queryKey: QUERY_KEYS.meetings.myPage,
    queryFn: getMeeting,
  });

  if (isLoading) {
    return null;
  }

  if (meetings.length === 0 && !isFetching) {
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
      <div className="grid grid-cols-1 gap-4 sm:gap-6">
        {meetings.map((item) => (
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

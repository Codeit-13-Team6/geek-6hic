"use client";

import { useRouter } from "next/navigation";
import { getMeeting, getUserMeetingsPage } from "@/shared/api/client/meetings";
import { UserCard } from "@/app/users/[id]/_components/UserCard";
import { PlusCircle } from "lucide-react";
import { QUERY_KEYS } from "@/shared/constants/queryKey";
import NumberPagination from "@/shared/components/ui/NumberPagination";
import { useOffsetPaginationQuery } from "@/shared/hooks/useOffsetPaginationQuery";
import { isSecretMeeting } from "@/shared/lib/meetingSecret";
import { UserTabSkeleton } from "@/shared/components/skeleton/UserTabSkeleton";
import { cn } from "@/shared/lib/utils";

const MY_MEETINGS_PAGE_SIZE = 10;

interface MyMeetingListProps {
  isOwnProfile?: boolean;
  userId?: number;
}

export default function UserMeetingList({
  isOwnProfile = true,
  userId,
}: MyMeetingListProps) {
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
    queryKey: (pageNumber, limit) =>
      isOwnProfile
        ? QUERY_KEYS.meetings.myPage(pageNumber, limit)
        : QUERY_KEYS.meetings.userPage(userId!, pageNumber, limit),
    queryFn: ({ offset, limit }) =>
      isOwnProfile
        ? getMeeting({ offset, limit })
        : getUserMeetingsPage({
            userId: userId!,
            offset,
            limit,
          }),
    scrollTargetId: "pagination-top",
  });

  if (isLoading) {
    return <UserTabSkeleton variant="meeting" />;
  }

  if (meetings.length === 0 && !isFetching) {
    return (
      <div className="flex flex-col items-center justify-center border-t border-slate-100 py-32">
        <div className="mb-6 flex size-20 items-center justify-center rounded-full bg-slate-50">
          <PlusCircle className="size-10 text-slate-200" strokeWidth={1.5} />
        </div>
        <h3 className="text-xl font-black tracking-tighter text-slate-900 uppercase">
          {isOwnProfile ? "아직 주최한 모임이 없어요" : "아직 모임이 없어요"}
        </h3>
        <p className="mt-2 text-sm font-medium text-slate-400">
          {isOwnProfile
            ? "아직 직접 개설한 모임이 없습니다. 새로운 모임을 시작해보세요."
            : "아직 이 사용자가 개설한 모임이 없습니다."}
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
        {meetings.map((item) => (
          <UserCard
            key={item.id}
            title={item.name}
            type={item.type}
            date={new Date(item.createdAt)}
            imageSrc={item.image ?? undefined}
            capacity={item.capacity}
            participantCount={item.participantCount}
            showLikeBtn={false}
            showLockBtn={isSecretMeeting(item.dateTime)}
            onDetailClick={() => router.push(`/meetings/${item.id}`)}
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

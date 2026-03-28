"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useIntersectionObserver } from "@/hooks/useIntersectionObserver";
import type { DateRange } from "react-day-picker";

import { getMeetingList } from "@/api/meetings";
import type { JoinedMeetingsResponse, GetMeetingListParams } from "@/types";
import { useMeetingFavoriteMutation } from "@/hooks/useMeetingFavoriteMutation";
import MeetingList from "./MeetingList";
import MeetingFilters, {
  type SortValue,
  type TabValue,
} from "./MeetingsFilters";
import { CreateMeetingModal } from "@/app/meetings/modal/CreateMeetingModal";

const TAB_LIST = [
  { value: "all", label: "전체", type: undefined },
  { value: "team", label: "팀미팅", type: "팀미팅" },
  { value: "study", label: "스터디", type: "스터디" },
  { value: "job", label: "취준생", type: "취준생" },
  { value: "wework", label: "위워크", type: "위워크" },
  { value: "etc", label: "기타", type: "기타" },
] as const;

const sortByMap = {
  deadline: "registrationEnd",
  participants: "participantCount",
} as const;

const sortOrderMap = {
  deadline: "asc",
  participants: "desc",
} as const;

export default function MeetingsClient() {
  const router = useRouter();

  const [activeValue, setActiveValue] = useState<TabValue>("all");
  const [sortValue, setSortValue] = useState<SortValue>(null);
  const [appliedDate, setAppliedDate] = useState<DateRange | undefined>(
    undefined,
  );

  const { toggleFavorite } = useMeetingFavoriteMutation();

  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useInfiniteQuery<JoinedMeetingsResponse>({
      queryKey: ["meetings", activeValue, sortValue],
      queryFn: ({ pageParam }) => {
        const currentTab = TAB_LIST.find((tab) => tab.value === activeValue);
        const cursor = typeof pageParam === "string" ? pageParam : undefined;

        const params: GetMeetingListParams = {
          type: currentTab?.type,
          size: 10,
          ...(sortValue
            ? {
                sortBy: sortByMap[sortValue],
                sortOrder: sortOrderMap[sortValue],
              }
            : {}),
          ...(cursor ? { cursor } : {}),
        };

        return getMeetingList(params);
      },
      initialPageParam: undefined,
      getNextPageParam: (lastPage) =>
        lastPage.hasMore ? (lastPage.nextCursor ?? undefined) : undefined,
    });

  const bottomRef = useIntersectionObserver(
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  );

  const meetingList = data?.pages.flatMap((page) => page.data ?? []) ?? [];

  const filteredMeetingList = meetingList.filter((meeting) => {
    if (!appliedDate?.from || !appliedDate?.to) return true;

    const meetingTime = new Date(meeting.dateTime).getTime();
    const fromTime = new Date(appliedDate.from).setHours(0, 0, 0, 0);
    const toTime = new Date(appliedDate.to).setHours(23, 59, 59, 999);

    return meetingTime >= fromTime && meetingTime <= toTime;
  });

  const handleResetFilters = () => {
    setSortValue(null);
    setAppliedDate(undefined);
  };

  return (
    <div className="flex w-full flex-col">
      <CreateMeetingModal />

      <div className="sticky top-6 z-40 mb-2 sm:mb-16">
        <MeetingFilters
          activeValue={activeValue}
          sortValue={sortValue}
          appliedDate={appliedDate}
          onChangeTab={setActiveValue}
          onChangeSort={setSortValue}
          onApplyDate={setAppliedDate}
          onResetFilters={handleResetFilters}
        />
      </div>

      {/* 리스트 그리드 간격 넓혀서 개방감 확보 */}
      <div className="grid gap-x-12 gap-y-16 sm:grid-cols-2">
        <MeetingList
          meetingList={filteredMeetingList}
          isLoading={isLoading}
          onItemClick={(item) => router.push(`/meetings/${item.id}`)}
          sortValue={sortValue}
          onHeartClick={(item) => toggleFavorite(item)}
        />
      </div>

      {/* 하단 로딩 영역: 굵은 상단 보더, 딥 퍼플 텍스트 적용 */}
      <div
        ref={bottomRef}
        className="mt-20 flex h-40 w-full items-center justify-center border-t-2 border-slate-950"
      >
        {isFetchingNextPage && (
          // 로딩 텍스트 포인트 컬러 변경: 딥 퍼플(#260656)
          <p className="animate-pulse text-xs font-black tracking-[0.4em] text-[#260656] uppercase">
            Fetching Data...
          </p>
        )}
        {!hasNextPage && filteredMeetingList.length > 0 && (
          <p className="text-xs font-black tracking-[0.4em] text-slate-300 uppercase">
            End of Archive
          </p>
        )}
      </div>
    </div>
  );
}

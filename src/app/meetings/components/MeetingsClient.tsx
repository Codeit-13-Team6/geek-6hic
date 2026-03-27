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

      <div className="sticky top-6 z-40 mb-8 sm:mb-10">
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

      <div className="flex flex-col gap-5 sm:grid sm:grid-cols-2 lg:grid-cols-2 lg:gap-6">
        <MeetingList
          meetingList={filteredMeetingList}
          isLoading={isLoading}
          onItemClick={(item) => router.push(`/meetings/${item.id}`)}
          sortValue={sortValue}
          onHeartClick={(item) => toggleFavorite(item)}
        />
      </div>

      <div
        ref={bottomRef}
        className="flex h-32 w-full items-center justify-center py-10"
      >
        {isFetchingNextPage && (
          <div className="flex items-center gap-3 text-sm font-bold text-rose-500">
            <span className="h-5 w-5 animate-spin rounded-full border-[3px] border-rose-400 border-t-transparent"></span>
            데이터를 불러오는 중입니다...
          </div>
        )}
        {!hasNextPage && filteredMeetingList.length > 0 && (
          <p className="text-sm font-bold text-slate-400">
            모든 모임을 다 확인하셨습니다
          </p>
        )}
      </div>
    </div>
  );
}

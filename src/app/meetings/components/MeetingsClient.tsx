"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useIntersectionObserver } from "@/hooks/useIntersectionObserver";
import type { DateRange } from "react-day-picker";

import { getMeetingList } from "@/api/client/meetings";
import type {
  JoinedMeetingsResponse,
  GetMeetingListParams,
  TabValue,
  SortValue,
} from "@/types";
import MeetingList from "../../../components/features/list/MeetingList";
import MeetingFilters from "./MeetingsFilters";
import { CreateMeetingModal } from "@/app/meetings/modal/CreateMeetingModal";
import { useMeetingFavoriteMutation } from "@/hooks";

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
// const sortOrderMap = {
//   deadline: "asc",
//   participants: "desc",
// } as const;

export default function MeetingsClient() {
  const router = useRouter();

  // 현재 선택된 탭
  const [activeValue, setActiveValue] = useState<TabValue>("all");

  // 현재 선택된 정렬
  const [sortValue, setSortValue] = useState<SortValue>(null);
  const [isSortDesc, setIsSortDesc] = useState<boolean>(true);

  // 실제 적용된 날짜 필터
  const [appliedDate, setAppliedDate] = useState<DateRange | undefined>(
    undefined,
  );

  const { toggleFavorite } = useMeetingFavoriteMutation([
    "meetings",
    activeValue,
    sortValue,
    isSortDesc,
  ]);

  // 현재 탭에 맞는 API type 찾기
  const currentTab = TAB_LIST.find((tab) => tab.value === activeValue);

  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useInfiniteQuery<JoinedMeetingsResponse>({
      queryKey: ["meetings", activeValue, sortValue, isSortDesc],
      queryFn: ({ pageParam }) => {
        const currentTab = TAB_LIST.find((tab) => tab.value === activeValue);
        const cursor = typeof pageParam === "string" ? pageParam : undefined;

        const params: GetMeetingListParams = {
          type: currentTab?.type,
          size: 10,
          sortOrder: isSortDesc ? "desc" : "asc",
          ...(sortValue
            ? {
                sortBy: sortByMap[sortValue],
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

  // 날짜 필터 적용
  const filteredMeetingList = meetingList.filter((meeting) => {
    if (!appliedDate?.from || !appliedDate?.to) return true;

    const meetingTime = new Date(meeting.dateTime).getTime();
    const fromTime = new Date(appliedDate.from).setHours(0, 0, 0, 0);
    const toTime = new Date(appliedDate.to).setHours(23, 59, 59, 999);

    return meetingTime >= fromTime && meetingTime <= toTime;
  });

  // 탭 변경 시 정렬/날짜 초기화
  const handleResetFilters = () => {
    setSortValue(null);
    setAppliedDate(undefined);
  };

  return (
    <div className="w-full">
      <CreateMeetingModal />

      <div className="mb-10 sm:mb-14">
        <MeetingFilters
          // 현재 상태 (부모 → 자식)
          activeValue={activeValue}
          sortValue={sortValue}
          sortDescValue={isSortDesc}
          appliedDate={appliedDate}
          // 상태 변경 핸들러 (자식 → 부모)
          onChangeTab={setActiveValue}
          onChangeSort={setSortValue}
          onChangeSortDesc={setIsSortDesc}
          onApplyDate={setAppliedDate}
          onResetFilters={handleResetFilters}
        />
      </div>

      <div className="flex flex-col gap-6 sm:gap-8 lg:grid lg:grid-cols-2 lg:gap-x-10 lg:gap-y-12">
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
        className="mt-20 flex h-60 w-full flex-col items-center justify-center border-t border-slate-100"
      >
        {isFetchingNextPage ? (
          <div className="flex flex-col items-center gap-3">
            <div className="bg-main-purple h-1 w-12 animate-pulse" />
            <p className="text-main-purple text-[10px] font-black tracking-[0.4em] uppercase">
              Updating Archive...
            </p>
          </div>
        ) : (
          !hasNextPage &&
          filteredMeetingList.length > 0 && (
            <div className="flex flex-col items-center gap-4">
              <div className="h-1.5 w-8 bg-slate-400" />
              <p className="text-[11px] font-black tracking-[0.2em] text-slate-300 uppercase">
                End of Archive.
              </p>
            </div>
          )
        )}
      </div>
    </div>
  );
}

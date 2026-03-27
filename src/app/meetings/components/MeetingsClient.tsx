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

  // 현재 선택된 탭
  const [activeValue, setActiveValue] = useState<TabValue>("all");

  // 현재 선택된 정렬
  const [sortValue, setSortValue] = useState<SortValue>(null);

  // 실제 적용된 날짜 필터
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
    // Page.tsx에서 레이아웃을 잡아주므로 여기서는 불필요한 max-w 속성을 제거하고 100% 사용
    <div className="flex w-full flex-col">
      <CreateMeetingModal />

      {/* 툴바 섹션 영역: MeetingFilters 컴포넌트를 이 랩퍼 안에 그대로 배치 */}
      <div className="sticky top-6 z-40 mb-10 sm:mb-12">
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

      {/* 리스트 영역: 우리가 세팅했던 2열 그리드 레이아웃 적용 */}
      <div className="flex flex-col gap-6 sm:grid sm:grid-cols-2 lg:grid-cols-2 lg:gap-8">
        <MeetingList
          meetingList={filteredMeetingList}
          isLoading={isLoading}
          onItemClick={(item) => router.push(`/meetings/${item.id}`)}
          sortValue={sortValue}
          onHeartClick={(item) => toggleFavorite(item)}
        />
      </div>

      {/* 무한 스크롤 옵저버 영역: 텍스트 덜렁 있는 것 대신 보라색 로딩 스피너 적용 */}
      <div
        ref={bottomRef}
        className="flex h-32 w-full items-center justify-center py-10"
      >
        {isFetchingNextPage && (
          <div className="flex items-center gap-3 text-sm font-bold text-violet-600">
            <span className="h-5 w-5 animate-spin rounded-full border-[3px] border-violet-600 border-t-transparent"></span>
            데이터를 불러오는 중입니다...
          </div>
        )}
        {!hasNextPage && filteredMeetingList.length > 0 && (
          <p className="text-sm font-bold text-slate-400">
            모든 모임을 다 확인하셨습니다 ✨
          </p>
        )}
      </div>
    </div>
  );
}

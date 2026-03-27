"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import type { DateRange } from "react-day-picker";

import { getMeetingList } from "@/api/meetings";
import type { JoinedMeeting } from "@/types";
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
  const [appliedDate, setAppliedDate] = useState<DateRange | undefined>(undefined);

  const { toggleFavorite } = useMeetingFavoriteMutation();

  // 현재 탭에 맞는 API type 찾기
  const currentTab = TAB_LIST.find((tab) => tab.value === activeValue);

  const { data: meetingList = [], isLoading } = useQuery<JoinedMeeting[]>({
    // 서버 prefetch key와 초기값이 같아야 캐시를 바로 사용함
    queryKey: ["meetings", activeValue, sortValue],
    queryFn: async () => {
      const params = {
        type: currentTab?.type,
        size: 100,
        ...(sortValue
          ? {
              sortBy: sortByMap[sortValue],
              sortOrder: sortOrderMap[sortValue],
            }
          : {}),
      };

      return getMeetingList(params);
    },
  });

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
    <div className="mx-auto w-full max-w-[1280px] sm:px-6">
      <CreateMeetingModal />

      <MeetingFilters
        // 현재 상태 (부모 → 자식)
        activeValue={activeValue}
        sortValue={sortValue}
        appliedDate={appliedDate}

        // 상태 변경 핸들러 (자식 → 부모)
        onChangeTab={setActiveValue}
        onChangeSort={setSortValue}
        onApplyDate={setAppliedDate}
        onResetFilters={handleResetFilters}
      />

      <div className="flex flex-col gap-4 lg:grid lg:grid-cols-2">
        <MeetingList
          meetingList={filteredMeetingList}
          isLoading={isLoading}
          onItemClick={(item) => router.push(`/meetings/${item.id}`)}
          sortValue={sortValue}
          onHeartClick={(item) => toggleFavorite(item)}
        />
      </div>
    </div>
  );
}
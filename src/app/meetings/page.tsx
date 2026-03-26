"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { getMeetingList } from "@/api/meetings";
import type { JoinedMeeting } from "@/types";
import type { DateRange } from "react-day-picker";
import { useMeetingFavoriteMutation } from "@/hooks/useMeetingFavoriteMutation";
import MeetingList from "./components/MeetingList";
import MeetingFilters, {
  type SortValue,
  type TabValue,
} from "./components/MeetingFilters";
import { CreateMeetingModal } from "@/app/meetings/modal/CreateMeetingModal";

import bannerLg from "@/assets/img/banner/banner-lg.png";
import bannerSm from "@/assets/img/banner/banner-sm.png";

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

export default function Page() {
  const router = useRouter();

  const [activeValue, setActiveValue] = useState<TabValue>("all");
  const [sortValue, setSortValue] = useState<SortValue>(null);
  const [appliedDate, setAppliedDate] = useState<DateRange | undefined>(undefined);

  const { toggleFavorite } = useMeetingFavoriteMutation();

  const currentTab = TAB_LIST.find((tab) => tab.value === activeValue);

  const { data: meetingList = [], isLoading } = useQuery<JoinedMeeting[]>({
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

      const response = await getMeetingList(params);
      return response;
    },
  });

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
    <>
      <CreateMeetingModal />

      <div className="w-full bg-gray-50 pb-20 sm:pt-6 lg:pt-[48px]">
        <div className="relative mx-auto flex min-h-48 w-full items-center overflow-hidden bg-[#9debcd] bg-[url('/img/banner/banner-lg-demo.jpg')] bg-cover bg-center bg-no-repeat pl-4 sm:min-h-61 sm:max-w-[calc(100%-48px)] sm:rounded-3xl sm:bg-none sm:pl-10 lg:max-w-[1280px] lg:pl-14">
          <div>
            <h4 className="text-sm text-green-700 sm:text-xl">
              함께할 사람을 찾고 계신가요?
            </h4>
            <h3 className="mt-[10px] text-lg font-semibold sm:text-3xl">
              지금 모임에 참여해보세요
            </h3>

            <div className="absolute left-[323px] top-7 hidden h-[273px] w-117 sm:block lg:hidden">
              <Image src={bannerLg} fill alt="" />
            </div>

            <div className="absolute right-21 top-2 hidden h-[313px] w-134 lg:block">
              <Image src={bannerSm} fill alt="" />
            </div>
          </div>
        </div>

        <div className="mx-auto w-full max-w-[1280px] sm:px-6">
          <MeetingFilters
            activeValue={activeValue}
            sortValue={sortValue}
            appliedDate={appliedDate}
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
      </div>
    </>
  );
}
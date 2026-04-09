"use client";

import { useMemo } from "react";
import { cn } from "@/lib/utils";
import { useMeetingSearchParams } from "@/hooks/useMeetingSearchParams";
import SearchBarCommon from "@/components/ui/SearchBarCommon";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/SelectCommon";
import { useQuery } from "@tanstack/react-query"; // ✅ 다시 추가
import { QUERY_KEYS } from "@/constans/queryKey"; // ✅ 다시 추가
import { getMeetingTypes } from "@/api/client"; // ✅ 다시 추가
import type { MeetingType } from "@/types";

const SORT_UI_OPTIONS = [
  { id: "latest", label: "최신순", sortBy: "dateTime", sortOrder: "desc" },
  { id: "oldest", label: "오래된순", sortBy: "dateTime", sortOrder: "asc" },
  {
    id: "participant",
    label: "참여인원순",
    sortBy: "participantCount",
    sortOrder: "desc",
  },
] as const;

export default function MeetingFilters() {
  const {
    tabValue,
    keyword,
    sortBy,
    sortOrder,
    setTabValue,
    setKeyword,
    updateParams,
  } = useMeetingSearchParams();

  // ✅ [복구] 서버에서 탭(모임 유형) 데이터 가져오기
  const { data: meetingTypes = [] } = useQuery<MeetingType[]>({
    queryKey: QUERY_KEYS.meetings.meetingType,
    queryFn: getMeetingTypes,
    staleTime: 1000 * 60 * 5,
  });

  // ✅ [복구] 가져온 데이터를 탭 리스트 형식으로 변환
  const tabList = useMemo(
    () => [
      { value: "", label: "전체" },
      ...meetingTypes.map((t) => ({ value: String(t.name), label: t.name })),
    ],
    [meetingTypes],
  );

  const currentOption =
    SORT_UI_OPTIONS.find(
      (opt) => opt.sortBy === sortBy && opt.sortOrder === sortOrder,
    ) || SORT_UI_OPTIONS[0];

  return (
    <div className="flex flex-col gap-10">
      <SearchBarCommon
        placeholder="어떤 모임을 찾으시나요?"
        onSearch={(val) => setKeyword(val)}
      />

      <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
        {/* ✅ 다시 풍성해진 탭 리스트 */}
        <ul className="custom-scrollbar flex gap-6 overflow-x-auto border-b border-slate-100 pb-1">
          {tabList.map(({ value, label }) => (
            <li key={label} className="relative shrink-0">
              <button
                onClick={() => setTabValue(value)}
                className={cn(
                  "pb-3 text-sm font-black transition-all sm:text-base",
                  tabValue === value
                    ? "text-main-purple"
                    : "text-slate-400 hover:text-slate-500",
                )}
              >
                {label}
              </button>
              {tabValue === value && (
                <div className="bg-main-purple absolute bottom-0 left-0 h-[3px] w-full" />
              )}
            </li>
          ))}
        </ul>

        <div className="flex shrink-0 items-center gap-3">
          <Select
            value={currentOption.id}
            onValueChange={(id) => {
              const selected = SORT_UI_OPTIONS.find((opt) => opt.id === id);
              if (selected) {
                updateParams({
                  sortBy: selected.sortBy,
                  sortOrder: selected.sortOrder,
                });
              }
            }}
          >
            <SelectTrigger className="text-main-purple w-[120px] border-none bg-transparent font-black focus:ring-0">
              <SelectValue>{currentOption.label}</SelectValue>
            </SelectTrigger>
            <SelectContent align="end">
              <SelectGroup>
                {SORT_UI_OPTIONS.map((opt) => (
                  <SelectItem key={opt.id} value={opt.id} className="font-bold">
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
      </div>

      {keyword && (
        <div className="text-sm text-slate-500">
          <span className="text-main-purple font-bold">"{keyword}"</span> 검색
          결과입니다.
        </div>
      )}
    </div>
  );
}

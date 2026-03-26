"use client";

import { useState } from "react";
import type { DateRange } from "react-day-picker";
import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/Calendar";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/SelectCommon";

const TAB_LIST = [
  { value: "all", label: "전체", type: undefined },
  { value: "team", label: "팀미팅", type: "팀미팅" },
  { value: "study", label: "스터디", type: "스터디" },
  { value: "job", label: "취준생", type: "취준생" },
  { value: "wework", label: "위워크", type: "위워크" },
  { value: "etc", label: "기타", type: "기타" },
] as const;

const SORT_OPTIONS = [
  { value: "deadline", label: "마감임박 순" },
  { value: "participants", label: "참여인원 순" },
] as const;

export type TabValue = (typeof TAB_LIST)[number]["value"];
export type SortValue = "deadline" | "participants" | null;

interface MeetingFiltersProps {
  activeValue: TabValue;
  sortValue: SortValue;
  appliedDate: DateRange | undefined;
  onChangeTab: (value: TabValue) => void;
  onChangeSort: (value: SortValue) => void;
  onApplyDate: (value: DateRange | undefined) => void;
  onResetFilters: () => void;
}

export default function MeetingFilters({
  activeValue,
  sortValue,
  appliedDate,
  onChangeTab,
  onChangeSort,
  onApplyDate,
  onResetFilters,
}: MeetingFiltersProps) {
  const [draftDate, setDraftDate] = useState<DateRange | undefined>(appliedDate);
  const [isOpen, setIsOpen] = useState(false);

  const currentSortLabel = SORT_OPTIONS.find(
    (opt) => opt.value === sortValue,
  )?.label;

  // 탭클릭
  const handleTabClick = (value: TabValue) => {
    setDraftDate(undefined); //캘린더 선택 중이던 값 초기화 (UI 상태 리셋)
    setIsOpen(false); //캘린더 닫기
    onChangeTab(value);
    onResetFilters();
  };

  // 캘린더 초기화
  const handleCalendarReset = () => {
    setDraftDate(undefined);
    onApplyDate(undefined);
  };

  // 캘린더 적용
  const handleCalendarApply = () => {
    onApplyDate(draftDate);
    setIsOpen(false);
  };

  return (
    <div className="mb-4 mt-6 flex flex-col">
      <ul className="flex gap-2 overflow-auto">
        {TAB_LIST.map(({ value, label }) => (
          <li key={value} className="shrink-0">
            <button
              type="button"
              onClick={() => handleTabClick(value)}
              className={cn(
                "shrink-0 cursor-pointer rounded-[14px] px-4 py-2 transition-colors",
                activeValue === value
                  ? "bg-gray-700 font-bold text-white"
                  : "bg-gray-100 text-gray-800",
              )}
            >
              {label}
            </button>
          </li>
        ))}
      </ul>

      <div className="mt-2 flex items-center justify-end">
        <div className="relative">
          <button
            type="button"
            className="cursor-pointer"
            onClick={() => setIsOpen(true)}
          >
            날짜 선택
          </button>

          {isOpen ? (
            <Calendar
              mode="range"
              selected={draftDate}
              onSelect={setDraftDate}
              onReset={handleCalendarReset}
              onApply={handleCalendarApply}
            />
          ) : null}
        </div>

        <Select
          value={sortValue ?? ""}
          onValueChange={(value) => {
            if (value === "deadline" || value === "participants") {
              onChangeSort(value);
            }
          }}
        >
          <SelectTrigger className="h-[50px]! w-[140px] rounded-[12px]! px-4 text-sm font-medium text-gray-800">
            {currentSortLabel ? (
              <span>{currentSortLabel}</span>
            ) : (
              <SelectValue placeholder="정렬 선택" />
            )}
          </SelectTrigger>

          <SelectContent className="w-[140px]">
            <SelectGroup>
              {SORT_OPTIONS.map((item) => (
                <SelectItem key={item.value} value={item.value}>
                  {item.label}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
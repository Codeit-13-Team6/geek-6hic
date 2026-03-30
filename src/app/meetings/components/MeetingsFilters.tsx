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
import { MeetingFiltersProps, TabValue } from "@/types";

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

export default function MeetingFilters({
  activeValue,
  sortValue,
  appliedDate,
  onChangeTab,
  onChangeSort,
  onApplyDate,
  onResetFilters,
}: MeetingFiltersProps) {
  const [draftDate, setDraftDate] = useState<DateRange | undefined>(
    appliedDate,
  );
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
    <div className="flex w-full flex-col gap-6 md:flex-row md:items-end md:justify-between">
      <ul className="custom-scrollbar flex gap-6 overflow-x-auto sm:gap-8">
        {TAB_LIST.map(({ value, label }) => (
          <li key={value} className="relative shrink-0 pb-2">
            <button
              type="button"
              onClick={() => handleTabClick(value)}
              className={cn(
                "text-sm font-black tracking-tight transition-all sm:text-base",
                activeValue === value
                  ? "text-main-purple"
                  : "text-slate-300 hover:text-slate-500",
              )}
            >
              {label}
            </button>
            {activeValue === value && (
              <div className="bg-main-purple absolute bottom-0 left-0 h-1 w-full" />
            )}
          </li>
        ))}
      </ul>

      <div className="flex shrink-0 items-center justify-end gap-6 sm:gap-8">
        {/* 날짜 선택 */}
        <div className="relative">
          <button
            type="button"
            className={cn(
              "cursor-pointer pb-0.5 text-xs font-black tracking-widest uppercase transition-colors sm:text-xs",
              appliedDate
                ? "text-main-purple"
                : "hover:text-main-purple text-slate-900",
            )}
            onClick={() => setIsOpen(true)}
          >
            Select Date
          </button>

          {isOpen ? (
            <>
              {/* 캘린더 팝업 */}
              <div className="shadow-mag absolute top-8 right-0 z-50 rounded-2xl bg-white">
                <Calendar
                  mode="range"
                  selected={draftDate}
                  onSelect={setDraftDate}
                  onReset={handleCalendarReset}
                  onApply={handleCalendarApply}
                />
              </div>
              <div
                onClick={() => setIsOpen(false)}
                className="fixed inset-0 z-40 bg-transparent"
              ></div>
            </>
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
          <SelectTrigger
            suppressHydrationWarning
            className="h-auto w-auto gap-2 border-none bg-transparent p-0 text-xs font-black tracking-widest text-slate-400 uppercase shadow-none hover:text-slate-900 focus:ring-0 sm:text-xs"
          >
            {currentSortLabel ? (
              <span className="text-main-purple">{currentSortLabel}</span>
            ) : (
              <SelectValue placeholder="SORT BY" />
            )}
          </SelectTrigger>
          <SelectContent
            alignItemWithTrigger={false}
            sideOffset={2}
            align="end"
            className="z-50 min-w-[140px] overflow-hidden rounded-xl border-0 bg-white shadow-[0_10px_40px_-10px_rgba(0,0,0,0.1)] ring-1 ring-slate-900/5 outline-none"
          >
            <SelectGroup className="p-1">
              {SORT_OPTIONS.map((item) => (
                <SelectItem
                  key={item.value}
                  value={item.value}
                  className="focus:text-main-purple cursor-pointer rounded-xl px-3 py-2.5 text-sm font-bold text-slate-700 outline-none focus:bg-slate-50"
                >
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

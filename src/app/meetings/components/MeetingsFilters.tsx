"use client";

import { useState } from "react";
import type { DateRange } from "react-day-picker";
import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/Calendar";
// framer-motion 제거 (매거진 스타일에 불필요)
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

// 원본 props 타입 정의 완벽 유지
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
  const [draftDate, setDraftDate] = useState<DateRange | undefined>(
    appliedDate,
  );
  const [isOpen, setIsOpen] = useState(false);

  const currentSortLabel = SORT_OPTIONS.find(
    (opt) => opt.value === sortValue,
  )?.label;

  const handleTabClick = (value: TabValue) => {
    setDraftDate(undefined);
    setIsOpen(false);
    onChangeTab(value);
    onResetFilters();
  };

  const handleCalendarReset = () => {
    setDraftDate(undefined);
    onApplyDate(undefined);
  };

  const handleCalendarApply = () => {
    onApplyDate(draftDate);
    setIsOpen(false);
  };

  return (
    // 매거진 스타일 툴바: 직선적인 레이아웃, 여백 확대
    <div className="mb-2 flex flex-col gap-10 border-b border-slate-200 pb-10 lg:flex-row lg:items-center lg:justify-between">
      {/* 탭 리스트: 각진 태그 스타일, 언더라인 포인트 */}
      <nav className="flex flex-wrap gap-x-8 gap-y-4 pb-1">
        {TAB_LIST.map(({ value, label }) => {
          const isActive = activeValue === value;
          return (
            <button
              key={value}
              type="button"
              onClick={() => handleTabClick(value)}
              className={cn(
                "relative pb-3 text-sm font-black tracking-wide transition-all outline-none",
                isActive
                  ? "text-[#260656]" // 활성 탭 색상 변경: 딥 퍼플(#260656)
                  : "text-slate-300 hover:text-slate-500",
              )}
            >
              {label}
              {isActive && (
                // 활성 탭 언더라인 색상 변경: 딥 퍼플(#260656)
                <span className="absolute bottom-0 left-0 h-[3px] w-full bg-[#260656]" />
              )}
            </button>
          );
        })}
      </nav>

      {/* 우측 필터 영역: 각진 디자인, 굵은 테두리 */}
      <div className="flex flex-wrap items-center gap-6 pr-1 lg:shrink-0">
        <div className="relative z-20">
          <button
            type="button"
            onClick={() => setIsOpen(true)}
            // 호버/활성 색상 변경: 딥 퍼플(#260656)
            className="border-b-2 border-slate-900 pb-1 text-xs font-black tracking-widest text-slate-900 uppercase transition-all outline-none hover:border-[#260656] hover:text-[#260656]"
          >
            {appliedDate ? "PICKED DATE" : "SELECT DATE"}
          </button>

          {isOpen ? (
            <>
              <div
                onClick={() => setIsOpen(false)}
                className="fixed inset-0 z-40"
              />
              {/* 달력 모달: 각진 디자인, 굵은 테두리 */}
              <div className="absolute top-12 right-0 z-50 rounded-none border-2 border-slate-900 bg-white p-4 shadow-2xl">
                <Calendar
                  mode="range"
                  selected={draftDate}
                  onSelect={setDraftDate}
                  onReset={handleCalendarReset}
                  onApply={handleCalendarApply}
                />
              </div>
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
          {/* 정렬 셀렉트: 굵은 테두리, 각진 디자인 */}
          <SelectTrigger className="h-auto border-none p-0 text-xs font-black tracking-widest text-slate-900 uppercase outline-none focus:ring-0">
            <SelectValue placeholder="SORT BY" />
          </SelectTrigger>

          {/* 셀렉트 드롭다운: 각진 디자인, 굵은 테두리 */}
          <SelectContent className="rounded-none border-2 border-slate-900 bg-white shadow-2xl">
            <SelectGroup>
              {SORT_OPTIONS.map((item) => (
                <SelectItem
                  key={item.value}
                  value={item.value}
                  // 호버 색상 변경: 딥 퍼플(#260656)
                  className="cursor-pointer font-bold focus:bg-[#260656] focus:text-white"
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

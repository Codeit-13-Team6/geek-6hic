"use client";

import { useState } from "react";
import type { DateRange } from "react-day-picker";
import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/Calendar";
import { motion } from "framer-motion"; // 우리가 쓰던 쫀득한 애니메이션
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/SelectCommon";

// 프리미엄 툴바에 들어갈 미니멀 SVG 아이콘
const CalendarIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="text-slate-500"
  >
    <rect width="18" height="18" x="3" y="4" rx="2" ry="2" />
    <line x1="16" x2="16" y1="2" y2="6" />
    <line x1="8" x2="8" y1="2" y2="6" />
    <line x1="3" x2="21" y1="10" y2="10" />
  </svg>
);

const ChevronsUpDownIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="text-slate-400"
  >
    <path d="m7 15 5 5 5-5" />
    <path d="m7 9 5-5 5 5" />
  </svg>
);

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
  const [draftDate, setDraftDate] = useState<DateRange | undefined>(
    appliedDate,
  );
  const [isOpen, setIsOpen] = useState(false);

  const currentSortLabel = SORT_OPTIONS.find(
    (opt) => opt.value === sortValue,
  )?.label;

  // 팀원분이 작성하신 깔끔한 로직 유지!
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
    // 전체 툴바 글래스모피즘 래퍼
    <div className="flex w-full flex-col gap-5 rounded-[2rem] border border-white/60 bg-white/60 p-3 shadow-[0_8px_40px_rgba(0,0,0,0.04)] backdrop-blur-[40px] sm:flex-row sm:items-center sm:justify-between sm:p-2 sm:pl-3">
      {/* 1. 카테고리 탭 (Framer Motion 보라색 슬라이더) */}
      <div className="scrollbar-hide flex overflow-x-auto pb-1 sm:pb-0">
        <ul className="flex gap-1.5 rounded-full border border-slate-200/50 bg-white/50 p-1.5 shadow-inner backdrop-blur-2xl">
          {TAB_LIST.map(({ value, label }) => {
            const isActive = activeValue === value;
            return (
              <li key={value} className="relative shrink-0">
                {isActive && (
                  <motion.div
                    layoutId="active-tab-indicator"
                    className="absolute inset-0 rounded-full bg-violet-600 shadow-[0_2px_8px_rgba(139,92,246,0.4)]"
                    initial={false}
                    transition={{
                      type: "spring",
                      stiffness: 500,
                      damping: 35,
                    }}
                  />
                )}
                <button
                  type="button"
                  onClick={() => handleTabClick(value)}
                  className={cn(
                    "relative z-10 flex items-center justify-center rounded-full px-5 py-2.5 text-sm font-bold transition-colors duration-200",
                    isActive
                      ? "text-white"
                      : "text-slate-500 hover:bg-violet-50/80 hover:text-violet-700",
                  )}
                >
                  {label}
                </button>
              </li>
            );
          })}
        </ul>
      </div>

      {/* 2. 우측 달력 & 정렬 필터 영역 */}
      <div className="flex flex-wrap items-center gap-2.5 pr-1 lg:shrink-0">
        {/* 달력 팝업 버튼 */}
        <div className="relative z-20">
          <button
            type="button"
            className="flex h-11 items-center justify-center gap-2 rounded-full border border-slate-200 bg-white/80 px-5 text-sm font-semibold text-slate-700 shadow-[0_2px_8px_rgba(0,0,0,0.02)] backdrop-blur-2xl transition-all hover:border-violet-300 hover:bg-violet-50/50 hover:text-violet-700 focus:ring-2 focus:ring-violet-500 focus:ring-offset-2 focus:outline-none"
            onClick={() => setIsOpen(true)}
          >
            <CalendarIcon />
            {appliedDate ? "날짜 변경" : "날짜 선택"}
          </button>

          {isOpen ? (
            <>
              {/* 바깥 배경 클릭 시 닫히는 오버레이 (팀원분 로직 활용, z-index만 정리) */}
              <div
                onClick={() => setIsOpen(false)}
                className="fixed inset-0 z-40 cursor-default"
              />
              {/* 팝업되는 글래스 캘린더 컨텐츠 */}
              <div className="absolute top-14 right-0 z-50 mt-2 rounded-[1.5rem] border border-white/80 bg-white/90 p-3 shadow-[0_10px_40px_rgba(0,0,0,0.1)] backdrop-blur-[40px]">
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

        {/* 정렬 셀렉트 박스 */}
        <Select
          value={sortValue ?? ""}
          onValueChange={(value) => {
            if (value === "deadline" || value === "participants") {
              onChangeSort(value);
            }
          }}
        >
          <SelectTrigger className="flex h-11 w-[140px] items-center justify-between rounded-full border border-slate-200 bg-white/80 px-5 text-sm font-semibold text-slate-700 shadow-[0_2px_8px_rgba(0,0,0,0.02)] backdrop-blur-2xl transition-all hover:border-violet-300 hover:bg-violet-50/50 hover:text-violet-700 focus:ring-2 focus:ring-violet-500 focus:ring-offset-2">
            {currentSortLabel ? (
              <span>{currentSortLabel}</span>
            ) : (
              <SelectValue placeholder="정렬 선택" />
            )}
            <ChevronsUpDownIcon />
          </SelectTrigger>

          <SelectContent className="w-[140px] rounded-[1.5rem] border border-white/80 bg-white/90 shadow-[0_10px_40px_rgba(0,0,0,0.1)] backdrop-blur-[40px]">
            <SelectGroup>
              {SORT_OPTIONS.map((item) => (
                <SelectItem
                  key={item.value}
                  value={item.value}
                  className="cursor-pointer rounded-xl px-3 py-2.5 text-sm font-medium text-slate-700 focus:bg-violet-50 focus:font-bold focus:text-violet-700 focus:shadow-sm"
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

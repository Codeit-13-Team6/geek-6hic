"use client";

import { useState } from "react";
import type { DateRange } from "react-day-picker";
import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/Calendar";
import { motion } from "framer-motion";
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
    <div className="flex w-full flex-col gap-4 rounded-3xl border border-rose-100/60 bg-white/70 p-3 shadow-[0_10px_40px_rgba(251,113,133,0.06)] backdrop-blur-md sm:flex-row sm:items-center sm:justify-between sm:pl-4">
      <div className="scrollbar-hide flex overflow-x-auto pb-1 sm:pb-0">
        <ul className="flex gap-1">
          {TAB_LIST.map(({ value, label }) => {
            const isActive = activeValue === value;
            return (
              <li key={value} className="relative shrink-0">
                {isActive && (
                  <motion.div
                    layoutId="active-tab-indicator"
                    className="absolute inset-0 rounded-xl bg-gradient-to-r from-rose-500 to-orange-500 shadow-md shadow-rose-500/25"
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
                    "relative z-10 flex items-center justify-center rounded-xl px-5 py-2 text-sm font-bold transition-colors duration-200",
                    isActive
                      ? "text-white"
                      : "text-slate-500 hover:bg-rose-50/80 hover:text-rose-600",
                  )}
                >
                  {label}
                </button>
              </li>
            );
          })}
        </ul>
      </div>

      <div className="flex flex-wrap items-center gap-2 pr-1 lg:shrink-0">
        <div className="relative z-20">
          <button
            type="button"
            className="flex h-10 items-center justify-center gap-2 rounded-xl border border-rose-100/80 bg-white px-5 text-sm font-bold text-slate-600 transition-all hover:border-rose-200 hover:bg-rose-50/80 hover:text-rose-600"
            onClick={() => setIsOpen(true)}
          >
            {appliedDate ? "날짜 변경" : "날짜 선택"}
          </button>

          {isOpen ? (
            <>
              <div
                onClick={() => setIsOpen(false)}
                className="fixed inset-0 z-40 cursor-default"
              />
              <div className="absolute top-12 right-0 z-50 mt-1 rounded-2xl border border-rose-100 bg-white p-3 shadow-[0_10px_40px_rgba(251,113,133,0.12)]">
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
          <SelectTrigger className="flex h-10 w-[130px] items-center justify-between rounded-xl border border-rose-100/80 bg-white px-4 text-sm font-bold text-slate-600 transition-all hover:border-rose-200 hover:bg-rose-50/80 hover:text-rose-600">
            {currentSortLabel ? (
              <span>{currentSortLabel}</span>
            ) : (
              <SelectValue placeholder="정렬 선택" />
            )}
          </SelectTrigger>

          <SelectContent className="w-[130px] rounded-xl border border-rose-100 bg-white shadow-[0_10px_40px_rgba(251,113,133,0.12)]">
            <SelectGroup>
              {SORT_OPTIONS.map((item) => (
                <SelectItem
                  key={item.value}
                  value={item.value}
                  className="cursor-pointer rounded-lg px-3 py-2 text-sm font-semibold text-slate-600 focus:bg-rose-50 focus:text-rose-600"
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

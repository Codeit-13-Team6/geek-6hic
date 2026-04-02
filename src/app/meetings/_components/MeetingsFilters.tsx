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
import Image from "next/image";
import downIcon from "@/assets/icon/chevron/chevron-down.svg";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/shadcnOrigin/popover";

const SORT_OPTIONS = [
  { value: "deadline", label: "마감임박 순" },
  { value: "participants", label: "참여인원 순" },
] as const;

export default function MeetingFilters({
  tabList,
  activeValue,
  sortValue,
  sortDescValue,
  appliedDate,
  onChangeTab,
  onChangeSort,
  onApplyDate,
  onResetFilters,
  onChangeSortDesc,
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

  const handleClickDesc = () => {
    onChangeSortDesc(!sortDescValue);
  };

  return (
    <div className="flex w-full flex-col gap-6 md:flex-row md:items-end md:justify-between">
      <ul className="custom-scrollbar flex gap-6 overflow-x-auto sm:gap-8">
        {tabList.map(({ value, label }) => (
          <li key={value} className="relative shrink-0 pb-2">
            <button
              type="button"
              onClick={() => handleTabClick(value)}
              className={cn(
                "text-sm font-black tracking-tight transition-all sm:text-base",
                activeValue === value
                  ? "text-main-purple"
                  : "text-slate-400 hover:text-slate-500",
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

        <Popover open={isOpen} onOpenChange={setIsOpen}>
          <PopoverTrigger>
            <div
              className={cn(
                "flex cursor-pointer align-bottom  text-xs font-black tracking-widest uppercase transition-colors sm:text-xs",
                appliedDate
                  ? "text-main-purple"
                  : "hover:text-main-purple text-slate-900",
              )}
            >
              Select Date
            </div>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0 absolute left-[-90]">
            <Calendar
              mode="range"
              selected={draftDate}
              onSelect={setDraftDate}
              onReset={handleCalendarReset}
              onApply={handleCalendarApply}
            />
          </PopoverContent>
        </Popover>

        {/*<div className="relative">*/}
        {/*  <button*/}
        {/*    type="button"*/}
        {/*    className={cn(*/}
        {/*      "cursor-pointer pb-0.5 text-xs font-black tracking-widest uppercase transition-colors sm:text-xs",*/}
        {/*      appliedDate*/}
        {/*        ? "text-main-purple"*/}
        {/*        : "hover:text-main-purple text-slate-900",*/}
        {/*    )}*/}
        {/*    onClick={() => setIsOpen(true)}*/}
        {/*  >*/}
        {/*    Select Date*/}
        {/*  </button>*/}
        {/*  {isOpen ? (*/}
        {/*    <>*/}
        {/*      /!* 캘린더 팝업 *!/*/}
        {/*      <div*/}
        {/*        onClick={() => setIsOpen(false)}*/}
        {/*        className="absolute inset-0 z-40 bg-transparent"*/}
        {/*      ></div>*/}
        {/*      <div className="shadow-mag absolute top-auto right-auto z-50 mt-2 rounded-2xl bg-white">*/}
        {/*        <Calendar*/}
        {/*          mode="range"*/}
        {/*          selected={draftDate}*/}
        {/*          onSelect={setDraftDate}*/}
        {/*          onReset={handleCalendarReset}*/}
        {/*          onApply={handleCalendarApply}*/}
        {/*        />*/}
        {/*      </div>*/}
        {/*    </>*/}
        {/*  ) : null}*/}
        {/*</div>*/}

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
            className="h-auto w-auto cursor-pointer gap-2 border-none bg-transparent p-0 text-xs font-black tracking-widest text-slate-400 uppercase shadow-none hover:text-slate-900 focus:ring-0 sm:text-xs"
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
            className="z-50 min-w-[120px] overflow-hidden rounded-xl border-0 bg-white shadow-[0_10px_40px_-10px_rgba(0,0,0,0.1)] ring-1 ring-slate-900/5 outline-none"
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
        <div
          className="cursor-pointer"
          onClick={() => {
            handleClickDesc();
          }}
        >
          <Image
            className={sortDescValue ? "" : "rotate-180"}
            src={downIcon}
            width="24"
            height="24"
            alt="구글 아이콘"
          />
        </div>
      </div>
    </div>
  );
}

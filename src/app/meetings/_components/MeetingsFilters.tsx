"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/SelectCommon";
import type { MeetingType } from "@/types";
import Image from "next/image";
import downIcon from "@/assets/icon/chevron/chevron-down.svg";
import { useQuery } from "@tanstack/react-query";
import { QUERY_KEYS } from "@/constans/queryKey";
import { getMeetingTypes } from "@/api/client";
import { useMeetingSearchParams } from "@/hooks/useMeetingSearchParams";

const SORT_OPTIONS = [
  { value: "participantCount", label: "참여인원 순" },
] as const;

export default function MeetingFilters() {
  const {
    tabValue,
    sortBy,
    sortOrder,
    setTabValue,
    setSortValue,
    setSortOrder,
  } = useMeetingSearchParams();

  const [tabList, setTabList] = useState<{ value: string; label: string }[]>([
    { value: "", label: "전체" },
  ]);

  // const [isOpen, setIsOpen] = useState(false);
  // const [draftDate, setDraftDate] = useState<DateRange | undefined>(dateRange);

  const currentSortLabel = SORT_OPTIONS.find(
    (opt) => opt.value === sortBy,
  )?.label;

  const { data: meetingTypes = [] } = useQuery<MeetingType[]>({
    queryKey: QUERY_KEYS.meetings.meetingType,
    queryFn: getMeetingTypes,
    staleTime: 1000 * 60 * 5,
  });
  // const handleCalendarReset = () => {
  //   setDraftDate(undefined);
  //   setDateRange(undefined);
  //   setIsOpen(false);
  // };
  //
  // const handleCalendarApply = () => {
  //   setDateRange(draftDate);
  //   setIsOpen(false);
  // };

  useEffect(() => {
    if (meetingTypes.length > 0) {
      setTabList([
        { value: "", label: "전체" },
        ...meetingTypes.map((t) => ({ value: String(t.name), label: t.name })),
      ]);
    }
  }, [meetingTypes]);

  return (
    <>
      <div className="animate-fade-up flex w-full flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <ul className="custom-scrollbar flex gap-6 overflow-x-auto sm:gap-8">
          {tabList.map(({ value, label }) => (
            <li key={value} className="relative shrink-0 pb-2">
              <button
                type="button"
                onClick={() => setTabValue(value)}
                className={cn(
                  "text-sm font-black tracking-tight transition-all sm:text-base",
                  tabValue === value
                    ? "text-main-purple"
                    : "text-slate-400 hover:text-slate-500",
                )}
              >
                {label}
              </button>
              {tabValue === value && (
                <div className="bg-main-purple absolute bottom-0 left-0 h-1 w-full" />
              )}
            </li>
          ))}
        </ul>

        <div className="flex shrink-0 items-center justify-end gap-4">
          {/* 날짜 선택 */}

          {/* <Popover open={isOpen} onOpenChange={setIsOpen}>
            <PopoverTrigger>
              <div
                className={cn(
                  "flex cursor-pointer align-bottom text-xs font-black tracking-widest uppercase transition-colors sm:text-xs",
                  dateRange
                    ? "text-main-purple"
                    : "hover:text-main-purple text-slate-900",
                )}
              >
                Select Date
              </div>
            </PopoverTrigger>
            <PopoverContent className="absolute left-[-90] w-auto p-0">
              <Calendar
                mode="range"
                selected={draftDate}
                onSelect={setDraftDate}
                onReset={handleCalendarReset}
                onApply={handleCalendarApply}
              />
            </PopoverContent>
          </Popover> */}

          <Select
            value={sortBy}
            onValueChange={(value) => {
              if (value !== null) setSortValue(value);
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

          <button onClick={setSortOrder} className="flex items-center">
            <Image
              className={sortOrder === "desc" ? "" : "rotate-180"}
              src={downIcon}
              width="24"
              height="24"
              alt="드롭다운 아이콘"
            />
            <span className="text-main-purple gap-2 text-[12px] font-black tracking-[1.2px]">
              {sortOrder === "desc" ? "최신순" : "오래된 순"}
            </span>
          </button>
        </div>
      </div>
    </>
  );
}

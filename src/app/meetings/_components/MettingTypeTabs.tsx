"use client";

import { useMemo } from "react";
import { cn } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { QUERY_KEYS } from "@/constans/queryKey";
import { getMeetingTypes } from "@/api/client";
import type { MeetingType } from "@/types";

interface MeetingTypeTabsProps {
  currentTab: string;
  onTabChange: (type: string) => void;
}

export default function MeetingTypeTabs({
  currentTab,
  onTabChange,
}: MeetingTypeTabsProps) {
  const { data: meetingTypes = [] } = useQuery<MeetingType[]>({
    queryKey: QUERY_KEYS.meetings.meetingType,
    queryFn: getMeetingTypes,
    staleTime: 1000 * 60 * 5,
  });

  const tabList = useMemo(
    () => [
      { value: "", label: "전체" },
      ...meetingTypes.map((t) => ({ value: String(t.name), label: t.name })),
    ],
    [meetingTypes],
  );

  return (
    <ul className="custom-scrollbar flex gap-6 overflow-x-auto border-b border-slate-100 pb-1">
      {tabList.map(({ value, label }) => (
        <li key={label} className="relative shrink-0">
          <button
            onClick={() => onTabChange(value)}
            className={cn(
              "pb-3 text-sm font-black transition-all sm:text-base",
              currentTab === value
                ? "text-main-purple"
                : "text-slate-400 hover:text-slate-500",
            )}
          >
            {label}
          </button>
          {currentTab === value && (
            <div className="bg-main-purple absolute bottom-0 left-0 h-[3px] w-full" />
          )}
        </li>
      ))}
    </ul>
  );
}

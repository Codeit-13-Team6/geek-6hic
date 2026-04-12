"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { useUrlQuery } from "@/hooks/useUrlQuery";
import { useMeetingTypes } from "@/hooks/queries/useMeetings";

export default function MeetingTypeTabs() {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const { meetingTypes } = useMeetingTypes();

  const { getParam, updateParams } = useUrlQuery();
  const currentTab = getParam("type") || "";

  const tabList = [
    { value: "", label: "전체" },
    ...meetingTypes.map((t) => ({ value: String(t.name), label: t.name })),
  ];

  if (!isMounted) {
    return (
      <div className="mb-6 flex flex-col md:mb-8">
        <ul className="custom-scrollbar flex gap-6 overflow-x-auto border-b border-slate-100 pb-1">
          <li className="relative shrink-0">
            <button className="text-main-purple pb-3 text-sm font-black transition-all sm:text-base">
              전체
            </button>
            <div className="bg-main-purple absolute bottom-0 left-0 h-[3px] w-full" />
          </li>
        </ul>
      </div>
    );
  }

  return (
    <div className="mb-6 flex flex-col md:mb-8">
      <ul className="custom-scrollbar flex gap-6 overflow-x-auto border-b border-slate-100 pb-1">
        {tabList.map(({ value, label }) => (
          <li key={label} className="relative shrink-0">
            <button
              onClick={() => updateParams({ type: value })}
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
    </div>
  );
}

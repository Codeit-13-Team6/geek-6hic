"use client";

import { cn } from "@/lib/utils";
import {
  MeetingCategoryStepProps,
  MeetingCategoryItem,
} from "@/types";
import {
  Sparkles,
  BookOpen,
  Coffee,
  MoreHorizontal,
  Check,
  FolderKanban,
  Briefcase,
} from "lucide-react";

function getMeetingCategoryIcon(name: string) {
  switch (name) {
    case "팀미팅":
      return Sparkles;
    case "스터디":
      return BookOpen;
    case "프로젝트":
      return FolderKanban;
    case "취준생":
      return Briefcase;
    case "기타":
      return MoreHorizontal;
    default:
      return Coffee;
  }
}

export function MeetingCategoryStep({
  meetingTypeOptions = [],
  value,
  onChange,
}: MeetingCategoryStepProps) {
  const meetingCategoryList: MeetingCategoryItem[] = meetingTypeOptions.map(
    ({ value, label }) => ({
      value,
      label,
      icon: getMeetingCategoryIcon(label),
      className: label === "기타" ? "col-span-2" : undefined,
    }),
  );

  return (
    <div className="w-full">
      <div className="mb-8 text-center sm:text-left">
        <p className="text-lg font-bold tracking-tight text-slate-900">
          어떤 모임을 만들고 싶으세요?
          <span className="text-main-purple ml-1">*</span>
        </p>
        <p className="mt-1 text-sm font-medium text-slate-400">
          카테고리를 선택해 주세요.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:gap-4">
        {meetingCategoryList.map((categoryItem) => {
          const isSelected = value === categoryItem.value;
          const Icon = categoryItem.icon;

          return (
            <button
              key={categoryItem.value}
              type="button"
              onClick={() => onChange(categoryItem.value)}
              className={cn(
                "group relative flex h-[100px] flex-col items-center justify-center rounded-2xl border-2 transition-all duration-200 sm:h-[120px]",
                isSelected
                  ? "border-main-purple bg-main-purple/5 shadow-sm"
                  : "border-slate-50 bg-slate-50/50 hover:border-slate-200 hover:bg-white",
                categoryItem.className,
              )}
            >
              <div
                className={cn(
                  "mb-3 flex size-12 items-center justify-center rounded-full bg-white transition-transform group-hover:scale-110",
                  isSelected ? "text-main-purple shadow-sm" : "text-slate-300",
                )}
              >
                {Icon && <Icon size={24} strokeWidth={1.5} />}
              </div>

              <span
                className={cn(
                  "text-sm font-bold tracking-tight transition-colors",
                  isSelected
                    ? "text-main-purple"
                    : "text-slate-600 group-hover:text-slate-900",
                )}
              >
                {categoryItem.label}
              </span>

              {isSelected && (
                <div className="bg-main-purple absolute top-3 right-3 flex size-5 items-center justify-center rounded-full text-white shadow-sm">
                  <Check size={12} strokeWidth={4} />
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

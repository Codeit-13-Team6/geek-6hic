"use client";

import { cn } from "@/lib/utils";
import { MeetingCategoryStepProps, MeetingCategoryItem } from "@/types";
import {
  Sparkles,
  BookOpen,
  Coffee,
  Dumbbell,
  MoreHorizontal,
  Check,
} from "lucide-react";

export const MEETING_CATEGORY_LIST: MeetingCategoryItem[] = [
  { value: "팀미팅", label: "팀미팅", icon: Sparkles },
  { value: "스터디", label: "스터디", icon: BookOpen },
  { value: "프로젝트", label: "프로젝트", icon: Coffee },
  { value: "취준생", label: "취준생", icon: Dumbbell },
  {
    value: "기타",
    label: "기타",
    icon: MoreHorizontal,
    className: "col-span-2",
  },
];

export function MeetingCategoryStep({
  value,
  onChange,
}: MeetingCategoryStepProps) {
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
        {MEETING_CATEGORY_LIST.map((categoryItem) => {
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

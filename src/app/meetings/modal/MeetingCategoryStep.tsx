"use client";

import Image from "next/image";

import { cn } from "@/lib/utils";
import {
  MEETING_CATEGORY_LIST,
} from "@/app/meetings/modal/model/meeting-form.constants";
import { MeetingCategoryStepProps } from "@/app/meetings/modal/model/meeting-form.props";

export function MeetingCategoryStep({
  value,
  onChange,
}: MeetingCategoryStepProps) {
  return (
    <div className="pt-6">
      <p className="text-foreground mb-6 text-sm font-medium">
        어떤 모임을 만들고 싶으세요?
        <span className="text-primary"> *</span>
      </p>

      <div className="grid grid-cols-2 gap-4">
        {MEETING_CATEGORY_LIST.map((categoryItem) => {
          const isSelected = value === categoryItem.value;

          return (
            <button
              key={categoryItem.value}
              type="button"
              onClick={() => onChange(categoryItem.value)}
              className={cn(
                "bg-muted/30 flex h-[132px] flex-col items-center justify-center rounded-2xl border px-4 py-5 transition-colors",
                isSelected
                  ? "border-emerald-400 bg-emerald-50"
                  : "bg-muted/35 hover:bg-background border-transparent hover:border-emerald-200",
                categoryItem.className,
              )}
            >
              <Image
                src={categoryItem.imageSrc}
                alt={categoryItem.label}
                className="mb-3 h-12 w-12 object-contain"
              />
              <span className="text-foreground text-sm font-medium">
                {categoryItem.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

"use client";

import Image from "next/image";
import type { StaticImageData } from "next/image";

import { cn } from "@/lib/utils";
import teamBulb from "@/assets/img/bulb/elec-bulb.jpg";
import studyImage from "@/assets/img/category/study.jpg";
import towerWork from "@/assets/img/category/business.jpg";
import JobIShoes from "@/assets/img/category/fitness-health.jpg";
import etcImage from "@/assets/img/category/etc.jpg";
import { MeetingCategoryStepProps } from "@/types/meeting/meeting-form.props";

export interface MeetingCategoryItem {
  value: string;
  label: string;
  imageSrc: StaticImageData;
  className?: string;
}

export const MEETING_CATEGORY_LIST: MeetingCategoryItem[] = [
  {
    value: "친목/여가",
    label: "친목/여가",
    imageSrc: teamBulb,
  },
  {
    value: "스터디",
    label: "스터디",
    imageSrc: studyImage,
  },
  {
    value: "워케이션",
    label: "워케이션",
    imageSrc: towerWork,
  },
  {
    value: "취미/운동",
    label: "취미/운동",
    imageSrc: JobIShoes,
  },
  {
    value: "기타",
    label: "기타",
    imageSrc: etcImage,
    className: "col-span-2",
  },
];

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

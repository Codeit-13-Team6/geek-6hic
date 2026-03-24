"use client";

import Image from "next/image";

import towerWork from "@/assets/img/category/business.jpg";
import etcImage from "@/assets/img/category/etc.jpg";
import JobIShoes from "@/assets/img/category/fitness-health.jpg";
import teamBulb from "@/assets/img/bulb/elec-bulb.jpg";
import studyImage from "@/assets/img/category/study.jpg";
import { cn } from "@/lib/utils";
import {
  MeetingCategoryItem,
  MeetingCategoryStepProps,
} from "@/app/meetings/modal/modal";

const meetingCategoryList: MeetingCategoryItem[] = [
  {
    value: "TEAM_MEETING",
    label: "팀미팅",
    imageSrc: teamBulb,
  },
  {
    // STUDY
    value: "스터디",
    label: "스터디",
    imageSrc: studyImage,
  },
  {
    value: "WEWORK",
    label: "위워크",
    imageSrc: towerWork,
  },
  {
    value: "JOB_SEEKER",
    label: "취준생",
    imageSrc: JobIShoes,
  },
  {
    // ETC
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
        이 모임은 어떤 종류인가요?
        <span className="text-primary"> *</span>
      </p>

      <div className="grid grid-cols-2 gap-4">
        {meetingCategoryList.map((categoryItem) => {
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

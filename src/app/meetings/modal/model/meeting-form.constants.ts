import type { StaticImageData } from "next/image";
import towerWork from "@/assets/img/category/business.jpg";
import etcImage from "@/assets/img/category/etc.jpg";
import JobIShoes from "@/assets/img/category/fitness-health.jpg";
import teamBulb from "@/assets/img/bulb/elec-bulb.jpg";
import studyImage from "@/assets/img/category/study.jpg";

export interface MeetingTypeOption {
  value: string;
  label: string;
}

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

export const DEFAULT_MEETING_TYPE_OPTIONS: MeetingTypeOption[] =
  MEETING_CATEGORY_LIST.map(({ value, label }) => ({
    value,
    label,
  }));

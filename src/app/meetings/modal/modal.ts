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
    value: "취미/여가",
    label: "팀미팅",
    imageSrc: teamBulb,
  },
  {
    value: "스터디",
    label: "스터디",
    imageSrc: studyImage,
  },
  {
    value: "비즈니스",
    label: "위워크",
    imageSrc: towerWork,
  },
  {
    value: "가족/육아",
    label: "취준생",
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

export interface MeetingFormValues {
  category: string;
  name: string;
  description: string;
  link: string;
  imageFile: File | null;
  previewImageUrl: string;
  imageUrl: string | null;
  startDate: string;
  startTime: string;
  endDate: string;
  endTime: string;
  capacity: string;
}

export interface MeetingFormErrors {
  category: string;
  name: string;
  description: string;
  link: string;
  imageUrl: string;
  startDate: string;
  startTime: string;
  endDate: string;
  endTime: string;
  capacity: string;
}

export interface UploadImageResponse {
  presignedUrl: string;
  publicUrl: string;
}

export interface MeetingBasicInfoValues {
  category?: string;
  name: string;
  description: string;
  link: string;
  imageFile: File | null;
  previewImageUrl: string;
  imageUrl: string | null;
}

export interface MeetingBasicInfoErrors {
  category?: string;
  name: string;
  description: string;
  link: string;
  imageUrl: string;
}

export interface MeetingBasicInfoStepProps {
  values: MeetingBasicInfoValues;
  isImageUploading: boolean;
  errors: MeetingBasicInfoErrors;
  onChange: (nextValues: {
    category?: string;
    name?: string;
    description?: string;
    link?: string;
  }) => void;
  onChangeImage: (nextFile: File | null) => void;
  onRemoveImage: () => void;
}

export interface MeetingBasicInfoSectionProps extends MeetingBasicInfoStepProps {
  showCategoryField?: boolean;
  showImageMeta?: boolean;
}

export interface MeetingCategoryStepProps {
  value: string;
  onChange: (value: string) => void;
}

export interface MeetingScheduleStepValues {
  startDate: string;
  startTime: string;
  endDate: string;
  endTime: string;
  capacity: string;
}

export interface MeetingScheduleStepProps {
  values: MeetingScheduleStepValues;
  errors: {
    startDate: string;
    startTime: string;
    endDate: string;
    endTime: string;
    capacity: string;
  };
  onChange: (nextValues: Partial<MeetingScheduleStepValues>) => void;
}

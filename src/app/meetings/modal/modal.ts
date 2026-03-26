import type { StaticImageData } from "next/image";

export interface MeetingTypeOption {
  value: string;
  label: string;
}

export const DEFAULT_MEETING_TYPE_OPTIONS: MeetingTypeOption[] = [
  { value: "TEAM_MEETING", label: "취미/여가" },
  { value: "STUDY", label: "스터디" },
  { value: "WEWORK", label: "네트워킹" },
  { value: "JOB_SEEKER", label: "취업" },
  { value: "ETC", label: "기타" },
];

export interface MeetingFormValues {
  category: string;
  name: string;
  description: string;
  link: string;
  imageFile: File | null;
  previewImageUrl: string;
  imageUrl: string;
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
  imageUrl: string;
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

export interface MeetingCategoryItem {
  value: string;
  label: string;
  imageSrc: StaticImageData;
  className?: string;
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

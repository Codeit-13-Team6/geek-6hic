import type { StaticImageData } from "next/image";

export interface CreateMeetingFormValues {
  category: string;
  name: string;
  description: string;
  link: string;
  imageFile: File | null;
  imageUrl: string;
  startDate: string;
  startTime: string;
  endDate: string;
  endTime: string;
  capacity: string;
}

export interface CreateMeetingModalContentProps {
  onClose: () => void;
}
export interface UploadImageResponse {
  presignedUrl: string;
  publicUrl: string;
}

export interface MeetingBasicInfoStepProps {
  values: {
    name: string;
    description: string;
    link: string;
    imageFile: File | null;
    imageUrl: string;
  };
  isImageUploading: boolean;

  onChange: (nextValues: {
    name?: string;
    description?: string;
    link?: string;
    imageFile?: File | null;
  }) => void;
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
  onChange: (nextValues: Partial<MeetingScheduleStepValues>) => void;
}

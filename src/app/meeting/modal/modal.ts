import type { StaticImageData } from "next/image";

export interface CreateMeetingFormValues {
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

export interface CreateMeetingFormErrors {
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
    previewImageUrl: string;
    imageUrl: string;
  };
  isImageUploading: boolean;
  errors: {
    name: string;
    description: string;
    link: string;
    imageUrl: string;
  };
  onChange: (nextValues: {
    name?: string;
    description?: string;
    link?: string;
  }) => void;
  onChangeImage: (nextFile: File | null) => void;
  onRemoveImage: () => void;
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

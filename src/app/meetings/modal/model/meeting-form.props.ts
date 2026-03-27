import type {
  MeetingBasicInfoErrors,
  MeetingBasicInfoValues,
  MeetingScheduleStepValues,
} from "@/app/meetings/modal/model/meeting-form.types";

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

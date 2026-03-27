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

export interface MeetingScheduleStepValues {
  startDate: string;
  startTime: string;
  endDate: string;
  endTime: string;
  capacity: string;
}

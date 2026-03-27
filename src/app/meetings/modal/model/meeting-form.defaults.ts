import type {
  MeetingFormErrors,
  MeetingFormValues,
} from "@/app/meetings/modal/model/meeting-form.types";

export const INITIAL_MEETING_FORM_VALUES: MeetingFormValues = {
  category: "친목/여가",
  name: "",
  description: "",
  link: "",
  imageFile: null,
  previewImageUrl: "",
  imageUrl: null,
  startDate: "",
  startTime: "",
  endDate: "",
  endTime: "",
  capacity: "",
};

export const TOTAL_MEETING_FORM_STEPS = 3;

export const createEmptyMeetingFormErrors = (): MeetingFormErrors => ({
  category: "",
  name: "",
  description: "",
  link: "",
  imageUrl: "",
  startDate: "",
  startTime: "",
  endDate: "",
  endTime: "",
  capacity: "",
});

import type { MeetingDetailData } from "@/app/meetings/[meetingId]/types";
import { getNormalizedMeetingLink } from "@/app/meetings/modal/model/meeting-form.validation";
import type { MeetingFormValues } from "@/app/meetings/modal/model/meeting-form.types";

export const getIsoDateTime = (date: string, time: string) => {
  return new Date(`${date}T${time}`).toISOString();
};

const formatLocalDate = (value: string) => {
  const date = new Date(value);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

const formatLocalTime = (value: string) => {
  const date = new Date(value);
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");

  return `${hours}:${minutes}`;
};

export const toCreateMeetingPayload = (formValues: MeetingFormValues) => {
  return {
    name: formValues.name,
    type: formValues.category,
    region: "온라인",
    address: getNormalizedMeetingLink(formValues.link),
    latitude: 0,
    longitude: 0,
    dateTime: getIsoDateTime(formValues.startDate, formValues.startTime),
    registrationEnd: getIsoDateTime(formValues.endDate, formValues.endTime),
    capacity: Number(formValues.capacity),
    image: formValues.imageUrl,
    description: formValues.description,
  };
};

export const toMeetingFormValues = (
  data: Pick<
    MeetingDetailData,
    | "type"
    | "name"
    | "description"
    | "link"
    | "image"
    | "dateTime"
    | "registrationEnd"
    | "capacity"
  >,
): MeetingFormValues => ({
  category: data.type,
  name: data.name,
  description: data.description,
  link: data.link,
  imageFile: null,
  previewImageUrl: data.image ?? "",
  imageUrl: data.image ?? "",
  startDate: formatLocalDate(data.dateTime),
  startTime: formatLocalTime(data.dateTime),
  endDate: formatLocalDate(data.registrationEnd),
  endTime: formatLocalTime(data.registrationEnd),
  capacity: String(data.capacity),
});

export const toEditMeetingPayload = (formValues: MeetingFormValues) => {
  return {
    type: formValues.category,
    name: formValues.name,
    description: formValues.description,
    link: formValues.link,
    image: formValues.imageUrl || formValues.previewImageUrl || null,
    dateTime: getIsoDateTime(formValues.startDate, formValues.startTime),
    registrationEnd: getIsoDateTime(formValues.endDate, formValues.endTime),
    capacity: Number(formValues.capacity),
  };
};

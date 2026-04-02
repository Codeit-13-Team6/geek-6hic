"use client";

import { useEffect, useRef, useState } from "react";
import {
  getNormalizedMeetingLink,
  hasMeetingValidationError,
  validateMeetingBasicInfoStep,
  validateMeetingCategoryStep,
  validateMeetingScheduleStep,
} from "@/lib/meetingFormValidation";

import { ToastCommon } from "@/components/ui/ToastCommon";

import {
  changeMeetingImage,
  removeMeetingImage,
  revokeMeetingPreviewImageUrl,
} from "../lib/meetingFormImage";
import {
  MeetingDetailData,
  MeetingFormErrors,
  MeetingFormValues,
} from "@/types";

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

type EditMeetingTab = "basic" | "schedule";

export const INITIAL_MEETING_FORM_VALUES: MeetingFormValues = {
  category: "팀미팅",
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

export function useEditMeetingForm({
  data,
  isOpen,
  onSubmit,
  onSuccess,
}: {
  data: MeetingDetailData;
  isOpen: boolean;
  onSubmit: (nextValues: Partial<MeetingDetailData>) => Promise<void> | void;
  onSuccess?: () => void;
}) {
  const [activeTab, setActiveTab] = useState<EditMeetingTab>("basic");
  const [formValues, setFormValues] = useState<MeetingFormValues>(
    toMeetingFormValues(data),
  );
  const [errors, setErrors] = useState<MeetingFormErrors>(
    createEmptyMeetingFormErrors,
  );
  const [isImageUploading, setIsImageUploading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const previewImageUrlRef = useRef("");
  const previousIsOpenRef = useRef(false);

  const resetEditMeetingForm = (nextData: MeetingDetailData) => {
    const nextValues = toMeetingFormValues(nextData);

    previewImageUrlRef.current = nextValues.previewImageUrl;
    setActiveTab("basic");
    setFormValues(nextValues);
    setErrors(createEmptyMeetingFormErrors());
    setIsImageUploading(false);
    setIsSubmitting(false);
  };

  useEffect(() => {
    if (!previousIsOpenRef.current && isOpen) {
      queueMicrotask(() => {
        resetEditMeetingForm(data);
      });
    }

    previousIsOpenRef.current = isOpen;
  }, [data, isOpen]);

  useEffect(() => {
    return () => {
      revokeMeetingPreviewImageUrl(previewImageUrlRef.current);
    };
  }, []);

  const handleChangeMeetingImage = async (nextFile: File | null) => {
    await changeMeetingImage({
      nextFile,
      previewImageUrlRef,
      setFormValues,
      setIsImageUploading,
      clearImageError: () => {
        setErrors((prev) => ({
          ...prev,
          imageUrl: "",
        }));
      },
      setImageError: (message) => {
        setErrors((prev) => ({
          ...prev,
          imageUrl: message,
        }));
      },
      onUploadError: () => {
        ToastCommon({ message: "이미지 업로드에 실패했습니다." });
      },
    });
  };

  const handleRemoveMeetingImage = () => {
    removeMeetingImage({
      previewImageUrlRef,
      setFormValues,
      setIsImageUploading,
      clearImageError: () => {
        setErrors((prev) => ({
          ...prev,
          imageUrl: "",
        }));
      },
    });
  };

  const handleChangeBasicTab = (nextValues: {
    category?: string;
    name?: string;
    description?: string;
    link?: string;
    imageFile?: File | null;
    previewImageUrl?: string;
    imageUrl?: string;
  }) => {
    setFormValues((prev) => ({
      ...prev,
      ...nextValues,
    }));
    setErrors((prev) => ({
      ...prev,
      category: nextValues.category ? "" : prev.category,
      name: typeof nextValues.name === "string" ? "" : prev.name,
      description:
        typeof nextValues.description === "string" ? "" : prev.description,
      link: typeof nextValues.link === "string" ? "" : prev.link,
    }));
  };

  const handleChangeScheduleTab = (nextValues: {
    startDate?: string;
    startTime?: string;
    endDate?: string;
    endTime?: string;
    capacity?: string;
  }) => {
    setFormValues((prev) => ({
      ...prev,
      ...nextValues,
    }));
    setErrors((prev) => ({
      ...prev,
      startDate: nextValues.startDate ? "" : prev.startDate,
      startTime: nextValues.startTime ? "" : prev.startTime,
      endDate: nextValues.endDate ? "" : prev.endDate,
      endTime: nextValues.endTime ? "" : prev.endTime,
      capacity: typeof nextValues.capacity === "string" ? "" : prev.capacity,
    }));
  };

  const handleSubmit = async () => {
    const nextCategoryErrors = validateMeetingCategoryStep(formValues);
    const nextBasicErrors = validateMeetingBasicInfoStep(formValues);
    const nextScheduleErrors = validateMeetingScheduleStep(formValues);
    const nextErrors: MeetingFormErrors = {
      ...createEmptyMeetingFormErrors(),
      ...nextCategoryErrors,
      ...nextBasicErrors,
      ...nextScheduleErrors,
    };

    setErrors(nextErrors);

    if (
      hasMeetingValidationError(nextCategoryErrors) ||
      hasMeetingValidationError(nextBasicErrors)
    ) {
      setActiveTab("basic");
      return;
    }

    if (hasMeetingValidationError(nextScheduleErrors)) {
      setActiveTab("schedule");
      return;
    }

    setIsSubmitting(true);

    try {
      await onSubmit(toEditMeetingPayload(formValues));
      onSuccess?.();
    } catch {
      // updateMeetingMutation toast handles the error
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    activeTab,
    errors,
    formValues,
    isImageUploading,
    isSubmitting,
    setActiveTab,
    handleChangeMeetingImage,
    handleRemoveMeetingImage,
    handleChangeBasicTab,
    handleChangeScheduleTab,
    handleSubmit,
  };
}

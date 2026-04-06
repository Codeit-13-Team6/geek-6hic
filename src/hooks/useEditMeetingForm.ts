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

export const toCreateMeetingPayload = (formValues: MeetingFormValues) => {
  return {
    name: formValues.name,
    type: formValues.category,
    region: "온라인",
    address: getNormalizedMeetingLink(formValues.link),
    latitude: 0,
    longitude: 0,
    dateTime: "2100-01-01T00:00:00.000Z",
    registrationEnd: "2099-12-31T23:59:59.000Z",
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
  capacity: String(data.capacity),
});

export const toEditMeetingPayload = (formValues: MeetingFormValues) => {
  return {
    type: formValues.category,
    name: formValues.name,
    description: formValues.description,
    link: formValues.link,
    image: formValues.imageUrl || formValues.previewImageUrl || null,
    dateTime: "2100-01-01T00:00:00.000Z",
    registrationEnd: "2099-12-31T23:59:59.000Z",
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
  capacity: "",
};

export const createEmptyMeetingFormErrors = (): MeetingFormErrors => ({
  category: "",
  name: "",
  description: "",
  link: "",
  imageUrl: "",
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

  const handleChangeScheduleTab = (nextValues: { capacity?: string }) => {
    setFormValues((prev) => ({
      ...prev,
      ...nextValues,
    }));
    setErrors((prev) => ({
      ...prev,
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

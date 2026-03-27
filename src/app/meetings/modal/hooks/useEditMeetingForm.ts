"use client";

import { useEffect, useRef, useState } from "react";
import type { MeetingDetailData } from "@/app/meetings/[id]/types";
import { createEmptyMeetingFormErrors } from "@/app/meetings/modal/model/meeting-form.defaults";
import {
  toEditMeetingPayload,
  toMeetingFormValues,
} from "@/app/meetings/modal/model/meeting-form.mappers";
import type {
  MeetingFormErrors,
  MeetingFormValues,
} from "@/app/meetings/modal/model/meeting-form.types";
import {
  hasMeetingValidationError,
  validateMeetingBasicInfoStep,
  validateMeetingCategoryStep,
  validateMeetingScheduleStep,
} from "@/app/meetings/modal/model/meeting-form.validation";
import {
  changeMeetingImage,
  removeMeetingImage,
  revokeMeetingPreviewImageUrl,
} from "@/app/meetings/modal/services/meetingImageField";
import { ToastCommon } from "@/components/ui/ToastCommon";

type EditMeetingTab = "basic" | "schedule";

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

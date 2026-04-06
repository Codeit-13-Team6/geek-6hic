"use client";

import { useEffect, useRef, useState } from "react";
import axiosInstance from "@/lib/clientFetcher";
import { ToastCommon } from "@/components/ui/ToastCommon";

import {
  hasMeetingValidationError,
  validateMeetingBasicInfoStep,
  validateMeetingCategoryStep,
  validateMeetingScheduleStep,
} from "@/lib/meetingFormValidation";
import {
  changeMeetingImage,
  removeMeetingImage,
  revokeMeetingPreviewImageUrl,
} from "@/lib/meetingFormImage";
import {
  INITIAL_MEETING_FORM_VALUES,
  toCreateMeetingPayload,
} from "./useEditMeetingForm";
import { MeetingFormValues } from "@/types";
import { createMeeting, createPost, updateMeeting } from "@/api/client";
import { useRouter } from "next/navigation";
import { QUERY_KEYS } from "@/constans/queryKey";
import { useQueryClient } from "@tanstack/react-query";
import { threadKeyword } from "@/constans/post";

const TOTAL_MEETING_FORM_STEPS = 3;

export function useCreateMeetingForm(onSuccess?: () => void) {
  const [currentStep, setCurrentStep] = useState(1);
  const [touchedStepList, setTouchedStepList] = useState<number[]>([]);
  const [formValues, setFormValues] = useState<MeetingFormValues>(
    INITIAL_MEETING_FORM_VALUES,
  );
  const [isImageUploading, setIsImageUploading] = useState(false);
  const [imageErrorMessage, setImageErrorMessage] = useState("");

  const queryClient = useQueryClient();
  const previewImageUrlRef = useRef("");
  const router = useRouter();

  useEffect(() => {
    return () => {
      revokeMeetingPreviewImageUrl(previewImageUrlRef.current);
    };
  }, []);

  const categoryErrors = validateMeetingCategoryStep(formValues);
  const basicInfoErrors = validateMeetingBasicInfoStep(formValues);
  const scheduleErrors = validateMeetingScheduleStep(formValues);

  const isTouchedStep = (step: number) => touchedStepList.includes(step);

  const markTouchedStep = (step: number) => {
    setTouchedStepList((prev) => {
      if (prev.includes(step)) {
        return prev;
      }

      return [...prev, step];
    });
  };

  const handleChangeCategory = (value: string) => {
    setFormValues((prev) => ({
      ...prev,
      category: value,
    }));
  };

  const handleChangeBasicInfo = (nextValues: {
    name?: string;
    description?: string;
    link?: string;
  }) => {
    setFormValues((prev) => ({
      ...prev,
      ...nextValues,
    }));
  };

  const handleChangeSchedule = (
    nextValues: Partial<
      Pick<
        MeetingFormValues,
        "startDate" | "startTime" | "endDate" | "endTime" | "capacity"
      >
    >,
  ) => {
    setFormValues((prev) => ({
      ...prev,
      ...nextValues,
    }));
  };

  const handleChangeMeetingImage = async (nextFile: File | null) => {
    await changeMeetingImage({
      nextFile,
      previewImageUrlRef,
      setFormValues,
      setIsImageUploading,
      clearImageError: () => {
        setImageErrorMessage("");
      },
      setImageError: (message) => {
        setImageErrorMessage(message);
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
        setImageErrorMessage("");
      },
    });
  };

  const handlePrevStep = () => {
    setCurrentStep((prev) => Math.max(1, prev - 1));
  };

  const handleNextStep = () => {
    const currentStepErrors =
      currentStep === 1
        ? categoryErrors
        : currentStep === 2
          ? basicInfoErrors
          : scheduleErrors;

    if (hasMeetingValidationError(currentStepErrors)) {
      markTouchedStep(currentStep);
      return;
    }

    setCurrentStep((prev) => Math.min(TOTAL_MEETING_FORM_STEPS, prev + 1));
  };

  const resetCreateMeetingForm = () => {
    revokeMeetingPreviewImageUrl(previewImageUrlRef.current);
    previewImageUrlRef.current = "";

    setCurrentStep(1);
    setTouchedStepList([]);
    setFormValues(INITIAL_MEETING_FORM_VALUES);
    setIsImageUploading(false);
    setImageErrorMessage("");
  };

  const handleSubmitMeeting = async () => {
    const nextCategoryErrors = validateMeetingCategoryStep(formValues);
    const nextBasicInfoErrors = validateMeetingBasicInfoStep(formValues);
    const nextScheduleErrors = validateMeetingScheduleStep(formValues);

    if (hasMeetingValidationError(nextCategoryErrors)) {
      markTouchedStep(1);
      setCurrentStep(1);
      return;
    }

    if (hasMeetingValidationError(nextBasicInfoErrors)) {
      markTouchedStep(2);
      setCurrentStep(2);
      return;
    }

    if (hasMeetingValidationError(nextScheduleErrors)) {
      markTouchedStep(3);
      setCurrentStep(3);
      return;
    }

    try {
      const payload = toCreateMeetingPayload(formValues);
      const newMeeting = await createMeeting(payload);
      const newMeetingId = newMeeting.id;

      const newPost = await createPost({
        title: threadKeyword.build(newMeetingId),
        content:
          "모임 스레드가 생성되었습니다. 자유롭게 이야기와 링크를 나눠보세요!",
      });

      const createdPostId = newPost.id;

      await updateMeeting(newMeetingId, {
        region: String(createdPostId),
      });

      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.meetings.root, })
      ToastCommon({ message: `${newMeeting.name} 모임 생성완료` });
      onSuccess?.();
      router.push(`/meetings/${newMeetingId}`);
    } catch (error) {
      console.error("meeting create error", error);
      ToastCommon({ message: "모임 생성에 실패했습니다." });
    }
  };

  return {
    currentStep,
    totalSteps: TOTAL_MEETING_FORM_STEPS,
    formValues,
    isImageUploading,
    imageErrorMessage,
    basicInfoErrors,
    scheduleErrors,
    isTouchedStep,
    handleChangeCategory,
    handleChangeBasicInfo,
    handleChangeSchedule,
    handleChangeMeetingImage,
    handleRemoveMeetingImage,
    handlePrevStep,
    handleNextStep,
    handleSubmitMeeting,
    resetCreateMeetingForm,
  };
}

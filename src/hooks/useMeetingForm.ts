"use client";

import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";
import { ToastCommon } from "@/components/ui/ToastCommon";
import {
  getNormalizedMeetingLink,
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
import { MeetingDetailData, MeetingFormErrors, MeetingFormValues } from "@/types";
import { createMeeting, createPost, updateMeeting } from "@/api/client";
import { useRouter } from "next/navigation";
import { QUERY_KEYS } from "@/constans/queryKey";
import { useQueryClient } from "@tanstack/react-query";
import { threadKeyword } from "@/constans/post";


export const toCreateMeetingPayload = (formValues: MeetingFormValues) => ({
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
});

export const toEditMeetingPayload = (formValues: MeetingFormValues) => ({
  type: formValues.category,
  name: formValues.name,
  description: formValues.description,
  link: formValues.link,
  image: formValues.imageUrl || formValues.previewImageUrl || null,
  dateTime: "2100-01-01T00:00:00.000Z",
  registrationEnd: "2099-12-31T23:59:59.000Z",
  capacity: Number(formValues.capacity),
});

export const toMeetingFormValues = (
  data: Pick<
    MeetingDetailData,
    "type" | "name" | "description" | "link" | "image" | "dateTime" | "registrationEnd" | "capacity"
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


function useMeetingFormBase({
  initialValues,
  onClearImageError,
  onSetImageError,
}: {
  initialValues: MeetingFormValues;
  onClearImageError: () => void;
  onSetImageError: (message: string) => void;
}): {
  formValues: MeetingFormValues;
  setFormValues: Dispatch<SetStateAction<MeetingFormValues>>;
  isImageUploading: boolean;
  setIsImageUploading: Dispatch<SetStateAction<boolean>>;
  previewImageUrlRef: { current: string };
  handleChangeMeetingImage: (nextFile: File | null) => Promise<void>;
  handleRemoveMeetingImage: () => void;
} {
  const [formValues, setFormValues] = useState<MeetingFormValues>(initialValues);
  const [isImageUploading, setIsImageUploading] = useState(false);
  const previewImageUrlRef = useRef(initialValues.previewImageUrl);

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
      clearImageError: onClearImageError,
      setImageError: onSetImageError,
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
      clearImageError: onClearImageError,
    });
  };

  return {
    formValues,
    setFormValues,
    isImageUploading,
    setIsImageUploading,
    previewImageUrlRef,
    handleChangeMeetingImage,
    handleRemoveMeetingImage,
  };
}

// create

const TOTAL_MEETING_FORM_STEPS = 2;

export function useCreateMeetingForm(onSuccess?: () => void) {
  const [currentStep, setCurrentStep] = useState(1);
  const [touchedStepList, setTouchedStepList] = useState<number[]>([]);
  const [imageErrorMessage, setImageErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isSubmittingRef = useRef(false);

  const {
    formValues,
    setFormValues,
    isImageUploading,
    setIsImageUploading,
    previewImageUrlRef,
    handleChangeMeetingImage,
    handleRemoveMeetingImage,
  } = useMeetingFormBase({
    initialValues: INITIAL_MEETING_FORM_VALUES,
    onClearImageError: () => setImageErrorMessage(""),
    onSetImageError: setImageErrorMessage,
  });

  const queryClient = useQueryClient();
  const router = useRouter();

  const categoryErrors = validateMeetingCategoryStep(formValues);
  const basicInfoErrors = validateMeetingBasicInfoStep(formValues);
  const scheduleErrors = validateMeetingScheduleStep(formValues);

  const isTouchedStep = (step: number) => touchedStepList.includes(step);

  const markTouchedStep = (step: number) => {
    setTouchedStepList((prev) => {
      if (prev.includes(step)) return prev;
      return [...prev, step];
    });
  };

  const handleChangeCategory = (value: string) => {
    setFormValues((prev) => ({ ...prev, category: value }));
  };

  const handleChangeBasicInfo = (nextValues: {
    name?: string;
    description?: string;
    link?: string;
    capacity?: string;
  }) => {
    setFormValues((prev) => ({ ...prev, ...nextValues }));
  };

  const handlePrevStep = () => {
    setCurrentStep((prev) => Math.max(1, prev - 1));
  };

  const handleNextStep = () => {
    const currentStepErrors = currentStep === 1 ? categoryErrors : basicInfoErrors;
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
    if (isSubmittingRef.current) return;

    const nextCategoryErrors = validateMeetingCategoryStep(formValues);
    const nextBasicInfoErrors = validateMeetingBasicInfoStep(formValues);
    const nextScheduleErrors = validateMeetingScheduleStep(formValues);

    if (hasMeetingValidationError(nextCategoryErrors)) {
      markTouchedStep(1);
      setCurrentStep(1);
      return;
    }
    if (hasMeetingValidationError(nextBasicInfoErrors) || hasMeetingValidationError(nextScheduleErrors)) {
      markTouchedStep(2);
      setCurrentStep(2);
      return;
    }

    isSubmittingRef.current = true;
    setIsSubmitting(true);

    try {
      const payload = toCreateMeetingPayload(formValues);
      const newMeeting = await createMeeting(payload);
      const newMeetingId = newMeeting.id;

      const newPost = await createPost({
        title: threadKeyword.build(newMeetingId),
        content: "모임 스레드가 생성되었습니다. 자유롭게 이야기와 링크를 나눠보세요!",
      });

      await updateMeeting(newMeetingId, { region: String(newPost.id) });

      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.meetings.root });
      ToastCommon({ message: `${newMeeting.name} 모임 생성완료` });
      onSuccess?.();
      router.push(`/meetings/${newMeetingId}`);
    } catch (error) {
      console.error("meeting create error", error);
      ToastCommon({ message: "모임 생성에 실패했습니다." });
    } finally {
      isSubmittingRef.current = false;
      setIsSubmitting(false);
    }
  };

  return {
    currentStep,
    totalSteps: TOTAL_MEETING_FORM_STEPS,
    formValues,
    isImageUploading,
    isSubmitting,
    imageErrorMessage,
    basicInfoErrors,
    scheduleErrors,
    isTouchedStep,
    handleChangeCategory,
    handleChangeBasicInfo,
    handleChangeMeetingImage,
    handleRemoveMeetingImage,
    handlePrevStep,
    handleNextStep,
    handleSubmitMeeting,
    resetCreateMeetingForm,
  };
}

// edit

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
  const [errors, setErrors] = useState<MeetingFormErrors>(createEmptyMeetingFormErrors);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const previousIsOpenRef = useRef(false);

  const {
    formValues,
    setFormValues,
    isImageUploading,
    setIsImageUploading,
    previewImageUrlRef,
    handleChangeMeetingImage,
    handleRemoveMeetingImage,
  } = useMeetingFormBase({
    initialValues: toMeetingFormValues(data),
    onClearImageError: () => setErrors((prev) => ({ ...prev, imageUrl: "" })),
    onSetImageError: (message) => setErrors((prev) => ({ ...prev, imageUrl: message })),
  });

  const resetEditMeetingForm = (nextData: MeetingDetailData) => {
    const nextValues = toMeetingFormValues(nextData);
    previewImageUrlRef.current = nextValues.previewImageUrl;
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

  const handleChange = (nextValues: {
    category?: string;
    name?: string;
    description?: string;
    link?: string;
    capacity?: string;
    imageFile?: File | null;
    previewImageUrl?: string;
    imageUrl?: string;
  }) => {
    setFormValues((prev) => ({ ...prev, ...nextValues }));
    setErrors((prev) => ({
      ...prev,
      category: nextValues.category ? "" : prev.category,
      name: typeof nextValues.name === "string" ? "" : prev.name,
      description: typeof nextValues.description === "string" ? "" : prev.description,
      link: typeof nextValues.link === "string" ? "" : prev.link,
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
      hasMeetingValidationError(nextBasicErrors) ||
      hasMeetingValidationError(nextScheduleErrors)
    ) {
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
    errors,
    formValues,
    isImageUploading,
    isSubmitting,
    handleChangeMeetingImage,
    handleRemoveMeetingImage,
    handleChange,
    handleSubmit,
  };
}

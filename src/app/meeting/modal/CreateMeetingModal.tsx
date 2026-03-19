"use client";

import plusIcon from "@/assets/icon/plus/plus.svg";

import Image from "next/image";

import { useEffect, useMemo, useRef, useState } from "react";

import { MeetingCategoryStep } from "@/app/meeting/modal/MeetingCategoryStep";
import { MeetingBasicInfoStep } from "@/app/meeting/modal/MeetingBasicInfoStep";
import { MeetingScheduleStep } from "@/app/meeting/modal/MeetingScheduleStep";
import { CreateMeetingFormValues } from "@/app/meeting/modal/modal";
import {
  getNormalizedMeetingLink,
  hasMeetingValidationError,
  validateMeetingBasicInfoStep,
  validateMeetingCategoryStep,
  validateMeetingScheduleStep,
} from "@/app/meeting/modal/meetingValidation";
import { uploadMeetingImage } from "@/app/meeting/modal/services/uploadMeetingImage";

import axiosInstance from "@/lib/axios";
import { toastCommon } from "@/lib/toastCommon";

import { BtnCommon } from "@/components/ui/BtnCommon";
import ModalBase from "@/components/features/modal/ModalBase";

const INITIAL_FORM_VALUES: CreateMeetingFormValues = {
  category: "TEAM_MEETING",
  name: "",
  description: "",
  link: "",
  imageFile: null,
  previewImageUrl: "",
  imageUrl: "",
  startDate: "",
  startTime: "",
  endDate: "",
  endTime: "",
  capacity: "",
};

const TOTAL_STEPS = 3;

const getIsoDateTime = (date: string, time: string) => {
  return new Date(`${date}T${time}`).toISOString();
};

export function CreateMeetingModal() {
  const [isOpen, setIsOpen] = useState(false);

  const handleOpenModal = () => {
    resetCreateMeetingForm();
    setIsOpen(true);
  };

  const handleCloseModal = () => {
    setIsOpen(false);
  };

  const [currentStep, setCurrentStep] = useState(1);
  const [touchedStepList, setTouchedStepList] = useState<number[]>([]);
  const [formValues, setFormValues] =
    useState<CreateMeetingFormValues>(INITIAL_FORM_VALUES);
  const [isImageUploading, setIsImageUploading] = useState(false);
  const [imageErrorMessage, setImageErrorMessage] = useState("");

  const previewImageUrlRef = useRef("");

  const revokePreviewImageUrl = (previewImageUrl: string) => {
    if (!previewImageUrl) {
      return;
    }

    URL.revokeObjectURL(previewImageUrl);
  };

  useEffect(() => {
    return () => {
      revokePreviewImageUrl(previewImageUrlRef.current);
    };
  }, []);

  const categoryErrors = useMemo(() => {
    return validateMeetingCategoryStep(formValues);
  }, [formValues]);

  const basicInfoErrors = useMemo(() => {
    return validateMeetingBasicInfoStep(formValues);
  }, [formValues]);

  const scheduleErrors = useMemo(() => {
    return validateMeetingScheduleStep(formValues);
  }, [formValues]);

  const isTouchedStep = (step: number) => {
    return touchedStepList.includes(step);
  };

  const markTouchedStep = (step: number) => {
    setTouchedStepList((prev) => {
      if (prev.includes(step)) {
        return prev;
      }

      return [...prev, step];
    });
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

  const handleChangeMeetingImage = async (nextFile: File | null) => {
    if (!nextFile) {
      return;
    }

    const nextPreviewImageUrl = URL.createObjectURL(nextFile);

    revokePreviewImageUrl(previewImageUrlRef.current);
    previewImageUrlRef.current = nextPreviewImageUrl;

    setFormValues((prev) => ({
      ...prev,
      imageFile: nextFile,
      previewImageUrl: nextPreviewImageUrl,
      imageUrl: "",
    }));
    setImageErrorMessage("");
    setIsImageUploading(true);

    try {
      const nextImageUrl = await uploadMeetingImage(nextFile);

      setFormValues((prev) => ({
        ...prev,
        imageFile: nextFile,
        imageUrl: nextImageUrl,
      }));
      setImageErrorMessage("");
    } catch (error) {
      setFormValues((prev) => ({
        ...prev,
        imageFile: nextFile,
        imageUrl: "",
      }));
      setImageErrorMessage("이미지 업로드에 실패했습니다. 다시 시도해주세요.");
      toastCommon({ message: "이미지 업로드에 실패했습니다." });
    } finally {
      setIsImageUploading(false);
    }
  };

  const handleRemoveMeetingImage = () => {
    revokePreviewImageUrl(previewImageUrlRef.current);
    previewImageUrlRef.current = "";

    setFormValues((prev) => ({
      ...prev,
      imageFile: null,
      previewImageUrl: "",
      imageUrl: "",
    }));
    setImageErrorMessage("");
    setIsImageUploading(false);
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

    setCurrentStep((prev) => Math.min(TOTAL_STEPS, prev + 1));
  };

  const getCreateMeetingPayload = () => {
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
  const resetCreateMeetingForm = () => {
    revokePreviewImageUrl(previewImageUrlRef.current);
    previewImageUrlRef.current = "";

    setCurrentStep(1);
    setTouchedStepList([]);
    setFormValues(INITIAL_FORM_VALUES);
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
      const payload = getCreateMeetingPayload();
      console.log("제출 잘됨 ?", payload);
      const { data } = await axiosInstance.post("/meetings", payload);

      toastCommon({ message: `${data.name} 모임 생성완료` });
      handleCloseModal();
    } catch (error) {
      console.error("meeting create error", error);
      toastCommon({ message: "모임 생성에 실패했습니다." });
    }
  };
  const handleOpenChangeModal = (nextIsOpen: boolean) => {
    if (!nextIsOpen) {
      handleCloseModal();
      return;
    }

    setIsOpen(true);
  };

  return (
    <>
      <BtnCommon className="gap-[4px]" type="button" onClick={handleOpenModal}>
        <Image src={plusIcon} alt="모임 만들기 추가 아이콘" />
        모임 만들기
      </BtnCommon>

      <ModalBase
        disablePointerDismissal
        isOpen={isOpen}
        onOpenChange={handleOpenChangeModal}
        contentClassName="w-[544px] max-w-[calc(100vw-24px)] rounded-[40px] border-none px-12 py-12 shadow-2xl"
        title={`모임 만들기 ${currentStep}/${TOTAL_STEPS}`}
      >
        {currentStep === 1 ? (
          <MeetingCategoryStep
            value={formValues.category}
            onChange={(value) => {
              setFormValues((prev) => ({
                ...prev,
                category: value,
              }));
            }}
          />
        ) : null}

        {currentStep === 2 ? (
          <MeetingBasicInfoStep
            values={{
              name: formValues.name,
              description: formValues.description,
              link: formValues.link,
              imageFile: formValues.imageFile,
              previewImageUrl: formValues.previewImageUrl,
              imageUrl: formValues.imageUrl,
            }}
            errors={{
              name: isTouchedStep(2) ? basicInfoErrors.name : "",
              description: isTouchedStep(2) ? basicInfoErrors.description : "",
              link: isTouchedStep(2) ? basicInfoErrors.link : "",
              imageUrl: imageErrorMessage,
            }}
            isImageUploading={isImageUploading}
            onChange={handleChangeBasicInfo}
            onChangeImage={handleChangeMeetingImage}
            onRemoveImage={handleRemoveMeetingImage}
          />
        ) : null}

        {currentStep === 3 ? (
          <MeetingScheduleStep
            values={{
              startDate: formValues.startDate,
              startTime: formValues.startTime,
              endDate: formValues.endDate,
              endTime: formValues.endTime,
              capacity: formValues.capacity,
            }}
            errors={{
              startDate: isTouchedStep(3) ? scheduleErrors.startDate : "",
              startTime: isTouchedStep(3) ? scheduleErrors.startTime : "",
              endDate: isTouchedStep(3) ? scheduleErrors.endDate : "",
              endTime: isTouchedStep(3) ? scheduleErrors.endTime : "",
              capacity: isTouchedStep(3) ? scheduleErrors.capacity : "",
            }}
            onChange={(nextValues) => {
              setFormValues((prev) => ({
                ...prev,
                ...nextValues,
              }));
            }}
          />
        ) : null}

        <div className="mt-8 flex gap-3">
          {currentStep === 1 ? (
            <BtnCommon
              type="button"
              variant="outline"
              size="md"
              className="flex-1"
              onClick={handleCloseModal}
            >
              취소
            </BtnCommon>
          ) : (
            <BtnCommon
              type="button"
              variant="outline"
              size="md"
              className="flex-1"
              onClick={handlePrevStep}
            >
              이전
            </BtnCommon>
          )}

          {currentStep < TOTAL_STEPS ? (
            <BtnCommon
              type="button"
              size="md"
              className="flex-1"
              onClick={handleNextStep}
            >
              다음
            </BtnCommon>
          ) : (
            <BtnCommon
              type="button"
              size="md"
              className="flex-1"
              onClick={handleSubmitMeeting}
            >
              모임 만들기
            </BtnCommon>
          )}
        </div>
      </ModalBase>
    </>
  );
}

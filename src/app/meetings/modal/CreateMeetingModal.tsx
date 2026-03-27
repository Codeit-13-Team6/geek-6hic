"use client";

import plusIcon from "@/assets/icon/plus/plus.svg";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";

import { MeetingCategoryStep } from "@/app/meetings/modal/MeetingCategoryStep";
import { MeetingBasicInfoStep } from "@/app/meetings/modal/MeetingBasicInfoStep";
import { MeetingScheduleStep } from "@/app/meetings/modal/MeetingScheduleStep";
import { MeetingFormValues } from "@/app/meetings/modal/modal";
import {
  getNormalizedMeetingLink,
  hasMeetingValidationError,
  validateMeetingBasicInfoStep,
  validateMeetingCategoryStep,
  validateMeetingScheduleStep,
} from "@/app/meetings/modal/meetingValidation";
import {
  changeMeetingImage,
  removeMeetingImage,
  revokeMeetingPreviewImageUrl,
} from "@/app/meetings/modal/services/meetingImageField";

import axiosInstance from "@/lib/client-fetcher";
import { ToastCommon } from "@/components/ui/ToastCommon";
import { BtnCommon } from "@/components/ui/BtnCommon";
import ModalBase from "@/components/ui/ModalBase";
import { useRouter } from "next/navigation";
import { createMeeting, updateMeeting } from "@/api/meetings";
import { createPost } from "@/api/posts";

const INITIAL_FORM_VALUES: MeetingFormValues = {
  category: "취미/여가",
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

const TOTAL_STEPS = 3;

const getIsoDateTime = (date: string, time: string) => {
  return new Date(`${date}T${time}`).toISOString();
};

export function CreateMeetingModal() {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [isCloseConfirmOpen, setIsCloseConfirmOpen] = useState(false);

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
    useState<MeetingFormValues>(INITIAL_FORM_VALUES);
  const [isImageUploading, setIsImageUploading] = useState(false);
  const [imageErrorMessage, setImageErrorMessage] = useState("");

  const previewImageUrlRef = useRef("");

  useEffect(() => {
    return () => {
      revokeMeetingPreviewImageUrl(previewImageUrlRef.current);
    };
  }, []);

  const categoryErrors = validateMeetingCategoryStep(formValues);
  const basicInfoErrors = validateMeetingBasicInfoStep(formValues);
  const scheduleErrors = validateMeetingScheduleStep(formValues);

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

  // 기본 정보 단계는 텍스트 입력만 다루므로 해당 필드만 부분 갱신한다.
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

    // 현재 단계에서만 검증해 다음 단계 이동 여부를 결정한다.
    setCurrentStep((prev) => Math.min(TOTAL_STEPS, prev + 1));
  };

  // API 요청 전 서버 스펙에 맞는 payload 형태로 변환한다.
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

  // 모달을 다시 열 때 이전 입력값과 임시 이미지 상태를 함께 초기화한다.
  const resetCreateMeetingForm = () => {
    revokeMeetingPreviewImageUrl(previewImageUrlRef.current);
    previewImageUrlRef.current = "";

    setCurrentStep(1);
    setTouchedStepList([]);
    setFormValues(INITIAL_FORM_VALUES);
    setIsImageUploading(false);
    setImageErrorMessage("");
  };

  const requestCloseModal = () => {
    setIsCloseConfirmOpen(true);
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
      // 모든 단계를 통과한 뒤에만 생성 요청을 보낸다.
      const payload = getCreateMeetingPayload();
      const newMeeting = await createMeeting(payload);
      const newMeetingId = newMeeting.id;

      const newPost = await createPost({
        title: `isThread_${newMeetingId}`,
        content:
          "모임 스레드가 생성되었습니다. 자유롭게 이야기와 링크를 나눠보세요!",
      });

      const createdPostId = newPost.id;

      await updateMeeting(newMeetingId, {
        region: String(createdPostId),
      });

      ToastCommon({ message: `${newMeeting.name} 모임 생성완료` });
      handleCloseModal();
      router.push(`/meetings/${newMeetingId}`);
    } catch (error) {
      console.error("meeting create error", error);
      ToastCommon({ message: "모임 생성에 실패했습니다." });
    }
  };

  const handleOpenChangeModal = (nextIsOpen: boolean) => {
    if (!nextIsOpen) {
      requestCloseModal();
      return;
    }

    setIsOpen(true);
  };

  return (
    <>
      <BtnCommon
        className="fixed right-4 bottom-6 z-99 max-h-12 max-w-12 gap-[4px] rounded-full sm:max-h-full sm:max-w-47 sm:rounded-3xl sm:py-4 lg:right-[86px] lg:bottom-14"
        type="button"
        onClick={handleOpenModal}
      >
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
              onClick={requestCloseModal}
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
      <ModalBase
        disablePointerDismissal
        isOpen={isCloseConfirmOpen}
        onOpenChange={setIsCloseConfirmOpen}
        contentClassName="w-[400px] max-w-[calc(100vw-24px)] rounded-[32px] border-none px-8 py-8 shadow-2xl"
        title=""
      >
        <div className="pt-4 text-center">
          <p className="text-[24px] font-semibold text-gray-900">
            취소하시겠습니까?
          </p>
          <p className="mt-3 text-[16px] text-gray-500">
            저장하지 않은 내용은 사라집니다.
          </p>
        </div>

        <div className="mt-10 grid grid-cols-2 gap-3">
          <BtnCommon
            type="button"
            variant="teritary"
            size="md"
            onClick={() => setIsCloseConfirmOpen(false)}
          >
            계속 작성하기
          </BtnCommon>
          <BtnCommon
            type="button"
            size="md"
            onClick={() => {
              setIsCloseConfirmOpen(false);
              handleCloseModal();
            }}
          >
            나가기
          </BtnCommon>
        </div>
      </ModalBase>
    </>
  );
}

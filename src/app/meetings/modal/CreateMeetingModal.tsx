"use client";

import Image from "next/image";
import { useState } from "react";
import { MeetingCategoryStep } from "@/app/meetings/modal/MeetingCategoryStep";
import { MeetingBasicInfoStep } from "@/app/meetings/modal/MeetingBasicInfoStep";
import { MeetingScheduleStep } from "@/app/meetings/modal/MeetingScheduleStep";
import { useCreateMeetingForm } from "@/app/meetings/modal/hooks/useCreateMeetingForm";
import { BtnCommon } from "@/components/ui/BtnCommon";
import ModalBase from "@/components/ui/ModalBase";

// 기존 plusIcon 이미지 대신 프리미엄 테마에 맞는 SVG 아이콘으로 대체
const PlusIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="text-white transition-transform duration-300 group-hover:rotate-90"
  >
    <path d="M5 12h14" />
    <path d="M12 5v14" />
  </svg>
);

export function CreateMeetingModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [isCloseConfirmOpen, setIsCloseConfirmOpen] = useState(false);
  const {
    currentStep,
    totalSteps,
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
  } = useCreateMeetingForm(() => {
    setIsOpen(false);
  });

  const handleOpenModal = () => {
    resetCreateMeetingForm();
    setIsOpen(true);
  };

  const handleCloseModal = () => {
    setIsOpen(false);
  };

  const requestCloseModal = () => {
    setIsCloseConfirmOpen(true);
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
      {/* 1. 플로팅 액션 버튼(FAB): 보라색 그라데이션, 확실한 그림자, 호버/터치 액션 추가 */}
      <BtnCommon
        className="group fixed right-4 bottom-6 z-[99] flex h-14 w-14 cursor-pointer items-center justify-center gap-2 rounded-full border border-violet-400/50 bg-violet-600 font-bold text-white shadow-[0_8px_30px_rgba(139,92,246,0.4)] backdrop-blur-md transition-all duration-300 hover:scale-105 hover:bg-violet-700 active:scale-95 sm:h-14 sm:w-auto sm:px-6 lg:right-10 lg:bottom-10"
        type="button"
        onClick={handleOpenModal}
      >
        <PlusIcon />
        <span className="hidden sm:block sm:text-base md:text-lg">
          모임 만들기
        </span>
      </BtnCommon>

      {/* 2. 메인 폼 모달: 글래스모피즘 패널 디자인 적용 */}
      <ModalBase
        disablePointerDismissal
        isOpen={isOpen}
        onOpenChange={handleOpenChangeModal}
        contentClassName="w-[544px] max-w-[calc(100vw-24px)] rounded-[2.5rem] border border-white/60 bg-white/80 px-8 py-10 sm:px-12 sm:py-12 shadow-[0_20px_60px_rgba(0,0,0,0.1)] backdrop-blur-[40px]"
        title={`모임 만들기 ${currentStep}/${totalSteps}`}
      >
        {currentStep === 1 ? (
          <MeetingCategoryStep
            value={formValues.category}
            onChange={handleChangeCategory}
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
            onChange={handleChangeSchedule}
          />
        ) : null}

        <div className="mt-8 flex gap-3">
          {currentStep === 1 ? (
            <BtnCommon
              type="button"
              variant="outline"
              size="md"
              className="flex-1 rounded-2xl border-slate-200 bg-white/50 text-slate-600 transition-all hover:bg-slate-100/80 hover:text-slate-900 active:scale-[0.98]"
              onClick={requestCloseModal}
            >
              취소
            </BtnCommon>
          ) : (
            <BtnCommon
              type="button"
              variant="outline"
              size="md"
              className="flex-1 rounded-2xl border-slate-200 bg-white/50 text-slate-600 transition-all hover:bg-slate-100/80 hover:text-slate-900 active:scale-[0.98]"
              onClick={handlePrevStep}
            >
              이전
            </BtnCommon>
          )}

          {currentStep < totalSteps ? (
            <BtnCommon
              type="button"
              size="md"
              className="flex-1 rounded-2xl bg-violet-600 text-white shadow-[0_4px_15px_rgba(139,92,246,0.3)] transition-all hover:bg-violet-700 active:scale-[0.98]"
              onClick={handleNextStep}
            >
              다음
            </BtnCommon>
          ) : (
            <BtnCommon
              type="button"
              size="md"
              className="flex-1 rounded-2xl bg-violet-600 text-white shadow-[0_4px_15px_rgba(139,92,246,0.3)] transition-all hover:bg-violet-700 active:scale-[0.98]"
              onClick={handleSubmitMeeting}
            >
              모임 만들기
            </BtnCommon>
          )}
        </div>
      </ModalBase>

      {/* 3. 취소/나가기 확인 모달: 글래스모피즘 적용 및 타이포그래피 세련되게 수정 */}
      <ModalBase
        disablePointerDismissal
        isOpen={isCloseConfirmOpen}
        onOpenChange={setIsCloseConfirmOpen}
        contentClassName="w-[400px] max-w-[calc(100vw-24px)] rounded-[2rem] border border-white/60 bg-white/80 px-8 py-10 shadow-[0_20px_60px_rgba(0,0,0,0.1)] backdrop-blur-[40px]"
        title=""
      >
        <div className="pt-2 text-center">
          <p className="text-[24px] font-extrabold tracking-tight text-slate-900">
            취소하시겠습니까?
          </p>
          <p className="mt-3 text-[16px] font-medium text-slate-500">
            저장하지 않은 내용은 사라집니다.
          </p>
        </div>

        <div className="mt-10 grid grid-cols-2 gap-3">
          <BtnCommon
            type="button"
            variant="teritary"
            size="md"
            className="rounded-2xl border border-slate-200/50 bg-slate-100/50 text-slate-600 transition-all hover:bg-slate-100 active:scale-[0.98]"
            onClick={() => setIsCloseConfirmOpen(false)}
          >
            계속 작성하기
          </BtnCommon>
          <BtnCommon
            type="button"
            size="md"
            className="rounded-2xl bg-violet-600 text-white shadow-[0_4px_15px_rgba(139,92,246,0.3)] transition-all hover:bg-violet-700 active:scale-[0.98]"
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

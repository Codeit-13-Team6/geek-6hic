"use client";

import Image from "next/image";
import { useState } from "react";
import { MeetingCategoryStep } from "@/app/meetings/modal/MeetingCategoryStep";
import { MeetingBasicInfoStep } from "@/app/meetings/modal/MeetingBasicInfoStep";
import { MeetingScheduleStep } from "@/app/meetings/modal/MeetingScheduleStep";
import { useCreateMeetingForm } from "@/app/meetings/modal/hooks/useCreateMeetingForm";
import { BtnCommon } from "@/components/ui/BtnCommon";
import ModalBase from "@/components/ui/ModalBase";

const PlusIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="22"
    height="22"
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
      {/* 1. 플로팅 액션 버튼(FAB): 세련된 딥 퍼플 솔리드 스타일 */}
      <BtnCommon
        className="group fixed right-4 bottom-6 z-[99] flex h-14 w-14 cursor-pointer items-center justify-center gap-2 rounded-2xl bg-[#260656] font-bold text-white shadow-[0_12px_24px_-8px_rgba(38,6,86,0.4)] transition-all duration-300 hover:scale-105 hover:bg-[#1a043d] active:scale-95 sm:h-14 sm:w-auto sm:px-6 lg:right-10 lg:bottom-10"
        type="button"
        onClick={handleOpenModal}
      >
        <PlusIcon />
        <span className="hidden sm:block sm:text-sm sm:font-black sm:tracking-widest">
          모임 생성
        </span>
      </BtnCommon>

      {/* 2. 메인 폼 모달: 소프트 매거진 글래스모피즘 */}
      <ModalBase
        disablePointerDismissal
        isOpen={isOpen}
        onOpenChange={handleOpenChangeModal}
        contentClassName="w-[544px] max-w-[calc(100vw-24px)] rounded-[2rem] border border-slate-200 bg-white/95 px-8 py-10 sm:px-12 sm:py-12 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.1)] backdrop-blur-xl"
        title={`STEP ${currentStep} / ${totalSteps}`}
      >
        <div className="mb-8">
          <p className="text-[10px] font-black tracking-[0.3em] text-[#260656] uppercase">
            New Archive
          </p>
          <div className="mt-1 h-1 w-8 bg-[#260656]" />
        </div>

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

        <div className="mt-10 flex gap-3">
          <BtnCommon
            type="button"
            variant="outline"
            size="md"
            className="flex-1 rounded-xl border-slate-200 bg-white text-slate-500 transition-all hover:bg-slate-50 hover:text-slate-900 active:scale-[0.98]"
            onClick={currentStep === 1 ? requestCloseModal : handlePrevStep}
          >
            {currentStep === 1 ? "취소" : "이전"}
          </BtnCommon>

          <BtnCommon
            type="button"
            size="md"
            className="flex-1 rounded-xl bg-[#260656] text-sm font-bold text-white shadow-[0_8px_16px_-4px_rgba(38,6,86,0.3)] transition-all hover:bg-[#1a043d] active:scale-[0.98]"
            onClick={
              currentStep < totalSteps ? handleNextStep : handleSubmitMeeting
            }
          >
            {currentStep < totalSteps ? "다음" : "모임 만들기"}
          </BtnCommon>
        </div>
      </ModalBase>

      {/* 3. 취소/나가기 확인 모달 */}
      <ModalBase
        disablePointerDismissal
        isOpen={isCloseConfirmOpen}
        onOpenChange={setIsCloseConfirmOpen}
        contentClassName="w-[400px] max-w-[calc(100vw-24px)] rounded-[2rem] border border-slate-200 bg-white px-8 py-10 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.1)]"
        title=""
      >
        <div className="pt-2 text-center">
          <p className="text-[20px] font-bold tracking-tight text-slate-950">
            작성을 취소하시겠습니까?
          </p>
          <p className="mt-3 text-[14px] font-medium text-slate-400">
            저장하지 않은 데이터는 모두 삭제됩니다.
          </p>
        </div>

        <div className="mt-10 grid grid-cols-2 gap-3">
          <BtnCommon
            type="button"
            variant="teritary"
            size="md"
            className="rounded-xl bg-slate-100 text-slate-600 transition-all hover:bg-slate-200 active:scale-[0.98]"
            onClick={() => setIsCloseConfirmOpen(false)}
          >
            계속 작성
          </BtnCommon>
          <BtnCommon
            type="button"
            size="md"
            className="rounded-xl bg-[#260656] font-bold text-white shadow-[0_8px_16px_-4px_rgba(38,6,86,0.2)] transition-all hover:bg-[#1a043d] active:scale-[0.98]"
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

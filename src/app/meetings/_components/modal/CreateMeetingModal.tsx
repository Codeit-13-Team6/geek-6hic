"use client";

import { useState } from "react";
import { MeetingCategoryStep } from "@/app/meetings/_components/modal/MeetingCategoryStep";
import { MeetingBasicInfoStep } from "@/app/meetings/_components/modal/MeetingBasicInfoStep";
import { MeetingScheduleStep } from "@/app/meetings/_components/modal/MeetingScheduleStep";
import { BtnCommon } from "@/components/ui/BtnCommon";
import ModalBase from "@/components/ui/ModalBase";
import { useCreateMeetingForm } from "@/hooks";
import { AlertCircle, Plus, StepForwardIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { useLoginModalStore } from "@/store/useLoginModalStore";
import { CreateMeetingModalProps } from "@/types";

export function CreateMeetingModal({
  meetingTypeOptions = [],
}: CreateMeetingModalProps) {
  const loginGuardAction = useLoginModalStore((s) => s.loginGuardAction);

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
    isSubmitting,
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

  const floatingBtnStyle =
    "fixed right-6 bottom-6 z-99 flex items-center justify-center bg-main-purple text-white shadow-[0_20px_40px_rgba(38,6,86,0.3)] transition-all hover:bg-slate-950 active:scale-95 " +
    "h-14 w-14 rounded-full sm:h-14 sm:w-[190px] sm:rounded-2xl sm:gap-2 " +
    "lg:right-16 lg:bottom-16";

  return (
    <>
      <BtnCommon
        className={cn(floatingBtnStyle, "group !p-0 sm:!p-6")}
        type="button"
        onClick={() => loginGuardAction(handleOpenModal)}
      >
        <Plus
          size={20}
          strokeWidth={3}
          className="transition-transform duration-300 group-hover:rotate-180"
        />
        <span className="hidden text-xs font-black tracking-widest uppercase sm:block">
          Create Meeting
        </span>
      </BtnCommon>

      <ModalBase
        disablePointerDismissal
        isOpen={isOpen}
        onOpenChange={handleOpenChangeModal}
        contentClassName="w-full -mt-10 sm:max-w-[540px] rounded-[32px] border-none py-2 shadow-[0_40px_80px_rgba(0,0,0,0.2)]"
        title=""
      >
        <div className="px-6 py-10 sm:px-8 sm:py-10">
          <div className="-mt-4 mb-8 flex flex-col items-center">
            <div className="text-main-purple flex items-center gap-2 text-sm font-black tracking-[0.2em] uppercase">
              <StepForwardIcon size={14} strokeWidth={3} />
              <span>
                Step {currentStep} / {totalSteps}
              </span>
            </div>
          </div>

          <div>
            {currentStep === 1 && (
              <MeetingCategoryStep
                meetingTypeOptions={meetingTypeOptions}
                value={formValues.category}
                onChange={handleChangeCategory}
              />
            )}
            {currentStep === 2 && (
              <MeetingBasicInfoStep
                meetingTypeOptions={meetingTypeOptions}
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
                  description: isTouchedStep(2)
                    ? basicInfoErrors.description
                    : "",
                  link: isTouchedStep(2) ? basicInfoErrors.link : "",
                  imageUrl: imageErrorMessage,
                }}
                isImageUploading={isImageUploading}
                onChange={handleChangeBasicInfo}
                onChangeImage={handleChangeMeetingImage}
                onRemoveImage={handleRemoveMeetingImage}
              />
            )}
            {currentStep === 3 && (
              <MeetingScheduleStep
                values={{
                  capacity: formValues.capacity,
                }}
                errors={{
                  capacity: isTouchedStep(3) ? scheduleErrors.capacity : "",
                }}
                onChange={handleChangeSchedule}
              />
            )}
          </div>

          <div className="mt-8 flex gap-3">
            <BtnCommon
              type="button"
              className="h-12 flex-1 rounded-xl bg-slate-50 text-base font-bold text-slate-400 transition-all hover:bg-slate-100 sm:h-14 sm:rounded-2xl"
              onClick={currentStep === 1 ? requestCloseModal : handlePrevStep}
            >
              {currentStep === 1 ? "취소" : "이전"}
            </BtnCommon>
            <BtnCommon
              type="button"
              disabled={isSubmitting}
              className="bg-main-purple h-12 flex-1 rounded-xl text-base font-bold text-white shadow-[0_10px_20px_rgba(38,6,86,0.15)] transition-all hover:bg-slate-950 disabled:cursor-not-allowed disabled:opacity-60 sm:h-14 sm:rounded-2xl"
              onClick={
                currentStep < totalSteps ? handleNextStep : handleSubmitMeeting
              }
            >
              {currentStep < totalSteps
                ? "다음"
                : isSubmitting
                  ? "생성 중..."
                  : "생성"}
            </BtnCommon>
          </div>
        </div>
      </ModalBase>

      <ModalBase
        disablePointerDismissal
        isOpen={isCloseConfirmOpen}
        onOpenChange={setIsCloseConfirmOpen}
        contentClassName="w-full sm:w-[400px] max-w-[calc(100vw-32px)] rounded-[32px] border-none p-8 shadow-2xl"
        title=""
      >
        <div className="flex flex-col items-center pt-4 text-center">
          <div className="mb-6 flex size-14 items-center justify-center rounded-full bg-red-50 text-red-500">
            <AlertCircle size={28} />
          </div>
          <p className="text-xl font-black tracking-tighter text-slate-950 sm:text-2xl">
            취소하시겠습니까?
          </p>
          <p className="mt-2 text-sm font-medium text-slate-400">
            저장하지 않은 내용은 사라집니다.
          </p>
        </div>

        <div className="mt-10 flex flex-col gap-2 sm:gap-3">
          <BtnCommon
            type="button"
            className="bg-main-purple h-14 w-full rounded-2xl font-black text-white transition-all hover:bg-slate-950"
            onClick={() => setIsCloseConfirmOpen(false)}
          >
            <span className="text-base">계속 작성</span>
          </BtnCommon>
          <BtnCommon
            type="button"
            className="h-14 w-full rounded-2xl bg-slate-50 font-bold text-slate-400 transition-all hover:bg-slate-100"
            onClick={() => {
              setIsCloseConfirmOpen(false);
              handleCloseModal();
            }}
          >
            <span className="text-base">나가기</span>
          </BtnCommon>
        </div>
      </ModalBase>
    </>
  );
}

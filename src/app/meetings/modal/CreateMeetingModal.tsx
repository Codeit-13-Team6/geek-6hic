"use client";

import plusIcon from "@/assets/icon/plus/plus.svg";
import Image from "next/image";
import { useState } from "react";
import { MeetingCategoryStep } from "@/app/meetings/modal/MeetingCategoryStep";
import { MeetingBasicInfoStep } from "@/app/meetings/modal/MeetingBasicInfoStep";
import { MeetingScheduleStep } from "@/app/meetings/modal/MeetingScheduleStep";
import { BtnCommon } from "@/components/ui/BtnCommon";
import ModalBase from "@/components/ui/ModalBase";
import { useCreateMeetingForm } from "@/hooks";
import MeetingFilters from "@/app/meetings/components/MeetingsFilters";
import MeetingList from "@/components/features/list/MeetingList";
import LoginModal from "@/components/modal/LoginModal";

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
      <LoginModal
        fallback={
          <BtnCommon
            className="fixed right-4 bottom-6 z-99 max-h-12 max-w-12 gap-[4px] rounded-full sm:max-h-full sm:max-w-47 sm:rounded-3xl sm:py-4 lg:right-[86px] lg:bottom-14"
            type="button"
            onClick={()=> {}}
          >
            <Image src={plusIcon} alt="모임 만들기 추가" />
            <span className="hidden sm:block">모임 만들기</span>
          </BtnCommon>
        }
      >
        <BtnCommon
          className="fixed right-4 bottom-6 z-99 max-h-12 max-w-12 gap-[4px] rounded-full sm:max-h-full sm:max-w-47 sm:rounded-3xl sm:py-4 lg:right-[86px] lg:bottom-14"
          type="button"
          onClick={handleOpenModal}
        >
          <Image src={plusIcon} alt="모임 만들기 추가" />
          <span className="hidden sm:block">모임 만들기</span>
        </BtnCommon>
      </LoginModal>

      <ModalBase
        disablePointerDismissal
        isOpen={isOpen}
        onOpenChange={handleOpenChangeModal}
        contentClassName="w-[544px] max-w-[calc(100vw-24px)] rounded-[40px] border-none px-12 py-12 shadow-2xl"
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

          {currentStep < totalSteps ? (
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

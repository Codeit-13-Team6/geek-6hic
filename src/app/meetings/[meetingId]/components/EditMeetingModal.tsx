"use client";

import { useState } from "react";
import { MeetingBasicInfoSection } from "@/app/meetings/modal/MeetingBasicInfoSection";
import { MeetingScheduleStep } from "@/app/meetings/modal/MeetingScheduleStep";
import { useEditMeetingForm } from "@/app/meetings/modal/hooks/useEditMeetingForm";
import { MeetingDetailData } from "@/app/meetings/[meetingId]/types";
import { BtnCommon } from "@/components/ui/BtnCommon";
import ModalBase from "@/components/ui/ModalBase";

interface EditMeetingModalProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  data: MeetingDetailData;
  onSubmit: (nextValues: Partial<MeetingDetailData>) => Promise<void> | void;
}

export function EditMeetingModal({
  isOpen,
  onOpenChange,
  data,
  onSubmit,
}: EditMeetingModalProps) {
  const [isCloseConfirmOpen, setIsCloseConfirmOpen] = useState(false);
  const {
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
  } = useEditMeetingForm({
    data,
    isOpen,
    onSubmit,
    onSuccess: () => {
      onOpenChange(false);
    },
  });

  const handleClose = () => {
    onOpenChange(false);
  };

  const requestClose = () => {
    setIsCloseConfirmOpen(true);
  };

  return (
    <>
      <ModalBase
        disablePointerDismissal
        isOpen={isOpen}
        onOpenChange={(nextIsOpen) => {
          if (!nextIsOpen) {
            requestClose();
            return;
          }

          onOpenChange(nextIsOpen);
        }}
        contentClassName="w-[544px] max-w-[calc(100vw-24px)] rounded-[40px] border-none px-10 py-10 shadow-2xl"
        title="모임 수정하기"
        titleClassName="text-[24px] font-semibold text-gray-900"
      >
        <div className="mt-6">
          <div className="flex border-b border-gray-200">
            <button
              type="button"
              onClick={() => setActiveTab("basic")}
              className={`flex-1 border-b-2 px-2 py-4 text-[22px] font-semibold transition ${
                activeTab === "basic"
                  ? "border-main-green-500 text-main-green-500"
                  : "border-transparent text-gray-400"
              }`}
            >
              기본 정보
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("schedule")}
              className={`flex-1 border-b-2 px-2 py-4 text-[22px] font-semibold transition ${
                activeTab === "schedule"
                  ? "border-main-green-500 text-main-green-500"
                  : "border-transparent text-gray-400"
              }`}
            >
              일정 및 인원
            </button>
          </div>

          {activeTab === "basic" ? (
            <div className="space-y-5 pt-8">
              <MeetingBasicInfoSection
                values={{
                  category: formValues.category,
                  name: formValues.name,
                  description: formValues.description,
                  link: formValues.link,
                  imageFile: formValues.imageFile,
                  previewImageUrl: formValues.previewImageUrl,
                  imageUrl: formValues.imageUrl,
                }}
                errors={{
                  category: errors.category,
                  name: errors.name,
                  description: errors.description,
                  link: errors.link,
                  imageUrl: errors.imageUrl,
                }}
                isImageUploading={isImageUploading}
                onChange={handleChangeBasicTab}
                onChangeImage={handleChangeMeetingImage}
                onRemoveImage={handleRemoveMeetingImage}
                showCategoryField
                showImageMeta={false}
              />
            </div>
          ) : null}

          {activeTab === "schedule" ? (
            <div className="pt-8">
              <MeetingScheduleStep
                values={{
                  startDate: formValues.startDate,
                  startTime: formValues.startTime,
                  endDate: formValues.endDate,
                  endTime: formValues.endTime,
                  capacity: formValues.capacity,
                }}
                errors={{
                  startDate: errors.startDate,
                  startTime: errors.startTime,
                  endDate: errors.endDate,
                  endTime: errors.endTime,
                  capacity: errors.capacity,
                }}
                onChange={handleChangeScheduleTab}
              />
            </div>
          ) : null}

          <div className="mt-8 flex gap-3">
            <BtnCommon
              type="button"
              variant="outline"
              size="md"
              className="flex-1"
              disabled={isSubmitting}
              onClick={requestClose}
            >
              취소
            </BtnCommon>
            <BtnCommon
              type="button"
              size="md"
              className="flex-1"
              disabled={isImageUploading || isSubmitting}
              onClick={handleSubmit}
            >
              {isSubmitting ? "처리 중.." : "수정하기"}
            </BtnCommon>
          </div>
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
              handleClose();
            }}
          >
            나가기
          </BtnCommon>
        </div>
      </ModalBase>
    </>
  );
}

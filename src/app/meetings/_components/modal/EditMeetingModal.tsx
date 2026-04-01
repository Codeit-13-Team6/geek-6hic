"use client";

import { useState } from "react";
import { MeetingBasicInfoSection } from "@/app/meetings/_components/modal/MeetingBasicInfoSection";
import { MeetingScheduleStep } from "@/app/meetings/_components/modal/MeetingScheduleStep";
import { BtnCommon } from "@/components/ui/BtnCommon";
import ModalBase from "@/components/ui/ModalBase";
import { useEditMeetingForm } from "@/hooks/useEditMeetingForm";
import { EditMeetingModalProps } from "@/types";
import { AlertCircle, LayoutDashboard, CalendarRange } from "lucide-react";
import { cn } from "@/lib/utils";

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
        contentClassName="w-full sm:max-w-[540px] lg:max-w-[840px] rounded-[40px] border-none p-0 shadow-[0_40px_80px_rgba(0,0,0,0.2)]"
        title=""
      >
        <div className="px-6 py-4 sm:px-16">
          <div className="mb-10 text-center">
            <h2 className="text-2xl font-black tracking-tighter text-slate-950 sm:text-3xl">
              모임 수정하기
            </h2>
            <p className="mt-2 text-[10px] font-bold tracking-[0.4em] text-slate-400 uppercase">
              Edit your archive details
            </p>
          </div>

          <div className="mb-4 flex gap-2 rounded-2xl bg-slate-50 p-1.5">
            <button
              type="button"
              onClick={() => setActiveTab("basic")}
              className={cn(
                "flex flex-1 items-center justify-center gap-2 rounded-xl py-3 text-sm font-black transition-all",
                activeTab === "basic"
                  ? "text-main-purple bg-white shadow-sm"
                  : "text-slate-400 hover:text-slate-600",
              )}
            >
              <LayoutDashboard size={16} strokeWidth={2.5} />
              기본 정보
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("schedule")}
              className={cn(
                "flex flex-1 items-center justify-center gap-2 rounded-xl py-3 text-sm font-black transition-all",
                activeTab === "schedule"
                  ? "text-main-purple bg-white shadow-sm"
                  : "text-slate-400 hover:text-slate-600",
              )}
            >
              <CalendarRange size={16} strokeWidth={2.5} />
              일정 및 인원
            </button>
          </div>

          <div className="min-h-[300px]">
            {activeTab === "basic" && (
              <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
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
            )}

            {activeTab === "schedule" && (
              <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
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
            )}
          </div>

          <div className="my-8 flex gap-4 pt-4">
            <BtnCommon
              type="button"
              className="h-14 flex-1 rounded-2xl bg-slate-50 font-bold text-slate-400 transition-all hover:bg-slate-100"
              disabled={isSubmitting}
              onClick={requestClose}
            >
              취소
            </BtnCommon>
            <BtnCommon
              type="button"
              className="bg-main-purple h-14 flex-1 rounded-2xl font-black tracking-widest text-white shadow-[0_10px_20px_rgba(38,6,86,0.15)] transition-all hover:bg-slate-950"
              disabled={isImageUploading || isSubmitting}
              onClick={handleSubmit}
            >
              {isSubmitting ? "저장 중..." : "저장"}
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

        <div className="mt-10 flex flex-col gap-3">
          <BtnCommon
            type="button"
            className="bg-main-purple h-14 w-full rounded-2xl font-black text-white transition-all hover:bg-slate-950"
            onClick={() => setIsCloseConfirmOpen(false)}
          >
            계속 수정
          </BtnCommon>
          <BtnCommon
            type="button"
            className="h-14 w-full rounded-2xl bg-transparent font-bold text-slate-300 transition-all hover:bg-slate-50"
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

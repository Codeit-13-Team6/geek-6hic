"use client";

import { useState } from "react";
import { MeetingModalForm } from "@/app/meetings/_components/modal/MeetingModalForm";
import { BtnCommon } from "@/components/ui/BtnCommon";
import ModalBase from "@/components/ui/ModalBase";
import { useCreateMeetingForm } from "@/hooks";
import { type MeetingType } from "@/types";
import { AlertCircle, Plus, StepForwardIcon, Sparkles, BookOpen, Coffee, MoreHorizontal, Check, FolderKanban, Briefcase } from "lucide-react";
import { cn } from "@/lib/utils";
import { useLoginModalStore } from "@/store/useLoginModalStore";
import { useQuery } from "@tanstack/react-query";
import { QUERY_KEYS } from "@/constans/queryKey";
import { getMeetingTypes } from "@/api/client";
import { ConfirmModal } from "@/components/ui/ConfirmModal";

function getMeetingCategoryIcon(name: string) {
  switch (name) {
    case "팀미팅": return Sparkles;
    case "스터디": return BookOpen;
    case "프로젝트": return FolderKanban;
    case "취준생": return Briefcase;
    case "기타": return MoreHorizontal;
    default: return Coffee;
  }
}

export function CreateMeetingModal() {
  const loginGuardAction = useLoginModalStore((s) => s.loginGuardAction);

  const [isOpen, setIsOpen] = useState(false);
  const [isCloseConfirmOpen, setIsCloseConfirmOpen] = useState(false);

  const { data: meetingTypes = [] } = useQuery<MeetingType[]>({
    queryKey: QUERY_KEYS.meetings.meetingType,
    queryFn: getMeetingTypes,
    staleTime: 1000 * 60 * 5,
  });

  const {
    currentStep,
    totalSteps,
    formValues,
    isImageUploading,
    isSubmitting,
    errors,
    handleChange,
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

  const requestCloseModal = () => {
    setIsCloseConfirmOpen(true);
  };

  return (
    <>
      <BtnCommon
        className={cn(
          "bg-main-purple fixed right-6 bottom-6 z-99 flex items-center justify-center text-white shadow-[0_20px_40px_rgba(38,6,86,0.3)] transition-all hover:bg-slate-950 active:scale-95",
          "h-14 w-14 rounded-full sm:h-14 sm:w-[190px] sm:gap-2 sm:rounded-2xl",
          "lg:right-16 lg:bottom-16",
          "group !p-0 sm:!p-6",
        )}
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
        onOpenChange={(nextIsOpen) => {
          if (!nextIsOpen) requestCloseModal();
        }}
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
              <div className="w-full">
                <div className="mb-8 text-center sm:text-left">
                  <p className="text-lg font-bold tracking-tight text-slate-900">
                    어떤 모임을 만들고 싶으세요?
                    <span className="text-main-purple ml-1">*</span>
                  </p>
                  <p className="mt-1 text-sm font-medium text-slate-400">
                    카테고리를 선택해 주세요.
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-3 sm:gap-4">
                  {meetingTypes.map((type) => {
                    const isSelected = formValues.category === type.name;
                    const Icon = getMeetingCategoryIcon(type.name);
                    return (
                      <button
                        key={type.name}
                        type="button"
                        onClick={() => handleChange({ category: type.name })}
                        className={cn(
                          "group relative flex h-[100px] flex-col items-center justify-center rounded-2xl border-2 transition-all duration-200 sm:h-[120px]",
                          isSelected
                            ? "border-main-purple bg-main-purple/5 shadow-sm"
                            : "border-slate-50 bg-slate-50/50 hover:border-slate-200 hover:bg-white",
                          type.name === "기타" ? "col-span-2" : undefined,
                        )}
                      >
                        <div
                          className={cn(
                            "mb-3 flex size-12 items-center justify-center rounded-full bg-white transition-transform group-hover:scale-110",
                            isSelected
                              ? "text-main-purple shadow-sm"
                              : "text-slate-300",
                          )}
                        >
                          <Icon size={24} strokeWidth={1.5} />
                        </div>
                        <span
                          className={cn(
                            "text-sm font-bold tracking-tight transition-colors",
                            isSelected
                              ? "text-main-purple"
                              : "text-slate-600 group-hover:text-slate-900",
                          )}
                        >
                          {type.name}
                        </span>
                        {isSelected && (
                          <div className="bg-main-purple absolute top-3 right-3 flex size-5 items-center justify-center rounded-full text-white shadow-sm">
                            <Check size={12} strokeWidth={4} />
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
            {currentStep === 2 && (
              <div className="space-y-6 pt-6">
                <MeetingModalForm
                  values={formValues}
                  errors={errors}
                  isImageUploading={isImageUploading}
                  onChange={handleChange}
                  onChangeImage={handleChangeMeetingImage}
                  onRemoveImage={handleRemoveMeetingImage}
                />
              </div>
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

      <ConfirmModal
        isOpen={isCloseConfirmOpen}
        onOpenChange={setIsCloseConfirmOpen}
        onConfirm={() => setIsCloseConfirmOpen(false)}
        onCancel={() => {
          setIsCloseConfirmOpen(false);
          setIsOpen(false);
        }}
      />

    </>
  );
}

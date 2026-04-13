"use client";

import { useState } from "react";
import { MeetingModalForm } from "@/app/meetings/_components/modal/MeetingModalForm";
import { BtnCommon } from "@/components/ui/BtnCommon";
import ModalBase from "@/components/ui/ModalBase";
import { useEditMeetingForm } from "@/hooks/useMeetingForm";
import { EditMeetingModalProps } from "@/types";
import { AlertCircle } from "lucide-react";
import { ConfirmModal } from "@/components/ui/ConfirmModal";

export function EditMeetingModal({
  isOpen,
  onOpenChange,
  detail,
  onSubmit,
}: EditMeetingModalProps) {
  const [isCloseConfirmOpen, setIsCloseConfirmOpen] = useState(false);

  const {
    errors,
    formValues,
    isImageUploading,
    isSubmitting,
    handleChangeMeetingImage,
    handleRemoveMeetingImage,
    handleChange,
    handleSubmit,
  } = useEditMeetingForm({
    detail,
    isOpen,
    onSubmit,
    onSuccess: () => {
      onOpenChange(false);
    },
  });

  const requestClose = () => {
    setIsCloseConfirmOpen(true);
  };

  return (
    <>
      <ModalBase
        disablePointerDismissal
        isOpen={isOpen}
        onOpenChange={(nextIsOpen) => {
          if (!nextIsOpen) requestClose();
        }}
        contentClassName="w-full sm:max-w-[540px] overflow-hidden rounded-[40px] border-none p-0 shadow-[0_40px_80px_rgba(0,0,0,0.2)]"
        title=""
      >
        <div className="px-6 py-8 sm:px-16">
          <div className="mb-10 text-center">
            <h2 className="text-2xl font-black tracking-tighter text-slate-950 sm:text-3xl">
              모임 수정하기
            </h2>
            <p className="mt-2 text-[10px] font-bold tracking-[0.4em] text-slate-400 uppercase">
              모임 정보를 수정해 주세요
            </p>
          </div>

          <div className="space-y-6 custom-scrollbar overflow-auto max-h-[300px] sm:max-h-[500px] pr-[15px]">
            <MeetingModalForm
              values={formValues}
              errors={errors}
              isImageUploading={isImageUploading}
              onChange={handleChange}
              onChangeImage={handleChangeMeetingImage}
              onRemoveImage={handleRemoveMeetingImage}
              showCategoryField
            />
          </div>

          <div className="flex gap-4 pt-10">
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

      <ConfirmModal
        isOpen={isCloseConfirmOpen}
        onOpenChange={setIsCloseConfirmOpen}
        onConfirm={() => setIsCloseConfirmOpen(false)}
        onCancel={() => {
          setIsCloseConfirmOpen(false);
          onOpenChange(false);
        }}
      />
    </>
  );
}

"use client";

import { AlertCircle } from "lucide-react";
import { BtnCommon } from "@/shared/components/ui/BtnCommon";
import ModalBase from "@/shared/components/modal/ModalBase";

interface ConfirmDeleteModalProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  title?: string;
  description?: string;
  subDescription?: string;
  onConfirm: () => void;
  onCancel?: () => void;
  confirmButtonLabel?: string;
  cancelButtonLabel?: string;
  isLoading?: boolean;
}

export function ConfirmModal({
  isOpen,
  onOpenChange,
  title = "",
  description = "취소하시겠습니까?",
  subDescription = "저장하지 않은 내용은 사라집니다.",
  onConfirm,
  confirmButtonLabel = "계속 작성",
  cancelButtonLabel = "나가기",
  onCancel,
  isLoading = false,
}: ConfirmDeleteModalProps) {
  const handleCancel = () => {
    onCancel?.();
    onOpenChange(false);
  };

  return (
    <ModalBase
      disablePointerDismissal
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      contentClassName="w-full sm:w-[400px] max-w-[calc(100vw-32px)] rounded-[32px] border-none p-8 shadow-2xl"
      title={title}
    >
      <div className="flex flex-col items-center pt-4 text-center">
        <div className="mb-6 flex size-14 items-center justify-center rounded-full bg-red-50 text-red-500">
          <AlertCircle size={28} />
        </div>
        <p className="text-xl font-black tracking-tighter text-slate-950">
          {description}
        </p>
        <p className="mt-2 text-sm font-medium text-slate-400">
          {subDescription}
        </p>
      </div>

      <div className="mt-10 flex flex-col gap-2 sm:gap-3">
        <BtnCommon
          type="button"
          className="bg-main-purple h-14 w-full rounded-2xl font-black text-white transition-all hover:bg-slate-950"
          disabled={isLoading}
          onClick={onConfirm}
        >
          <span className="text-base">
            {isLoading ? "처리 중..." : confirmButtonLabel}
          </span>
        </BtnCommon>

        {onCancel && (
          <p className="mt-1 text-xs font-medium text-slate-300">
            <BtnCommon
              type="button"
              className="h-14 w-full rounded-2xl bg-slate-50 font-bold text-slate-400 transition-all hover:bg-slate-100"
              disabled={isLoading}
              onClick={handleCancel}
            >
              <span className="text-base">{cancelButtonLabel}</span>
            </BtnCommon>
          </p>
        )}
      </div>
    </ModalBase>
  );
}

"use client";

import { AlertCircle } from "lucide-react";
import { Button } from "@/shared/components/ui/Button";
import ModalBase from "@/shared/components/modal/ModalBase";

interface ConfirmDeleteModalProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  title?: string;
  description?: string;
  subDescription?: string;
  onConfirm: () => void;
  onCancel?: () => void;
  isLoading?: boolean;
}

export function DeleteModal({
  isOpen,
  onOpenChange,
  // title = "DELETE",
  description = "정말 삭제하시겠습니까?",
  subDescription = "삭제된 데이터는 복구할 수 없습니다.",
  onConfirm,
  onCancel,
  isLoading = false,
}: ConfirmDeleteModalProps) {
  const handleCancel = () => {
    if (onCancel) onCancel();
    onOpenChange(false);
  };

  return (
    <ModalBase
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      // title={title}
      // contentClassName="-mt-10"
      titleClassName="text-xl font-black tracking-tighter text-slate-900 uppercase text-center"
    >
      <div className="flex flex-col gap-8 pt-4">
        <div className="space-y-2 text-center">
          <div className="flex justify-center">
            <div className="mb-4 flex size-12 items-center justify-center rounded-full bg-red-50 text-red-500">
              <AlertCircle size={24} strokeWidth={2.5} />
            </div>
          </div>
          {/* <div className="mx-auto mb-4 flex size-12 items-center justify-center rounded-full bg-red-50 text-red-500 sm:mx-0">
          </div> */}

          <p className="text-lg leading-tight font-black tracking-tight text-slate-900">
            {description}
          </p>
          <p className="text-sm leading-relaxed font-bold text-slate-400">
            {subDescription}
          </p>
        </div>

        <div className="grid w-full grid-cols-2 gap-3">
          <Button
            variant="teritary"
            onClick={handleCancel}
            disabled={isLoading}
            className="h-12 !w-full !rounded-2xl font-black tracking-widest text-slate-400 transition-all hover:bg-slate-50 sm:h-14"
          >
            취소
          </Button>
          <Button
            onClick={onConfirm}
            disabled={isLoading}
            className="h-12 !w-full !rounded-2xl bg-red-500 font-black tracking-widest text-white shadow-[0_10px_20px_rgba(239,68,68,0.2)] transition-all hover:bg-red-600 active:scale-95 sm:h-14"
          >
            {isLoading ? "삭제 중..." : "삭제"}
          </Button>
        </div>
      </div>
    </ModalBase>
  );
}

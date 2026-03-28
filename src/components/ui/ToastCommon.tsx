"use client";

import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { ToastCommonProps } from "@/types";
/**
 * 예시)
 * ToastCommon({ message: "성공적으로 저장되었습니다." });
 * ToastCommon({ message: "삭제 완료", size: "sm", duration: 1500 });
 * ToastCommon({
 *   message: "로그인이 필요합니다.",
 *   className: "border border-red-500",
 * });
 */

// 피그마 기준 크기 규격입니다.
const TOAST_SIZE_STYLES = {
  lg: "min-h-[56px] min-w-[339px] rounded-[12px] px-[32px] py-[16px] text-[20px] leading-[24px]",
  sm: "min-h-[40px] min-w-[260px] rounded-[10px] px-[24px] py-[12px] text-[14px] leading-[16px]",
};

// 공용 toast 실행 함수입니다.
// sonner의 custom API를 사용해 프로젝트 전용 toast UI를 렌더링합니다.
export const ToastCommon = ({
  message,
  size = "lg",
  duration = 2000,
  className,
}: ToastCommonProps) => {
  toast.custom(
    () => (
      <div
        className={cn(
          "flex items-center justify-center bg-black/80 text-center font-semibold text-white shadow-lg",
          TOAST_SIZE_STYLES[size],
          className,
        )}
      >
        {message}
      </div>
    ),
    { duration },
  );
};

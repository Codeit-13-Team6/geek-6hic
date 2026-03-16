"use client";

import { toast } from "sonner";
import { cn } from "@/lib/utils";

// Toast의 크기를 결정하는 타입입니다.
// lg: 데스크탑 디자인
// sm: 모바일 디자인
type ToastSize = "lg" | "sm";

// toast 실행 시 필요한 옵션 정의
interface CommonToastProps {
  message: string; // 사용자에게 보여줄 알림 메시지
  size?: ToastSize; // toast 크기 (기본값: lg)
  duration?: number; // 화면에 머무는 시간(ms)
  className?: string; // 추가 커스텀 스타일
}

// 피그마 디자인 규격을 그대로 반영한 스타일 사전입니다.
// size 값에 따라 다른 디자인 수치가 적용됩니다.
const TOAST_SIZE_STYLES = {
  // 데스크탑 디자인
  lg: "min-h-[56px] min-w-[339px] rounded-[12px] px-[32px] py-[16px] text-[20px] leading-[24px]",

  // 모바일 디자인
  sm: "min-h-[40px] min-w-[260px] rounded-[10px] px-[24px] py-[12px] text-[14px] leading-[16px]",
};

// 화면 어디서든 호출하여 toast 알림을 띄우는 공용 실행 함수입니다.
// 컴포넌트가 아니라 "함수 형태"로 사용합니다.
//
// 사용 예시
// commonToast({ message: "저장되었습니다." })
//
// commonToast({
//   message: "업로드 완료",
//   size: "sm",
// })
export const commonToast = ({
  message,
  size = "lg",
  duration = 2000,
  className,
}: CommonToastProps) => {
  // sonner의 custom API를 사용합니다.
  // 기본 toast UI 대신 우리가 만든 JSX를 직접 렌더링합니다.
  toast.custom(
    () => (
      // toast UI 컨테이너
      <div
        className={cn(
          // 공통 스타일
          // 검정 반투명 배경 + 중앙 정렬 + 흰색 텍스트
          "flex items-center justify-center bg-black/80 text-center font-semibold text-white shadow-lg",

          // 피그마 기준 사이즈 스타일 적용
          TOAST_SIZE_STYLES[size],

          // 외부에서 전달된 커스텀 스타일
          className,
        )}
      >
        {/* 사용자에게 보여줄 메시지 */}
        {message}
      </div>
    ),

    // toast가 화면에 머무는 시간(ms)
    { duration },
  );
};

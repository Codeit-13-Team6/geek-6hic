import { useId, type ComponentProps } from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

// textarea 스타일 설계 영역
// class-variance-authority(cva)를 사용하여 상태별 스타일을 관리합니다.
// 공통 스타일 + variant(상태별 스타일)를 조합하는 방식입니다.
const textareaVariants = cva(
  // 기본 스타일
  // - 전체 width
  // - 배경색
  // - padding
  // - placeholder 스타일
  // - disabled 상태
  "flex w-full min-w-0 resize-none rounded-[8px] border bg-gray-50 p-[12px] text-gray-800 outline-none transition-all placeholder:text-gray-400 disabled:cursor-not-allowed disabled:bg-gray-100 disabled:opacity-50",
  {
    variants: {
      // 입력 에러 상태 여부
      // true → 에러 스타일
      // false → 기본 스타일
      isDestructive: {
        true: "border-error aria-invalid:border-error focus:ring-[4px] focus:ring-error/20",
        false:
          "border-gray-300 focus:border-main-green-500 focus:ring-[4px] focus:ring-main-green-100",
      },

      // textarea 크기 규격
      // sm → 모바일 / 작은 영역
      // lg → 기본 / 데스크탑
      size: {
        sm: "min-h-[118px] text-[14px]",
        lg: "min-h-[126px] text-[16px]",
      },
    },

    // 기본 상태
    defaultVariants: {
      isDestructive: false,
      size: "lg",
    },
  },
);

// CommonTextarea 컴포넌트 props
// 기본 textarea 속성 + CVA variant + 추가 UI 속성
export interface CommonTextareaProps
  extends ComponentProps<"textarea">, VariantProps<typeof textareaVariants> {
  label?: string; // 입력창 상단 라벨
  hintText?: string; // 하단 안내 문구 또는 에러 메시지
  isRequired?: boolean; // 필수 입력 여부 표시
  labelClassName?: string; // 라벨 스타일 커스터마이징
}

// 공통 textarea 컴포넌트
// 구조
// 1. label (선택)
// 2. textarea
// 3. hint text (선택)
export function CommonTextarea({
  className,
  id,
  isDestructive,
  size,
  label,
  labelClassName,
  hintText,
  isRequired,
  ...props
}: CommonTextareaProps) {
  // label 과 textarea 연결을 위한 id 생성
  const generatedId = useId();
  const textareaId = id ?? generatedId;

  return (
    <div className={cn("flex flex-col gap-[6px]")}>
      {/* 라벨 영역 */}
      {label && (
        <label
          htmlFor={textareaId}
          className={cn(
            "text-[14px] font-medium text-gray-800",
            labelClassName,
          )}
        >
          {label}
          {/* 필수 입력 표시 */}
          {isRequired && <span className="text-error ml-1">*</span>}
        </label>
      )}

      {/* textarea 입력 영역 */}
      <textarea
        id={textareaId}
        className={cn(textareaVariants({ isDestructive, size }), className)}
        {...props}
      />

      {/* 안내 문구 / 에러 메시지 */}
      {hintText && (
        <p
          className={cn(
            "text-[12px] leading-[16px]",
            isDestructive ? "text-error" : "text-gray-500",
          )}
        >
          {hintText}
        </p>
      )}
    </div>
  );
}

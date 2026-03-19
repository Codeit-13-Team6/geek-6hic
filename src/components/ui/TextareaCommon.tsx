import { useId, type ComponentProps } from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

/**
 * 예시)
 * <TextareaCommon
 *   label="자기소개"
 *   placeholder="본인을 자유롭게 소개해 주세요."
 *   size="lg"
 *   isRequired
 *   isDestructive={false}
 *   hintText="최대 500자까지 입력 가능합니다."
 * />
 */

// 공용 textarea 스타일 정의입니다.
// 에러 상태와 크기별 스타일을 variant로 분리합니다.
const textareaVariants = cva(
  "flex w-full min-w-0 resize-none rounded-[8px] border bg-gray-50 p-[12px] text-gray-800 outline-none transition-all placeholder:text-gray-400 disabled:cursor-not-allowed disabled:bg-gray-100 disabled:opacity-50",
  {
    variants: {
      isDestructive: {
        true: "border-error aria-invalid:border-error focus:ring-[4px] focus:ring-error/20",
        false:
          "border-gray-300 focus:border-main-green-500 focus:ring-[4px] focus:ring-main-green-100",
      },
      size: {
        sm: "min-h-[118px] text-[14px]",
        lg: "min-h-[126px] text-[16px]",
      },
    },
    defaultVariants: {
      isDestructive: false,
      size: "lg",
    },
  },
);

export interface TextareaCommonProps
  extends ComponentProps<"textarea">, VariantProps<typeof textareaVariants> {
  label?: string;
  hintText?: string;
  isRequired?: boolean;
  labelClassName?: string;
}

// 공용 textarea 컴포넌트입니다.
// label, hintText를 함께 제공하며, 검증 로직은 상위에서 처리합니다.
export function TextareaCommon({
  className,
  id,
  isDestructive,
  size,
  label,
  labelClassName,
  hintText,
  isRequired,
  ...props
}: TextareaCommonProps) {
  const generatedId = useId();
  const textareaId = id ?? generatedId;

  return (
    <div className={cn("flex flex-col gap-[6px]")}>
      {label && (
        <label
          htmlFor={textareaId}
          className={cn(
            "text-[14px] font-medium text-gray-800",
            labelClassName,
          )}
        >
          {label}
          {isRequired && (
            <span
              className={cn(
                "ml-1",
                isDestructive ? "text-error" : "text-green-500",
              )}
            >
              *
            </span>
          )}
        </label>
      )}

      <textarea
        id={textareaId}
        className={cn(textareaVariants({ isDestructive, size }), className)}
        {...props}
      />

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

import { useId, type ComponentProps, type MouseEvent } from "react";
import Image from "next/image";
import { cva, type VariantProps } from "class-variance-authority";

import deleteLgIcon from "@/assets/icon/delete/delete-lg.svg";
import deleteSmIcon from "@/assets/icon/delete/delete-sm.svg";
import { cn } from "@/shared/lib/utils";
import { Input } from "@/shared/components/ui/input";

/**
 * 예시)
 * <InputCommon
 *   label="이메일"
 *   isRequired
 *   placeholder="example@email.com"
 *   value={email}
 *   onChange={(e) => setEmail(e.target.value)}
 *   onClear={() => setEmail("")}
 *   isDestructive={emailError}
 *   showClearButton={false}
 *   hintText={
 *     emailError
 *       ? "올바른 이메일 형식이 아닙니다."
 *       : "로그인에 사용할 이메일을 입력하세요."
 *   }
 * />
 */

// 공용 input 스타일 정의입니다.
// 에러 상태와 크기별 스타일을 variant로 분리합니다.
const inputVariants = cva(
  "flex w-full min-w-0 rounded-[8px] border bg-gray-50 text-gray-800 outline-none transition-all placeholder:text-gray-400 disabled:bg-gray-100 disabled:opacity-50",
  {
    variants: {
      isDestructive: {
        true: "border-red-500 focus-visible:border-error focus-visible:ring-1 focus-visible:ring-0",
        false:
          "border-gray-300 focus-visible:border-main-purple focus-visible:ring-1",
      },
      inputSize: {
        sm: "h-10 px-3 py-2 text-sm sm:text-base sm:h-12 sm:p-3",
        lg: "h-[50px] px-4 py-3 text-base",
      },
    },
    defaultVariants: {
      isDestructive: false,
      inputSize: "lg",
    },
  },
);
export interface InputCommonProps
  extends ComponentProps<"input">, VariantProps<typeof inputVariants> {
  label?: string;
  hintText?: string;
  isRequired?: boolean;
  labelClassName?: string;
  onClear?: () => void;
  showClearButton?: boolean;
}

// 공용 input 컴포넌트입니다.
// label, hintText, clear 버튼까지 함께 제공하며,
// 검증 로직은 상위 컴포넌트에서 처리합니다.
export function InputCommon({
  className,
  id,
  type,
  isDestructive,
  inputSize = "lg",
  label,
  labelClassName,
  hintText,
  isRequired,
  value,
  onChange,
  onClear,
  showClearButton = true,
  ...props
}: InputCommonProps) {
  const generatedId = useId();
  const inputId = id ?? generatedId;

  const hasValue = String(value ?? "").length > 0;
  const isClearButtonVisible = showClearButton && hasValue && Boolean(onClear);

  const handleClearClick = (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    onClear?.();
  };

  return (
    <div className={cn("flex w-full flex-col gap-[6px]")}>
      {label && (
        <label
          htmlFor={inputId}
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
                isDestructive ? "text-error" : "text-purple-500",
              )}
            >
              *
            </span>
          )}
        </label>
      )}

      <div className="relative flex w-full items-center">
        <Input
          id={inputId}
          type={type}
          value={value}
          onChange={onChange}
          className={cn(
            inputVariants({ isDestructive, inputSize }),
            isClearButtonVisible && "pr-[44px]",
            className,
          )}
          {...props}
        />

        {showClearButton ? (
          <button
            type="button"
            onClick={handleClearClick}
            aria-label="입력값 삭제"
            tabIndex={hasValue ? 0 : -1}
            disabled={!hasValue}
            className={cn(
              "absolute right-[12px] z-10 flex items-center justify-center transition-opacity hover:opacity-70",
              hasValue ? "opacity-100" : "pointer-events-none opacity-0",
            )}
          >
            <Image
              src={inputSize === "sm" ? deleteSmIcon : deleteLgIcon}
              alt="삭제 아이콘"
              width={inputSize === "sm" ? 20 : 24}
              height={inputSize === "sm" ? 20 : 24}
            />
          </button>
        ) : null}
      </div>

      {hintText && (
        <p
          className={cn(
            "mt-1 text-[12px] leading-[16px]",
            isDestructive ? "text-error" : "text-purple-500",
          )}
        >
          {hintText}
        </p>
      )}
    </div>
  );
}

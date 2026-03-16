import { useId, type ComponentProps, type MouseEvent } from "react";
import Image from "next/image";
import { cva, type VariantProps } from "class-variance-authority";

import deleteLgIcon from "@/assets/icon/delete/delete-lg.svg";
import deleteSmIcon from "@/assets/icon/delete/delete-sm.svg";
import { cn } from "@/lib/utils";

// input 공통 스타일을 관리하는 영역입니다.
// 기본 스타일과 상태별 스타일을 CVA로 분리하여
// 조건에 따라 일관된 class 조합을 만들 수 있게 합니다.
const inputVariants = cva(
  "flex w-full min-w-0 rounded-[8px] border bg-gray-50 text-gray-800 outline-none transition-all placeholder:text-gray-400 disabled:bg-gray-100 disabled:opacity-50",
  {
    variants: {
      // 에러 상태 여부입니다.
      // true면 에러용 테두리와 포커스 스타일을 적용하고,
      // false면 기본 테두리와 포커스 스타일을 적용합니다.
      isDestructive: {
        true: "border-error aria-invalid:border-error focus:ring-[4px] focus:ring-error/20",
        false:
          "border-gray-300 focus:border-main-green-500 focus:ring-[4px] focus:ring-main-green-100",
      },

      // input 크기 규격입니다.
      // sm은 작은 화면 또는 작은 입력 필드에 사용하고,
      // lg는 기본 크기의 입력 필드에 사용합니다.
      inputSize: {
        sm: "h-[40px] px-[12px] py-[8px] text-[14px]",
        lg: "h-[50px] px-[16px] py-[12px] text-[16px]",
      },
    },

    // 별도 값이 전달되지 않았을 때 적용할 기본값입니다.
    defaultVariants: {
      isDestructive: false,
      inputSize: "lg",
    },
  },
);

// CommonInput에서 사용하는 props입니다.
// 기본 input 속성을 그대로 받을 수 있고,
// 공통 UI에서 필요한 label, hintText, onClear 같은 확장 속성도 함께 받습니다.
export interface CommonInputProps
  extends ComponentProps<"input">, VariantProps<typeof inputVariants> {
  label?: string; // 상단 라벨 문구
  hintText?: string; // 하단 안내 문구 또는 에러 메시지
  isRequired?: boolean; // 필수 입력 여부
  labelClassName?: string; // 라벨 전용 커스텀 스타일
  onClear?: () => void; // 우측 삭제 버튼 클릭 시 실행할 콜백
}

// 공통 input 컴포넌트입니다.
// 이 컴포넌트는 아래 순서로 구성됩니다.
// 1. label
// 2. input
// 3. hintText
//
// 공용 컴포넌트이므로 입력 기능 자체에 집중하고,
// 실제 검증 규칙이나 도메인 로직은 상위 컴포넌트에서 처리합니다.
export function CommonInput({
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
  ...props
}: CommonInputProps) {
  // label과 input을 연결하기 위한 id입니다.
  // 외부에서 id를 넘기면 그 값을 사용하고,
  // 없으면 useId로 고유 id를 생성합니다.
  const generatedId = useId();
  const inputId = id ?? generatedId;

  // 현재 input에 값이 있는지 판단합니다.
  // 값이 있을 때만 삭제 버튼을 활성화하고 보이게 처리하기 위해 사용합니다.
  const hasValue = Boolean(value && String(value).length > 0);

  // 삭제 버튼 클릭 시 실행되는 핸들러입니다.
  // button이 form 안에 있을 수 있으므로 기본 submit 동작을 막고,
  // 부모 컴포넌트에서 전달한 onClear 콜백을 실행합니다.
  const handleClearClick = (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    onClear?.();
  };

  return (
    // 전체 컨테이너입니다.
    // label, input, hintText를 세로 방향으로 배치합니다.
    <div className={cn("flex w-full flex-col gap-[6px]")}>
      {/* label이 전달된 경우에만 상단 라벨을 렌더링합니다. */}
      {label && (
        <label
          htmlFor={inputId}
          className={cn(
            "text-[14px] font-medium text-gray-800",
            labelClassName,
          )}
        >
          {label}

          {/* 필수 입력 필드인 경우 별표를 함께 표시합니다. */}
          {isRequired && <span className="text-error ml-1">*</span>}
        </label>
      )}

      {/* input과 삭제 버튼을 같은 영역 안에서 겹쳐 배치하기 위한 wrapper입니다.
          삭제 버튼을 input 오른쪽 안쪽에 올려놓기 위해 relative를 사용합니다. */}
      <div className="relative flex items-center">
        <input
          id={inputId}
          type={type}
          value={value}
          onChange={onChange}
          className={cn(
            inputVariants({ isDestructive, inputSize }),

            // 삭제 버튼이 활성화되어 보이는 경우 텍스트가 버튼과 겹치지 않도록
            // 오른쪽 여백을 추가합니다.
            hasValue && "pr-[44px]",
            className,
          )}
          {...props}
        />

        {/* 삭제 버튼은 레이아웃 흔들림을 줄이기 위해 항상 렌더링합니다.
            다만 값이 없을 때는 클릭, 포커스가 되지 않도록 비활성화하고
            화면에서도 보이지 않게 처리합니다. */}
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
          {/* input 크기에 맞는 삭제 아이콘 에셋을 사용합니다. */}
          <Image
            src={inputSize === "sm" ? deleteSmIcon : deleteLgIcon}
            alt=""
            width={inputSize === "sm" ? 20 : 24}
            height={inputSize === "sm" ? 20 : 24}
          />
        </button>
      </div>

      {/* 하단 안내 문구 영역입니다.
          hintText가 있을 때만 렌더링하며,
          에러 상태면 빨간색, 일반 상태면 회색 텍스트를 사용합니다. */}
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
